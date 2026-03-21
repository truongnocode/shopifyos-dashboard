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
  Store, Gem, Menu, X, ChevronRight
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
  { id: 1, store: 'Heart To Soul', skill: 'optimize-products', type: 'SEO Optimize', status: 'success', time: 'Phiên trước' },
  { id: 2, store: 'Heart To Soul', skill: 'ads-content-creator', type: 'Tạo Ads', status: 'success', time: '2 ngày trước' },
  { id: 3, store: 'Heart To Soul', skill: 'social-content-creator', type: 'Social Posts', status: 'success', time: '3 ngày trước' },
  { id: 4, store: 'Lume Vibe', skill: 'winning-product-hunter', type: 'Nghiên cứu SP', status: 'pending', time: 'Dự kiến' },
];

const productsData = [
  { id: 1, name: 'Infinity Love Necklace', type: 'Necklace', price: '$39.99', tags: 8, images: 5, status: 'Optimized' },
  { id: 2, name: 'Eternal Bond Bracelet', type: 'Bracelet', price: '$29.99', tags: 6, images: 4, status: 'Optimized' },
  { id: 3, name: 'Soulmate Ring Set', type: 'Ring', price: '$49.99', tags: 10, images: 6, status: 'Optimized' },
  { id: 4, name: 'Heart Pendant Collection', type: 'Pendant', price: '$34.99', tags: 7, images: 3, status: 'Pending' },
  { id: 5, name: 'Promise Earrings', type: 'Earrings', price: '$24.99', tags: 5, images: 4, status: 'Pending' },
];

const skillsConfig = [
  { id: 'optimize-products', name: 'Product Optimizer', icon: Package, color: 'indigo', desc: 'Tối ưu title, SEO, tags qua Shopify API' },
  { id: 'ads-content-creator', name: 'Ads Creator', icon: Megaphone, color: 'rose', desc: 'Tạo chiến dịch Meta, Google, TikTok' },
  { id: 'social-content-creator', name: 'Social Content', icon: Share2, color: 'emerald', desc: 'Tạo bài đăng, caption, prompt hình/video' },
  { id: 'winning-product-hunter', name: 'Winning Products', icon: TrendingUp, color: 'amber', desc: 'Tìm SP trend, spy ads đối thủ' },
  { id: 'shopify-pipeline', name: 'Pipeline Manager', icon: Rocket, color: 'purple', desc: 'Quản lý toàn bộ: crawl, optimize, setup' },
];

const insightsData = [
  { id: 1, type: 'Trend', title: 'Personalized jewelry đang trend trên TikTok Shop', impact: 'Cao', source: 'winning-product-hunter' },
  { id: 2, type: 'SEO', title: '12 SP cần cập nhật meta description', impact: 'TB', source: 'optimize-products' },
  { id: 3, type: 'Ads', title: 'CTR chiến dịch Valentine cao hơn TB ngành', impact: 'Cao', source: 'ads-content-creator' },
  { id: 4, type: 'Social', title: '3 bài lên lịch, 2 bài cần prompt hình', impact: 'TB', source: 'social-content-creator' },
];

// --- CORE COMPONENTS ---
const GlassCard = ({ children, className = '', noPadding = false, hoverEffect = false, onClick }) => (
  <div onClick={onClick} className={`
    relative overflow-hidden
    bg-white/40 dark:bg-slate-900/40
    backdrop-blur-3xl
    border border-white/60 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    rounded-[24px] md:rounded-[32px]
    ${hoverEffect ? 'hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]' : ''}
    ${noPadding ? '' : 'p-5 md:p-8'}
    ${className}
  `}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10"></div>
    {children}
  </div>
);

const GlassButton = ({ children, variant = 'primary', className = '', icon: Icon, onClick, size = 'md' }) => {
  const baseStyle = "flex items-center justify-center space-x-2 font-medium transition-all duration-300 active:scale-95 shadow-sm cursor-pointer";
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-2xl',
    md: 'px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm',
  };
  const variants = {
    primary: "bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-indigo-500/30 shadow-lg backdrop-blur-md border border-indigo-400/50",
    glass: "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
    </button>
  );
};

const Badge = ({ type, text }) => {
  const styles = {
    success: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200/50',
    pending: 'bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200/50',
    failed: 'bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200/50',
    neutral: 'bg-slate-100/80 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-200/50',
    active: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200/50',
    setup: 'bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200/50',
  };
  const mappedType = { 'Optimized': 'success', 'Pending': 'pending', 'Cao': 'failed', 'TB': 'pending', 'High': 'failed', 'Medium': 'pending', 'Đã tối ưu': 'success', 'Đang đợi': 'pending' }[text] || type;
  return <span className={`px-3 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-sm ${styles[mappedType] || styles.neutral}`}>{text}</span>;
};

const colorMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', pill: 'bg-blue-100 dark:bg-blue-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', pill: 'bg-indigo-100 dark:bg-indigo-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', pill: 'bg-purple-100 dark:bg-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', pill: 'bg-amber-100 dark:bg-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', pill: 'bg-rose-100 dark:bg-rose-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', pill: 'bg-emerald-100 dark:bg-emerald-500/20' },
};

