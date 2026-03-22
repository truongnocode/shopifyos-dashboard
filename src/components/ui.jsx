import React from 'react';

export const GlassCard = ({ children, className = '', noPadding = false, hoverEffect = false, onClick }) => (
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

export const GlassButton = ({ children, variant = 'primary', className = '', icon: Icon, onClick, size = 'md', disabled = false }) => {
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
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
    </button>
  );
};

export const Badge = ({ type, text }) => {
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

export const colorMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', pill: 'bg-blue-100 dark:bg-blue-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', pill: 'bg-indigo-100 dark:bg-indigo-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', pill: 'bg-purple-100 dark:bg-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', pill: 'bg-amber-100 dark:bg-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', pill: 'bg-rose-100 dark:bg-rose-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', pill: 'bg-emerald-100 dark:bg-emerald-500/20' },
};

export const LoadingSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white/30 dark:bg-slate-800/30 rounded-2xl h-20 backdrop-blur-xl border border-white/20 dark:border-white/5"></div>
      </div>
    ))}
  </div>
);
