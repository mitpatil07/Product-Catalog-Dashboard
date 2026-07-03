import React from 'react';

export function Card({
  children,
  title,
  subtitle,
  actions,
  hoverable = false,
  className = '',
  ...props
}) {
  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-indigo-950/20 hover:border-slate-300 dark:hover:border-slate-700'
    : '';

  return (
    <div
      className={`bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/50 shadow-sm p-5 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out ${hoverStyles} ${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-100 dark:border-slate-800/50 pb-3">
          <div>
            {title && (
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