// --- VIEWS ---
const CommandCenter = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Trung tâm điều khiển</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">ShopifyOS &middot; Tổng quan hệ thống</p>
    </div>

    {/* Stats - 2x2 on mobile */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {[
        { icon: Store, label: 'Stores', value: stats.stores, color: 'blue', badge: '2 niches' },
        { icon: Package, label: 'Sản phẩm', value: stats.products, color: 'indigo', badge: null },
        { icon: Sparkles, label: 'AI Skills', value: stats.skills, color: 'purple', badge: 'Active' },
        { icon: Zap, label: 'Automations', value: stats.automations, color: 'amber', badge: null },
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
          { icon: Package, label: 'Tối ưu SP', color: 'indigo', skill: '/optimize-products' },
          { icon: Megaphone, label: 'Tạo Ads', color: 'rose', skill: '/ads-content-creator' },
          { icon: Share2, label: 'Social', color: 'emerald', skill: '/social-content-creator' },
          { icon: TrendingUp, label: 'Tìm SP Win', color: 'amber', skill: '/winning-product-hunter' },
          { icon: Rocket, label: 'Pipeline', color: 'purple', skill: '/shopify-pipeline' },
        ].map((action, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 md:p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/5 min-w-[80px] md:min-w-[100px] cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/40 transition-all active:scale-95">
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
      <h2 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white mb-4 md:mb-6">Cửa hàng</h2>
      <div className="space-y-3">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between p-3.5 md:p-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl md:rounded-[24px] border border-white/40 dark:border-white/5">
            <div className="flex items-center space-x-3 md:space-x-5 min-w-0">
              <div className={`w-11 h-11 md:w-14 md:h-14 rounded-2xl md:rounded-[18px] bg-gradient-to-br ${store.gradient} flex items-center justify-center text-xl md:text-2xl shadow-inner flex-shrink-0`}>
                {store.icon}
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm md:text-lg truncate">{store.name}</span>
                <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{store.domain}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge type={store.status} text={store.status === 'active' ? 'Active' : 'Đang setup'} />
                  <span className="text-[10px] md:text-xs text-slate-400 hidden sm:inline">{store.niche}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300">{store.products}</p>
              <p className="text-[10px] md:text-xs text-slate-400">SP</p>
            </div>
          </div>
        ))}
      </div>
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
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Hoạt động gần đây</h2>
        <div className="space-y-2.5">
          {recentRuns.map((run) => (
            <div key={run.id} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
              <div className={`p-2 rounded-xl flex-shrink-0 ${run.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                {run.status === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-amber-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{run.type}</p>
                <p className="text-[11px] text-slate-500">{run.store} &middot; {run.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>

    {/* Insights */}
    <GlassCard>
      <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
        <Lightbulb className="mr-2 text-amber-500" size={20} /> Nhận định thông minh
      </h2>
      <div className="space-y-2.5">
        {insightsData.map((insight) => (
          <div key={insight.id} className="flex items-center justify-between p-3 md:p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                insight.type === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                insight.type === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                insight.type === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
              }`}>{insight.type}</span>
              <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{insight.title}</p>
            </div>
            <Badge type="neutral" text={insight.impact} />
          </div>
        ))}
      </div>
    </GlassCard>
  </div>
);

