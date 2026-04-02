import React from 'react';

// macOS 26 Liquid Glass Design System

export const GlassCard = ({ children, className = '', noPadding = false, hoverEffect = false, onClick }) => (
  <div onClick={onClick} className={`
    relative overflow-hidden
    bg-white/[0.15] dark:bg-slate-900/[0.2]
    backdrop-blur-[12px] backdrop-saturate-[180%]
    border border-white/20 dark:border-white/[0.08]
    shadow-[0_8px_32px_rgba(31,38,135,0.12),inset_0_2px_8px_rgba(255,255,255,0.2)]
    dark:shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_4px_rgba(255,255,255,0.04)]
    rounded-[22px]
    ${hoverEffect ? 'hover:bg-white/[0.22] dark:hover:bg-slate-800/[0.28] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(31,38,135,0.18)]' : ''}
    ${noPadding ? '' : 'p-5 md:p-7'}
    ${className}
  `}>
    <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/[0.06]"></div>
    {children}
  </div>
);

export const GlassButton = ({ children, variant = 'primary', className = '', icon: Icon, onClick, size = 'md', disabled = false }) => {
  const baseStyle = "flex items-center justify-center space-x-2 font-medium transition-all duration-200 active:scale-[0.97] cursor-pointer";
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-[16px]',
    md: 'px-5 py-2.5 md:px-6 md:py-3 rounded-[18px] text-sm',
  };
  const variants = {
    primary: "bg-indigo-600/85 hover:bg-indigo-600/95 text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] backdrop-blur-[8px] border border-indigo-400/30",
    glass: "bg-white/[0.15] dark:bg-slate-800/[0.2] hover:bg-white/[0.25] dark:hover:bg-slate-700/[0.3] text-slate-700 dark:text-slate-200 backdrop-blur-[8px] backdrop-saturate-[180%] border border-white/20 dark:border-white/[0.08]",
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
    success: 'bg-emerald-100/60 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200/30',
    pending: 'bg-amber-100/60 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200/30',
    failed: 'bg-rose-100/60 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border-rose-200/30',
    neutral: 'bg-slate-100/60 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 border-slate-200/30',
    active: 'bg-emerald-100/60 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200/30',
    setup: 'bg-blue-100/60 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-blue-200/30',
  };
  const mappedType = { 'Optimized': 'success', 'Pending': 'pending', 'Cao': 'failed', 'TB': 'pending', 'High': 'failed', 'Medium': 'pending', 'Đã tối ưu': 'success', 'Đang đợi': 'pending', 'Hoạt động': 'active' }[text] || type;
  return <span className={`px-3 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-[4px] ${styles[mappedType] || styles.neutral}`}>{text}</span>;
};

export const colorMap = {
  blue: { bg: 'bg-blue-500/8', text: 'text-blue-600 dark:text-blue-400', pill: 'bg-blue-100/50 dark:bg-blue-500/15' },
  indigo: { bg: 'bg-indigo-500/8', text: 'text-indigo-600 dark:text-indigo-400', pill: 'bg-indigo-100/50 dark:bg-indigo-500/15' },
  purple: { bg: 'bg-purple-500/8', text: 'text-purple-600 dark:text-purple-400', pill: 'bg-purple-100/50 dark:bg-purple-500/15' },
  amber: { bg: 'bg-amber-500/8', text: 'text-amber-600 dark:text-amber-400', pill: 'bg-amber-100/50 dark:bg-amber-500/15' },
  rose: { bg: 'bg-rose-500/8', text: 'text-rose-600 dark:text-rose-400', pill: 'bg-rose-100/50 dark:bg-rose-500/15' },
  emerald: { bg: 'bg-emerald-500/8', text: 'text-emerald-600 dark:text-emerald-400', pill: 'bg-emerald-100/50 dark:bg-emerald-500/15' },
};

export const LoadingSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white/10 dark:bg-slate-800/15 rounded-[18px] h-20 backdrop-blur-[8px] border border-white/10 dark:border-white/[0.04]"></div>
      </div>
    ))}
  </div>
);
