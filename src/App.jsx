import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, DownloadCloud, Palette,
  Settings, BrainCircuit, History, BookOpen,
  Hash, Radio, FileText, Moon, Sun,
  Plus, Play, CheckCircle2, AlertCircle, Clock,
  MoreVertical, Target, Zap, Activity,
  Search, Filter, ArrowUpRight, RefreshCw
} from 'lucide-react';

// --- MOCK DATA ---
const stats = { stores: 12, products: 1450, queue: 24, insights: 8 };

const niches = [
  { name: 'Jewelry', stores: ['Aura Gems', 'Lumina Rings'] },
  { name: 'Tech Gadgets', stores: ['Gizmo Hub', 'Future Tech', 'SmartHome Pro'] },
  { name: 'Pet Supplies', stores: ['Happy Paws'] }
];

const recentRuns = [
  { id: 1, store: 'Aura Gems', type: 'SEO Optimize', status: 'success', time: '10 mins ago' },
  { id: 2, store: 'Gizmo Hub', type: 'Image Resize', status: 'processing', time: 'In progress' },
  { id: 3, store: 'Future Tech', type: 'Tag Cleanup', status: 'failed', time: '1 hour ago' },
];

const productsData = [
  { id: 1, name: 'Minimalist Gold Ring', store: 'Aura Gems', type: 'Ring', price: '$45.00', tags: 12, images: 4, status: 'Optimized', lastRun: 'Today, 09:00' },
  { id: 2, name: 'Smart Watch Series X', store: 'Gizmo Hub', type: 'Electronics', price: '$120.00', tags: 5, images: 2, status: 'Pending', lastRun: '-' },
  { id: 3, name: 'Orthopedic Dog Bed', store: 'Happy Paws', type: 'Pet Bed', price: '$65.00', tags: 8, images: 5, status: 'Optimized', lastRun: 'Yesterday' },
  { id: 4, name: 'Wireless Earbuds', store: 'Future Tech', type: 'Audio', price: '$35.00', tags: 15, images: 3, status: 'Error', lastRun: '2 days ago' },
  { id: 5, name: 'Crystal Pendant', store: 'Aura Gems', type: 'Necklace', price: '$85.00', tags: 10, images: 6, status: 'Optimized', lastRun: 'Today, 10:30' },
];

const insightsData = [
  { id: 1, type: 'Trend', title: 'Search spike for "round face smartwatch"', impact: 'High', time: '2 hours ago', icon: <ArrowUpRight size={18} className="text-emerald-500" /> },
  { id: 2, type: 'Competitor', title: 'Competitor "TechHaven" just added 50 new products', impact: 'Medium', time: '5 hours ago', icon: <Target size={18} /> },
  { id: 3, type: 'SEO', title: 'Keyword opportunity: "blue gemstone silver ring"', impact: 'High', time: '1 day ago', icon: <Search size={18} /> },
];