const ProductsView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Sản phẩm</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Heart To Soul &middot; Shopify Admin API</p>
    </div>

    <div className="grid grid-cols-3 gap-3 md:gap-6">
      {[
        { label: 'Đã tối ưu', value: 36, icon: CheckCircle2, color: 'emerald' },
        { label: 'Đang đợi', value: 12, icon: Clock, color: 'amber' },
        { label: 'Tổng', value: 48, icon: Package, color: 'indigo' },
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
      <GlassButton variant="primary" icon={Zap} size="sm">Tối ưu hàng loạt</GlassButton>
      <GlassButton variant="glass" icon={Filter} size="sm">Lọc</GlassButton>
    </div>

    <div className="space-y-3">
      {productsData.map((prod) => (
        <GlassCard key={prod.id} className="!p-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-200 to-pink-300 dark:from-rose-800 dark:to-pink-900 flex items-center justify-center flex-shrink-0">
              <Heart size={18} className="text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm text-slate-800 dark:text-white truncate pr-2">{prod.name}</p>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-shrink-0">{prod.price}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-slate-500">{prod.type} &middot; {prod.tags} tags &middot; {prod.images} ảnh</p>
                <Badge type="neutral" text={prod.status === 'Optimized' ? 'Đã tối ưu' : 'Đang đợi'} />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const AdsView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Tạo Quảng cáo</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">AI tạo chiến dịch cho Meta, Google, TikTok</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
      {[
        { platform: 'Meta Ads', icon: Eye, color: 'blue', desc: 'Image prompts, ad copy, targeting', count: '12 creatives' },
        { platform: 'Google Ads', icon: Globe, color: 'emerald', desc: 'Search ads, keywords, extensions', count: '8 ads' },
        { platform: 'TikTok Ads', icon: Video, color: 'rose', desc: 'Video prompts, scripts, hooks', count: '5 scripts' },
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
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quy trình</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { step: '1', title: 'Nghiên cứu', desc: 'Phân tích ads đối thủ' },
          { step: '2', title: 'Tạo nội dung', desc: 'AI tạo prompt, copy, script' },
          { step: '3', title: 'Xuất file', desc: 'Lưu vào ~/Documents/' },
          { step: '4', title: 'Tự tiến hóa', desc: 'Học từ kết quả thực tế' },
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

const SocialView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Social Content</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Tạo nội dung đa nền tảng</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {[
        { icon: FileText, label: 'Bài đăng', value: '24', color: 'indigo' },
        { icon: Image, label: 'Prompt hình', value: '18', color: 'purple' },
        { icon: Video, label: 'Video concepts', value: '6', color: 'rose' },
        { icon: Hash, label: 'Hashtag sets', value: '12', color: 'emerald' },
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
          {stores.map((store) => (
            <div key={store.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{store.icon}</span>
                <div>
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{store.name}</p>
                  <p className="text-[11px] text-slate-500">{store.niche}</p>
                </div>
              </div>
              <Badge type={store.status} text={store.status === 'active' ? 'Đang chạy' : 'Chờ'} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

const WinningProductsView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Săn SP Win</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Nghiên cứu SP, phát hiện trend, spy ads</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
      {[
        { icon: TrendingUp, title: 'Quét Trend', desc: 'Phát hiện micro-trends từ TikTok, Amazon, Google', color: 'emerald' },
        { icon: Eye, title: 'Spy Ads', desc: 'Phân tích ads đối thủ trên Meta, TikTok, Google', color: 'blue' },
        { icon: ShoppingBag, title: 'Chấm điểm SP', desc: 'Score theo demand, cạnh tranh, biên lợi', color: 'amber' },
      ].map((f, i) => (
        <GlassCard key={i} hoverEffect className="cursor-pointer !p-5">
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
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Báo cáo</h2>
      <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5 font-mono text-xs md:text-sm text-slate-600 dark:text-slate-300">
        ~/Documents/winning-product-reports/
      </div>
      <p className="text-xs text-slate-500 mt-2">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/winning-product-hunter</code> trong Claude Code.</p>
    </GlassCard>
  </div>
);

const IntelligenceView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Intelligence</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Phân tích thị trường & theo dõi đối thủ</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      <GlassCard>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
          <BrainCircuit className="mr-2 text-purple-500" size={20} /> Nhận định mới
        </h2>
        <div className="space-y-3">
          {insightsData.map((insight) => (
            <div key={insight.id} className="p-3.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
              <div className="flex justify-between items-start mb-1.5">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  insight.type === 'Trend' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                  insight.type === 'SEO' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                  insight.type === 'Ads' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' :
                  'bg-purple-100 dark:bg-purple-500/20 text-purple-600'
                }`}>{insight.type}</span>
                <Badge type="neutral" text={insight.impact} />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-2">{insight.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">Nguồn: {insight.source}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-4">
          <Target className="mr-2 text-rose-500" size={20} /> Theo dõi đối thủ
        </h2>
        <div className="space-y-3 mb-4">
          {[
            { domain: 'Niche Jewelry', stores: 'Heart To Soul', status: 'Đang theo' },
            { domain: 'Niche LED Art', stores: 'Lume Vibe', status: 'Dự kiến' },
          ].map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-white/5">
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">{comp.domain}</h3>
                <p className="text-xs text-slate-500">Cho: {comp.stores}</p>
              </div>
              <Badge type={comp.status === 'Đang theo' ? 'success' : 'pending'} text={comp.status} />
            </div>
          ))}
        </div>
        <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-white/5">
          <p className="text-xs text-slate-500">Chạy <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono">/shopify-pipeline</code> để crawl & phân tích.</p>
        </div>
      </GlassCard>
    </div>
  </div>
);

const ThemesView = () => (
  <div className="space-y-6 md:space-y-8 animate-fade-in">
    <div>
      <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Themes</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-lg">Quản lý Liquid theme</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
      {[
        { name: 'hearttosoul-liquid', store: 'Heart To Soul', status: 'Active', desc: 'Theme jewelry với branding love/soul' },
        { name: 'lume-vibe-liquid', store: 'Lume Vibe', status: 'Đang phát triển', desc: 'Theme LED art với dark aesthetic' },
      ].map((theme, i) => (
        <GlassCard key={i} hoverEffect className="cursor-pointer !p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
              <Palette size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <Badge type={theme.status === 'Active' ? 'success' : 'pending'} text={theme.status} />
          </div>
          <h3 className="text-base md:text-xl font-bold text-slate-800 dark:text-white mb-1 font-mono">{theme.name}</h3>
          <p className="text-xs text-slate-500 mb-1">Store: {theme.store}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{theme.desc}</p>
        </GlassCard>
      ))}
    </div>
  </div>
);

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
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-2.5 rounded-xl">
                  <span className="text-lg">{store.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{store.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{store.domain}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
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
