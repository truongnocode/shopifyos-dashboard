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
        className={`flex items-center space-x-2 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-lg animate-fade-in cursor-pointer ${
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
      <button onClick={onRefresh} className="p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={loading}>
        <RefreshCw size={16} className={`text-slate-500 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
      </button>
    )}
  </div>
);

// --- VIEWS ---
const CommandCenter = ({ stores, dashboard, runs, insights, addToast }) => {
  const storeList = stores.data || fallbackStores;
  const dashData = dashboard.data || { stores: storeList.length, productCount: storeList.reduce((sum, s) => sum + (s.productCount || 0), 0), runCount: 5, insightCount: 4 };
  const runList = runs.data || fallbackRuns;
  const insightList = insights.data || fallbackInsights;

  const handleQuickAction = async (action, label) => {
    addToast(`Đang chạy ${label}...`, 'info');
    try {
      if (action === 'optimize') {
        await api.optimizeStore(storeList[0]?.id);
      } else if (action === 'sync') {
        await api.syncStore(storeList[0]?.id);
      }
      addToast(`${label} hoàn tất!`, 'success');
      runs.refetch();
    } catch (e) {
      addToast(`Lỗi: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Trung tâm điều khiển</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">ShopifyOS &middot; Tổng quan hệ thống</p>
        </div>
        <button onClick={() => { dashboard.refetch(); stores.refetch(); runs.refetch(); insights.refetch(); }} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${dashboard.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: Store, label: 'Stores', value: Array.isArray(dashData.stores) ? dashData.stores.length : (dashData.stores || 0), color: 'blue', badge: `${storeList.length} niches` },
          { icon: Package, label: 'Sản phẩm', value: dashData.productCount, color: 'indigo', badge: null },
          { icon: Sparkles, label: 'AI Skills', value: 5, color: 'purple', badge: 'Active' },
          { icon: Zap, label: 'Automations', value: 3, color: 'amber', badge: null },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex flex-col justify-center space-y-3 md:space-y-4 !p-4 md:!p-8">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 md:p-4 rounded-2xl ${colorMap[stat.color].bg} ${colorMap[stat.color].text}`}>
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

      {/* Quick Actions - horizontal scroll on mobile */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Thao tác nhanh</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { icon: Package, label: 'Tối ưu SP', color: 'indigo', action: () => handleQuickAction('optimize', 'Tối ưu SP') },
            { icon: Megaphone, label: 'Tạo Ads', color: 'rose', action: () => addToast('Mở Claude Code và chạy /ads-content-creator', 'info') },
            { icon: Share2, label: 'Social', color: 'emerald', action: () => addToast('Mở Claude Code và chạy /social-content-creator', 'info') },
            { icon: TrendingUp, label: 'Tìm SP Win', color: 'amber', action: () => addToast('Mở Claude Code và chạy /winning-product-hunter', 'info') },
            { icon: Rocket, label: 'Pipeline', color: 'purple', action: () => addToast('Mở Claude Code và chạy /shopify-pipeline', 'info') },
          ].map((action, i) => (
            <div key={i} onClick={action.action} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 md:p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/5 min-w-[80px] md:min-w-[100px] cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
              <div className={`p-2.5 rounded-xl ${colorMap[action.color].bg} ${colorMap[action.color].text}`}>
                <action.icon size={20} />
              </div>
              <span className="text-[11px] md:text-xs font-semibold text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stores */}
      <GlassCard>
        <SectionHeader title="Cửa hàng" onRefresh={stores.refetch} loading={stores.loading} />
        {stores.loading ? <LoadingSkeleton count={2} /> : (
          <div className="space-y-3 mt-4">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3.5 md:p-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl md:rounded-[24px] border border-white/40 dark:border-white/5">
                <div className="flex items-center space-x-3 md:space-x-5 min-w-0">
                  <div className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl md:rounded-[18px] bg-gradient-to-br ${store.gradient || 'from-rose-400 to-pink-600'} flex items-center justify-center text-xl md:text-2xl shadow-inner flex-shrink-0`}>
                    {store.icon || '\u{1F3EA}'}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text-lg truncate">{store.name}</span>
                    <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{store.domain}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? 'Active' : 'Đang setup'} />
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

      {/* 2 columns: Skills + Recent Runs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">AI Skills</h2>
          <div className="space-y-2.5">
            {skillsConfig.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5">
                <div className={`p-2.5 rounded-xl ${colorMap[skill.color].pill} flex-shrink-0`}>
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

        <GlassCard>
          <SectionHeader title="Hoạt động gần đây" onRefresh={runs.refetch} loading={runs.loading} />
          {runs.loading ? <LoadingSkeleton count={4} /> : (
            <div className="space-y-2.5 mt-4">
              {runList.map((run) => (
                <div key={run.id} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${run.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                    {run.status === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{run.runType}</p>
                    <p className="text-[11px] text-slate-500">{run.store?.name} &middot; {run.startedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Insights */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
            <Lightbulb className="mr-2 text-amber-500" size={20} /> Nhận định thông minh
          </h2>
          <button onClick={insights.refetch} className="p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95" disabled={insights.loading}>
            <RefreshCw size={16} className={`text-slate-500 dark:text-slate-400 ${insights.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {insights.loading ? <LoadingSkeleton count={4} /> : (
          <div className="space-y-2.5">
            {insightList.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-3 md:p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
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
        <button onClick={products.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
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
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
              <div className={`p-3 md:p-4 rounded-2xl w-fit md:mb-4 ${colorMap[p.color].bg} ${colorMap[p.color].text}`}>
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
                {content.script && <pre className="text-[11px] text-slate-500 bg-white/30 dark:bg-slate-800/30 p-2 rounded-xl mb-2 whitespace-pre-wrap">{content.script}</pre>}
                {content.keywords && <div className="flex flex-wrap gap-1 mb-2">{content.keywords.map((k, i) => <span key={i} className="px-2 py-0.5 bg-indigo-100/80 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] rounded-full">{k}</span>)}</div>}
                {content.hashtags && <div className="flex flex-wrap gap-1 mb-2">{content.hashtags.map((h, i) => <span key={i} className="px-2 py-0.5 bg-purple-100/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] rounded-full">{h}</span>)}</div>}
                {content.targeting && <div className="mt-2 p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-xl"><p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Targeting: {content.targeting.age} | {content.targeting.interests?.join(', ')}</p></div>}
                {(content.imagePrompt || content.videoPrompt) && <div className="mt-2 p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-xl"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Prompt:</span> {content.imagePrompt || content.videoPrompt}</p></div>}
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
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Social Content</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Tạo nội dung đa nền tảng</p>
        </div>
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${skillOutputs.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: FileText, label: 'Bài đăng', value: outputs.filter(o => o.outputType === 'post').length || '24', color: 'indigo' },
          { icon: Image, label: 'Prompt hình', value: outputs.filter(o => o.outputType === 'image_prompt').length || '18', color: 'purple' },
          { icon: Video, label: 'Video concepts', value: outputs.filter(o => o.outputType === 'video').length || '6', color: 'rose' },
          { icon: Hash, label: 'Hashtag sets', value: outputs.filter(o => o.outputType === 'hashtag').length || '12', color: 'emerald' },
        ].map((s, i) => (
          <GlassCard key={i} className="!p-4 md:!p-6">
            <div className={`p-2.5 rounded-xl w-fit mb-2 ${colorMap[s.color].pill}`}>
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
                {content.caption && <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-white/30 dark:bg-slate-800/30 p-3 rounded-xl mb-2 leading-relaxed">{content.caption}</pre>}
                {content.imagePrompt && <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-xl"><p className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-semibold">Image Prompt:</span> {content.imagePrompt}</p></div>}
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
              <div key={i} className="flex items-center space-x-3 p-2.5 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/30 dark:border-white/5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">{type}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Stores đang hoạt động</h2>
          <div className="space-y-3">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
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

const WinningProductsView = ({ competitors, skillOutputs, addToast }) => {
  const competitorList = competitors.data || fallbackCompetitors;
  const outputs = skillOutputs?.data || [];

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
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Săn SP Win</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Nghiên cứu SP, phát hiện trend, spy ads</p>
        </div>
        <button onClick={competitors.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
              <div className={`p-3 md:p-4 rounded-2xl w-fit md:mb-4 ${colorMap[f.color].bg} ${colorMap[f.color].text}`}>
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
                    <div className="p-2 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-xl text-center"><p className="text-lg font-bold text-emerald-600">{content.score}</p><p className="text-[10px] text-slate-500">Score</p></div>
                    <div className="p-2 bg-blue-50/50 dark:bg-blue-500/10 rounded-xl text-center"><p className="text-xs font-bold text-blue-600">{content.trend}</p><p className="text-[10px] text-slate-500">Trend</p></div>
                    <div className="p-2 bg-amber-50/50 dark:bg-amber-500/10 rounded-xl text-center"><p className="text-xs font-bold text-amber-600">{content.marginPotential}</p><p className="text-[10px] text-slate-500">Margin</p></div>
                    <div className="p-2 bg-purple-50/50 dark:bg-purple-500/10 rounded-xl text-center"><p className="text-xs font-bold text-purple-600">{content.sellingPrice}</p><p className="text-[10px] text-slate-500">Giá bán</p></div>
                  </div>
                )}
                {content.whyWinning && <p className="text-xs text-slate-600 dark:text-slate-300 mb-2"><span className="font-semibold">Tại sao win:</span> {content.whyWinning}</p>}
                {content.competitors && (
                  <div className="space-y-2 mb-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Đối thủ phân tích:</p>
                    {content.competitors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/30 dark:bg-slate-800/30 rounded-xl">
                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.name}</p><p className="text-[10px] text-slate-500">{c.platform} | {c.adSpend}</p></div>
                        <Badge type="neutral" text={`CTR ${c.ctr}`} />
                      </div>
                    ))}
                  </div>
                )}
                {content.insights && <div className="space-y-1 mb-2">{content.insights.map((ins, i) => <p key={i} className="text-[11px] text-slate-500">• {ins}</p>)}</div>}
                {content.recommendation && <div className="p-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl"><p className="text-[11px] text-indigo-600 dark:text-indigo-300"><span className="font-semibold">Khuyến nghị:</span> {content.recommendation}</p></div>}
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
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Phân tích thị trường & theo dõi đối thủ</p>
        </div>
        <button onClick={() => { insights.refetch(); competitors.refetch(); }} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
                <div key={insight.id} className="p-3.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
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
                <div key={comp.id || idx} className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{comp.domain}</h3>
                    <p className="text-xs text-slate-500">Cho: {comp.name}</p>
                  </div>
                  <Badge type={comp.lastCrawledAt || comp.status === 'Đang theo' ? 'success' : 'pending'} text={comp.lastCrawledAt ? 'Đang theo' : (comp.status || 'Dự kiến')} />
                </div>
              ))}
            </div>
          )}
          <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5">
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
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Quản lý Liquid theme</p>
        </div>
        <button onClick={themes.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${themes.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {themes.loading ? <LoadingSkeleton count={2} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {themeList.map((theme, i) => (
            <GlassCard key={theme.id || i} hoverEffect className="cursor-pointer !p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
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

// --- SIDEBAR ITEM ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-2.5 mb-0.5 rounded-2xl transition-all duration-300 ${active ? 'bg-white/80 dark:bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 font-medium'}`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} /><span className="text-sm">{label}</span>
  </button>
);

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

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

  // Use fallback stores for sidebar
  const sidebarStores = stores.data || fallbackStores;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navItems = [
    { group: 'Tổng quan', items: [
      { id: 'command-center', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'products', icon: Package, label: 'Sản phẩm' },
      { id: 'themes', icon: Palette, label: 'Themes' },
    ]},
    { group: 'AI Skills', items: [
      { id: 'ads', icon: Megaphone, label: 'Tạo Ads' },
      { id: 'social', icon: Share2, label: 'Social' },
      { id: 'winning-products', icon: TrendingUp, label: 'Săn SP Win' },
    ]},
    { group: 'Nghiên cứu', items: [
      { id: 'intelligence', icon: BrainCircuit, label: 'Intelligence' },
    ]},
  ];

  const bottomNav = [
    { id: 'command-center', icon: LayoutDashboard, label: 'Home' },
    { id: 'products', icon: Package, label: 'SP' },
    { id: 'ads', icon: Megaphone, label: 'Ads' },
    { id: 'social', icon: Share2, label: 'Social' },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0B1120] text-slate-200' : 'bg-[#F3F4F6] text-slate-800'} relative overflow-hidden font-sans`}>
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob ${isDark ? 'bg-indigo-900/40' : 'bg-purple-200'}`}></div>
        <div className={`absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000 ${isDark ? 'bg-teal-900/30' : 'bg-cyan-200'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000 ${isDark ? 'bg-purple-900/30' : 'bg-pink-200'}`}></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/40 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <Zap size={16} />
            </div>
            <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-white/10">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-white/10">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative mx-4 mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl p-5 max-h-[70vh] overflow-y-auto">
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
                <div key={store.id} className="flex items-center space-x-3 p-2.5 rounded-xl">
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
                <div key={store.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer">
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
              <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all border border-white/40 dark:border-white/10">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                <span className="ml-2 text-sm font-medium">{isDark ? 'Sáng' : 'Tối'}</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0 p-4 md:p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'command-center' && <CommandCenter stores={stores} dashboard={dashboard} runs={runs} insights={insights} addToast={addToast} />}
            {activeTab === 'products' && <ProductsView products={products} addToast={addToast} />}
            {activeTab === 'ads' && <AdsView skillOutputs={adsOutputs} addToast={addToast} />}
            {activeTab === 'social' && <SocialView stores={stores} skillOutputs={socialOutputs} />}
            {activeTab === 'winning-products' && <WinningProductsView competitors={competitors} skillOutputs={winningOutputs} addToast={addToast} />}
            {activeTab === 'intelligence' && <IntelligenceView insights={insights} competitors={competitors} addToast={addToast} />}
            {activeTab === 'themes' && <ThemesView themes={themes} />}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3 flex items-center justify-around py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/50 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          {bottomNav.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center py-1.5 px-3 rounded-xl text-slate-400">
            <Menu size={20} />
            <span className="text-[10px] font-semibold mt-0.5">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
