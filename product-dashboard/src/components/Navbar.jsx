import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Sun, Moon, Boxes } from 'lucide-react';

export function Navbar({ theme, toggleTheme }) {
  const activeClass = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50/80 border border-indigo-100/50 dark:bg-indigo-950/30 dark:border-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition-[transform,colors,shadow,border-color] duration-200 shadow-2xs scale-[1.02]';
  const inactiveClass = 'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-[colors,background-color] duration-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/30 border border-transparent';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105 duration-200">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent transition-opacity duration-200 group-hover:opacity-90">
            StockSync
          </span>
        </NavLink>

        {/* Navigation Links & Actions */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </NavLink>
          </nav>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-[transform,colors,border-color] duration-200 active:scale-95 cursor-pointer shadow-xs"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
