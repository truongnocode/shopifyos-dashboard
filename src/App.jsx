import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Palette, Settings,
  BrainCircuit, Moon, Sun, Plus, Play,
  CheckCircle2, AlertCircle, Clock, MoreVertical,
  Target, Zap, Activity, Search, Filter,
  ArrowUpRight, RefreshCw, Megaphone, Share2,
  TrendingUp, ShoppingBag, Eye, ExternalLink,
  Sparkles, BarChart3, Globe, Heart, Lightbulb,
  FileText, Image, Video, Hash, Rocket,
  Store, Gem, Lamp
} from 'lucide-react';

// --- REAL DATA ---
const stores = [
  {
    id: 'heart-to-soul',
    name: 'Heart To Soul',
    domain: 'beyond-love.com',
    niche: 'Jewelry & Accessories',
    status: 'active',
    products: 48,
    gradient: 'from-rose-400 to-pink-600',
    icon: '💎',
    skills: ['optimize-products', 'ads-content-creator', 'social-content-creator']
  },
  {
    id: 'lume-vibe',
    name: 'Lume Vibe',
    domain: 'lumevibe.com',
    niche: 'LED Art & Decor',
    status: 'setup',
    products: 0,
    gradient: 'from-violet-400 to-indigo-600',
    icon: '💡',
    skills: ['optimize-products', 'ads-content-creator']
  }
];

const stats = {
  stores: stores.length,
  products: stores.reduce((sum, s) => sum + s.products, 0),
  skills: 5,
  automations: 3
};

const recentRuns = [
  { id: 1, store: 'Heart To Soul', skill: 'optimize-products', type: 'SEO Optimize', status: 'success', time: 'Last session' },
  { id: 2, store: 'Heart To Soul', skill: 'ads-content-creator', type: 'Ad Campaign Generate', status: 'success', time: '2 days ago' },
  { id: 3, store: 'Heart To Soul', skill: 'social-content-creator', type: 'Social Posts', status: 'success', time: '3 days ago' },
  { id: 4, store: 'Lume Vibe', skill: 'winning-product-hunter', type: 'Product Research', status: 'pending', time: 'Planned' },
];

const productsData = [
  { id: 1, name: 'Infinity Love Necklace', store: 'Heart To Soul', type: 'Necklace', price: '$39.99', tags: 8, images: 5, status: 'Optimized' },
  { id: 2, name: 'Eternal Bond Bracelet', store: 'Heart To Soul', type: 'Bracelet', price: '$29.99', tags: 6, images: 4, status: 'Optimized' },
  { id: 3, name: 'Soulmate Ring Set', store: 'Heart To Soul', type: 'Ring', price: '$49.99', tags: 10, images: 6, status: 'Optimized' },
  { id: 4, name: 'Heart Pendant Collection', store: 'Heart To Soul', type: 'Pendant', price: '$34.99', tags: 7, images: 3, status: 'Pending' },
  { id: 5, name: 'Promise Earrings', store: 'Heart To Soul', type: 'Earrings', price: '$24.99', tags: 5, images: 4, status: 'Pending' },
];

const skillsConfig = [
  { id: 'optimize-products', name: 'Product Optimizer', icon: Package, color: 'indigo', desc: 'AI optimize titles, descriptions, SEO, tags via Shopify API' },
  { id: 'ads-content-creator', name: 'Ads Creator', icon: Megaphone, color: 'rose', desc: 'Generate ad campaigns for Meta, Google, TikTok' },
  { id: 'social-content-creator', name: 'Social Content', icon: Share2, color: 'emerald', desc: 'Create social media posts, captions, image/video prompts' },
  { id: 'winning-product-hunter', name: 'Winning Products', icon: TrendingUp, color: 'amber', desc: 'Find trending products, spy competitor ads, micro-trends' },
  { id: 'shopify-pipeline', name: 'Pipeline Manager', icon: Rocket, color: 'purple', desc: 'Unified store management: crawl, optimize, convert, setup' },
];

