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
  { id: 1, store: { name: 'Heart To Soul' }, runType: 'SEO Optimize', status: 'success', startedAt: 'Phi\u00EAn tr\u01B0\u1EDBc' },
  { id: 2, store: { name: 'Heart To Soul' }, runType: 'T\u1EA1o Ads', status: 'success', startedAt: '2 ng\u00E0y tr\u01B0\u1EDBc' },
  { id: 3, store: { name: 'Heart To Soul' }, runType: 'Social Posts', status: 'success', startedAt: '3 ng\u00E0y tr\u01B0\u1EDBc' },
  { id: 4, store: { name: 'Lume Vibe' }, runType: 'Nghi\u00EAn c\u1EE9u SP', status: 'pending', startedAt: 'D\u1EF1 ki\u1EBFn' },
];

const fallbackInsights = [
  { id: 1, category: 'Trend', title: 'Personalized jewelry \u0111ang trend tr\u00EAn TikTok Shop', relevance: 'Cao', discoveredAt: null },
  { id: 2, category: 'SEO', title: '12 SP c\u1EA7n c\u1EADp nh\u1EADt meta description', relevance: 'TB', discoveredAt: null },
  { id: 3, category: 'Ads', title: 'CTR chi\u1EBFn d\u1ECBch Valentine cao h\u01A1n TB ng\u00E0nh', relevance: 'Cao', discoveredAt: null },
  { id: 4, category: 'Social', title: '3 b\u00E0i l\u00EAn l\u1ECBch, 2 b\u00E0i c\u1EA7n prompt h\u00ECnh', relevance: 'TB', discoveredAt: null },
];

const fallbackCompetitors = [
  { id: 1, domain: 'Niche Jewelry', name: 'Heart To Soul', productCount: 0, lastCrawledAt: null, niche: { name: 'Jewelry' }, status: '\u0110ang theo' },
  { id: 2, domain: 'Niche LED Art', name: 'Lume Vibe', productCount: 0, lastCrawledAt: null, niche: { name: 'LED Art' }, status: 'D\u1EF1 ki\u1EBFn' },
];

const fallbackThemes = [
  { id: 1, versionName: 'hearttosoul-liquid', sourceType: 'custom', status: 'Active', store: { name: 'Heart To Soul' }, desc: 'Theme jewelry v\u1EDBi branding love/soul' },
  { id: 2, versionName: 'lume-vibe-liquid', sourceType: 'custom', status: '\u0110ang ph\u00E1t tri\u1EC3n', store: { name: 'Lume Vibe' }, desc: 'Theme LED art v\u1EDBi dark aesthetic' },
];

