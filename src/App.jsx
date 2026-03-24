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
  Store, Gem, Menu, X, ChevronRight,
  ChevronDown, Timer, CircleDot, Layers, History,
  Upload, FileUp, Database
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
        className={`flex items-center space-x-2 px-4 py-3 rounded-[18px] backdrop-blur-[10px] backdrop-saturate-[170%] border shadow-lg animate-fade-in cursor-pointer ${
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
      <button onClick={onRefresh} className="p-2 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={loading}>
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
          <div key={task.id} className="flex items-center justify-between p-2.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <div className={`p-1.5 rounded-[14px] flex-shrink-0 ${
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
        <button onClick={() => { dashboard.refetch(); stores.refetch(); runs.refetch(); insights.refetch(); }} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
              <div className={`p-2.5 md:p-4 rounded-[18px] ${colorMap[stat.color].bg} ${colorMap[stat.color].text}`}>
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
            <div key={i} onClick={action.action} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 md:p-4 bg-white/[0.08] dark:bg-slate-800/[0.1] backdrop-blur-[10px] backdrop-saturate-[170%] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04] min-w-[80px] md:min-w-[100px] cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
              <div className={`p-2.5 rounded-[14px] ${colorMap[action.color].bg} ${colorMap[action.color].text}`}>
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
              <div key={store.id} className="flex items-center justify-between p-3.5 md:p-5 bg-white/[0.1] dark:bg-slate-800/[0.12] backdrop-blur-[10px] backdrop-saturate-[170%] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
                <div className="flex items-center space-x-3 md:space-x-5 min-w-0">
                  <div className={`w-11 h-11 md:w-14 md:h-14 rounded-[18px] md:rounded-[18px] bg-gradient-to-br ${store.gradient || 'from-rose-400 to-pink-600'} flex items-center justify-center text-xl md:text-2xl shadow-inner flex-shrink-0`}>
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
              <div key={skill.id} className="flex items-center space-x-3 p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[18px] border border-white/[0.1] dark:border-white/[0.04]">
                <div className={`p-2.5 rounded-[14px] ${colorMap[skill.color].pill} flex-shrink-0`}>
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
                    <div key={run.id} className="flex items-center space-x-3 p-3 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
                      <div className={`p-2 rounded-[14px] flex-shrink-0 ${isSuccess ? 'bg-emerald-100 dark:bg-emerald-500/20' : isFailed ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
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
          <button onClick={insights.refetch} className="p-2 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={insights.loading}>
            <RefreshCw size={16} className={`text-slate-500 dark:text-slate-400 ${insights.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {insights.loading ? <LoadingSkeleton count={4} /> : (
          <div className="space-y-2.5">
            {insightList.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 md:p-4 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
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
        <button onClick={products.refetch} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
                <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
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
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
              <div className={`p-3 md:p-4 rounded-[18px] w-fit md:mb-4 ${colorMap[p.color].bg} ${colorMap[p.color].text}`}>
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
                {content.script && <pre className="text-[11px] text-slate-500 bg-white/[0.06] dark:bg-slate-800/[0.08] p-2 rounded-[14px] mb-2 whitespace-pre-wrap">{content.script}</pre>}
                {content.keywords && <div className="flex flex-wrap gap-1 mb-2">{content.keywords.map((k, i) => <span key={i} className="px-2 py-0.5 bg-indigo-100/80 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] rounded-full">{k}</span>)}</div>}
                {content.hashtags && <div className="flex flex-wrap gap-1 mb-2">{content.hashtags.map((h, i) => <span key={i} className="px-2 py-0.5 bg-purple-100/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] rounded-full">{h}</span>)}</div>}
                {content.targeting && <div className="mt-2 p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-[14px]"><p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Targeting: {content.targeting.age} | {content.targeting.interests?.join(', ')}</p></div>}
                {(content.imagePrompt || content.videoPrompt) && <div className="mt-2 p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[14px]"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Prompt:</span> {content.imagePrompt || content.videoPrompt}</p></div>}
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
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
            <div className={`p-2.5 rounded-[14px] w-fit mb-2 ${colorMap[s.color].pill}`}>
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
                {content.caption && <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/[0.06] dark:bg-slate-800/[0.08] p-3 rounded-[14px] mb-2 leading-relaxed">{content.caption}</pre>}
                {content.imagePrompt && <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[14px]"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Image Prompt:</span> {content.imagePrompt}</p></div>}
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
              <div key={i} className="flex items-center space-x-3 p-2.5 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[14px] border border-white/[0.1] dark:border-white/[0.04]">
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
              <div key={store.id} className="flex items-center justify-between p-3 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
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

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Nghiên cứu sản phẩm</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Chạy /winning-product-hunter trong Claude Code để tìm SP tiềm năng</p>
        </div>
        <button onClick={() => { competitors.refetch(); skillOutputs?.refetch?.(); insights?.refetch?.(); }} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${competitors.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          { icon: TrendingUp, title: 'Quét Trend', desc: 'Chạy /winning-product-hunter trong Claude Code', color: 'emerald', skill: '/winning-product-hunter' },
          { icon: Eye, title: 'Spy Ads', desc: 'Chạy /winning-product-hunter trong Claude Code', color: 'blue', skill: '/winning-product-hunter' },
          { icon: ShoppingBag, title: 'Chấm điểm SP', desc: 'Chạy /winning-product-hunter trong Claude Code', color: 'amber', skill: '/winning-product-hunter' },
        ].map((f, i) => (
          <GlassCard key={i} hoverEffect className="cursor-pointer !p-5" onClick={() => addToast(`Mở Claude Code và chạy ${f.skill}`, 'info')}>
            <div className="flex items-center space-x-3 md:block">
              <div className={`p-3 md:p-4 rounded-[18px] w-fit md:mb-4 ${colorMap[f.color].bg} ${colorMap[f.color].text}`}>
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
                    <div className="p-2 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-[14px] text-center"><p className="text-lg font-bold text-emerald-600">{content.score}</p><p className="text-[10px] text-slate-500">Score</p></div>
                    <div className="p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-[14px] text-center"><p className="text-xs font-bold text-blue-600">{content.trend}</p><p className="text-[10px] text-slate-500">Trend</p></div>
                    <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-[14px] text-center"><p className="text-xs font-bold text-amber-600">{content.marginPotential}</p><p className="text-[10px] text-slate-500">Margin</p></div>
                    <div className="p-2 bg-purple-50/50 dark:bg-purple-500/10 rounded-[14px] text-center"><p className="text-xs font-bold text-purple-600">{content.sellingPrice}</p><p className="text-[10px] text-slate-500">Giá bán</p></div>
                  </div>
                )}
                {content.whyWinning && <p className="text-xs text-slate-600 dark:text-slate-300 mb-2"><span className="font-semibold">Tại sao win:</span> {content.whyWinning}</p>}
                {content.competitors && (
                  <div className="space-y-2 mb-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Đối thủ phân tích:</p>
                    {content.competitors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[14px]">
                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.name}</p><p className="text-[10px] text-slate-500">{c.platform} | {c.adSpend}</p></div>
                        <Badge type="neutral" text={`CTR ${c.ctr}`} />
                      </div>
                    ))}
                  </div>
                )}
                {content.insights && <div className="space-y-1 mb-2">{content.insights.map((ins, i) => <p key={i} className="text-[11px] text-slate-500">• {ins}</p>)}</div>}
                {content.recommendation && <div className="p-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-[14px]"><p className="text-[11px] text-indigo-600 dark:text-indigo-300"><span className="font-semibold">Khuyến nghị:</span> {content.recommendation}</p></div>}
                {content.sources && <div className="mt-2 flex flex-wrap gap-1">{content.sources.map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-100/80 dark:bg-slate-700/50 text-[9px] text-slate-500 rounded-full">{s}</span>)}</div>}
              </GlassCard>
            );
          })}
        </div>
      )}

      {outputs.length === 0 && (
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Báo cáo</h2>
          <p className="text-xs text-slate-500">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-[14px] text-[11px] font-mono">/winning-product-hunter</code> trong Claude Code để tạo reports.</p>
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
              <div key={insight.id} className="p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04]">
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
              <div key={comp.id || idx} className="flex items-center justify-between p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04]">
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
        <button onClick={() => { insights.refetch(); competitors.refetch(); }} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
                <div key={insight.id} className="p-3.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
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
                <div key={comp.id || idx} className="flex items-center justify-between p-3.5 bg-white/[0.1] dark:bg-slate-800/[0.12] rounded-[18px] border border-white/[0.12] dark:border-white/[0.04]">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{comp.domain}</h3>
                    <p className="text-xs text-slate-500">Cho: {comp.name}</p>
                  </div>
                  <Badge type={comp.lastCrawledAt || comp.status === 'Đang theo' ? 'success' : 'pending'} text={comp.lastCrawledAt ? 'Đang theo' : (comp.status || 'Dự kiến')} />
                </div>
              ))}
            </div>
          )}
          <div className="p-3 bg-white/[0.08] dark:bg-slate-800/[0.1] rounded-[18px] border border-white/[0.1] dark:border-white/[0.04]">
            <p className="text-xs text-slate-500">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-[14px] text-[11px] font-mono">/shopify-pipeline</code> để crawl & phân tích.</p>
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
        <button onClick={themes.refetch} className="p-2.5 rounded-[14px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${themes.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {themes.loading ? <LoadingSkeleton count={2} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {themeList.map((theme, i) => (
            <GlassCard key={theme.id || i} hoverEffect className="cursor-pointer !p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-[14px]">
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
const PipelineView = ({ mode = 'auto', stores, runs, addToast, handleQuickAction, addTask, updateTask }) => {
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [fullForm, setFullForm] = useState({ url: '', repo: '', storeName: '', domain: '', niche: '' });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillFormData, setSkillFormData] = useState({});
  const [skillResult, setSkillResult] = useState(null);
  const [resultHistory, setResultHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopifyos-result-history') || '[]'); } catch { return []; }
  });
  const [expandedResults, setExpandedResults] = useState({});

  useEffect(() => {
    try { localStorage.setItem('shopifyos-result-history', JSON.stringify(resultHistory)); } catch {}
  }, [resultHistory]);

  const inputClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[16px] py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200 placeholder-slate-400";
  const selectClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[16px] py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200";

  const pipelineSkills = [
    // === THU THẬP DỮ LIỆU ===
    {
      id: 'crawl', icon: Eye, label: 'Crawl đối thủ',
      desc: 'Thu thập SP, bộ sưu tập, giá từ store đối thủ',
      color: 'blue', group: 'data',
      inputs: [{ key: 'url', label: 'URL đối thủ', placeholder: 'competitor.myshopify.com', type: 'text', required: true }],
      run: async (data) => {
        if (!data.url) throw new Error('Nhập URL đối thủ');
        return await api.crawlCompetitor(data.url);
      },
      formatResult: (r) => {
        const cols = r.collections?.length || 0;
        const prods = r.productsCrawled || 0;
        const dataType = prods > 0 && cols > 0 ? '🟢 SP + Bộ sưu tập' : prods > 0 ? '🔵 Sản phẩm' : cols > 0 ? '🟡 Bộ sưu tập' : '⚪ Không có';
        return { 'Loại dữ liệu': dataType, 'Sản phẩm': prods, 'Bộ sưu tập': cols, 'Session': r.sessionId || '' };
      }
    },
    // Đồng bộ SP tạm gỡ - cần token Shopify Admin API
    // === TỐI ƯU ===
    {
      id: 'optimize', icon: Sparkles, label: 'Tối ưu SEO',
      desc: 'Tối ưu hoặc tái tối ưu title, description, tags',
      color: 'indigo', group: 'optimize',
      inputs: [{ key: 'storeId', label: 'Chọn store', type: 'store-select', required: true }],
      storeInfo: true,
      run: async (data, { updateProgress }) => {
        if (!data.storeId) throw new Error('Chọn store trước');
        const store = (stores.data || []).find(s => s.id === data.storeId);
        const productCount = store?.productCount || 500;
        const maxBatches = Math.ceil(productCount / 50) + 2; // safety limit
        let total = 0, batch = 0, more = true;
        while (more && batch < maxBatches) {
          try {
            batch++;
            const r = await api.optimizeStore(data.storeId, true);
            total += r.optimized || 0;
            if (updateProgress) updateProgress(`Batch ${batch}/${maxBatches - 2}: ${total}/${productCount} SP đã tối ưu...`);
            // Stop: no products optimized, all done, or processed >= total products
            if (!r.optimized || r.total === 0 || r.allOptimized || total >= productCount) more = false;
          } catch { more = false; }
        }
        return { optimized: total, storeName: store?.name, batches: batch };
      },
      formatResult: (r) => ({ 'Sản phẩm đã tối ưu': r.optimized, 'Số batch': r.batches, ...(r.storeName ? { 'Store': r.storeName } : {}) })
    },
    {
      id: 'import-crawled', icon: Package, label: 'Import SP',
      desc: 'Import SP từ file CSV/JSON hoặc từ crawl session',
      color: 'amber', group: 'optimize',
      inputs: [
        { key: 'storeId', label: 'Chọn store', type: 'store-select', required: true },
        { key: 'importSource', label: 'Nguồn dữ liệu', type: 'import-source' },
        { key: 'file', label: 'File sản phẩm (CSV/JSON)', type: 'file-upload', accept: '.csv,.json', showWhen: 'upload' },
        { key: 'sessionId', label: 'Chọn crawl session', type: 'crawl-session-select', showWhen: 'crawl' },
      ],
      run: async (data, { updateProgress }) => {
        if (!data.storeId) throw new Error('Chọn store trước');
        const source = data.importSource || 'upload';
        if (source === 'upload') {
          if (!data._parsedProducts || data._parsedProducts.length === 0) throw new Error('Chọn file CSV/JSON chứa sản phẩm');
          updateProgress?.(`Đang import ${data._parsedProducts.length} SP từ file...`);
          const r = await api.importFromFile(data.storeId, data._parsedProducts);
          return { imported: r.imported || data._parsedProducts.length, source: 'file', fileName: data._fileName || 'file' };
        } else {
          if (!data.sessionId) throw new Error('Chọn crawl session');
          updateProgress?.('Đang import SP từ crawl session...');
          let total = 0, hasMore = true;
          while (hasMore) {
            const r = await api.importCrawled(data.storeId, data.sessionId);
            total += r.imported || 0;
            if (!r.imported) hasMore = false;
          }
          return { imported: total, source: 'crawl', sessionId: data.sessionId };
        }
      },
      formatResult: (r) => ({ 'Sản phẩm đã import': r.imported, 'Nguồn': r.source === 'file' ? `File: ${r.fileName}` : `Crawl session` })
    },
    // === THIẾT LẬP ===
    {
      id: 'create-store', icon: Store, label: 'Tạo Store',
      desc: 'Tạo store mới trong hệ thống',
      color: 'purple', group: 'setup',
      inputs: [
        { key: 'storeName', label: 'Tên store', placeholder: 'My New Store', type: 'text', required: true },
        { key: 'domain', label: 'Domain Shopify', placeholder: 'my-store.myshopify.com', type: 'text', required: true },
        { key: 'niche', label: 'Niche', placeholder: 'vd: Jewelry', type: 'text', required: true },
      ],
      run: async (data) => {
        if (!data.storeName || !data.domain || !data.niche) throw new Error('Điền đầy đủ tên store, domain, niche');
        return await api.createStore({ name: data.storeName, domain: data.domain, nicheName: data.niche, envTokenKey: 'SHOPIFY_ACCESS_TOKEN_HEARTTOSOUL' });
      },
      formatResult: (r) => ({ 'Store': r.name, 'Domain': r.domain, 'ID': r.id })
    },
    {
      id: 'convert-theme', icon: Palette, label: 'Convert Theme',
      desc: 'React/HTML → Shopify Liquid',
      color: 'rose', group: 'setup',
      inputs: [{ key: 'repo', label: 'GitHub repo URL', placeholder: 'https://github.com/user/theme', type: 'text', required: true }],
      run: async () => {
        return { claudeCode: true, message: 'Mở Claude Code và chạy /shopify-pipeline mode convert-theme.' };
      },
      formatResult: (r) => ({ 'Hướng dẫn': r.message })
    },
    {
      id: 'setup-store', icon: Settings, label: 'Setup Store',
      desc: 'Menus, collections, settings, pages',
      color: 'emerald', group: 'setup',
      inputs: [{ key: 'storeId', label: 'Chọn store', type: 'store-select', required: true }],
      run: async () => {
        return { claudeCode: true, message: 'Mở Claude Code và chạy /shopify-pipeline mode setup-store.' };
      },
      formatResult: (r) => ({ 'Hướng dẫn': r.message })
    },
  ];

  const runSkill = async () => {
    if (!selectedSkill) return;
    setRunning(true);
    setSkillResult(null);
    const taskId = addTask(selectedSkill.label);
    updateTask(taskId, { detail: 'Đang xử lý...' });
    const updateProgress = (msg) => updateTask(taskId, { detail: msg });
    try {
      const result = await selectedSkill.run(skillFormData, { updateProgress });
      updateTask(taskId, { status: 'completed', detail: 'Hoàn tất', result: 'OK' });
      setSkillResult(result);
      const formatted = selectedSkill.formatResult ? selectedSkill.formatResult(result) : {};
      setResultHistory(prev => [{ id: Date.now(), skill: selectedSkill.label, skillId: selectedSkill.id, color: selectedSkill.color, data: formatted, raw: result, time: new Date().toLocaleString('vi-VN') }, ...prev.slice(0, 19)]);
      addToast(`${selectedSkill.label} hoàn tất!`, 'success');
      stores.refetch(); runs.refetch();
    } catch (e) {
      updateTask(taskId, { status: 'failed', detail: e.message });
      addToast(`Lỗi: ${e.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const updateStep = (idx, status, detail) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status, detail: detail || s.detail } : s));
  };


  const runFullPipeline = async () => {
    if (!fullForm.storeName || !fullForm.domain || !fullForm.niche) return addToast('Vui lòng điền đầy đủ thông tin (tên store, domain, niche)', 'error');
    const autoTokenKey = 'SHOPIFY_ACCESS_TOKEN_HEARTTOSOUL';

    setRunning(true);
    const hasCrawl = !!fullForm.url;
    const stepList = [];
    if (hasCrawl) stepList.push({ title: 'Crawl store đối thủ', status: 'pending', detail: '' });
    stepList.push({ title: 'Tạo store', status: 'pending', detail: '' });
    stepList.push({ title: 'Đồng bộ sản phẩm', status: 'pending', detail: '' });
    stepList.push({ title: 'Tối ưu SEO', status: 'pending', detail: '' });
    setSteps(stepList);
    let stepIdx = 0;

    // Add task to col 3 monitor
    const taskId = addTask('Full Pipeline');
    updateTask(taskId, { detail: 'Đang khởi chạy pipeline...' });

    try {
      if (hasCrawl) {
        updateStep(stepIdx, 'running', 'Đang phân tích trang web đối thủ...');
        updateTask(taskId, { detail: 'Crawl store đối thủ...' });
        const crawlResult = await api.crawlCompetitor(fullForm.url);
        updateStep(stepIdx, 'done', `${crawlResult.productsCrawled} SP, ${crawlResult.collections?.length || 0} bộ sưu tập`);
        stepIdx++;
      }

      updateStep(stepIdx, 'running', 'Đang tạo store trong hệ thống...');
      updateTask(taskId, { detail: 'Tạo store...' });
      const store = await api.createStore({ name: fullForm.storeName, domain: fullForm.domain, nicheName: fullForm.niche, envTokenKey: autoTokenKey });
      updateStep(stepIdx, 'done', store.name);
      stepIdx++;

      updateStep(stepIdx, 'running', 'Đang đồng bộ sản phẩm từ Shopify API...');
      updateTask(taskId, { detail: 'Đồng bộ sản phẩm...' });
      const syncResult = await api.syncStore(store.id);
      updateStep(stepIdx, 'done', `${syncResult.synced} SP đã đồng bộ`);
      stepIdx++;

      updateStep(stepIdx, 'running', 'Đang tối ưu SEO...');
      updateTask(taskId, { detail: 'Tối ưu SEO...' });
      let totalOpt = 0;
      let more = true;
      while (more) {
        try {
          const r = await api.optimizeStore(store.id);
          totalOpt += r.optimized || 0;
          if (!r.optimized || r.total === 0) more = false;
          updateTask(taskId, { detail: `Đã tối ưu ${totalOpt} SP...` });
          updateStep(stepIdx, 'running', `Đã tối ưu ${totalOpt} SP...`);
        } catch { more = false; }
      }
      updateStep(stepIdx, 'done', `${totalOpt} SP đã tối ưu`);

      updateTask(taskId, { status: 'completed', detail: 'Hoàn tất', result: `${totalOpt} SP tối ưu` });
      const pipelineResult = { store: store.name, synced: syncResult.synced, optimized: totalOpt };
      setResultHistory(prev => [{ id: Date.now(), skill: 'Full Pipeline', skillId: 'full-pipeline', color: 'purple', data: { 'Store': store.name, 'Đồng bộ': `${syncResult.synced} SP`, 'Tối ưu': `${totalOpt} SP` }, raw: pipelineResult, time: new Date().toLocaleString('vi-VN') }, ...prev.slice(0, 19)]);
      addToast('Pipeline hoàn tất!', 'success');
      stores.refetch(); runs.refetch();
    } catch (e) {
      const failIdx = steps.findIndex(s => s.status === 'running');
      if (failIdx >= 0) updateStep(failIdx, 'failed', e.message);
      updateTask(taskId, { status: 'failed', detail: e.message });
      addToast(`Lỗi: ${e.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">{mode === 'auto' ? 'Setup tự động' : 'Công cụ'}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">{mode === 'auto' ? 'Xây dựng store Shopify hoàn chỉnh từ A-Z, sẵn sàng bán hàng' : 'Chạy từng bước riêng lẻ theo nhu cầu'}</p>
      </div>

      {/* Auto Mode */}
      {mode === 'auto' && (
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Xây dựng Store Shopify hoàn chỉnh</h2>
          <p className="text-xs text-slate-500 mb-4">Tự động xây dựng store Shopify hoàn chỉnh từ A-Z: phân tích đối thủ, đồng bộ sản phẩm, tối ưu SEO toàn bộ, sẵn sàng xuất bản và bán hàng ngay.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">URL đối thủ (tùy chọn - để phân tích đối thủ)</label>
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
            <GlassButton variant="primary" icon={Rocket} onClick={runFullPipeline} disabled={running}>
              {running ? 'Đang chạy...' : 'Chạy Full Pipeline'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Custom Mode */}
      {mode === 'custom' && (<>
        {/* Skill Selector - premium 3-column grouped cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Thu thập', group: 'data' },
            { label: 'Tối ưu', group: 'optimize' },
            { label: 'Thiết lập', group: 'setup' },
          ].map(({ label, group }) => (
            <div key={group} className="relative overflow-hidden rounded-[22px] bg-white/[0.12] dark:bg-white/[0.04] border border-white/[0.18] dark:border-white/[0.06] backdrop-blur-[16px] backdrop-saturate-[180%] shadow-[0_2px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300">
              {/* Specular highlight top edge */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent" />
              {/* Group label */}
              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-slate-500/80 dark:text-slate-400/60 uppercase tracking-[0.08em]">{label}</p>
              </div>
              {/* Skill items */}
              <div className="px-2 pb-2 space-y-px">
                {pipelineSkills.filter(s => s.group === group).map(skill => {
                  const Icon = skill.icon;
                  const isActive = selectedSkill?.id === skill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => { setSelectedSkill(skill); setSkillFormData({}); setSkillResult(null); setSteps([]); }}
                      disabled={running}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-[16px] transition-all duration-200 cursor-pointer text-left group ${
                        isActive
                          ? `bg-white/[0.2] dark:bg-white/[0.1] ${colorMap[skill.color].text} shadow-[0_1px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.3)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]`
                          : 'hover:bg-white/[0.1] dark:hover:bg-white/[0.05] text-slate-600 dark:text-slate-400'
                      } ${running ? 'opacity-30 pointer-events-none' : 'active:scale-[0.97]'}`}
                    >
                      <div className={`p-1.5 rounded-[10px] flex-shrink-0 transition-all duration-200 backdrop-blur-[4px] ${
                        isActive
                          ? `${colorMap[skill.color].bg} shadow-[0_0_10px_rgba(99,102,241,0.12)]`
                          : `${colorMap[skill.color].bg} group-hover:scale-105`
                      }`}>
                        <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12px] font-semibold leading-tight ${isActive ? '' : 'text-slate-700 dark:text-slate-300'}`}>{skill.label}</p>
                        <p className="text-[10px] text-slate-400/70 dark:text-slate-500/70 leading-tight mt-0.5 truncate">{skill.desc}</p>
                      </div>
                      {isActive && <div className="w-1 h-4 rounded-full bg-current/40 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No skill selected */}
        {!selectedSkill && !skillResult && (
          <div className="text-center py-5">
            <p className="text-xs text-slate-400/60">Chọn một công cụ phía trên để bắt đầu</p>
          </div>
        )}

        {/* Skill Form + Running state */}
        {selectedSkill && !skillResult && (
          <GlassCard>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2.5 rounded-[14px] ${colorMap[selectedSkill.color].bg} ${colorMap[selectedSkill.color].text}`}>
                {running ? <RefreshCw size={18} className="animate-spin" /> : <selectedSkill.icon size={18} />}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-800 dark:text-white">{running ? `Đang chạy: ${selectedSkill.label}` : selectedSkill.label}</h2>
                <p className="text-[11px] text-slate-500">{running ? 'Theo dõi tiến trình ở cột phải →' : selectedSkill.desc}</p>
              </div>
            </div>
            {running && (
              <div className="w-full h-1 bg-white/10 dark:bg-slate-800/20 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            )}
            <div className={`space-y-2.5 ${running ? 'opacity-40 pointer-events-none' : ''}`}>
              {selectedSkill.inputs.map(inp => {
                // Hide conditional inputs based on showWhen
                if (inp.showWhen && skillFormData.importSource !== inp.showWhen) {
                  // Default to 'upload' if not set
                  if (!(inp.showWhen === 'upload' && !skillFormData.importSource)) return null;
                }
                return (
                <div key={inp.key}>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">{inp.label} {inp.required && '*'}</label>
                  {inp.type === 'store-select' ? (
                    <>
                      <select className={selectClass} value={skillFormData[inp.key] || ''} onChange={e => setSkillFormData({ ...skillFormData, [inp.key]: e.target.value })} disabled={running}>
                        <option value="">-- Chọn store --</option>
                        {(stores.data || []).map(s => (<option key={s.id} value={s.id}>{s.name} ({s.domain})</option>))}
                      </select>
                      {selectedSkill.storeInfo && skillFormData[inp.key] && (() => {
                        const st = (stores.data || []).find(s => s.id === skillFormData[inp.key]);
                        if (!st) return null;
                        return (
                          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                            <span>SP: <b className="text-slate-600 dark:text-slate-300">{st.productCount || 0}</b></span>
                            <span>Tối ưu lần cuối: <b className="text-slate-600 dark:text-slate-300">{st.lastOptimizedAt ? new Date(st.lastOptimizedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Chưa có'}</b></span>
                          </div>
                        );
                      })()}
                    </>
                  ) : inp.type === 'import-source' ? (
                    <div className="flex gap-1.5">
                      {[{ value: 'upload', label: 'Upload file', icon: FileUp }, { value: 'crawl', label: 'Từ crawl', icon: Database }].map(opt => (
                        <button key={opt.value} onClick={() => setSkillFormData({ ...skillFormData, [inp.key]: opt.value, file: undefined, sessionId: '', _parsedProducts: undefined, _fileName: undefined })}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] text-xs font-semibold border transition-all ${
                            (skillFormData[inp.key] || 'upload') === opt.value
                              ? 'bg-amber-100/80 dark:bg-amber-500/15 border-amber-300/50 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                              : 'bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                          }`}>
                          <opt.icon size={13} /> {opt.label}
                        </button>
                      ))}
                    </div>
                  ) : inp.type === 'file-upload' ? (
                    <div>
                      <label className={`flex flex-col items-center justify-center w-full py-4 px-3 rounded-[14px] border-2 border-dashed cursor-pointer transition-all ${
                        skillFormData._parsedProducts?.length
                          ? 'border-emerald-300/50 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-500/5'
                          : 'border-white/[0.12] dark:border-white/[0.06] bg-white/[0.04] hover:border-amber-300/40 dark:hover:border-amber-500/20 hover:bg-amber-50/20 dark:hover:bg-amber-500/5'
                      }`}>
                        <input type="file" accept={inp.accept || '.csv,.json'} className="hidden" onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            try {
                              const text = ev.target.result;
                              let products = [];
                              if (file.name.endsWith('.json')) {
                                const parsed = JSON.parse(text);
                                products = Array.isArray(parsed) ? parsed : parsed.products || parsed.data || [];
                              } else {
                                // CSV parse
                                const lines = text.split('\n').filter(l => l.trim());
                                if (lines.length < 2) throw new Error('File CSV rỗng');
                                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                                products = lines.slice(1).map(line => {
                                  const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                                  const obj = {};
                                  headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
                                  return obj;
                                });
                              }
                              setSkillFormData(prev => ({ ...prev, _parsedProducts: products, _fileName: file.name }));
                            } catch (err) {
                              setSkillFormData(prev => ({ ...prev, _parsedProducts: [], _fileName: file.name, _parseError: err.message }));
                            }
                          };
                          reader.readAsText(file);
                        }} />
                        {skillFormData._parsedProducts?.length ? (
                          <>
                            <CheckCircle2 size={20} className="text-emerald-500 mb-1" />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{skillFormData._fileName}</span>
                            <span className="text-[10px] text-emerald-500">{skillFormData._parsedProducts.length} sản phẩm tìm thấy</span>
                          </>
                        ) : (
                          <>
                            <Upload size={20} className="text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500">Kéo thả hoặc bấm để chọn file</span>
                            <span className="text-[10px] text-slate-400">CSV, JSON</span>
                          </>
                        )}
                        {skillFormData._parseError && (
                          <span className="text-[10px] text-red-500 mt-1">{skillFormData._parseError}</span>
                        )}
                      </label>
                      {/* Preview first few products */}
                      {skillFormData._parsedProducts?.length > 0 && (
                        <div className="mt-2 max-h-28 overflow-y-auto rounded-[10px] bg-white/[0.05] dark:bg-slate-800/[0.1] border border-white/[0.08] p-2">
                          <p className="text-[10px] font-bold text-slate-400 mb-1">Preview ({Math.min(3, skillFormData._parsedProducts.length)} / {skillFormData._parsedProducts.length})</p>
                          {skillFormData._parsedProducts.slice(0, 3).map((p, i) => (
                            <div key={i} className="text-[10px] text-slate-500 dark:text-slate-400 truncate py-0.5 border-b border-white/[0.04] last:border-0">
                              {p.title || p.Title || p.name || p.Handle || Object.values(p).slice(0, 3).join(' · ')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : inp.type === 'crawl-session-select' ? (
                    <select className={selectClass} value={skillFormData[inp.key] || ''} onChange={e => setSkillFormData({ ...skillFormData, [inp.key]: e.target.value })} disabled={running}>
                      <option value="">-- Chọn crawl session --</option>
                      {resultHistory.filter(r => r.skillId === 'crawl' && r.raw?.sessionId).map(r => (
                        <option key={r.id} value={r.raw.sessionId}>{r.raw.sessionId?.slice(0, 8)}... - {r.data?.['Sản phẩm'] || '?'} SP - {r.time}</option>
                      ))}
                    </select>
                  ) : (
                    <input className={inputClass} placeholder={inp.placeholder || ''} value={skillFormData[inp.key] || ''} onChange={e => setSkillFormData({ ...skillFormData, [inp.key]: e.target.value })} disabled={running} />
                  )}
                </div>
                );
              })}
              {!running && (
                <GlassButton variant="primary" icon={Play} onClick={runSkill}>
                  Chạy {selectedSkill.label}
                </GlassButton>
              )}
            </div>
          </GlassCard>
        )}

        {/* Results + form to run again */}
        {skillResult && selectedSkill && (
          <GlassCard>
            {/* Result header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-[12px] bg-emerald-100/60 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedSkill.label}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Hoàn tất</p>
                </div>
              </div>
              {/* Download buttons */}
              <div className="flex items-center space-x-1.5">
                {skillResult.sessionId && (
                  <>
                    <button onClick={() => api.downloadCrawlCsv(skillResult.sessionId).catch(e => addToast(`Lỗi: ${e.message}`, 'error'))} className="flex items-center space-x-1 px-2.5 py-1 rounded-[12px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all text-[11px] font-semibold cursor-pointer">
                      <FileText size={12} />
                      <span>CSV</span>
                    </button>
                    <button onClick={() => api.exportCrawl(skillResult.sessionId).then(data => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `crawl-full-${skillResult.sessionId}.json`; a.click(); }).catch(e => addToast(`Lỗi: ${e.message}`, 'error'))} className="flex items-center space-x-1 px-2.5 py-1 rounded-[12px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all text-[11px] font-semibold cursor-pointer">
                      <FileText size={12} />
                      <span>JSON</span>
                    </button>
                  </>
                )}
                {!skillResult.sessionId && !skillResult.claudeCode && (
                  <button onClick={() => { const json = JSON.stringify(skillResult, null, 2); const blob = new Blob([json], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${selectedSkill.id}-${Date.now()}.json`; a.click(); }} className="flex items-center space-x-1 px-2.5 py-1 rounded-[12px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all text-[11px] font-semibold cursor-pointer">
                    <FileText size={12} />
                    <span>JSON</span>
                  </button>
                )}
              </div>
            </div>

            {/* Result data */}
            {selectedSkill.formatResult && (
              <div className="space-y-1 mb-3">
                {Object.entries(selectedSkill.formatResult(skillResult)).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5 px-2.5 bg-white/[0.05] dark:bg-slate-800/[0.06] rounded-[12px]">
                    <span className="text-[11px] font-semibold text-slate-500">{key}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Claude Code hint */}
            {skillResult.claudeCode && (
              <div className="p-2.5 bg-amber-50/50 dark:bg-amber-500/10 rounded-[12px] border border-amber-200/30 dark:border-amber-500/10 mb-3">
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  <Lightbulb size={12} className="inline mr-1 -mt-0.5" />
                  {skillResult.message}
                </p>
              </div>
            )}

            {/* Next step suggestions */}
            {skillResult.sessionId && selectedSkill.id === 'crawl' && (
              <div className="flex items-center space-x-2 mb-3 p-2.5 bg-indigo-50/40 dark:bg-indigo-500/8 rounded-[12px] border border-indigo-200/20 dark:border-indigo-500/10">
                <Sparkles size={12} className="text-indigo-500 flex-shrink-0" />
                <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium">Tiếp theo:</span>
                <button onClick={() => { setSkillResult(null); const s = pipelineSkills.find(s => s.id === 'optimize'); if (s) { setSelectedSkill(s); setSkillFormData({}); } }} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Tối ưu SEO</button>
                <span className="text-[10px] text-slate-400">hoặc</span>
                <button onClick={() => { setSkillResult(null); const s = pipelineSkills.find(s => s.id === 'import-crawled'); if (s) { setSelectedSkill(s); setSkillFormData({}); } }} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Import SP</button>
              </div>
            )}
            {selectedSkill.id === 'optimize' && !skillResult.claudeCode && (
              <div className="flex items-center space-x-2 mb-3 p-2.5 bg-emerald-50/40 dark:bg-emerald-500/8 rounded-[12px] border border-emerald-200/20 dark:border-emerald-500/10">
                <Sparkles size={12} className="text-emerald-500 flex-shrink-0" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">Tiếp theo:</span>
                <button onClick={() => addToast('Mở Claude Code và chạy /ads-content-creator', 'info')} className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">Tạo Ads</button>
                <span className="text-[10px] text-slate-400">hoặc</span>
                <button onClick={() => addToast('Mở Claude Code và chạy /social-content-creator', 'info')} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Tạo Content MXH</button>
              </div>
            )}

            {/* Run again - inline form */}
            <div className="pt-2.5 mt-2.5 border-t border-white/[0.06] dark:border-white/[0.03]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Chạy lại</p>
              <div className="space-y-2">
                {selectedSkill.inputs.filter(inp => !inp.showWhen).map(inp => (
                  <div key={inp.key}>
                    {inp.type === 'store-select' ? (
                      <select className={selectClass} value={skillFormData[inp.key] || ''} onChange={e => setSkillFormData({ ...skillFormData, [inp.key]: e.target.value })}>
                        <option value="">-- Chọn store --</option>
                        {(stores.data || []).map(s => (<option key={s.id} value={s.id}>{s.name} ({s.domain})</option>))}
                      </select>
                    ) : inp.type === 'import-source' ? null : (
                      <input className={inputClass} placeholder={inp.placeholder || ''} value={skillFormData[inp.key] || ''} onChange={e => setSkillFormData({ ...skillFormData, [inp.key]: e.target.value })} />
                    )}
                  </div>
                ))}
                <GlassButton variant="glass" icon={RefreshCw} onClick={() => { setSkillResult(null); setSteps([]); }}>
                  Chạy lại {selectedSkill.label}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}
      </>)}

      {/* Result History - always visible */}
      <GlassCard>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center">
          <Activity size={18} className="mr-2 text-indigo-500" /> Lịch sử kết quả
        </h2>
        {resultHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Chưa có kết quả nào. Chạy một tác vụ để bắt đầu.</p>
        ) : (
        <div className="space-y-1.5">
            {resultHistory.map((r) => {
              const skillDef = pipelineSkills.find(s => s.id === r.skillId);
              const Icon = skillDef?.icon || Activity;
              const isExpanded = expandedResults[r.id];
              return (
                <div key={r.id} className="bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04] overflow-hidden">
                  <button onClick={() => setExpandedResults(prev => ({ ...prev, [r.id]: !prev[r.id] }))} className="w-full flex items-center justify-between p-3 hover:bg-white/[0.04] dark:hover:bg-slate-700/[0.06] transition-all cursor-pointer">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`p-1.5 rounded-[12px] ${colorMap[r.color]?.bg || 'bg-slate-100'} ${colorMap[r.color]?.text || 'text-slate-500'} flex-shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{r.skill}</p>
                        <p className="text-[10px] text-slate-400">{r.time}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-white/[0.06] dark:border-white/[0.03] pt-2">
                      {Object.entries(r.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1.5 px-2.5 bg-white/[0.04] dark:bg-slate-800/[0.06] rounded-[12px]">
                          <span className="text-[10px] font-semibold text-slate-500">{key}</span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{String(value)}</span>
                        </div>
                      ))}
                      <div className="flex items-center space-x-3 mt-1">
                        {r.raw?.sessionId && (
                          <>
                            <button onClick={() => api.downloadCrawlCsv(r.raw.sessionId).catch(() => {})} className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer">
                              <FileText size={12} />
                              <span>CSV (Shopify)</span>
                            </button>
                            <button onClick={() => api.exportCrawl(r.raw.sessionId).then(data => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `crawl-full-${r.raw.sessionId}.json`; a.click(); }).catch(() => {})} className="flex items-center space-x-1 text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer">
                              <FileText size={12} />
                              <span>JSON (đầy đủ)</span>
                            </button>
                          </>
                        )}
                        {!r.raw?.sessionId && (
                          <button onClick={() => { const json = JSON.stringify(r.raw, null, 2); const blob = new Blob([json], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${r.skill.replace(/\s+/g, '-').toLowerCase()}-${r.id}.json`; a.click(); }} className="flex items-center space-x-1 text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer">
                            <FileText size={12} />
                            <span>Tải JSON</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Pipeline Progress - only for auto mode running */}
      {mode === 'auto' && steps.length > 0 && (
        <GlassCard className="border-l-4 border-indigo-500 !rounded-l-none">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
            <Activity size={18} className="mr-2 text-indigo-500" /> Tiến trình Pipeline
          </h2>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04]">
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

  const inputClass = "w-full bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.12] dark:border-white/[0.04] rounded-[16px] py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-[8px] text-slate-800 dark:text-slate-200 placeholder-slate-400";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Quản lý Niche & Store</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Thêm, sửa, xóa niche và cửa hàng Shopify</p>
        </div>
        <button onClick={() => { niches.refetch(); stores.refetch(); }} className="p-2.5 rounded-[16px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/[0.15] transition-all active:scale-95">
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
          <div className="mb-4 p-4 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[18px] border border-white/[0.1] dark:border-white/[0.04] space-y-3">
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
              <div key={niche.id} className="flex items-center justify-between p-3.5 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{niche.name}</p>
                  <p className="text-[11px] text-slate-500">{niche.description || 'Không có mô tả'} &middot; {niche.stores?.length || 0} stores</p>
                </div>
                <button onClick={() => handleDeleteNiche(niche.id, niche.name)} className="p-2 rounded-[12px] hover:bg-rose-100/50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
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
          <div className="mb-4 p-4 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[18px] border border-white/[0.1] dark:border-white/[0.04] space-y-3">
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
              <div key={store.id} className="flex items-center justify-between p-3.5 bg-white/[0.06] dark:bg-slate-800/[0.08] rounded-[16px] border border-white/[0.08] dark:border-white/[0.04]">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
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
                <button onClick={() => handleDeleteStore(store.id, store.name)} className="p-2 rounded-[12px] hover:bg-rose-100/50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors">
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
const SidebarItem = ({ icon: Icon, label, active, onClick, compact }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-[14px] transition-all duration-200 group relative ${active ? 'bg-white/[0.2] dark:bg-white/[0.08] shadow-[0_1px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.25)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.06)] text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-white/[0.1] dark:hover:bg-white/[0.04] font-medium'}`}>
    <Icon size={compact ? 16 : 18} strokeWidth={active ? 2.5 : 1.8} />
    <span className={`flex-1 text-left ${compact ? 'text-[12px]' : 'text-[13px]'}`}>{label}</span>
    <ChevronRight size={12} className={`flex-shrink-0 transition-all duration-200 ${active ? 'opacity-60' : 'opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0'}`} />
  </button>
);

// --- RIGHT PANEL (Column 3) - Redesigned with Vercel/Linear/GitHub patterns ---
const RightPanel = ({ activeTab, tasks, runs, stores, niches, handleQuickAction, addToast }) => {
  const storeList = stores.data || [];
  const runList = runs.data || [];
  const nicheList = niches?.data || [];
  const [rightTab, setRightTab] = useState('monitor'); // 'monitor' | 'history'
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('all');

  // Read persistent result history
  const [resultHistory, setResultHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopifyos-result-history') || '[]'); } catch { return []; }
  });
  useEffect(() => {
    const interval = setInterval(() => {
      try { setResultHistory(JSON.parse(localStorage.getItem('shopifyos-result-history') || '[]')); } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Derived data
  const runningTasks = tasks.filter(t => t.status === 'running');
  const completedTasks = tasks.filter(t => t.status !== 'running');
  const totalRuns = resultHistory.length;
  const successRuns = resultHistory.filter(r => !r.data?.['Lỗi']).length;
  const totalOptimized = resultHistory.reduce((sum, r) => sum + (r.raw?.optimized || r.raw?.imported || r.raw?.productsCrawled || 0), 0);
  const filteredHistory = historyFilter === 'all' ? resultHistory : resultHistory.filter(r => r.skillId === historyFilter);
  const skillFilters = [...new Set(resultHistory.map(r => r.skillId))].filter(Boolean);

  const getElapsed = (startedAt) => {
    if (!startedAt) return '';
    const secs = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    return `${mins}m${secs % 60}s`;
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
    return `${Math.floor(diff / 86400)}d trước`;
  };

  const statusConfig = {
    running: { dot: 'bg-blue-500', ring: 'ring-blue-500/30', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/[0.06]', label: 'Đang chạy' },
    completed: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/[0.04]', label: 'Hoàn tất' },
    failed: { dot: 'bg-rose-500', ring: 'ring-rose-500/30', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/[0.04]', label: 'Lỗi' },
  };

  // === KPI CARDS (Retool-style) ===
  const KPICards = () => {
    const activeStore = storeList[0];
    const productCount = activeStore?.productCount || 0;
    const successRate = totalRuns > 0 ? Math.round(successRuns / totalRuns * 100) : 0;
    return (
      <div className="grid grid-cols-3 gap-1.5">
        <div className="text-center p-2 rounded-[12px] bg-white/[0.06] dark:bg-slate-800/[0.08] border border-white/[0.08] dark:border-white/[0.03]">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{productCount}</p>
          <p className="text-[8px] text-slate-400 mt-0.5">Sản phẩm</p>
        </div>
        <div className="text-center p-2 rounded-[12px] bg-white/[0.06] dark:bg-slate-800/[0.08] border border-white/[0.08] dark:border-white/[0.03]">
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{successRate}%</p>
          <p className="text-[8px] text-slate-400 mt-0.5">Thành công</p>
        </div>
        <div className="text-center p-2 rounded-[12px] bg-white/[0.06] dark:bg-slate-800/[0.08] border border-white/[0.08] dark:border-white/[0.03]">
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{totalOptimized}</p>
          <p className="text-[8px] text-slate-400 mt-0.5">Đã xử lý</p>
        </div>
      </div>
    );
  };

  // === LIVE TASK MONITOR (Vercel-style with status dots) ===
  const LiveMonitor = () => (
    <div>
      {/* Running tasks - Vercel deployment style */}
      {runningTasks.map((task) => {
        const cfg = statusConfig.running;
        return (
          <div key={task.id} className="mb-2 p-2.5 rounded-[14px] bg-blue-500/[0.05] dark:bg-blue-500/[0.08] border border-blue-400/15 dark:border-blue-500/10">
            <div className="flex items-start space-x-2.5">
              {/* Animated status dot */}
              <div className="mt-1 relative flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`}></div>
                <div className={`absolute inset-0 w-2 h-2 rounded-full ${cfg.dot} animate-ping opacity-40`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 truncate">{task.label}</p>
                  <span className="text-[9px] font-mono text-blue-500/80 ml-1 flex-shrink-0">{getElapsed(task.startedAt)}</span>
                </div>
                <p className="text-[10px] text-blue-500/60 dark:text-blue-400/50 mt-0.5 truncate">{task.detail}</p>
                {/* Slim progress bar */}
                <div className="mt-1.5 h-[3px] bg-blue-200/20 dark:bg-blue-900/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{
                    width: task.detail?.match(/Batch (\d+)/) ? `${Math.min(95, parseInt(task.detail.match(/Batch (\d+)/)?.[1] || '1') * 20)}%` : '40%',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Completed/failed - GitHub Actions style timeline */}
      {completedTasks.length > 0 && (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-slate-200/50 dark:bg-slate-700/30"></div>
          <div className="space-y-0.5">
            {completedTasks.slice(0, 8).map((task) => {
              const cfg = statusConfig[task.status] || statusConfig.failed;
              const isExpanded = expandedTaskId === task.id;
              return (
                <div key={task.id}>
                  <div
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className={`relative flex items-center space-x-2.5 p-1.5 pl-0 rounded-[10px] cursor-pointer transition-all hover:bg-white/[0.06] dark:hover:bg-slate-800/[0.08] group`}
                  >
                    {/* Status dot on timeline */}
                    <div className="relative z-10 flex-shrink-0 ml-[3px]">
                      <div className={`w-[10px] h-[10px] rounded-full ${cfg.dot} ring-2 ${cfg.ring} ring-offset-1 ring-offset-white dark:ring-offset-slate-900`}></div>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate">{task.label}</p>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                        {task.result && <span className={`text-[9px] font-semibold ${cfg.text}`}>{task.result}</span>}
                        <span className="text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{getRelativeTime(task.startedAt)}</span>
                        <ChevronDown size={9} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                  {/* Expanded detail - step breakdown */}
                  {isExpanded && (
                    <div className="ml-6 mb-1 p-2 bg-white/[0.05] dark:bg-slate-800/[0.06] rounded-[8px] border border-white/[0.06] dark:border-white/[0.02]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">Trạng thái</span>
                          <span className={`text-[9px] font-semibold ${cfg.text}`}>{cfg.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">Chi tiết</span>
                          <span className="text-[9px] text-slate-600 dark:text-slate-400">{task.detail}</span>
                        </div>
                        {task.result && (
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-500">Kết quả</span>
                            <span className={`text-[9px] font-bold ${cfg.text}`}>{task.result}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">Thời gian</span>
                          <span className="text-[9px] text-slate-400">{task.startedAt ? new Date(task.startedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-4">
          <CircleDot size={20} className="mx-auto text-slate-300 dark:text-slate-600 mb-1.5" />
          <p className="text-[10px] text-slate-400">Chưa có tác vụ nào</p>
          <p className="text-[9px] text-slate-400/60 mt-0.5">Chạy công cụ ở cột giữa để bắt đầu</p>
        </div>
      )}
    </div>
  );

  // === ACTIVITY HISTORY (Shopify Admin + GitHub style with filters) ===
  const ActivityHistory = () => (
    <div>
      {/* Filter chips */}
      {skillFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          <button
            onClick={() => setHistoryFilter('all')}
            className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-all ${
              historyFilter === 'all' ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20' : 'bg-white/[0.08] dark:bg-slate-800/[0.1] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >Tất cả ({totalRuns})</button>
          {skillFilters.map(f => {
            const count = resultHistory.filter(r => r.skillId === f).length;
            return (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-all ${
                  historyFilter === f ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20' : 'bg-white/[0.08] dark:bg-slate-800/[0.1] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >{f === 'optimize' ? 'SEO' : f === 'crawl' ? 'Crawl' : f === 'import-crawled' ? 'Import' : f} ({count})</button>
            );
          })}
        </div>
      )}

      {/* History list - expandable timeline */}
      <div className="space-y-1 max-h-[calc(100vh-420px)] overflow-y-auto hide-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-4">
            <History size={18} className="mx-auto text-slate-300 dark:text-slate-600 mb-1.5" />
            <p className="text-[10px] text-slate-400">Chưa có lịch sử</p>
          </div>
        ) : (
          filteredHistory.map((r) => {
            const isExpanded = expandedHistoryId === r.id;
            const hasError = r.data?.['Lỗi'];
            const skillColorMap = { optimize: 'indigo', crawl: 'blue', 'import-crawled': 'amber' };
            const sColor = skillColorMap[r.skillId] || 'emerald';
            return (
              <div key={r.id}>
                <div
                  onClick={() => setExpandedHistoryId(isExpanded ? null : r.id)}
                  className="flex items-center space-x-2 p-2 rounded-[10px] cursor-pointer transition-all hover:bg-white/[0.06] dark:hover:bg-slate-800/[0.06] group"
                >
                  {/* Colored status dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasError ? 'bg-rose-500' : `bg-${sColor}-500`}`}
                    style={{ backgroundColor: hasError ? '#f43f5e' : sColor === 'indigo' ? '#6366f1' : sColor === 'blue' ? '#3b82f6' : sColor === 'amber' ? '#f59e0b' : '#10b981' }}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate">{r.skill}</p>
                      <span className="text-[8px] text-slate-400 flex-shrink-0 ml-1">{r.time}</span>
                    </div>
                    {/* Quick summary inline */}
                    {r.data && !isExpanded && (
                      <p className="text-[9px] text-slate-400/70 truncate mt-0.5">
                        {Object.entries(r.data).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                  </div>
                  <ChevronDown size={9} className={`text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                {isExpanded && r.data && (
                  <div className="ml-5 mb-1 p-2 bg-white/[0.05] dark:bg-slate-800/[0.06] rounded-[8px] border border-white/[0.05] dark:border-white/[0.02]">
                    {Object.entries(r.data).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-0.5">
                        <span className="text-[9px] text-slate-500">{k}</span>
                        <span className={`text-[9px] font-semibold ${k === 'Lỗi' ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* API runs - recent */}
      {runList.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] dark:border-white/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">API Runs</p>
            <button onClick={runs.refetch} className="p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-white/5 transition-all">
              <RefreshCw size={10} className={`text-slate-400 ${runs.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="space-y-0.5">
            {runList.slice(0, 5).map((run) => {
              const isOk = run.status === 'COMPLETED' || run.status === 'success';
              return (
                <div key={run.id} className="flex items-center space-x-2 p-1.5 rounded-[8px] hover:bg-white/[0.04] dark:hover:bg-slate-800/[0.04] transition-all">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOk ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate">{run.runType?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {run.productsOptimized > 0 && <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">{run.productsOptimized}/{run.productsTotal}</span>}
                    <span className="text-[8px] text-slate-400">{getRelativeTime(run.startedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // === ACTION BUTTON ===
  const ActionBtn = ({ icon: Ic, label, color, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center space-x-3 p-2.5 rounded-[16px] bg-white/[0.08] dark:bg-slate-800/[0.1] border border-white/[0.1] dark:border-white/[0.04] hover:bg-white/[0.15] dark:hover:bg-slate-700/[0.2] transition-all active:scale-[0.98] cursor-pointer">
      <div className={`p-2 rounded-[12px] ${colorMap[color].bg} ${colorMap[color].text}`}><Ic size={16} /></div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </button>
  );

  // === CONTEXT ACTIONS (varies by tab) ===
  const ContextActions = () => {
    if (activeTab === 'command-center') return (
      <div className="space-y-1.5">
        <ActionBtn icon={Package} label="Tối ưu sản phẩm" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
        <ActionBtn icon={Megaphone} label="Tạo quảng cáo" color="rose" onClick={() => handleQuickAction('ads', 'Tạo quảng cáo')} />
        <ActionBtn icon={Share2} label="Nội dung MXH" color="emerald" onClick={() => handleQuickAction('social', 'Nội dung MXH')} />
        <ActionBtn icon={TrendingUp} label="Tìm SP tiềm năng" color="amber" onClick={() => handleQuickAction('winning', 'Tìm SP tiềm năng')} />
      </div>
    );
    if (activeTab === 'products') return (
      <div className="space-y-1.5">
        <ActionBtn icon={Zap} label="Tối ưu hàng loạt" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
      </div>
    );
    if (activeTab === 'ads') return (
      <div className="space-y-1.5">
        <ActionBtn icon={Eye} label="Meta Ads" color="blue" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
        <ActionBtn icon={Globe} label="Google Ads" color="emerald" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
        <ActionBtn icon={Video} label="TikTok Ads" color="rose" onClick={() => addToast('Chạy /ads-content-creator trong Claude Code', 'info')} />
      </div>
    );
    if (activeTab === 'social') return (
      <div className="space-y-1.5">
        <ActionBtn icon={FileText} label="Bài đăng mới" color="indigo" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
        <ActionBtn icon={Image} label="Tạo prompt hình" color="purple" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
        <ActionBtn icon={Video} label="Ý tưởng video" color="rose" onClick={() => addToast('Chạy /social-content-creator trong Claude Code', 'info')} />
      </div>
    );
    if (activeTab === 'winning-products') return (
      <div className="space-y-1.5">
        <ActionBtn icon={TrendingUp} label="Quét Trend" color="emerald" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
        <ActionBtn icon={Eye} label="Spy Ads đối thủ" color="blue" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
        <ActionBtn icon={ShoppingBag} label="Chấm điểm SP" color="amber" onClick={() => addToast('Chạy /winning-product-hunter trong Claude Code', 'info')} />
      </div>
    );
    if (activeTab === 'pipeline-auto' || activeTab === 'pipeline-custom') return (
      <div className="space-y-1.5">
        <ActionBtn icon={Rocket} label="Chạy Full Pipeline" color="purple" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
        <ActionBtn icon={Eye} label="Crawl đối thủ" color="blue" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
        <ActionBtn icon={Palette} label="Convert Theme" color="rose" onClick={() => addToast('Gõ /shopify-pipeline trong Claude Code', 'info')} />
      </div>
    );
    if (activeTab === 'stores-manage') return (
      <div className="space-y-1.5">
        <ActionBtn icon={Plus} label="Thêm Niche mới" color="purple" onClick={() => addToast('Bấm "Thêm Niche" ở cột giữa', 'info')} />
        <ActionBtn icon={Plus} label="Thêm Store mới" color="indigo" onClick={() => addToast('Bấm "Thêm Store" ở cột giữa', 'info')} />
      </div>
    );
    return (
      <div className="space-y-1.5">
        <ActionBtn icon={Package} label="Tối ưu sản phẩm" color="indigo" onClick={() => handleQuickAction('optimize', 'Tối ưu sản phẩm')} />
      </div>
    );
  };

  // === MAIN LAYOUT - Unified for all tabs ===
  return (
    <div className="space-y-4">
      {/* Tab switcher - Linear style */}
      <div className="flex items-center bg-white/[0.06] dark:bg-slate-800/[0.06] rounded-[12px] p-0.5">
        <button
          onClick={() => setRightTab('monitor')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-[10px] text-[10px] font-semibold transition-all ${
            rightTab === 'monitor'
              ? 'bg-white/[0.12] dark:bg-slate-700/[0.2] text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Activity size={12} />
          <span>Giám sát</span>
          {runningTasks.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center animate-pulse">{runningTasks.length}</span>
          )}
        </button>
        <button
          onClick={() => setRightTab('history')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-[10px] text-[10px] font-semibold transition-all ${
            rightTab === 'history'
              ? 'bg-white/[0.12] dark:bg-slate-700/[0.2] text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <History size={12} />
          <span>Lịch sử</span>
          {totalRuns > 0 && (
            <span className="px-1.5 h-4 rounded-full bg-slate-200/60 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400 text-[8px] font-bold flex items-center justify-center">{totalRuns}</span>
          )}
        </button>
      </div>

      {/* KPI summary */}
      <KPICards />

      {/* Tab content */}
      {rightTab === 'monitor' ? (
        <div className="space-y-4">
          {/* Live task feed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tác vụ đang chạy</p>
              {runningTasks.length > 0 && <span className="text-[8px] text-blue-500 font-medium">{runningTasks.length} đang xử lý</span>}
            </div>
            <LiveMonitor />
          </div>

          {/* Context actions */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thao tác nhanh</p>
            <ContextActions />
          </div>
        </div>
      ) : (
        <ActivityHistory />
      )}
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
    { group: 'Quản lý Store', items: [
      { id: 'pipeline-auto', icon: Rocket, label: 'Setup tự động' },
      { id: 'pipeline-custom', icon: Zap, label: 'Công cụ' },
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

  // Skills that need Claude Code terminal (not HTTP API)
  const claudeCodeSkills = {
    ads: '/ads-content-creator',
    social: '/social-content-creator',
    winning: '/winning-product-hunter',
  };

  const handleQuickAction = async (action, label) => {
    // Delegate to Claude Code for skills that don't have HTTP API
    if (claudeCodeSkills[action]) {
      addToast(`Mở Claude Code và chạy ${claudeCodeSkills[action]}`, 'info');
      return;
    }

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
        updateTask(taskId, { status: 'failed', detail: 'Action không xác định' });
        return;
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
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-[14px] bg-white/[0.1] dark:bg-slate-800/[0.12] border border-white/40 dark:border-white/10">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-[14px] bg-white/[0.1] dark:bg-slate-800/[0.12] border border-white/40 dark:border-white/10">
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
                <div key={store.id} className="flex items-center space-x-3 p-2.5 rounded-[14px]">
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
        {/* Desktop Sidebar - Floating Island */}
        <div className="hidden md:flex my-3 ml-3 flex-col w-60 lg:w-[260px]">
          <div className="h-full flex flex-col rounded-[24px] bg-white/[0.12] dark:bg-white/[0.04] border border-white/[0.18] dark:border-white/[0.06] backdrop-blur-[20px] backdrop-saturate-[180%] shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Specular highlight */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />

            {/* Logo */}
            <div className="flex items-center space-x-2.5 px-5 pt-5 pb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[12px] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(99,102,241,0.3)]"><Zap size={18} /></div>
              <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
            </div>

            {/* Scrollable nav */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-3 pb-3 space-y-2">

              {/* Pinned / Favorites */}
              <div className="rounded-[16px] bg-white/[0.06] dark:bg-white/[0.02] border border-white/[0.08] dark:border-white/[0.03] p-1.5">
                <p className="text-[9px] font-bold text-slate-400/70 uppercase tracking-[0.1em] px-2.5 pt-1 pb-1.5">Ghim</p>
                <SidebarItem icon={LayoutDashboard} label="Bảng điều khiển" active={activeTab === 'command-center'} onClick={() => setActiveTab('command-center')} compact />
                <SidebarItem icon={Zap} label="Công cụ" active={activeTab === 'pipeline-custom'} onClick={() => setActiveTab('pipeline-custom')} compact />
              </div>

              {/* Bento Block: Hệ thống */}
              <div className="rounded-[16px] bg-white/[0.06] dark:bg-white/[0.02] border border-white/[0.08] dark:border-white/[0.03] p-1.5">
                <p className="text-[9px] font-bold text-slate-400/70 uppercase tracking-[0.1em] px-2.5 pt-1 pb-1.5">Hệ thống</p>
                <SidebarItem icon={Package} label="Sản phẩm" active={activeTab === 'products'} onClick={() => setActiveTab('products')} compact />
                <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />
                <SidebarItem icon={Rocket} label="Setup tự động" active={activeTab === 'pipeline-auto'} onClick={() => setActiveTab('pipeline-auto')} compact />
                <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />
                <SidebarItem icon={Settings} label="Niche & Store" active={activeTab === 'stores-manage'} onClick={() => setActiveTab('stores-manage')} compact />
              </div>

              {/* Bento Block: AI Skills */}
              <div className="rounded-[16px] bg-white/[0.06] dark:bg-white/[0.02] border border-white/[0.08] dark:border-white/[0.03] p-1.5">
                <p className="text-[9px] font-bold text-slate-400/70 uppercase tracking-[0.1em] px-2.5 pt-1 pb-1.5">AI Skills</p>
                <SidebarItem icon={Sparkles} label="Tối ưu SP" active={activeTab === 'products'} onClick={() => setActiveTab('products')} compact />
                <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />
                <SidebarItem icon={Megaphone} label="Quảng cáo" active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} compact />
                <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />
                <SidebarItem icon={Share2} label="Mạng xã hội" active={activeTab === 'social'} onClick={() => setActiveTab('social')} compact />
                <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />
                <SidebarItem icon={TrendingUp} label="Nghiên cứu SP" active={activeTab === 'winning-products'} onClick={() => setActiveTab('winning-products')} compact />
              </div>

              {/* Stores */}
              <div className="rounded-[16px] bg-white/[0.06] dark:bg-white/[0.02] border border-white/[0.08] dark:border-white/[0.03] p-1.5">
                <p className="text-[9px] font-bold text-slate-400/70 uppercase tracking-[0.1em] px-2.5 pt-1 pb-1.5">Stores</p>
                {sidebarStores.map((store, i) => (
                  <React.Fragment key={store.id}>
                    {i > 0 && <div className="mx-2.5 border-b border-white/[0.06] dark:border-white/[0.03]" />}
                    <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-[12px] hover:bg-white/[0.08] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                      <span className="text-sm">{store.icon || '\u{1F3EA}'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{store.name}</p>
                        <p className="text-[9px] text-slate-400/70 truncate">{store.domain}</p>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${store.isActive || store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Bottom: Theme toggle */}
            <div className="px-3 pb-3 pt-1">
              <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center p-2 rounded-[14px] bg-white/[0.06] dark:bg-white/[0.03] hover:bg-white/[0.12] dark:hover:bg-white/[0.06] text-slate-500 dark:text-slate-400 transition-all border border-white/[0.08] dark:border-white/[0.03]">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                <span className="ml-2 text-[11px] font-medium">{isDark ? 'Sáng' : 'Tối'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Main Content - SCROLLABLE */}
        <div className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0 p-4 md:p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'command-center' && <CommandCenter stores={stores} dashboard={dashboard} runs={runs} insights={insights} addToast={addToast} tasks={tasks} handleQuickAction={handleQuickAction} />}
            {activeTab === 'products' && <ProductsView products={products} addToast={addToast} />}
            {activeTab === 'ads' && <AdsView skillOutputs={adsOutputs} addToast={addToast} />}
            {activeTab === 'social' && <SocialView stores={stores} skillOutputs={socialOutputs} />}
            {activeTab === 'winning-products' && <WinningProductsView competitors={competitors} skillOutputs={winningOutputs} insights={insights} addToast={addToast} />}
            {activeTab === 'pipeline-auto' && <PipelineView mode="auto" stores={stores} runs={runs} addToast={addToast} handleQuickAction={handleQuickAction} addTask={addTask} updateTask={updateTask} />}
            {activeTab === 'pipeline-custom' && <PipelineView mode="custom" stores={stores} runs={runs} addToast={addToast} handleQuickAction={handleQuickAction} addTask={addTask} updateTask={updateTask} />}
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
        <div className="mx-3 mb-3 flex items-center justify-around py-2 bg-white/[0.15] dark:bg-slate-900/[0.2] backdrop-blur-[12px] backdrop-saturate-[180%] rounded-[18px] border border-white/50 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          {bottomNav.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`flex flex-col items-center py-1.5 px-3 rounded-[14px] transition-all ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center py-1.5 px-3 rounded-[14px] text-slate-400">
            <Menu size={20} />
            <span className="text-[10px] font-semibold mt-0.5">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