const insightsData = [
  { id: 1, type: 'Trend', title: 'Personalized jewelry trending on TikTok Shop', impact: 'High', source: 'winning-product-hunter' },
  { id: 2, type: 'SEO', title: 'Heart To Soul: 12 products need meta description update', impact: 'Medium', source: 'optimize-products' },
  { id: 3, type: 'Ads', title: 'Valentine campaign CTR above industry average', impact: 'High', source: 'ads-content-creator' },
  { id: 4, type: 'Social', title: '3 posts scheduled, 2 need image prompts', impact: 'Medium', source: 'social-content-creator' },
];

// --- CORE COMPONENTS ---
const GlassCard = ({ children, className = '', noPadding = false, hoverEffect = false }) => (
  <div className={`
    relative overflow-hidden
    bg-white/40 dark:bg-slate-900/40
    backdrop-blur-3xl
    border border-white/60 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    rounded-[32px]
    ${hoverEffect ? 'hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]' : ''}
    ${noPadding ? '' : 'p-8'}
    ${className}
  `}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10"></div>
    {children}
  </div>
);

const GlassButton = ({ children, variant = 'primary', className = '', icon: Icon, onClick }) => {
  const baseStyle = "flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 active:scale-95 shadow-sm cursor-pointer";
  const variants = {
    primary: "bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-indigo-500/30 shadow-lg backdrop-blur-md border border-indigo-400/50",
    glass: "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10",
    danger: "bg-rose-500/90 hover:bg-rose-500 text-white shadow-rose-500/30 shadow-lg backdrop-blur-md border border-rose-400/50"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
};

const Badge = ({ type, text }) => {
  const styles = {
    success: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30',
    processing: 'bg-purple-100/80 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200/50 dark:border-purple-500/30',
    failed: 'bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200/50 dark:border-rose-500/30',
    pending: 'bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200/50 dark:border-amber-500/30',
    neutral: 'bg-slate-100/80 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-200/50 dark:border-slate-500/30',
    high: 'bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200/50 dark:border-rose-500/30',
    medium: 'bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200/50 dark:border-amber-500/30',
    active: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30',
    setup: 'bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200/50 dark:border-blue-500/30',
  };
  const mappedType = { 'Optimized': 'success', 'Pending': 'pending', 'Error': 'failed', 'High': 'high', 'Medium': 'medium' }[text] || type;
  return <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${styles[mappedType] || styles.neutral}`}>{text}</span>;
};

// --- VIEWS ---
const CommandCenter = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Command Center</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">ShopifyOS automation overview</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: Store, label: 'Stores', value: stats.stores, color: 'blue', badge: '2 niches' },
        { icon: Package, label: 'Products', value: stats.products, color: 'indigo', badge: null },
        { icon: Sparkles, label: 'AI Skills', value: stats.skills, color: 'purple', badge: 'Active' },
        { icon: Zap, label: 'Automations', value: stats.automations, color: 'amber', badge: 'n8n ready' },
      ].map((stat, i) => (
        <GlassCard key={i} className="flex flex-col justify-center space-y-4">
          <div className="flex items-center justify-between">
            <div className={`p-4 rounded-[1.25rem] ${
              stat.color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
              stat.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
              stat.color === 'purple' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
              'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              <stat.icon size={28} />
            </div>
            {stat.badge && <Badge type="neutral" text={stat.badge} />}
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
          </div>
        </GlassCard>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Stores */}
      <div className="lg:col-span-2 space-y-8">
        <GlassCard>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Stores</h2>
          </div>
          <div className="space-y-4">
            {stores.map((store) => (
              <div key={store.id} className="group flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[24px] border border-white/40 dark:border-white/5 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${store.gradient} flex items-center justify-center text-2xl shadow-inner`}>
                    {store.icon}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700 dark:text-slate-200 text-lg">{store.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{store.domain}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type={store.status} text={store.status === 'active' ? 'Active' : 'Setting up'} />
                      <span className="text-xs text-slate-400">{store.niche}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{store.products}</p>
                  <p className="text-xs text-slate-400">products</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Insights */}
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
              <Lightbulb className="mr-3 text-amber-500" /> Smart Insights
            </h2>
          </div>
          <div className="space-y-3">
            {insightsData.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-[20px] border border-white/40 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    insight.type === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                    insight.type === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                    insight.type === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                    'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
                  }`}>{insight.type}</span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{insight.title}</p>
                </div>
                <Badge type="neutral" text={insight.impact} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Right column */}
      <div className="space-y-8">
        {/* AI Skills */}
        <GlassCard>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">AI Skills</h2>
          <div className="space-y-3">
            {skillsConfig.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-[16px] border border-white/30 dark:border-white/5">
                <div className={`p-2.5 rounded-full ${
                  skill.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-500/20' :
                  skill.color === 'rose' ? 'bg-rose-100 dark:bg-rose-500/20' :
                  skill.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                  skill.color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/20' :
                  'bg-purple-100 dark:bg-purple-500/20'
                }`}>
                  <skill.icon size={18} className={
                    skill.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                    skill.color === 'rose' ? 'text-rose-600 dark:text-rose-400' :
                    skill.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    skill.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-purple-600 dark:text-purple-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{skill.name}</p>
                  <p className="text-xs text-slate-400 truncate">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Runs */}
        <GlassCard>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Recent Runs</h2>
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-[20px] border border-white/40 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-full ${run.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                    {run.status === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{run.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{run.store} &middot; {run.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
);

const ProductsView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Products</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Heart To Soul &middot; Shopify Admin API</p>
      </div>
      <div className="flex space-x-3">
        <GlassButton variant="glass" icon={Filter}>Filter</GlassButton>
        <GlassButton variant="primary" icon={Zap}>Bulk Optimize</GlassButton>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Optimized</p><p className="text-3xl font-bold text-emerald-600">36</p></div>
        <div className="p-4 bg-emerald-100/50 dark:bg-emerald-500/20 rounded-full"><CheckCircle2 size={24} className="text-emerald-500" /></div>
      </GlassCard>
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Pending</p><p className="text-3xl font-bold text-amber-600">12</p></div>
        <div className="p-4 bg-amber-100/50 dark:bg-amber-500/20 rounded-full"><Clock size={24} className="text-amber-500" /></div>
      </GlassCard>
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Total</p><p className="text-3xl font-bold text-indigo-600">48</p></div>
        <div className="p-4 bg-indigo-100/50 dark:bg-indigo-500/20 rounded-full"><Package size={24} className="text-indigo-500" /></div>
      </GlassCard>
    </div>

    <GlassCard className="!p-2">
      <div className="p-6 border-b border-white/40 dark:border-white/5 flex justify-between items-center">
        <div className="relative w-72">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search products..." className="w-full bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md text-slate-800 dark:text-slate-200" />
        </div>
        <Badge type="neutral" text="Heart To Soul" />
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4 pl-6">Product</th><th className="p-4">Store</th><th className="p-4">Type</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((prod) => (
              <tr key={prod.id} className="bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/50 backdrop-blur-sm transition-colors">
                <td className="p-4 pl-6 rounded-l-[24px]">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
                      <Heart size={20} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{prod.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{prod.tags} tags &middot; {prod.images} images</p>
                    </div>
                  </div>
                </td>
                <td className="p-4"><span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-300">{prod.store}</span></td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{prod.type}</td>
                <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{prod.price}</td>
                <td className="p-4"><Badge type="neutral" text={prod.status} /></td>
                <td className="p-4 pr-6 rounded-r-[24px]"><button className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-slate-600 text-slate-400 hover:text-indigo-600 transition-colors"><MoreVertical size={20} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  </div>
);

const AdsView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Ads Creator</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">AI-generated ad campaigns for Meta, Google, TikTok</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { platform: 'Meta Ads', icon: Eye, color: 'blue', desc: 'Image prompts, ad copy, targeting guides', count: '12 creatives' },
        { platform: 'Google Ads', icon: Globe, color: 'emerald', desc: 'Search ads, keyword analysis, extensions', count: '8 ads' },
        { platform: 'TikTok Ads', icon: Video, color: 'rose', desc: 'Video prompts, scripts, hook sequences', count: '5 scripts' },
      ].map((p, i) => (
        <GlassCard key={i} hoverEffect className="cursor-pointer">
          <div className={`p-4 rounded-[1.25rem] w-fit mb-4 ${
            p.color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
            p.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            <p.icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{p.platform}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{p.desc}</p>
          <Badge type="neutral" text={p.count} />
        </GlassCard>
      ))}
    </div>
    <GlassCard>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { step: '1', title: 'Research', desc: 'Analyze competitor ads & winning hooks' },
          { step: '2', title: 'Generate', desc: 'AI creates image prompts, copy, scripts' },
          { step: '3', title: 'Review', desc: 'Output saved to ~/Documents/ad-campaigns/' },
          { step: '4', title: 'Evolve', desc: 'Feed performance data back to improve' },
        ].map((s, i) => (
          <div key={i} className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-[20px] border border-white/30 dark:border-white/5 text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold text-lg">{s.step}</div>
            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{s.title}</p>
            <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  </div>
);

const SocialView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Social Content</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Multi-store social media content generation</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: FileText, label: 'Posts Generated', value: '24', color: 'indigo' },
        { icon: Image, label: 'Image Prompts', value: '18', color: 'purple' },
        { icon: Video, label: 'Video Concepts', value: '6', color: 'rose' },
        { icon: Hash, label: 'Hashtag Sets', value: '12', color: 'emerald' },
      ].map((s, i) => (
        <GlassCard key={i} className="!p-6">
          <div className={`p-3 rounded-full w-fit mb-3 ${
            s.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-500/20' :
            s.color === 'purple' ? 'bg-purple-100 dark:bg-purple-500/20' :
            s.color === 'rose' ? 'bg-rose-100 dark:bg-rose-500/20' :
            'bg-emerald-100 dark:bg-emerald-500/20'
          }`}>
            <s.icon size={20} className={
              s.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
              s.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
              s.color === 'rose' ? 'text-rose-600 dark:text-rose-400' :
              'text-emerald-600 dark:text-emerald-400'
            } />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
          <p className="text-sm text-slate-500 mt-1">{s.label}</p>
        </GlassCard>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Content Types</h2>
        <div className="space-y-3">
          {['Educational & Tips', 'Emotional & Storytelling', 'Product Showcase', 'Behind the Scenes', 'User-Generated Style', 'Seasonal & Trending'].map((type, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-[16px] border border-white/30 dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{type}</span>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Active Stores</h2>
        <div className="space-y-3">
          {stores.map((store) => (
            <div key={store.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-[20px] border border-white/40 dark:border-white/5">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{store.icon}</span>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{store.name}</p>
                  <p className="text-xs text-slate-500">{store.niche}</p>
                </div>
              </div>
              <Badge type={store.status} text={store.status === 'active' ? 'Content active' : 'Pending'} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

const WinningProductsView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Winning Products</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Product research, trend detection & competitor ads spy</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: TrendingUp, title: 'Trend Scanner', desc: 'Detect micro-trends from TikTok, Amazon, Google Trends', color: 'emerald' },
        { icon: Eye, title: 'Ads Spy', desc: 'Analyze competitor ads on Meta, TikTok, Google', color: 'blue' },
        { icon: ShoppingBag, title: 'Product Validator', desc: 'Score products by demand, competition, margin potential', color: 'amber' },
      ].map((f, i) => (
        <GlassCard key={i} hoverEffect className="cursor-pointer">
          <div className={`p-4 rounded-[1.25rem] w-fit mb-4 ${
            f.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            f.color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
            'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}>
            <f.icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{f.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
        </GlassCard>
      ))}
    </div>
    <GlassCard>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Reports Location</h2>
      <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-[20px] border border-white/30 dark:border-white/5 font-mono text-sm text-slate-600 dark:text-slate-300">
        ~/Documents/winning-product-reports/
      </div>
      <p className="text-sm text-slate-500 mt-3">Run <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">/winning-product-hunter</code> in Claude Code to generate new reports.</p>
    </GlassCard>
  </div>
);

const IntelligenceView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Intelligence</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Market analysis & competitor tracking</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center"><BrainCircuit className="mr-3 text-purple-500" /> Latest Insights</h2>
        </div>
        <div className="space-y-4">
          {insightsData.map((insight) => (
            <div key={insight.id} className="p-5 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 rounded-[24px] border border-white/40 dark:border-white/5 cursor-pointer group transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  insight.type === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                  insight.type === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                  insight.type === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                  'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
                }`}>{insight.type}</span>
                <Badge type="neutral" text={insight.impact} />
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{insight.title}</p>
              <p className="text-xs text-slate-400 mt-2">Source: {insight.source}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center"><Target className="mr-3 text-rose-500" /> Competitor Watch</h2>
        </div>
        <div className="space-y-4 mb-6">
          {[
            { domain: 'Jewelry niche competitors', stores: 'Heart To Soul', status: 'Monitoring' },
            { domain: 'LED Art niche competitors', stores: 'Lume Vibe', status: 'Planned' },
          ].map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/50 rounded-[24px] border border-white/40 dark:border-white/5">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{comp.domain}</h3>
                <p className="text-sm text-slate-500">For: {comp.stores}</p>
              </div>
              <Badge type={comp.status === 'Monitoring' ? 'success' : 'pending'} text={comp.status} />
            </div>
          ))}
        </div>
        <div className="p-4 bg-white/40 dark:bg-slate-800/40 rounded-[20px] border border-white/30 dark:border-white/5">
          <p className="text-sm text-slate-500">Run <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">/shopify-pipeline</code> for full competitor crawl & analysis.</p>
        </div>
      </GlassCard>
    </div>
  </div>
);

const ThemesView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Themes</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Liquid theme management for all stores</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'hearttosoul-liquid', store: 'Heart To Soul', status: 'Active', desc: 'Custom jewelry theme with love/soul branding' },
        { name: 'lume-vibe-liquid', store: 'Lume Vibe', status: 'In Development', desc: 'LED art showcase theme with dark aesthetic' },
      ].map((theme, i) => (
        <GlassCard key={i} hoverEffect className="cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-[1rem]">
              <Palette size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <Badge type={theme.status === 'Active' ? 'success' : 'pending'} text={theme.status} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-mono">{theme.name}</h3>
          <p className="text-sm text-slate-500 mb-2">Store: {theme.store}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{theme.desc}</p>
        </GlassCard>
      ))}
    </div>
  </div>
);

// --- MAIN APP ---
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 mb-1 rounded-full transition-all duration-300 ${active ? 'bg-white/80 dark:bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 font-medium'}`}>
    <Icon size={20} strokeWidth={active ? 2.5 : 2} /><span>{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navItems = [
    { group: 'Overview', items: [
      { id: 'command-center', icon: LayoutDashboard, label: 'Command Center' },
      { id: 'products', icon: Package, label: 'Products' },
      { id: 'themes', icon: Palette, label: 'Themes' },
    ]},
    { group: 'AI Skills', items: [
      { id: 'ads', icon: Megaphone, label: 'Ads Creator' },
      { id: 'social', icon: Share2, label: 'Social Content' },
      { id: 'winning-products', icon: TrendingUp, label: 'Winning Products' },
    ]},
    { group: 'Research', items: [
      { id: 'intelligence', icon: BrainCircuit, label: 'Intelligence' },
    ]},
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0B1120] text-slate-200' : 'bg-[#F3F4F6] text-slate-800'} relative overflow-hidden font-sans`}>
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob ${isDark ? 'bg-indigo-900/40' : 'bg-purple-200'}`}></div>
        <div className={`absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000 ${isDark ? 'bg-teal-900/30' : 'bg-cyan-200'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000 ${isDark ? 'bg-purple-900/30' : 'bg-pink-200'}`}></div>
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="my-6 ml-6 flex flex-col w-72">
          <GlassCard className="h-full flex flex-col !p-5 shadow-2xl overflow-y-auto hide-scrollbar">
            <div className="flex items-center space-x-3 mb-8 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"><Zap size={22} /></div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
            </div>

            <div className="flex-1 space-y-6">
              {navItems.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">{group.group}</p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Store switcher */}
            <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10 px-2 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Stores</p>
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-lg">{store.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{store.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{store.domain}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/40 dark:border-white/10 px-2">
              <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all border border-white/40 dark:border-white/10">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                <span className="ml-3 font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'command-center' && <CommandCenter />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'ads' && <AdsView />}
            {activeTab === 'social' && <SocialView />}
            {activeTab === 'winning-products' && <WinningProductsView />}
            {activeTab === 'intelligence' && <IntelligenceView />}
            {activeTab === 'themes' && <ThemesView />}
          </div>
        </div>
      </div>
    </div>
  );
}