const skillsConfig = [
  { id: 'optimize-products', name: 'Product Optimizer', icon: Package, color: 'indigo', desc: 'T\u1ED1i \u01B0u title, SEO, tags qua Shopify API' },
  { id: 'ads-content-creator', name: 'Ads Creator', icon: Megaphone, color: 'rose', desc: 'T\u1EA1o chi\u1EBFn d\u1ECBch Meta, Google, TikTok' },
  { id: 'social-content-creator', name: 'Social Content', icon: Share2, color: 'emerald', desc: 'T\u1EA1o b\u00E0i \u0111\u0103ng, caption, prompt h\u00ECnh/video' },
  { id: 'winning-product-hunter', name: 'Winning Products', icon: TrendingUp, color: 'amber', desc: 'T\u00ECm SP trend, spy ads \u0111\u1ED1i th\u1EE7' },
  { id: 'shopify-pipeline', name: 'Pipeline Manager', icon: Rocket, color: 'purple', desc: 'Qu\u1EA3n l\u00FD to\u00E0n b\u1ED9: crawl, optimize, setup' },
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
    addToast(`\u0110ang ch\u1EA1y ${label}...`, 'info');
    try {
      if (action === 'optimize') {
        await api.optimizeStore(storeList[0]?.id);
      } else if (action === 'sync') {
        await api.syncStore(storeList[0]?.id);
      }
      addToast(`${label} ho\u00E0n t\u1EA5t!`, 'success');
      runs.refetch();
    } catch (e) {
      addToast(`L\u1ED7i: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Trung t\u00E2m \u0111i\u1EC1u khi\u1EC3n</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">ShopifyOS &middot; T\u1ED5ng quan h\u1EC7 th\u1ED1ng</p>
        </div>
        <button onClick={() => { dashboard.refetch(); stores.refetch(); runs.refetch(); insights.refetch(); }} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${dashboard.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: Store, label: 'Stores', value: dashData.stores, color: 'blue', badge: `${storeList.length} niches` },
          { icon: Package, label: 'S\u1EA3n ph\u1EA9m', value: dashData.productCount, color: 'indigo', badge: null },
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
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Thao t\u00E1c nhanh</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { icon: Package, label: 'T\u1ED1i \u01B0u SP', color: 'indigo', action: () => handleQuickAction('optimize', 'T\u1ED1i \u01B0u SP') },
            { icon: Megaphone, label: 'T\u1EA1o Ads', color: 'rose', action: () => addToast('M\u1EDF Claude Code v\u00E0 ch\u1EA1y /ads-content-creator', 'info') },
            { icon: Share2, label: 'Social', color: 'emerald', action: () => addToast('M\u1EDF Claude Code v\u00E0 ch\u1EA1y /social-content-creator', 'info') },
            { icon: TrendingUp, label: 'T\u00ECm SP Win', color: 'amber', action: () => addToast('M\u1EDF Claude Code v\u00E0 ch\u1EA1y /winning-product-hunter', 'info') },
            { icon: Rocket, label: 'Pipeline', color: 'purple', action: () => addToast('M\u1EDF Claude Code v\u00E0 ch\u1EA1y /shopify-pipeline', 'info') },
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
        <SectionHeader title="C\u1EEDa h\u00E0ng" onRefresh={stores.refetch} loading={stores.loading} />
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
                      <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? 'Active' : '\u0110ang setup'} />
                      <span className="text-[10px] md:text-xs text-slate-400 hidden sm:inline">{store.niche?.name || store.niche}</span>
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
          <SectionHeader title="Ho\u1EA1t \u0111\u1ED9ng g\u1EA7n \u0111\u00E2y" onRefresh={runs.refetch} loading={runs.loading} />
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
            <Lightbulb className="mr-2 text-amber-500" size={20} /> Nh\u1EADn \u0111\u1ECBnh th\u00F4ng minh
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
    addToast('\u0110ang t\u1ED1i \u01B0u h\u00E0ng lo\u1EA1t...', 'info');
    try {
      await api.optimizeStore();
      addToast('T\u1ED1i \u01B0u ho\u00E0n t\u1EA5t!', 'success');
      products.refetch();
    } catch (e) {
      addToast(`L\u1ED7i: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">S\u1EA3n ph\u1EA9m</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Heart To Soul &middot; Shopify Admin API</p>
        </div>
        <button onClick={products.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${products.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {[
          { label: '\u0110\u00E3 t\u1ED1i \u01B0u', value: optimized, icon: CheckCircle2, color: 'emerald' },
          { label: '\u0110ang \u0111\u1EE3i', value: pending, icon: Clock, color: 'amber' },
          { label: 'T\u1ED5ng', value: productList.length, icon: Package, color: 'indigo' },
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
        <GlassButton variant="primary" icon={Zap} size="sm" onClick={handleBulkOptimize}>T\u1ED1i \u01B0u h\u00E0ng lo\u1EA1t</GlassButton>
        <GlassButton variant="glass" icon={Filter} size="sm">L\u1ECDc</GlassButton>
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
                    <p className="text-[11px] text-slate-500">{prod.productType || prod.type} &middot; {typeof prod.tags === 'number' ? prod.tags : Array.isArray(prod.tags) ? prod.tags.length : 0} tags &middot; {prod.imageCount || prod.images} \u1EA3nh</p>
                    <Badge type="neutral" text={prod.lastOptimizedAt ? '\u0110\u00E3 t\u1ED1i \u01B0u' : '\u0110ang \u0111\u1EE3i'} />
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
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">T\u1EA1o Qu\u1EA3ng c\u00E1o</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">AI t\u1EA1o chi\u1EBFn d\u1ECBch cho Meta, Google, TikTok</p>
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

      <GlassCard>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quy tr\u00ECnh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: '1', title: 'Nghi\u00EAn c\u1EE9u', desc: 'Ph\u00E2n t\u00EDch ads \u0111\u1ED1i th\u1EE7' },
            { step: '2', title: 'T\u1EA1o n\u1ED9i dung', desc: 'AI t\u1EA1o prompt, copy, script' },
            { step: '3', title: 'Xu\u1EA5t file', desc: 'L\u01B0u v\u00E0o ~/Documents/' },
            { step: '4', title: 'T\u1EF1 ti\u1EBFn h\u00F3a', desc: 'H\u1ECDc t\u1EEB k\u1EBFt qu\u1EA3 th\u1EF1c t\u1EBF' },
          ].map((s, i) => (
            <div key={i} className="p-3 md:p-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5 text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 font-bold text-sm md:text-lg">{s.step}</div>
              <p className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm">{s.title}</p>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
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
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">T\u1EA1o n\u1ED9i dung \u0111a n\u1EC1n t\u1EA3ng</p>
        </div>
        <button onClick={skillOutputs.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${skillOutputs.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { icon: FileText, label: 'B\u00E0i \u0111\u0103ng', value: outputs.filter(o => o.outputType === 'post').length || '24', color: 'indigo' },
          { icon: Image, label: 'Prompt h\u00ECnh', value: outputs.filter(o => o.outputType === 'image_prompt').length || '18', color: 'purple' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Lo\u1EA1i n\u1ED9i dung</h2>
          <div className="space-y-2">
            {['Gi\u00E1o d\u1EE5c & Tips', 'C\u1EA3m x\u00FAc & Storytelling', 'Gi\u1EDBi thi\u1EC7u SP', 'H\u1EADu tr\u01B0\u1EDDng', 'Phong c\u00E1ch UGC', 'Theo m\u00F9a & Trending'].map((type, i) => (
              <div key={i} className="flex items-center space-x-3 p-2.5 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/30 dark:border-white/5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">{type}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Stores \u0111ang ho\u1EA1t \u0111\u1ED9ng</h2>
          <div className="space-y-3">
            {storeList.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{store.icon || '\u{1F3EA}'}</span>
                  <div>
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{store.name}</p>
                    <p className="text-[11px] text-slate-500">{store.niche?.name || store.niche}</p>
                  </div>
                </div>
                <Badge type={store.isActive ? 'active' : 'setup'} text={store.isActive ? '\u0110ang ch\u1EA1y' : 'Ch\u1EDD'} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const WinningProductsView = ({ competitors, addToast }) => {
  const competitorList = competitors.data || fallbackCompetitors;

  const handleCrawl = async () => {
    addToast('\u0110ang crawl \u0111\u1ED1i th\u1EE7...', 'info');
    try {
      await api.crawlCompetitor('', competitorList[0]?.id);
      addToast('Crawl ho\u00E0n t\u1EA5t!', 'success');
      competitors.refetch();
    } catch (e) {
      addToast(`L\u1ED7i: ${e.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">S\u0103n SP Win</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Nghi\u00EAn c\u1EE9u SP, ph\u00E1t hi\u1EC7n trend, spy ads</p>
        </div>
        <button onClick={competitors.refetch} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${competitors.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          { icon: TrendingUp, title: 'Qu\u00E9t Trend', desc: 'Ph\u00E1t hi\u1EC7n micro-trends t\u1EEB TikTok, Amazon, Google', color: 'emerald' },
          { icon: Eye, title: 'Spy Ads', desc: 'Ph\u00E2n t\u00EDch ads \u0111\u1ED1i th\u1EE7 tr\u00EAn Meta, TikTok, Google', color: 'blue' },
          { icon: ShoppingBag, title: 'Ch\u1EA5m \u0111i\u1EC3m SP', desc: 'Score theo demand, c\u1EA1nh tranh, bi\u00EAn l\u1EE3i', color: 'amber' },
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

      <GlassCard>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">B\u00E1o c\u00E1o</h2>
        <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5 font-mono text-xs md:text-sm text-slate-600 dark:text-slate-300">
          ~/Documents/winning-product-reports/
        </div>
        <p className="text-xs text-slate-500 mt-2">Ch\u1EA1y <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/winning-product-hunter</code> trong Claude Code.</p>
      </GlassCard>
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
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Ph\u00E2n t\u00EDch th\u1ECB tr\u01B0\u1EDDng & theo d\u00F5i \u0111\u1ED1i th\u1EE7</p>
        </div>
        <button onClick={() => { insights.refetch(); competitors.refetch(); }} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
          <RefreshCw size={18} className={`text-slate-500 dark:text-slate-400 ${insights.loading || competitors.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <BrainCircuit className="mr-2 text-purple-500" size={20} /> Nh\u1EADn \u0111\u1ECBnh m\u1EDBi
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
                  <p className="text-[10px] text-slate-400 mt-1">Ngu\u1ED3n: {insight.source || insight.category}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
        <GlassCard>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
            <Target className="mr-2 text-rose-500" size={20} /> Theo d\u00F5i \u0111\u1ED1i th\u1EE7
          </h2>
          {competitors.loading ? <LoadingSkeleton count={2} /> : (
            <div className="space-y-3 mb-4">
              {competitorList.map((comp, idx) => (
                <div key={comp.id || idx} className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white">{comp.domain}</h3>
                    <p className="text-xs text-slate-500">Cho: {comp.name}</p>
                  </div>
                  <Badge type={comp.lastCrawledAt || comp.status === '\u0110ang theo' ? 'success' : 'pending'} text={comp.lastCrawledAt ? '\u0110ang theo' : (comp.status || 'D\u1EF1 ki\u1EBFn')} />
                </div>
              ))}
            </div>
          )}
          <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5">
            <p className="text-xs text-slate-500">Ch\u1EA1y <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/shopify-pipeline</code> \u0111\u1EC3 crawl & ph\u00E2n t\u00EDch.</p>
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
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Qu\u1EA3n l\u00FD Liquid theme</p>
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

  // Use fallback stores for sidebar
  const sidebarStores = stores.data || fallbackStores;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navItems = [
    { group: 'T\u1ED5ng quan', items: [
      { id: 'command-center', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'products', icon: Package, label: 'S\u1EA3n ph\u1EA9m' },
      { id: 'themes', icon: Palette, label: 'Themes' },
    ]},
    { group: 'AI Skills', items: [
      { id: 'ads', icon: Megaphone, label: 'T\u1EA1o Ads' },
      { id: 'social', icon: Share2, label: 'Social' },
      { id: 'winning-products', icon: TrendingUp, label: 'S\u0103n SP Win' },
    ]},
    { group: 'Nghi\u00EAn c\u1EE9u', items: [
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
                <span className="ml-2 text-sm font-medium">{isDark ? 'S\u00E1ng' : 'T\u1ED1i'}</span>
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
            {activeTab === 'winning-products' && <WinningProductsView competitors={competitors} addToast={addToast} />}
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