const competitorsData = [
  { domain: 'techhaven.com', niche: 'Tech Gadgets', products: 2400, change: '+50 prods', lastCrawl: 'Today' },
  { domain: 'shinythings.co', niche: 'Jewelry', products: 850, change: 'Price updated', lastCrawl: 'Yesterday' },
  { domain: 'pawparadise.net', niche: 'Pet Supplies', products: 1200, change: 'No change', lastCrawl: '3 days ago' },
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

const GlassButton = ({ children, variant = 'primary', className = '', icon: Icon }) => {
  const baseStyle = "flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 active:scale-95 shadow-sm";
  const variants = {
    primary: "bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-indigo-500/30 shadow-lg backdrop-blur-md border border-indigo-400/50",
    glass: "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10",
    danger: "bg-rose-500/90 hover:bg-rose-500 text-white shadow-rose-500/30 shadow-lg backdrop-blur-md border border-rose-400/50"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`}>
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
  };
  const mappedType = { 'Optimized': 'success', 'Pending': 'pending', 'Error': 'failed', 'High': 'high', 'Medium': 'medium' }[text] || type;
  return <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${styles[mappedType] || styles.neutral}`}>{text}</span>;
};

// --- VIEWS ---
const CommandCenter = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Command Center</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Overview of your entire ShopifyOS system.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GlassCard className="flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-[1.25rem]"><LayoutDashboard size={28} /></div>
          <Badge type="neutral" text="+2 this month" />
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.stores}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Total Stores</p>
        </div>
      </GlassCard>
      <GlassCard className="flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-[1.25rem]"><Package size={28} /></div>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.products.toLocaleString()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Managed Products</p>
        </div>
      </GlassCard>
      <GlassCard className="flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-[1.25rem]"><Clock size={28} /></div>
          <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.queue}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Import Queue</p>
        </div>
      </GlassCard>
      <GlassCard className="flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-[1.25rem]"><BrainCircuit size={28} /></div>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.insights}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Smart Insights</p>
        </div>
      </GlassCard>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <GlassCard>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Store Management</h2>
            <div className="flex space-x-3">
              <GlassButton variant="glass" className="!px-4 !py-2"><Filter size={18} className="mr-2" /> Filter</GlassButton>
              <GlassButton variant="primary" icon={Plus} className="!px-4 !py-2">Add New</GlassButton>
            </div>
          </div>
          <div className="space-y-6">
            {niches.map((niche, idx) => (
              <div key={idx} className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-[24px] p-6 border border-white/40 dark:border-white/5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-3">
                    <div className="p-2 bg-white/50 dark:bg-slate-700/50 rounded-full shadow-sm"><Target size={20} className="text-indigo-500" /></div>
                    <span>Niche: {niche.name}</span>
                  </h3>
                  <Badge type="neutral" text={`${niche.stores.length} stores`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {niche.stores.map((store, sIdx) => (
                    <div key={sIdx} className="group flex items-center justify-between p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[20px] border border-white/60 dark:border-white/10 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">{store.charAt(0)}</div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-200 text-lg">{store}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Active</span>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={20} /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-8">
        <GlassCard>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: DownloadCloud, color: 'blue', label: 'Import CSV' },
              { icon: Zap, color: 'amber', label: 'Run Optimize' },
              { icon: Radio, color: 'emerald', label: 'Crawl' },
              { icon: Palette, color: 'purple', label: 'Themes' }
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-[24px] border border-white/60 dark:border-white/10 shadow-sm transition-all group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${
                  action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/20' :
                  action.color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/20' :
                  action.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                  'bg-purple-100 dark:bg-purple-500/20'
                }`}>
                  <action.icon size={24} className={
                    action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    action.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    action.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-purple-600 dark:text-purple-400'
                  } />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{action.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Runs</h2>
            <button className="text-sm text-indigo-500 hover:text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full">View all</button>
          </div>
          <div className="space-y-4">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-[20px] border border-white/40 dark:border-white/5">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${run.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' : run.status === 'processing' ? 'bg-purple-100 dark:bg-purple-500/20' : 'bg-rose-100 dark:bg-rose-500/20'}`}>
                    {run.status === 'success' && <CheckCircle2 size={20} className="text-emerald-500" />}
                    {run.status === 'processing' && <RefreshCw size={20} className="text-purple-500 animate-spin" />}
                    {run.status === 'failed' && <AlertCircle size={20} className="text-rose-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{run.type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{run.store} - {run.time}</p>
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
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage and optimize your product catalog.</p>
      </div>
      <div className="flex space-x-3">
        <GlassButton variant="glass" icon={Filter}>Filter</GlassButton>
        <GlassButton variant="primary" icon={Zap}>Bulk Optimize</GlassButton>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Optimized</p><p className="text-3xl font-bold text-emerald-600">1,204</p></div>
        <div className="p-4 bg-emerald-100/50 dark:bg-emerald-500/20 rounded-full"><CheckCircle2 size={24} className="text-emerald-500" /></div>
      </GlassCard>
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Pending</p><p className="text-3xl font-bold text-amber-600">246</p></div>
        <div className="p-4 bg-amber-100/50 dark:bg-amber-500/20 rounded-full"><Clock size={24} className="text-amber-500" /></div>
      </GlassCard>
      <GlassCard className="!p-6 flex items-center justify-between">
        <div><p className="text-sm text-slate-500 font-medium mb-1">Errors</p><p className="text-3xl font-bold text-rose-600">12</p></div>
        <div className="p-4 bg-rose-100/50 dark:bg-rose-500/20 rounded-full"><AlertCircle size={24} className="text-rose-500" /></div>
      </GlassCard>
    </div>

    <GlassCard className="!p-2">
      <div className="p-6 border-b border-white/40 dark:border-white/5 flex justify-between items-center">
        <div className="relative w-72">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search products..." className="w-full bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md text-slate-800 dark:text-slate-200" />
        </div>
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
                <td className="p-4 pl-6 rounded-l-[24px]"><div className="flex items-center space-x-4"><div className="w-12 h-12 rounded-[16px] bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0"><Package size={20} className="text-slate-400" /></div><div><p className="font-bold text-slate-800 dark:text-white">{prod.name}</p><p className="text-xs text-slate-500 mt-1">{prod.tags} tags - {prod.images} images</p></div></div></td>
                <td className="p-4"><span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">{prod.store}</span></td>
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

const IntelligenceView = () => (
  <div className="space-y-8 animate-fade-in pb-10">
    <div>
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">Intelligence</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Market analysis, trends, and competitor tracking.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center"><BrainCircuit className="mr-3 text-purple-500" /> Latest Insights</h2>
          <Badge type="neutral" text="This week" />
        </div>
        <div className="space-y-4">
          {insightsData.map((insight) => (
            <div key={insight.id} className="p-5 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 rounded-[24px] border border-white/40 dark:border-white/5 cursor-pointer group transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2"><span className="p-2 bg-white/60 dark:bg-slate-700/60 rounded-full">{insight.icon}</span><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{insight.type}</span></div>
                <Badge type="neutral" text={insight.impact} />
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{insight.title}</p>
              <p className="text-sm text-slate-500 mt-2">{insight.time}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center"><Target className="mr-3 text-rose-500" /> Tracked Competitors</h2>
          <GlassButton variant="glass" className="!p-3 !py-2"><Plus size={18} /></GlassButton>
        </div>
        <div className="space-y-4">
          {competitorsData.map((comp, idx) => (
            <div key={idx} className="flex flex-col p-5 bg-white/50 dark:bg-slate-800/50 rounded-[24px] border border-white/40 dark:border-white/5">
              <div className="flex justify-between items-center mb-4">
                <div><h3 className="text-lg font-bold text-slate-800 dark:text-white">{comp.domain}</h3><p className="text-sm text-slate-500">{comp.niche}</p></div>
                <div className="text-right"><p className="text-xl font-bold text-slate-700 dark:text-slate-300">{comp.products}</p><p className="text-xs text-slate-400">Products</p></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-900/60 rounded-[16px]">
                <span className="text-sm font-medium text-emerald-600 flex items-center"><ArrowUpRight size={16} className="mr-1" /> {comp.change}</span>
                <span className="text-xs text-slate-500">Updated: {comp.lastCrawl}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

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
        <div className={`my-6 ml-6 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-72' : 'w-24'}`}>
          <GlassCard className="h-full flex flex-col !p-5 shadow-2xl overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-8 px-2">
              {sidebarOpen ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"><Zap size={22} /></div>
                  <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">ShopifyOS</span>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg"><Zap size={22} /></div>
              )}
            </div>

            <div className="flex-1 space-y-8">
              <div>
                {sidebarOpen && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">ShopifyOS</p>}
                <div className="space-y-1">
                  <SidebarItem icon={LayoutDashboard} label={sidebarOpen ? "Command Center" : ""} active={activeTab === 'command-center'} onClick={() => setActiveTab('command-center')} />
                  <SidebarItem icon={Package} label={sidebarOpen ? "Products" : ""} active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                  <SidebarItem icon={DownloadCloud} label={sidebarOpen ? "Import" : ""} active={activeTab === 'import'} onClick={() => setActiveTab('import')} />
                  <SidebarItem icon={Palette} label={sidebarOpen ? "Themes" : ""} active={activeTab === 'themes'} onClick={() => setActiveTab('themes')} />
                  <SidebarItem icon={Settings} label={sidebarOpen ? "Store Setup" : ""} active={activeTab === 'store-setup'} onClick={() => setActiveTab('store-setup')} />
                  <SidebarItem icon={BrainCircuit} label={sidebarOpen ? "Intelligence" : ""} active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} />
                </div>
              </div>
              <div>
                {sidebarOpen && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Social Media</p>}
                <div className="space-y-1">
                  <SidebarItem icon={Activity} label={sidebarOpen ? "Overview" : ""} active={activeTab === 'social-overview'} onClick={() => setActiveTab('social-overview')} />
                  <SidebarItem icon={Hash} label={sidebarOpen ? "Topics & Brands" : ""} active={activeTab === 'social-topics'} onClick={() => setActiveTab('social-topics')} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/40 dark:border-white/10 space-y-3 px-2">
              <button onClick={() => setIsDark(!isDark)} className="w-full flex items-center justify-center p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all border border-white/40 dark:border-white/10">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                {sidebarOpen && <span className="ml-3 font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'command-center' && <CommandCenter />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'intelligence' && <IntelligenceView />}

            {['import', 'themes', 'store-setup', 'social-overview', 'social-topics'].includes(activeTab) && (
              <div className="h-full flex items-center justify-center animate-fade-in">
                <GlassCard className="text-center max-w-md w-full !p-12">
                  <div className="w-24 h-24 bg-white/50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><LayoutDashboard size={40} className="text-slate-400" /></div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 capitalize">{activeTab.replace(/-/g, ' ')}</h3>
                  <p className="text-slate-500">This feature is under development.</p>
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
