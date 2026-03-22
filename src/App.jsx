import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Package, Palette, Settings,
  BrainCircuit, Moon, Sun, Plus, Play,
  CheckCircle2, AlertCircle, Clock, MoreVertical,
  Target, Zap, Activity, Search, Filter,
  ArrowUpRight, RefreshCw, Megaphone, Share2,
  TrendingUp, ShoppingBag, Eye, ExternalLink,
  Sparkles, BarChart3, Globe, Heart, Lightbulb,
  FileText, Image, Video, Hash, Rocket,
  Store, Gem, Menu, X, ChevronRight
} from 'lucide-react';
import { GlassCard, GlassButton, Badge, colorMap, LoadingSkeleton } from './components/ui';
import { api } from './api';
import { useApi } from './hooks/useApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- FALLBACK DATA ---
const fallbackStores = [
  {
    id: 'heart-to-soul',
    name: 'Heart To Soul',
    domain: 'beyond-love.com',
    niche: { name: 'Jewelry & Accessories' },
    productCount: 48,
    isActive: true,
    lastSyncAt: null,
    gradient: 'from-rose-400 to-pink-600',
    icon: '\u{1F48E}',
    skills: ['optimize-products', 'ads-content-creator', 'social-content-creator']
  },
  {
    id: 'lume-vibe',
    name: 'Lume Vibe',
    domain: 'lumevibe.com',
    niche: { name: 'LED Art & Decor' },
    productCount: 0,
    isActive: false,
    lastSyncAt: null,
    gradient: 'from-violet-400 to-indigo-600',
    icon: '\u{1F4A1}',
    skills: ['optimize-products', 'ads-content-creator']
  }
];

const fallbackProducts = [
  { id: 1, title: 'Infinity Love Necklace', productType: 'Necklace', priceMin: '39.99', tags: 8, imageCount: 5, lastOptimizedAt: '2024-01-01', store: { name: 'Heart To Soul' } },
  { id: 2, title: 'Eternal Bond Bracelet', productType: 'Bracelet', priceMin: '29.99', tags: 6, imageCount: 4, lastOptimizedAt: '2024-01-01', store: { name: 'Heart To Soul' } },
  { id: 3, title: 'Soulmate Ring Set', productType: 'Ring', priceMin: '49.99', tags: 10, imageCount: 6, lastOptimizedAt: '2024-01-01', store: { name: 'Heart To Soul' } },
  { id: 4, title: 'Heart Pendant Collection', productType: 'Pendant', priceMin: '34.99', tags: 7, imageCount: 3, lastOptimizedAt: null, store: { name: 'Heart To Soul' } },
  { id: 5, title: 'Promise Earrings', productType: 'Earrings', priceMin: '24.99', tags: 5, imageCount: 4, lastOptimizedAt: null, store: { name: 'Heart To Soul' } },
];

const fallbackRuns = [
  { id: 1, store: { name: 'Heart To Soul' }, runType: 'SEO Optimize', status: 'success', startedAt: 'Phiên trước' },
  { id: 2, store: { name: 'Heart To Soul' }, runType: 'Tạo Ads', status: 'success', startedAt: '2 ngày trước' },
  { id: 3, store: { name: 'Heart To Soul' }, runType: 'Social Posts', status: 'success', startedAt: '3 ngày trước' },
  { id: 4, store: { name: 'Lume Vibe' }, runType: 'Nghiên cứu SP', status: 'pending', startedAt: 'Dự kiến' },
];

const fallbackInsights = [
  { id: 1, category: 'Trend', title: 'Personalized jewelry đang trend trên TikTok Shop', relevance: 'Cao', discoveredAt: null },
  { id: 2, category: 'SEO', title: '12 SP cần cập nhật meta description', relevance: 'TB', discoveredAt: null },
  { id: 3, category: 'Ads', title: 'CTR chiến dịch Valentine cao hơn TB ngành', relevance: 'Cao', discoveredAt: null },
  { id: 4, category: 'Social', title: '3 bài lên lịch, 2 bài cần prompt hình', relevance: 'TB', discoveredAt: null },
];

const fallbackCompetitors = [
  { id: 1, domain: 'Niche Jewelry', name: 'Heart To Soul', productCount: 0, lastCrawledAt: null, niche: { name: 'Jewelry' }, status: 'Đang theo' },
  { id: 2, domain: 'Niche LED Art', name: 'Lume Vibe', productCount: 0, lastCrawledAt: null, niche: { name: 'LED Art' }, status: 'Dự kiến' },
];

const fallbackThemes = [
  { id: 1, versionName: 'hearttosoul-liquid', sourceType: 'custom', status: 'Active', store: { name: 'Heart To Soul' }, desc: 'Theme jewelry với branding love/soul' },
  { id: 2, versionName: 'lume-vibe-liquid', sourceType: 'custom', status: 'Đang phát triển', store: { name: 'Lume Vibe' }, desc: 'Theme LED art với dark aesthetic' },
];

const skillsConfig = [
  { id: 'optimize-products', name: 'Product Optimizer', icon: Package, color: 'indigo', desc: 'Tối ưu title, SEO, tags qua Shopify API' },
  { id: 'ads-content-creator', name: 'Ads Creator', icon: Megaphone, color: 'rose', desc: 'Tạo chiến dịch Meta, Google, TikTok' },
  { id: 'social-content-creator', name: 'Social Content', icon: Share2, color: 'emerald', desc: 'Tạo bài đăng, caption, prompt hình/video' },
  { id: 'winning-product-hunter', name: 'Winning Products', icon: TrendingUp, color: 'amber', desc: 'Tìm SP trend, spy ads đối thủ' },
  { id: 'shopify-pipeline', name: 'Pipeline Manager', icon: Rocket, color: 'purple', desc: 'Quản lý toàn bộ: crawl, optimize, setup' },
];

// --- TOAST SYSTEM ---
const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center space-x-2 px-4 py-3 rounded-[16px] backdrop-blur-[10px] backdrop-saturate-[170%] border shadow-lg animate-fade-in cursor-pointer ${
          toast.type === 'success'
            ? 'bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-200/50 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : toast.type === 'error'
            ? 'bg-rose-100/80 dark:bg-rose-900/60 border-rose-200/50 dark:border-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-blue-100/80 dark:bg-blue-900/60 border-blue-200/50 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
        }`}
        onClick={() => removeToast(toast.id)}
      >
        {toast.type === 'success' ? <CheckCircle2 size={16} /> : toast.type === 'error' ? <AlertCircle size={16} /> : <Activity size={16} />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    ))}
  </div>
);

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

// --- SECTION HEADER ---
const SectionHeader = ({ title, onRefresh, loading }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
    {onRefresh && (
      <button onClick={onRefresh} className="p-2 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={loading}>
        <RefreshCw size={16} className={`text-slate-500 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
      </button>
    )}
  </div>
);

// --- TASK MONITOR ---
const TaskMonitor = ({ tasks }) => {
  if (tasks.length === 0) return null;
  return (
    <GlassCard className="!p-4 border-l-4 border-indigo-500">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center">
        <Activity size={16} className="mr-2 text-indigo-500" /> Giám sát tác vụ
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-2.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[12px] border border-white/[0.1] dark:border-white/[0.04]">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                task.status === 'running' ? 'bg-blue-100 dark:bg-blue-500/20' :
                task.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                task.status === 'failed' ? 'bg-rose-100 dark:bg-rose-500/20' :
                'bg-amber-100 dark:bg-amber-500/20'
              }`}>
                {task.status === 'running' ? <RefreshCw size={14} className="text-blue-500 animate-spin" /> :
                 task.status === 'completed' ? <CheckCircle2 size={14} className="text-emerald-500" /> :
                 task.status === 'failed' ? <AlertCircle size={14} className="text-rose-500" /> :
                 <Clock size={14} className="text-amber-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{task.label}</p>
                <p className="text-[10px] text-slate-500">{task.detail || task.status}</p>
              </div>
            </div>
            {task.status === 'completed' && task.result && (
              <span className="text-[10px] font-semibold text-emerald-600 flex-shrink-0">{task.result}</span>
            )}
            {task.status === 'running' && (
              <span className="text-[10px] text-blue-500 flex-shrink-0 animate-pulse">Đang xử lý...</span>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// --- VIEWS ---
const CommandCenter = ({ stores, dashboard, runs, insights, addToast, tasks, handleQuickAction }) => {
  const storeList = stores.data || fallbackStores;
  const dashData = dashboard.data || { stores: storeList.length, productCount: storeList.reduce((sum, s) => sum + (s.productCount || 0), 0), runCount: 5, insightCount: 4 };
  const runList = runs.data || fallbackRuns;
  const insightList = insights.data || fallbackInsights;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Trung tâm điều khiển</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">ShopifyOS &middot; Tổng quan hệ thống</p>
        </div>
        <button onClick={() => { dashboard.refetch(); stores.refetch(); runs.refetch(); insights.refetch(); }} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${dashboard.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: Store, label: 'Cửa hàng', value: Array.isArray(dashData.stores) ? dashData.stores.length : (dashData.stores || 0), color: 'blue', badge: `${storeList.length} niches` },
          { icon: Package, label: 'Sản phẩm', value: dashData.productCount, color: 'indigo', badge: null },
          { icon: Sparkles, label: 'Kỹ năng AI', value: 5, color: 'purple', badge: 'Hoạt động' },
          { icon: Zap, label: 'Tự động hóa', value: 3, color: 'amber', badge: null },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex flex-col justify-center space-y-3 md:space-y-4 !p-4 md:!p-8">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 md:p-4 rounded-[16px] ${colorMap[stat.color].bg} ${colorMap[stat.color].text}`}>
                <stat.icon size={20} className="md:w-7 md:h-7" />
              </div>
              {stat.badge && <Badge type="neutral" text={stat.badge} />}
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions - shown on mobile/tablet only (right panel on desktop) */}
      <div className="lg:hidden">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Thao tác nhanh</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { icon: Package, label: 'Tối ưu SP', color: 'indigo', action: () => handleQuickAction('optimize', 'Tối ưu SP') },
            { icon: Megaphone, label: 'Tạo Ads', color: 'rose', action: () => addToast('Mở Claude Code và chạy /ads-content-creator', 'info') },
            { icon: Share2, label: 'Social', color: 'emerald', action: () => addToast('Mở Claude Code và chạy /social-content-creator', 'info') },
            { icon: TrendingUp, label: 'Tìm SP Win', color: 'amber', action: () => addToast('Mở Claude Code và chạy /winning-product-hunter', 'info') },
            { icon: Rocket, label: 'Pipeline', color: 'purple', action: () => addToast('Mở Claude Code và chạy /shopify-pipeline', 'info') },
          ].map((action, i) => (
            <div key={i} onClick={action.action} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 md:p-4 bg-white/[0.08] dark:bg-slate-800/[0.1] backdrop-blur-[10px] backdrop-saturate-[170%] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04] min-w-[80px] md:min-w-[100px] cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
              <div className={`p-2.5 rounded-[12px] ${colorMap[action.color].bg} ${colorMap[action.color].text}`}>
                <action.icon size={20} />
              </div>
              <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Monitor - shown on mobile/tablet only */}
      <div className="lg:hidden">
        <TaskMonitor tasks={tasks} />
      </div>

      {/* Charts */}
      {(() => {
        const totalProducts = storeList.reduce((s, st) => s + (st.productCount || 0), 0);
        const optimizedCount = runList.reduce((s, r) => s + (r.productsOptimized || 0), 0);
        const pendingCount = Math.max(0, totalProducts - optimizedCount);

        const pieData = [
          { name: 'Đã tối ưu', value: optimizedCount || 0 },
          { name: 'Chưa tối ưu', value: pendingCount || 1 },
        ];
        const COLORS = ['#6366f1', '#e2e8f0'];
        const DARK_COLORS = ['#818cf8', '#334155'];

        const storeBarData = storeList.map(st => ({
          name: st.name?.length > 10 ? st.name.substring(0, 10) + '...' : st.name,
          sp: st.productCount || 0,
        }));

        const insightBarData = [
          { name: 'TREND', value: insightList.filter(i => i.category === 'TREND').length },
          { name: 'SEO', value: insightList.filter(i => i.category === 'SEO_UPDATE').length },
          { name: 'Đối thủ', value: insightList.filter(i => i.category === 'COMPETITOR_CHANGE').length },
          { name: 'Cơ hội', value: insightList.filter(i => i.category === 'OPPORTUNITY').length },
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pie: Optimization Status */}
            <GlassCard className="!p-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Trạng thái tối ưu</p>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="ml-2 space-y-1">
                  <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div><span className="text-[10px] text-slate-500">{optimizedCount} đã tối ưu</span></div>
                  <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600"></div><span className="text-[10px] text-slate-500">{pendingCount} chưa</span></div>
                </div>
              </div>
            </GlassCard>

            {/* Bar: Products per Store */}
            <GlassCard className="!p-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Sản phẩm theo Store</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={storeBarData} barSize={24}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 12, fontSize: 11, backdropFilter: 'blur(8px)' }} />
                  <Bar dataKey="sp" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Bar: Insights by Category */}
            <GlassCard className="!p-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Nhận định theo loại</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={insightBarData} barSize={24}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 12, fontSize: 11 }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        );
      })()}

      {/* Stores */}
      <GlassCard>
        <SectionHeader title="Cửa hàng" onRefresh={stores.refetch} loading={stores.loading} />
        {stores.loading ? <LoadingSkeleton count={2} /> : (
          <div className="space-y-3 mt-4">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3.5 md:p-5 bg-white/[0.1] dark:bg-slate-800/[0.12] backdrop-blur-[10px] backdrop-saturate-[170%] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                <div className="flex items-center space-x-3 md:space-x-5 min-w-0">
                  <div className={`w-11 h-11 md:w-14 md:h-14 rounded-[16px] md:rounded-[18px] bg-gradient-to-br ${store.gradient || 'from-rose-400 to-pink-600'} flex items-center justify-center text-xl md:text-2xl shadow-inner flex-shrink-0`}>
                    {store.icon || '\u{1F3EA}'}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text-lg truncate">{store.name}</span>
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{store.domain}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? 'Hoạt động' : 'Đang setup'} />
                      <span className="text-[10px] md:text-xs text-slate-400 hidden sm:inline">{store.niche?.name || (typeof store.niche === 'string' ? store.niche : '')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300">{store.productCount ?? store.products ?? 0}</p>
                  <p className="text-[10px] md:text-xs text-slate-400">SP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* AI Skills + Recent Runs (runs hidden on lg+ - shown in right panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">AI Skills</h2>
          <div className="space-y-2.5">
            {skillsConfig.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-3 p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[16px] border border-white/[0.1] dark:border-white/[0.04]">
                <div className={`p-2.5 rounded-[12px] ${colorMap[skill.color].pill} flex-shrink-0`}>
                  <skill.icon size={18} className={colorMap[skill.color].text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{skill.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{skill.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Runs - hidden on lg+ (in right panel) */}
        <div className="lg:hidden">
          <GlassCard>
            <SectionHeader title="Hoạt động gần đây" onRefresh={runs.refetch} loading={runs.loading} />
            {runs.loading ? <LoadingSkeleton count={4} /> : (
              <div className="space-y-2.5 mt-4">
                {runList.map((run) => {
                  const isSuccess = run.status === 'COMPLETED' || run.status === 'success';
                  const isFailed = run.status === 'FAILED';
                  const timeAgo = run.startedAt ? new Date(run.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <div key={run.id} className="flex items-center space-x-3 p-3 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                      <div className={`p-2 rounded-[12px] flex-shrink-0 ${isSuccess ? 'bg-emerald-100 dark:bg-emerald-500/20' : isFailed ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                        {isSuccess ? <CheckCircle2 size={18} className="text-emerald-500" /> : isFailed ? <AlertCircle size={18} className="text-rose-500" /> : <Clock size={18} className="text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{run.runType?.replace(/_/g, ' ')}</p>
                        <p className="text-[11px] text-slate-500">{run.store?.name || 'Heart To Soul'} &middot; {timeAgo}</p>
                      </div>
                      {run.productsOptimized > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-600 flex-shrink-0">{run.productsOptimized}/{run.productsTotal}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Insights */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
            <Lightbulb className="mr-2 text-amber-500" size={20} /> Nhận định thông minh
          </h2>
          <button onClick={insights.refetch} className="p-2 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={insights.loading}>
            <RefreshCw size={16} className={`text-slate-500 dark:text-slate-400 ${insights.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {insights.loading ? <LoadingSkeleton count={4} /> : (
          <div className="space-y-2.5">
            {insightList.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 md:p-4 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    (insight.category || insight.type) === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                    (insight.category || insight.type) === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                    (insight.category || insight.type) === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                    'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
                  }`}>{insight.category || insight.type}</span>
                  <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{insight.title}</p>
                </div>
                <Badge type="neutral" text={insight.relevance || insight.impact} />
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

const ProductsView = ({ products, addToast }) => {
  const productList = products.data || fallbackProducts;
  const optimized = productList.filter((p) => p.lastOptimizedAt).length;
  const pending = productList.length - optimized;

  const handleBulkOptimize = async () => {
    addToast('Đang tối ưu hàng loạt...', 'info');
    try {
      await api.optimizeStore();
      addToast('Tối ưu hoàn tất!', 'success');
      products.refetch();
    } catch (e) {
      addToast(`Lỗi: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Sản phẩm</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Heart To Soul &middot; Shopify Admin API</p>
        </div>
        <button onClick={products.refetch} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${products.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {[
          { label: 'Đã tối ưu', value: optimized, icon: CheckCircle2, color: 'emerald' },
          { label: 'Đang đợi', value: pending, icon: Clock, color: 'amber' },
          { label: 'Tổng', value: productList.length, icon: Package, color: 'indigo' },
        ].map((s, i) => (
          <GlassCard key={i} className="!p-4 md:!p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] md:text-sm text-slate-500 font-medium mb-0.5">{s.label}</p>
              <p className={`text-xl md:text-3xl font-bold ${colorMap[s.color].text}`}>{s.value}</p>
            </div>
            <div className={`p-2.5 md:p-4 ${colorMap[s.color].bg} rounded-full hidden sm:block`}>
              <s.icon size={20} className={colorMap[s.color].text} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex space-x-3">
        <GlassButton variant="primary" icon={Zap} size="sm" onClick={handleBulkOptimize}>Tối ưu hàng loạt</GlassButton>
        <GlassButton variant="glass" icon={Filter} size="sm">Lọc</GlassButton>
      </div>

      {products.loading ? <LoadingSkeleton count={5} /> : (
        <div className="space-y-3">
          {productList.map((prod) => (
            <GlassCard key={prod.id} className="!p-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
                  <Heart size={18} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate pr-2">{prod.title || prod.name}</p>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-shrink-0">${prod.priceMin || prod.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[11px] text-slate-500">{prod.productType || prod.type} &middot; {typeof prod.tags === 'number' ? prod.tags : Array.isArray(prod.tags) ? prod.tags.length : 0} tags &middot; {prod.imageCount || prod.images} ảnh</p>
                    <Badge type="neutral" text={prod.lastOptimizedAt ? 'Đã tối ưu' : 'Đang đợi'} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

const AdsView = ({ skillOutputs, addToast }) => {
  const outputs = skillOutputs.data || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Tạo Quảng cáo</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">AI tạo chiến dịch cho Meta, Google, TikTok</p>
        </div>
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${skillOutputs.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          { platform: 'Meta Ads', icon: Eye, color: 'blue', desc: 'Image prompts, ad copy, targeting', count: `${outputs.filter(o => o.metadata?.platform === 'meta').length || 12} creatives` },
          { platform: 'Google Ads', icon: Globe, color: 'emerald', desc: 'Search ads, keywords, extensions', count: `${outputs.filter(o => o.metadata?.platform === 'google').length || 8} ads` },
          { platform: 'TikTok Ads', icon: Video, color: 'rose', desc: 'Video prompts, scripts, hooks', count: `${outputs.filter(o => o.metadata?.platform === 'tiktok').length || 5} scripts` },
        ].map((p, i) => (
          <GlassCard key={i} hoverEffect className="cursor-pointer !p-5">
            <div className="flex items-center space-x-3 md:block">
              <div className={`p-3 md:p-4 rounded-[16px] w-fit md:mb-4 ${colorMap[p.color].bg} ${colorMap[p.color].text}`}>
                <p.icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-xl font-bold text-slate-800 dark:text-white">{p.platform}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 md:mt-2 md:mb-4">{p.desc}</p>
                <Badge type="neutral" text={p.count} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Nội dung chi tiết từ skill outputs */}
      {outputs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Nội dung đã tạo</h2>
          {outputs.map((output) => {
            let content = {};
            let meta = {};
            try { content = JSON.parse(output.content); } catch(e) { content = { raw: output.content }; }
            try { meta = JSON.parse(output.metadata); } catch(e) { meta = {}; }
            return (
              <GlassCard key={output.id} className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge type={output.outputType === 'META_AD' ? 'active' : output.outputType === 'GOOGLE_AD' ? 'success' : 'pending'} text={meta.platform || output.outputType} />
                    <span className="text-xs text-slate-400">{meta.format || meta.campaign || ''}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(output.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">{output.title}</h3>
                {content.headline && <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-1">{content.headline}</p>}
                {content.primaryText && <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{content.primaryText}</p>}
                {content.headlines && <div className="mb-2">{content.headlines.map((h, i) => <p key={i} className="text-xs text-slate-700 dark:text-slate-200 font-medium">• {h}</p>)}</div>}
                {content.descriptions && <div className="mb-2">{content.descriptions.map((d, i) => <p key={i} className="text-[11px] text-slate-500">{d}</p>)}</div>}
                {content.hook && <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">{content.hook}</p>}
                {content.script && <pre className="text-[11px] text-slate-500 bg-white/[0.06] dark:bg-slate-800/[0.08] p-2 rounded-[12px] mb-2 whitespace-pre-wrap">{content.script}</pre>}
                {content.keywords && <div className="flex flex-wrap gap-1 mb-2">{content.keywords.map((k, i) => <span key={i} className="px-2 py-0.5 bg-indigo-100/80 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] rounded-full">{k}</span>)}</div>}
                {content.hashtags && <div className="flex flex-wrap gap-1 mb-2">{content.hashtags.map((h, i) => <span key={i} className="px-2 py-0.5 bg-purple-100/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] rounded-full">{h}</span>)}</div>}
                {content.targeting && <div className="mt-2 p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-[12px]"><p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Targeting: {content.targeting.age} | {content.targeting.interests?.join(', ')}</p></div>}
                {(content.imagePrompt || content.videoPrompt) && <div className="mt-2 p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[12px]"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Prompt:</span> {content.imagePrompt || content.videoPrompt}</p></div>}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SocialView = ({ stores, skillOutputs }) => {
  const storeList = stores.data || fallbackStores;
  const outputs = skillOutputs.data || [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Nội dung Mạng xã hội</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Tạo nội dung đa nền tảng</p>
        </div>
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${skillOutputs.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: FileText, label: 'Bài đăng', value: outputs.filter(o => o.outputType === 'post').length || '24', color: 'indigo' },
          { icon: Image, label: 'Prompt hình', value: outputs.filter(o => o.outputType === 'image_prompt').length || '18', color: 'purple' },
          { icon: Video, label: 'Ý tưởng video', value: outputs.filter(o => o.outputType === 'video').length || '6', color: 'rose' },
          { icon: Hash, label: 'Bộ hashtag', value: outputs.filter(o => o.outputType === 'hashtag').length || '12', color: 'emerald' },
        ].map((s, i) => (
          <GlassCard key={i} className="!p-4 md:!p-6">
            <div className={`p-2.5 rounded-[12px] w-fit mb-2 ${colorMap[s.color].pill}`}>
              <s.icon size={18} className={colorMap[s.color].text} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
            <p className="text-[11px] md:text-sm text-slate-500 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Nội dung posts chi tiết */}
      {outputs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Bài đăng đã tạo</h2>
          {outputs.map((output) => {
            let content = {};
            let meta = {};
            try { content = JSON.parse(output.content); } catch(e) { content = { raw: output.content }; }
            try { meta = JSON.parse(output.metadata); } catch(e) { meta = {}; }
            return (
              <GlassCard key={output.id} className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge type={content.type === 'Educational' ? 'active' : content.type === 'Storytelling' ? 'pending' : 'success'} text={content.type || meta.contentType || 'Post'} />
                    <Badge type="neutral" text={content.platform || meta.platform || ''} />
                  </div>
                  <span className="text-[10px] text-slate-400">{content.bestTime && `Best: ${content.bestTime}`}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">{output.title}</h3>
                {content.caption && <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/[0.06] dark:bg-slate-800/[0.08] p-3 rounded-[12px] mb-2 leading-relaxed">{content.caption}</pre>}
                {content.imagePrompt && <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[12px]"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Image Prompt:</span> {content.imagePrompt}</p></div>}
              </GlassCard>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Loại nội dung</h2>
          <div className="space-y-2">
            {['Giáo dục & Tips', 'Cảm xúc & Storytelling', 'Giới thiệu SP', 'Hậu trường', 'Phong cách UGC', 'Theo mùa & Trending'].map((type, i) => (
              <div key={i} className="flex items-center space-x-3 p-2.5 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[12px] border border-white/[0.1] dark:border-white/[0.04]">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">{type}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Cửa hàng đang hoạt động</h2>
          <div className="space-y-3">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{store.icon || '\u{1F3EA}'}</span>
                  <div>
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{store.name}</p>
                    <p className="text-[11px] text-slate-500">{store.niche?.name || (typeof store.niche === 'string' ? store.niche : '')}</p>
                  </div>
                </div>
                <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? 'Đang chạy' : 'Chờ'} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const WinningProductsView = ({ competitors, skillOutputs, insights, addToast }) => {
  const competitorList = competitors.data || fallbackCompetitors;
  const outputs = skillOutputs?.data || [];
  const insightList = insights?.data || fallbackInsights;

  const handleCrawl = async () => {
    addToast('Đang crawl đối thủ...', 'info');
    try {
      await api.crawlCompetitor('', competitorList[0]?.id);
      addToast('Crawl hoàn tất!', 'success');
      competitors.refetch();
    } catch (e) {
      addToast(`Lỗi: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Nghiên cứu sản phẩm</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Tìm SP tiềm năng, phân tích đối thủ, theo dõi thị trường</p>
        </div>
        <button onClick={competitors.refetch} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${competitors.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          { icon: TrendingUp, title: 'Quét Trend', desc: 'Phát hiện micro-trends từ TikTok, Amazon, Google', color: 'emerald' },
          { icon: Eye, title: 'Spy Ads', desc: 'Phân tích ads đối thủ trên Meta, TikTok, Google', color: 'blue' },
          { icon: ShoppingBag, title: 'Chấm điểm SP', desc: 'Score theo demand, cạnh tranh, biên lợi', color: 'amber' },
        ].map((f, i) => (
          <GlassCard key={i} hoverEffect className="cursor-pointer !p-5" onClick={handleCrawl}>
            <div className="flex items-center space-x-3 md:block">
              <div className={`p-3 md:p-4 rounded-[16px] w-fit md:mb-4 ${colorMap[f.color].bg} ${colorMap[f.color].text}`}>
                <f.icon size={22} />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-slate-800 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Reports chi tiết */}
      {outputs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Báo cáo nghiên cứu</h2>
          {outputs.map((output) => {
            let content = {};
            let meta = {};
            try { content = JSON.parse(output.content); } catch(e) { content = { raw: output.content }; }
            try { meta = JSON.parse(output.metadata); } catch(e) { meta = {}; }
            return (
              <GlassCard key={output.id} className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge type={meta.confidence > 0.9 ? 'failed' : 'pending'} text={meta.category || 'Report'} />
                  <span className="text-[10px] text-slate-400">{meta.confidence && `Confidence: ${Math.round(meta.confidence * 100)}%`}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-3">{output.title}</h3>
                {content.product && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="p-2 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-[12px] text-center"><p className="text-lg font-bold text-emerald-600">{content.score}</p><p className="text-[10px] text-slate-500">Score</p></div>
                    <div className="p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-[12px] text-center"><p className="text-xs font-bold text-blue-600">{content.trend}</p><p className="text-[10px] text-slate-500">Trend</p></div>
                    <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[12px] text-center"><p className="text-xs font-bold text-amber-600">{content.marginPotential}</p><p className="text-[10px] text-slate-500">Margin</p></div>
                    <div className="p-2 bg-purple-50/50 dark:bg-purple-500/10 rounded-[12px] text-center"><p className="text-xs font-bold text-purple-600">{content.sellingPrice}</p><p className="text-[10px] text-slate-500">Giá bán</p></div>
                  </div>
                )}
                {content.whyWinning && <p className="text-xs text-slate-600 dark:text-slate-300 mb-2"><span className="font-semibold">Tại sao win:</span> {content.whyWinning}</p>}
                {content.competitors && (
                  <div className="space-y-2 mb-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Đối thủ phân tích:</p>
                    {content.competitors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[12px]">
                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.name}</p><p className="text-[10px] text-slate-500">{c.platform} | {c.adSpend}</p></div>
                        <Badge type="neutral" text={`CTR ${c.ctr}`} />
                      </div>
                    ))}
                  </div>
                )}
                {content.insights && <div className="space-y-1 mb-2">{content.insights.map((ins, i) => <p key={i} className="text-[11px] text-slate-500">• {ins}</p>)}</div>}
                {content.recommendation && <div className="p-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-[12px]"><p className="text-[11px] text-indigo-600 dark:text-indigo-300"><span className="font-semibold">Khuyến nghị:</span> {content.recommendation}</p></div>}
                {content.sources && <div className="mt-2 flex flex-wrap gap-1">{content.sources.map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-100/80 dark:bg-slate-700/50 text-[9px] text-slate-500 rounded-full">{s}</span>)}</div>}
              </GlassCard>
            );
          })}
        </div>
      )}

      {outputs.length === 0 && (
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Báo cáo</h2>
          <p className="text-xs text-slate-500">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/winning-product-hunter</code> trong Claude Code để tạo reports.</p>
        </GlassCard>
      )}

      {/* Insights + Competitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <Lightbulb className="mr-2 text-amber-500" size={20} /> Nhận định thị trường
          </h2>
          <div className="space-y-2.5">
            {insightList.map((insight) => (
              <div key={insight.id} className="p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    (insight.category || insight.type) === 'TREND' ? 'bg-emerald-100/60 dark:bg-emerald-500/15 text-emerald-600' :
                    (insight.category || insight.type) === 'SEO_UPDATE' ? 'bg-blue-100/60 dark:bg-blue-500/15 text-blue-600' :
                    (insight.category || insight.type) === 'COMPETITOR_CHANGE' ? 'bg-rose-100/60 dark:bg-rose-500/15 text-rose-600' :
                    'bg-purple-100/60 dark:bg-purple-500/15 text-purple-600'
                  }`}>{insight.category || insight.type}</span>
                  <span className="text-[10px] text-slate-400">{insight.relevance}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1.5">{insight.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">{insight.source}</p>
              </div>
            ))}
            {insightList.length === 0 && <p className="text-xs text-slate-400 text-center py-3">Chưa có nhận định</p>}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <Target className="mr-2 text-rose-500" size={20} /> Đối thủ cạnh tranh
          </h2>
          <div className="space-y-2.5">
            {competitorList.map((comp, idx) => (
              <div key={comp.id || idx} className="flex items-center justify-between p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-white">{comp.domain || comp.name}</p>
                  <p className="text-[10px] text-slate-500">{comp.name} &middot; {comp.productCount || 0} SP</p>
                </div>
                <Badge type={comp.lastCrawledAt ? 'success' : 'pending'} text={comp.lastCrawledAt ? 'Đã crawl' : 'Chờ'} />
              </div>
            ))}
            {competitorList.length === 0 && <p className="text-xs text-slate-400 text-center py-3">Chưa có đối thủ</p>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const IntelligenceView = ({ insights, competitors, addToast }) => {
  const insightList = insights.data || fallbackInsights;
  const competitorList = competitors.data || fallbackCompetitors;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Phân tích thị trường</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Phân tích thị trường & theo dõi đối thủ</p>
        </div>
        <button onClick={() => { insights.refetch(); competitors.refetch(); }} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${insights.loading || competitors.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <BrainCircuit className="mr-2 text-purple-500" size={20} /> Nhận định mới
          </h2>
          {insights.loading ? <LoadingSkeleton count={4} /> : (
            <div className="space-y-3">
              {insightList.map((insight) => (
                <div key={insight.id} className="p-3.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      (insight.category || insight.type) === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                      (insight.category || insight.type) === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                      (insight.category || insight.type) === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                      'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
                    }`}>{insight.category || insight.type}</span>
                    <Badge type="neutral" text={insight.relevance || insight.impact} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mt-2">{insight.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Nguồn: {insight.source || insight.category}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <Target className="mr-2 text-rose-500" size={20} /> Theo dõi đối thủ
          </h2>
          {competitors.loading ? <LoadingSkeleton count={2} /> : (
            <div className="space-y-3 mb-4">
              {competitorList.map((comp, idx) => (
                <div key={comp.id || idx} className="flex items-center justify-between p-3.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[16px] border border-white/[0.12] dark:border-white/[0.04]">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{comp.domain}</h3>
                    <p className="text-xs text-slate-500">Cho: {comp.name}</p>
                  </div>
                  <Badge type={comp.lastCrawledAt || comp.status === 'Đang theo' ? 'success' : 'pending'} text={comp.lastCrawledAt ? 'Đang theo' : (comp.status || 'Dự kiến')} />
                </div>
              ))}
            </div>
          )}
          <div className="p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[16px] border border-white/[0.1] dark:border-white/[0.04]">
            <p className="text-xs text-slate-500">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/shopify-pipeline</code> để crawl & phân tích.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const ThemesView = ({ themes }) => {
  const themeList = themes.data || fallbackThemes;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Themes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Quản lý giao diện</p>
        </div>
        <button onClick={themes.refetch} className="p-2.5 rounded-[12px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${themes.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {themes.loading ? <LoadingSkeleton count={2} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {themeList.map((theme, i) => (
            <GlassCard key={theme.id || i} hoverEffect className="cursor-pointer !p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-[12px]">
                  <Palette size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <Badge type={theme.status === 'Active' ? 'success' : 'pending'} text={theme.status} />
              </div>
              <h3 className="text-base md:text-xl font-bold text-slate-800 dark:text-white mb-1 font-mono">{theme.versionName || theme.name}</h3>
              <p className="text-xs text-slate-500 mb-1">Store: {theme.store?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{theme.desc || `Source: ${theme.sourceType}`}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PIPELINE VIEW ---
const PipelineView = ({ stores, runs, addToast, handleQuickAction }) => {
  const [mode, setMode] = useState('clone'); // 'clone' or 'full'
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [cloneForm, setCloneForm] = useState({ url: '', storeName: '' });
  const [fullForm, setFullForm] = useState({ url: '', repo: '', storeName: '', domain: '', tokenKey: '', niche: '' });

  const inputClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[14px] py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200 placeholder-slate-400";

  const updateStep = (idx, status, detail) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status, detail: detail || s.detail } : s));
  };

  const runClonePipeline = async () => {
    if (!cloneForm.url) return addToast('Vui lòng nhập URL đối thủ', 'error');
    const storeName = cloneForm.storeName || new URL(cloneForm.url.startsWith('http') ? cloneForm.url : `https://${cloneForm.url}`).hostname.split('.')[0];

    setRunning(true);
    setSteps([
      { title: 'Crawl đối thủ', status: 'pending', detail: '' },
      { title: 'Tạo store mới', status: 'pending', detail: '' },
      { title: 'Import sản phẩm', status: 'pending', detail: '' },
      { title: 'Tối ưu SEO', status: 'pending', detail: '' },
    ]);

    try {
      // Step 1: Crawl
      updateStep(0, 'running', 'Đang crawl sản phẩm...');
      const crawlResult = await api.crawlCompetitor(cloneForm.url);
      updateStep(0, 'done', `${crawlResult.productsCrawled} SP, ${crawlResult.collections?.length || 0} collections`);

      // Step 2: Create store
      updateStep(1, 'running', 'Đang tạo store...');
      const store = await api.createStore({ name: storeName, domain: `${storeName.toLowerCase().replace(/\s+/g,'-')}.myshopify.com`, nicheName: storeName + ' Niche', envTokenKey: `SHOPIFY_ACCESS_TOKEN_${storeName.toUpperCase().replace(/[^A-Z0-9]/g,'')}` });
      updateStep(1, 'done', store.name);

      // Step 3: Import crawled products
      updateStep(2, 'running', 'Đang import sản phẩm...');
      let totalImported = 0;
      let hasMore = true;
      while (hasMore) {
        const importResult = await api.importCrawled(store.id, crawlResult.sessionId);
        totalImported += importResult.imported;
        if (importResult.imported === 0) hasMore = false;
        updateStep(2, 'running', `Đã import ${totalImported} SP...`);
      }
      updateStep(2, 'done', `${totalImported} SP đã import`);

      // Step 4: Optimize
      updateStep(3, 'running', 'Đang tối ưu SEO...');
      let totalOptimized = 0;
      let optMore = true;
      while (optMore) {
        try {
          const optResult = await api.optimizeStore(store.id);
          totalOptimized += optResult.optimized || 0;
          if (!optResult.optimized || optResult.total === 0) optMore = false;
          updateStep(3, 'running', `Đã tối ưu ${totalOptimized} SP...`);
        } catch { optMore = false; }
      }
      updateStep(3, 'done', `${totalOptimized} SP đã tối ưu`);

      addToast(`Clone hoàn tất! ${totalImported} SP đã import và ${totalOptimized} đã tối ưu.`, 'success');
      stores.refetch(); runs.refetch();
    } catch (e) {
      const failIdx = steps.findIndex(s => s.status === 'running');
      if (failIdx >= 0) updateStep(failIdx, 'failed', e.message);
      addToast(`Lỗi: ${e.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const runFullPipeline = async () => {
    if (!fullForm.url || !fullForm.storeName || !fullForm.domain || !fullForm.tokenKey || !fullForm.niche) return addToast('Vui lòng điền đầy đủ thông tin', 'error');

    setRunning(true);
    setSteps([
      { title: 'Crawl đối thủ', status: 'pending', detail: '' },
      { title: 'Tạo store', status: 'pending', detail: '' },
      { title: 'Đồng bộ từ Shopify', status: 'pending', detail: '' },
      { title: 'Tối ưu SEO', status: 'pending', detail: '' },
    ]);

    try {
      // Step 1: Crawl
      updateStep(0, 'running', 'Đang crawl đối thủ...');
      const crawlResult = await api.crawlCompetitor(fullForm.url);
      updateStep(0, 'done', `${crawlResult.productsCrawled} SP`);

      // Step 2: Create store
      updateStep(1, 'running', 'Đang tạo store...');
      const store = await api.createStore({ name: fullForm.storeName, domain: fullForm.domain, nicheName: fullForm.niche, envTokenKey: fullForm.tokenKey });
      updateStep(1, 'done', store.name);

      // Step 3: Sync from Shopify
      updateStep(2, 'running', 'Đang đồng bộ từ Shopify API...');
      const syncResult = await api.syncStore(store.id);
      updateStep(2, 'done', `${syncResult.synced} SP đã đồng bộ`);

      // Step 4: Optimize
      updateStep(3, 'running', 'Đang tối ưu SEO...');
      let totalOpt = 0;
      let more = true;
      while (more) {
        try {
          const r = await api.optimizeStore(store.id);
          totalOpt += r.optimized || 0;
          if (!r.optimized || r.total === 0) more = false;
          updateStep(3, 'running', `Đã tối ưu ${totalOpt} SP...`);
        } catch { more = false; }
      }
      updateStep(3, 'done', `${totalOpt} SP đã tối ưu`);

      addToast('Pipeline hoàn tất!', 'success');
      stores.refetch(); runs.refetch();
    } catch (e) {
      const failIdx = steps.findIndex(s => s.status === 'running');
      if (failIdx >= 0) updateStep(failIdx, 'failed', e.message);
      addToast(`Lỗi: ${e.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Setup Store mới</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Tự động clone đối thủ hoặc setup store từ đầu</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setMode('clone')} className={`px-4 py-2 rounded-[14px] text-sm font-semibold transition-all ${mode === 'clone' ? 'bg-indigo-600/85 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)]' : 'bg-white/[0.08] dark:bg-slate-800/[0.1] text-slate-600 dark:text-slate-300 border border-white/[0.1] dark:border-white/[0.04]'}`}>
          Clone trang web đối thủ
        </button>
        <button onClick={() => setMode('full')} className={`px-4 py-2 rounded-[14px] text-sm font-semibold transition-all ${mode === 'full' ? 'bg-indigo-600/85 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)]' : 'bg-white/[0.08] dark:bg-slate-800/[0.1] text-slate-600 dark:text-slate-300 border border-white/[0.1] dark:border-white/[0.04]'}`}>
          Xây dựng Store hoàn chỉnh
        </button>
      </div>

      {/* Clone Mode */}
      {mode === 'clone' && (
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Clone trang web đối thủ</h2>
          <p className="text-xs text-slate-500 mb-4">Chỉ cần nhập URL trang web đối thủ. Hệ thống sẽ tự động phân tích, crawl toàn bộ sản phẩm, bộ sưu tập, và tạo một trang web Shopify mới tương tự đối thủ với sản phẩm đã được tối ưu SEO.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">URL đối thủ *</label>
              <input className={inputClass} placeholder="vd: competitor-store.myshopify.com" value={cloneForm.url} onChange={e => setCloneForm({...cloneForm, url: e.target.value})} disabled={running} />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tên store mới (tùy chọn)</label>
              <input className={inputClass} placeholder="Để trống = tự tạo từ URL" value={cloneForm.storeName} onChange={e => setCloneForm({...cloneForm, storeName: e.target.value})} disabled={running} />
            </div>
            <GlassButton variant="primary" icon={Rocket} onClick={runClonePipeline} disabled={running}>
              {running ? 'Đang chạy...' : 'Bắt đầu Clone'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Full Pipeline Mode */}
      {mode === 'full' && (
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Xây dựng Store Shopify hoàn chỉnh</h2>
          <p className="text-xs text-slate-500 mb-4">Thiết lập hệ thống Shopify đầy đủ: phân tích đối thủ, kết nối store Shopify của bạn, đồng bộ sản phẩm qua API, tối ưu SEO toàn bộ. Phù hợp khi bạn đã có store Shopify và muốn hoàn thiện hệ thống.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">URL đối thủ *</label>
              <input className={inputClass} placeholder="vd: competitor.myshopify.com" value={fullForm.url} onChange={e => setFullForm({...fullForm, url: e.target.value})} disabled={running} />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">GitHub repo (tùy chọn)</label>
              <input className={inputClass} placeholder="vd: https://github.com/user/theme" value={fullForm.repo} onChange={e => setFullForm({...fullForm, repo: e.target.value})} disabled={running} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tên store *</label>
                <input className={inputClass} placeholder="My New Store" value={fullForm.storeName} onChange={e => setFullForm({...fullForm, storeName: e.target.value})} disabled={running} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Niche *</label>
                <input className={inputClass} placeholder="vd: Jewelry" value={fullForm.niche} onChange={e => setFullForm({...fullForm, niche: e.target.value})} disabled={running} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Domain Shopify *</label>
              <input className={inputClass} placeholder="my-store.myshopify.com" value={fullForm.domain} onChange={e => setFullForm({...fullForm, domain: e.target.value})} disabled={running} />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Env Token Key *</label>
              <input className={inputClass} placeholder="SHOPIFY_ACCESS_TOKEN_MYSTORE" value={fullForm.tokenKey} onChange={e => setFullForm({...fullForm, tokenKey: e.target.value})} disabled={running} />
            </div>
            <GlassButton variant="primary" icon={Rocket} onClick={runFullPipeline} disabled={running}>
              {running ? 'Đang chạy...' : 'Bắt đầu Pipeline'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Pipeline Progress */}
      {steps.length > 0 && (
        <GlassCard className="border-l-4 border-indigo-500 !rounded-l-none">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
            <Activity size={18} className="mr-2 text-indigo-500" /> Tiến trình
          </h2>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  s.status === 'done' ? 'bg-emerald-100/60 dark:bg-emerald-500/15' :
                  s.status === 'running' ? 'bg-blue-100/60 dark:bg-blue-500/15' :
                  s.status === 'failed' ? 'bg-rose-100/60 dark:bg-rose-500/15' :
                  'bg-slate-100/60 dark:bg-slate-500/15'
                }`}>
                  {s.status === 'done' ? <CheckCircle2 size={16} className="text-emerald-500" /> :
                   s.status === 'running' ? <RefreshCw size={16} className="text-blue-500 animate-spin" /> :
                   s.status === 'failed' ? <AlertCircle size={16} className="text-rose-500" /> :
                   <Clock size={16} className="text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{s.title}</p>
                  {s.detail && <p className="text-[11px] text-slate-500">{s.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

// --- STORES MANAGE VIEW ---
const StoresManageView = ({ niches, stores, addToast }) => {
  const nicheList = niches.data || [];
  const storeList = stores.data || [];
  const [showAddNiche, setShowAddNiche] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [nicheForm, setNicheForm] = useState({ name: '', description: '', keywords: '' });
  const [storeForm, setStoreForm] = useState({ name: '', domain: '', nicheName: '', envTokenKey: '' });

  const handleAddNiche = async () => {
    if (!nicheForm.name) return addToast('Tên niche không được trống', 'error');
    try {
      await api.createNiche(nicheForm);
      addToast('Thêm niche thành công!', 'success');
      setNicheForm({ name: '', description: '', keywords: '' });
      setShowAddNiche(false);
      niches.refetch();
    } catch (e) { addToast(`Lỗi: ${e.message}`, 'error'); }
  };

  const handleAddStore = async () => {
    if (!storeForm.name || !storeForm.domain || !storeForm.nicheName || !storeForm.envTokenKey) return addToast('Vui lòng điền đầy đủ thông tin', 'error');
    try {
      await api.createStore(storeForm);
      addToast('Thêm store thành công!', 'success');
      setStoreForm({ name: '', domain: '', nicheName: '', envTokenKey: '' });
      setShowAddStore(false);
      stores.refetch(); niches.refetch();
    } catch (e) { addToast(`Lỗi: ${e.message}`, 'error'); }
  };

  const handleDeleteNiche = async (id, name) => {
    if (!confirm(`Xóa niche "${name}"?`)) return;
    try {
      await api.deleteNiche(id);
      addToast('Đã xóa niche', 'success');
      niches.refetch();
    } catch (e) { addToast(`Lỗi: ${e.message}`, 'error'); }
  };

  const handleDeleteStore = async (id, name) => {
    if (!confirm(`Xóa store "${name}"? Tất cả sản phẩm liên quan sẽ bị xóa.`)) return;
    try {
      await api.deleteStore(id);
      addToast('Đã xóa store', 'success');
      stores.refetch();
    } catch (e) { addToast(`Lỗi: ${e.message}`, 'error'); }
  };

  const inputClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[14px] py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200 placeholder-slate-400";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Quản lý Niche & Store</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Thêm, sửa, xóa niche và cửa hàng Shopify</p>
        </div>
        <button onClick={() => { niches.refetch(); stores.refetch(); }} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/[0.15] transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${niches.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Niches Section */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Niches</h2>
          <GlassButton variant="primary" icon={Plus} size="sm" onClick={() => setShowAddNiche(!showAddNiche)}>Thêm Niche</GlassButton>
        </div>

        {showAddNiche && (
          <div className="mb-4 p-4 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.1] dark:border-white/[0.04] space-y-3">
            <input className={inputClass} placeholder="Tên niche (vd: Jewelry & Accessories)" value={nicheForm.name} onChange={e => setNicheForm({...nicheForm, name: e.target.value})} />
            <input className={inputClass} placeholder="Mô tả (tùy chọn)" value={nicheForm.description} onChange={e => setNicheForm({...nicheForm, description: e.target.value})} />
            <input className={inputClass} placeholder="Keywords (phân cách bằng dấu phẩy)" value={nicheForm.keywords} onChange={e => setNicheForm({...nicheForm, keywords: e.target.value})} />
            <div className="flex gap-2">
              <GlassButton variant="primary" size="sm" onClick={handleAddNiche}>Lưu</GlassButton>
              <GlassButton variant="glass" size="sm" onClick={() => setShowAddNiche(false)}>Hủy</GlassButton>
            </div>
          </div>
        )}

        {niches.loading ? <LoadingSkeleton count={2} /> : (
          <div className="space-y-2">
            {nicheList.map((niche) => (
              <div key={niche.id} className="flex items-center justify-between p-3.5 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{niche.name}</p>
                  <p className="text-[11px] text-slate-500">{niche.description || 'Không có mô tả'} &middot; {niche.stores?.length || 0} stores</p>
                </div>
                <button onClick={() => handleDeleteNiche(niche.id, niche.name)} className="p-2 rounded-[10px] hover:bg-rose-100/50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
            {nicheList.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Chưa có niche nào</p>}
          </div>
        )}
      </GlassCard>

      {/* Stores Section */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Stores</h2>
          <GlassButton variant="primary" icon={Plus} size="sm" onClick={() => setShowAddStore(!showAddStore)}>Thêm Store</GlassButton>
        </div>

        {showAddStore && (
          <div className="mb-4 p-4 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.1] dark:border-white/[0.04] space-y-3">
            <input className={inputClass} placeholder="Tên store (vd: Heart To Soul)" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
            <input className={inputClass} placeholder="Domain Shopify (vd: my-store.myshopify.com)" value={storeForm.domain} onChange={e => setStoreForm({...storeForm, domain: e.target.value})} />
            <input className={inputClass} placeholder="Tên Niche (vd: Jewelry & Accessories)" value={storeForm.nicheName} onChange={e => setStoreForm({...storeForm, nicheName: e.target.value})} />
            <input className={inputClass} placeholder="Env Token Key (vd: SHOPIFY_ACCESS_TOKEN_MYSTORE)" value={storeForm.envTokenKey} onChange={e => setStoreForm({...storeForm, envTokenKey: e.target.value})} />
            <div className="flex gap-2">
              <GlassButton variant="primary" size="sm" onClick={handleAddStore}>Lưu</GlassButton>
              <GlassButton variant="glass" size="sm" onClick={() => setShowAddStore(false)}>Hủy</GlassButton>
            </div>
          </div>
        )}

        {stores.loading ? <LoadingSkeleton count={2} /> : (
          <div className="space-y-2">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3.5 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
                    {store.icon || '\u{1F3EA}'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{store.name}</p>
                    <p className="text-[11px] text-slate-500">{store.domain}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? 'Hoạt động' : 'Đang setup'} />
                      <span className="text-[10px] text-slate-400">{store.niche?.name || ''}</span>
                      <span className="text-[10px] text-slate-400">&middot; {store.productCount || 0} SP</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDeleteStore(store.id, store.name)} className="p-2 rounded-[10px] hover:bg-rose-100/50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
            {storeList.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Chưa có store nào</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// --- SIDEBAR ITEM ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-2.5 mb-0.5 rounded-[16px] transition-all duration-300 ${active ? 'bg-white/80 dark:bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 font-medium'}`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} /><span className="text-sm">{label}</span>
  </button>
);

// --- RIGHT PANEL (Column 3) ---
const RightPanel = ({ activeTab, tasks, runs, stores, niches, handleQuickAction, addToast }) => {
  const storeList = stores.data || [];
  const runList = runs.data || [];
  const nicheList = niches?.data || [];
  const lastSync = storeList[0]?.lastSyncAt ? new Date(storeList[0].lastSyncAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Chưa có';
  const lastOptimize = storeList[0]?.lastOptimizedAt ? new Date(storeList[0].lastOptimizedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Chưa có';

  const inputClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[14px] py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200 placeholder-slate-400";

  // Shared: Task Monitor
  const TaskSection = () => tasks.length > 0 && (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Giám sát tác vụ</p>
      <div className="space-y-1.5">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-2.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${task.status === 'running' ? 'bg-blue-100 dark:bg-blue-500/20' : task.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/20'}`}>
                {task.status === 'running' ? <RefreshCw size={12} className="text-blue-500 animate-spin" /> : task.status === 'completed' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{task.label}</p>
                <p className="text-[9px] text-slate-500 truncate">{task.detail}</p>
              </div>
            </div>
            {task.result && <span className="text-[9px] font-semibold text-emerald-600 flex-shrink-0 ml-1">{task.result}</span>}
            {task.status === 'running' && <span className="text-[9px] text-blue-500 flex-shrink-0 ml-1 animate-pulse">...</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // Shared: Recent Activity
  const ActivitySection = () => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoạt động gần đây</p>
        <button onClick={runs.refetch} className="p-1 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-all">
          <RefreshCw size={12} className={`text-slate-400 ${runs.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="space-y-1.5">
        {runList.slice(0, 5).map((run) => {
          const isOk = run.status === 'COMPLETED' || run.status === 'success';
          const time = run.startedAt ? new Date(run.startedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
          return (
            <div key={run.id} className="flex items-center space-x-2 p-2 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[12px]">
              <div className={`p-1 rounded-lg flex-shrink-0 ${isOk ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                {isOk ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-amber-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">{run.runType?.replace(/_/g, ' ')}</p>
                <p className="text-[9px] text-slate-400">{time}</p>
              </div>
              {run.productsOptimized > 0 && <span className="text-[9px] font-semibold text-emerald-600">{run.productsOptimized}/{run.productsTotal}</span>}
            </div>
          );
        })}
        {runList.length === 0 && <p className="text-[11px] text-slate-400 text-center py-2">Chưa có hoạt động</p>}
      </div>
    </div>
  );

  // Shared: Action Button
  const ActionBtn = ({ icon: Ic, label, color, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center space-x-3 p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/[0.15] dark:hover:bg-slate-700/[0.2] transition-all active:scale-[0.98] cursor-pointer">
      <div className={`p-2 rounded-[10px] ${colorMap[color].bg} ${colorMap[color].text}`}><Ic size={16} /></div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </button>
  );

  // --- Context-specific panels ---

  if (activeTab === 'command-center') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Thao tác nhanh</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Package} label="Tối ưu sản phẩm" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
          <ActionBtn icon={RefreshCw} label="Đồng bộ cửa hàng" color="blue" onClick={() => handleQuickAction('sync', 'Đồng bộ cửa hàng')} />
          <ActionBtn icon={Megaphone} label="Tạo quảng cáo" color="rose" onClick={() => handleQuickAction('ads', 'Tạo quảng cáo')} />
          <ActionBtn icon={Share2} label="Nội dung MXH" color="emerald" onClick={() => handleQuickAction('social', 'Nội dung MXH')} />
          <ActionBtn icon={TrendingUp} label="Tìm SP tiềm năng" color="amber" onClick={() => handleQuickAction('winning', 'Tìm SP tiềm năng')} />
        </div>
      </div>
      <TaskSection />
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Trạng thái cửa hàng</p>
        <div className="space-y-2 p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Sản phẩm</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{storeList[0]?.productCount || 0}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Đồng bộ lần cuối</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{lastSync}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Tối ưu lần cuối</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{lastOptimize}</span></div>
        </div>
      </div>
      <ActivitySection />
    </div>
  );

  if (activeTab === 'products') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Công cụ sản phẩm</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Zap} label="Tối ưu hàng loạt" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
          <ActionBtn icon={RefreshCw} label="Đồng bộ từ Shopify" color="blue" onClick={() => handleQuickAction('sync', 'Đồng bộ cửa hàng')} />
          <ActionBtn icon={Filter} label="Lọc sản phẩm" color="purple" onClick={() => addToast('Tính năng lọc đang phát triển', 'info')} />
        </div>
      </div>
      <TaskSection />
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Thống kê</p>
        <div className="space-y-2 p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Tổng SP</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{storeList[0]?.productCount || 0}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Đồng bộ lần cuối</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{lastSync}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Tối ưu lần cuối</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{lastOptimize}</span></div>
        </div>
      </div>
      <ActivitySection />
    </div>
  );

  if (activeTab === 'ads') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tạo chiến dịch</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Eye} label="Meta Ads" color="blue" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
          <ActionBtn icon={Globe} label="Google Ads" color="emerald" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
          <ActionBtn icon={Video} label="TikTok Ads" color="rose" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
        </div>
      </div>
      <TaskSection />
    </div>
  );

  if (activeTab === 'social') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tạo nội dung</p>
        <div className="space-y-1.5">
          <ActionBtn icon={FileText} label="Bài đăng mới" color="indigo" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
          <ActionBtn icon={Image} label="Tạo prompt hình" color="purple" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
          <ActionBtn icon={Video} label="Ý tưởng video" color="rose" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
        </div>
      </div>
      <TaskSection />
    </div>
  );

  if (activeTab === 'winning-products') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Công cụ nghiên cứu</p>
        <div className="space-y-1.5">
          <ActionBtn icon={TrendingUp} label="Quét Trend" color="emerald" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
          <ActionBtn icon={Eye} label="Spy Ads đối thủ" color="blue" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
          <ActionBtn icon={ShoppingBag} label="Chấm điểm SP" color="amber" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
        </div>
      </div>
      <TaskSection />
    </div>
  );

  if (activeTab === 'pipeline') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pipeline</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Rocket} label="Chạy Full Pipeline" color="purple" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
          <ActionBtn icon={Eye} label="Crawl đối thủ" color="blue" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
          <ActionBtn icon={Palette} label="Convert Theme" color="rose" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
          <ActionBtn icon={RefreshCw} label="Đồng bộ store" color="emerald" onClick={() => handleQuickAction('sync', 'Đồng bộ cửa hàng')} />
        </div>
      </div>
      <TaskSection />
      <ActivitySection />
    </div>
  );

  if (activeTab === 'stores-manage') return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quản lý</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Plus} label="Thêm Niche mới" color="purple" onClick={() => addToast('Bấm "Thêm Niche" ở cột giữa', 'info')} />
          <ActionBtn icon={Plus} label="Thêm Store mới" color="indigo" onClick={() => addToast('Bấm "Thêm Store" ở cột giữa', 'info')} />
          <ActionBtn icon={RefreshCw} label="Đồng bộ tất cả" color="blue" onClick={() => handleQuickAction('sync', 'Đồng bộ cửa hàng')} />
        </div>
      </div>
      <TaskSection />
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tổng quan</p>
        <div className="space-y-2 p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Niches</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{nicheList.length}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Stores</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{storeList.length}</span></div>
          <div className="flex justify-between"><span className="text-[11px] text-slate-500">Tổng SP</span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{storeList.reduce((s,st) => s + (st.productCount||0), 0)}</span></div>
        </div>
      </div>
    </div>
  );

  // Default: themes or any other tab
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Thao tác nhanh</p>
        <div className="space-y-1.5">
          <ActionBtn icon={Package} label="Tối ưu sản phẩm" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
          <ActionBtn icon={RefreshCw} label="Đồng bộ cửa hàng" color="blue" onClick={() => handleQuickAction('sync', 'Đồng bộ cửa hàng')} />
        </div>
      </div>
      <TaskSection />
      <ActivitySection />
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const taskIdRef = React.useRef(0);

  // API hooks
  const dashboard = useApi(() => api.getDashboard(), []);
  const stores = useApi(() => api.getStores(), []);
  const products = useApi(() => api.getProducts(), []);
  const runs = useApi(() => api.getRuns(), []);
  const insights = useApi(() => api.getInsights(), []);
  const competitors = useApi(() => api.getCompetitors(), []);
  const themes = useApi(() => api.getThemes(), []);
  const adsOutputs = useApi(() => api.getSkillOutputs('ads-content-creator'), []);
  const socialOutputs = useApi(() => api.getSkillOutputs('social-content-creator'), []);
  const winningOutputs = useApi(() => api.getSkillOutputs('winning-product-hunter'), []);
  const niches = useApi(() => api.getNiches(), []);

  // Use fallback stores for sidebar
  const sidebarStores = stores.data || fallbackStores;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navItems = [
    { group: 'Tổng quan', items: [
      { id: 'command-center', icon: LayoutDashboard, label: 'Bảng điều khiển' },
      { id: 'products', icon: Package, label: 'Sản phẩm' },
    ]},
    { group: 'AI Skills', items: [
      { id: 'products', icon: Sparkles, label: 'Tối ưu SP' },
      { id: 'ads', icon: Megaphone, label: 'Quảng cáo' },
      { id: 'social', icon: Share2, label: 'Mạng xã hội' },
      { id: 'winning-products', icon: TrendingUp, label: 'Nghiên cứu SP' },
    ]},
    { group: 'Quản lý', items: [
      { id: 'pipeline', icon: Rocket, label: 'Setup Store mới' },
      { id: 'stores-manage', icon: Settings, label: 'Niche & Store' },
    ]},
  ];

  const bottomNav = [
    { id: 'command-center', icon: LayoutDashboard, label: 'Trang chủ' },
    { id: 'products', icon: Package, label: 'SP' },
    { id: 'ads', icon: Megaphone, label: 'Ads' },
    { id: 'social', icon: Share2, label: 'Mạng xã hội' },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const addTask = (label) => {
    const id = ++taskIdRef.current;
    const task = { id, label, status: 'running', detail: 'Đang bắt đầu...', result: null, startedAt: new Date() };
    setTasks(prev => [task, ...prev.slice(0, 9)]);
    return id;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleQuickAction = async (action, label) => {
    const taskId = addTask(label);
    addToast(`Đang chạy ${label}...`, 'info');
    try {
      const storeId = (stores.data || [])[0]?.id;
      let result;
      if (action === 'optimize') {
        updateTask(taskId, { detail: 'Đang tối ưu sản phẩm qua Shopify API...' });
        result = await api.optimizeStore(storeId);
        updateTask(taskId, { status: 'completed', detail: 'Hoàn tất', result: `${result.optimized || 0}/${result.total || 0} đã tối ưu` });
      } else if (action === 'sync') {
        updateTask(taskId, { detail: 'Đang đồng bộ sản phẩm từ Shopify...' });
        result = await api.syncStore(storeId);
        updateTask(taskId, { status: 'completed', detail: 'Hoàn tất', result: `${result.synced || 0} đã đồng bộ` });
      } else {
        updateTask(taskId, { status: 'completed', detail: 'Đã kích hoạt', result: 'OK' });
      }
      addToast(`${label} hoàn tất!`, 'success');
      runs.refetch(); dashboard.refetch(); stores.refetch();
    } catch (e) {
      updateTask(taskId, { status: 'failed', detail: e.message });
      addToast(`Lỗi: ${e.message}`, 'error');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0B1120] text-slate-200' : 'bg-[#F3F4F6] text-slate-800'} relative overflow-hidden font-sans`}>
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob ${isDark ? 'bg-indigo-900/40' : 'bg-purple-200/80'}`}></div>
        <div className={`absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-2000 ${isDark ? 'bg-teal-900/30' : 'bg-cyan-200/80'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000 ${isDark ? 'bg-purple-900/30' : 'bg-pink-200/80'}`}></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.15] dark:bg-slate-900/[0.2] backdrop-blur-[12px] backdrop-saturate-[180%] border-b border-white/40 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <Zap size={16} />
            </div>
            <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-[12px] bg-white/[0.1] dark:bg-slate-800/[0.12] border border-white/40 dark:border-white/10">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-[12px] bg-white/[0.1] dark:bg-slate-800/[0.12] border border-white/40 dark:border-white/10">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative mx-4 mt-2 bg-white/[0.2] dark:bg-slate-900/[0.25] backdrop-blur-[12px] backdrop-saturate-[180%] rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl p-5 max-h-[70vh] overflow-y-auto">
            {navItems.map((group) => (
              <div key={group.group} className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">{group.group}</p>
                {group.items.map((item) => (
                  <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => handleNav(item.id)} />
                ))}
              </div>
            ))}
            <div className="pt-3 border-t border-white/30 dark:border-white/10 mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Stores</p>
              {sidebarStores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-2.5 rounded-[12px]">
                  <span className="text-lg">{store.icon || '\u{1F3EA}'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{store.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{store.domain}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${store.isActive || store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex my-6 ml-6 flex-col w-64 lg:w-72">
          <GlassCard className="h-full flex flex-col !p-5 shadow-2xl overflow-y-auto hide-scrollbar">
            <div className="flex items-center space-x-3 mb-6 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"><Zap size={22} /></div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
            </div>

            <div className="flex-1 space-y-5">
              {navItems.map((group) => (
                <div key={group.group}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">{group.group}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/30 dark:border-white/10 px-2 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stores</p>
              {sidebarStores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-2 rounded-[12px] hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-lg">{store.icon || '\u{1F3EA}'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{store.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{store.domain}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${store.isActive || store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/40 dark:border-white/10 px-2">
              <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center p-2.5 rounded-[16px] bg-white/[0.1] dark:bg-slate-800/[0.12] hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all border border-white/40 dark:border-white/10">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span className="ml-2 text-sm font-medium">{isDark ? 'Sáng' : 'Tối'}</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Col 2: Main Content - SCROLLABLE */}
        <div className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0 p-4 md:p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'command-center' && <CommandCenter stores={stores} dashboard={dashboard} runs={runs} insights={insights} addToast={addToast} tasks={tasks} handleQuickAction={handleQuickAction} />}
            {activeTab === 'products' && <ProductsView products={products} addToast={addToast} />}
            {activeTab === 'ads' && <AdsView skillOutputs={adsOutputs} addToast={addToast} />}
            {activeTab === 'social' && <SocialView stores={stores} skillOutputs={socialOutputs} />}
            {activeTab === 'winning-products' && <WinningProductsView competitors={competitors} skillOutputs={winningOutputs} insights={insights} addToast={addToast} />}
            {activeTab === 'pipeline' && <PipelineView stores={stores} runs={runs} addToast={addToast} handleQuickAction={handleQuickAction} />}
            {activeTab === 'stores-manage' && <StoresManageView niches={niches} stores={stores} addToast={addToast} />}
          </div>
        </div>

        {/* Col 3: Right Panel - STICKY (lg+ only) */}
        <div className="hidden lg:flex my-6 mr-6 flex-col w-72 xl:w-80">
          <GlassCard className="h-full flex flex-col !p-5 shadow-2xl overflow-y-auto hide-scrollbar">
            <RightPanel activeTab={activeTab} tasks={tasks} runs={runs} stores={stores} niches={niches} handleQuickAction={handleQuickAction} addToast={addToast} />
          </GlassCard>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3 flex items-center justify-around py-2 bg-white/[0.15] dark:bg-slate-900/[0.2] backdrop-blur-[12px] backdrop-saturate-[180%] rounded-[16px] border border-white/50 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          {bottomNav.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`flex flex-col items-center py-1.5 px-3 rounded-[12px] transition-all ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center py-1.5 px-3 rounded-[12px] text-slate-400">
            <Menu size={20} />
            <span className="text-[10px] font-semibold mt-0.5">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
