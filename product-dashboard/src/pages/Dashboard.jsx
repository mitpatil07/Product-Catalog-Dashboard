import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShieldCheck, ShieldAlert, DollarSign, AlertCircle, TrendingUp, ChevronRight, Activity, Calendar } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Utility to format ISO timestamps into human-readable relative time
function formatRelativeTime(isoString) {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return 'Recently';
  }
}

// 1. Isolated Category Donut Chart Component (Prevents whole Dashboard re-rendering on hover)
const CategoryDonutChart = React.memo(({ categories = [], totalProducts = 0 }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.159

  const donutSegments = useMemo(() => {
    let accumulatedAngle = 0;
    const colors = [
      'stroke-indigo-500',
      'stroke-purple-500',
      'stroke-pink-500',
      'stroke-rose-500',
      'stroke-amber-500',
      'stroke-emerald-500',
      'stroke-sky-500',
      'stroke-slate-500'
    ];

    return categories.map((cat, i) => {
      const proportion = cat.count / totalProducts;
      const length = proportion * circumference;
      const strokeDasharray = `${length} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += length;
      
      return {
        ...cat,
        strokeDasharray,
        strokeDashoffset,
        colorClass: colors[i % colors.length]
      };
    });
  }, [categories, totalProducts, circumference]);

  const activeSelectionInfo = useMemo(() => {
    if (hoveredCategory) {
      return categories.find(c => c.name === hoveredCategory);
    }
    return categories.length > 0 ? categories[0] : null;
  }, [hoveredCategory, categories]);

  if (totalProducts === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center h-full w-full">
        <Package className="w-12 h-12 text-slate-350 dark:text-slate-800 mb-2" />
        <p className="text-sm font-bold text-slate-500">Inventory database is empty</p>
        <p className="text-xs text-slate-400 mt-1">Please insert items to review category allocations.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-4 py-4 w-full">
      {/* SVG Donut Illustration Container */}
      <div className="relative w-56 h-56 flex-shrink-0">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-90 select-none"
        >
          {/* Base Loop */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            className="stroke-slate-100 dark:stroke-slate-850"
            strokeWidth="10"
          />

          {/* Render dynamic slices */}
          {donutSegments.map((segment) => {
            const isSelected = activeSelectionInfo?.name === segment.name;
            return (
              <circle
                key={segment.name}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                className={`${segment.colorClass} transition-[stroke-width] duration-200 cursor-pointer`}
                strokeWidth={isSelected ? '14' : '10'}
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredCategory(segment.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Donut Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {activeSelectionInfo ? (
            <>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
                {activeSelectionInfo.name}
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                {activeSelectionInfo.count}
              </p>
              <p className="text-xs font-bold text-indigo-500 mt-0.5">
                {activeSelectionInfo.percentage.toFixed(1)}% of total
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-400">Total Items</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalProducts}</p>
            </>
          )}
        </div>
      </div>

      {/* Sidebar Legend List */}
      <div className="flex-grow space-y-2.5 w-full max-w-sm sm:max-h-[220px] overflow-y-auto pr-1">
        {donutSegments.map((segment) => {
          const isSelected = activeSelectionInfo?.name === segment.name;
          return (
            <div
              key={segment.name}
              onMouseEnter={() => setHoveredCategory(segment.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-[background-color,border-color,transform] duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-950/30 scale-[1.02] shadow-2xs'
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${segment.colorClass.replace('stroke', 'bg')}`} />
                <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-355'}`}>
                  {segment.name}
                </span>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{segment.count}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-semibold">
                  ({segment.percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Sparkline SVG Trend graphs
function Sparkline({ points, strokeColor, fillColor }) {
  const width = 120;
  const height = 40;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const scaledPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${scaledPoints.join(' L ')}`;
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg className="w-20 h-10 select-none opacity-80" viewBox={`0 0 ${width} ${height}`}>
      <path d={fillD} fill={fillColor} className="transition-[fill] duration-300" />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Dashboard({ products = [], activities = [], clearActivities }) {
  const navigate = useNavigate();

  // Metric aggregates
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const inactiveProducts = products.filter(p => p.status === 'Inactive').length;
  
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0),
    0
  );

  const totalStockItems = products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0);

  const criticalStockItems = products.filter(
    p => p.status === 'Active' && (parseInt(p.quantity) || 0) <= 5
  );

  // Categories mapping memoized
  const categoryMap = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const categories = useMemo(() => {
    return Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name],
      percentage: totalProducts ? ((categoryMap[name] / totalProducts) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }, [categoryMap, totalProducts]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Redesigned Premium Welcome Banner with grid lines mesh and gradients */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        {/* Visual CSS grid pattern layout */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Soft glowing mesh gradient in backdrop */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/4 bottom-0 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold mb-4 select-none uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Admin Terminal</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome Back, Merchant
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Your catalogs are fully synced, stocks are updated, and metrics look healthy. Below is the inventory audit for your merchandise assets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/products/new')}
              className="!bg-white !text-slate-900 hover:!bg-slate-100 !border-white shadow-lg shadow-white/5 active:scale-95"
            >
              Add Product
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="!border-slate-800 hover:!border-slate-700 !text-slate-300 hover:!text-white hover:!bg-white/5 active:scale-95"
            >
              Audit Database
            </Button>
          </div>
        </div>
      </div>

      {/* Polish Stats Grid with SVG Sparkline Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Products */}
        <Card className="relative overflow-hidden group hover:border-indigo-500/30 transition-[border-color,box-shadow] duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Products Listed
              </p>
              <h2 className="font-heading text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5 tracking-tight">
                {totalProducts}
              </h2>
            </div>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl transition-transform duration-200 group-hover:scale-105">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>{totalStockItems} items stocked</span>
            </div>
            <Sparkline points={[10, 12, 11, 14, 13, 16, 17]} strokeColor="#6366f1" fillColor="rgba(99, 102, 241, 0.08)" />
          </div>
        </Card>

        {/* Active Products */}
        <Card className="relative overflow-hidden group hover:border-emerald-500/30 transition-[border-color,box-shadow] duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Active Listings
              </p>
              <h2 className="font-heading text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 tracking-tight">
                {activeProducts}
              </h2>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl transition-transform duration-200 group-hover:scale-105">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {totalProducts ? Math.round((activeProducts / totalProducts) * 100) : 0}% listing efficiency
            </p>
            <Sparkline points={[6, 7, 7, 8, 9, 8, 10]} strokeColor="#10b981" fillColor="rgba(16, 185, 129, 0.08)" />
          </div>
        </Card>

        {/* Inactive Products */}
        <Card className="relative overflow-hidden group hover:border-rose-500/30 transition-[border-color,box-shadow] duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Archived/Drafts
              </p>
              <h2 className="font-heading text-3xl font-extrabold text-rose-500 dark:text-rose-450 mt-1.5 tracking-tight">
                {inactiveProducts}
              </h2>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-xl transition-transform duration-200 group-hover:scale-105">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Suspended listing draft items
            </p>
            <Sparkline points={[4, 5, 4, 3, 3, 2, 2]} strokeColor="#f43f5e" fillColor="rgba(244, 63, 94, 0.08)" />
          </div>
        </Card>

        {/* Evaluation Value */}
        <Card className="relative overflow-hidden group hover:border-amber-500/30 transition-[border-color,box-shadow] duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Evaluation Value
              </p>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                ${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl transition-transform duration-200 group-hover:scale-105">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Based on pricing indices
            </p>
            <Sparkline points={[80, 85, 92, 89, 110, 105, 120]} strokeColor="#f59e0b" fillColor="rgba(245, 158, 11, 0.08)" />
          </div>
        </Card>
      </div>

      {/* Redesigned Analytics Section with Donut Chart and Timeline Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Memoized Interactive Donut Chart Container (2/3 width) */}
        <Card
          title="Category Distributions"
          subtitle="Hover segment to dynamically focus category scope"
          className="lg:col-span-2 flex flex-col justify-between"
        >
          <CategoryDonutChart categories={categories} totalProducts={totalProducts} />
        </Card>

        {/* Recent Activity Logs (1/3 width) */}
        <Card
          title="Recent Activity"
          subtitle="Audit ledger of database modifications"
          actions={
            activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-650 transition-colors p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                title="Wipe Logs"
              >
                Clear
              </button>
            )
          }
          className="flex flex-col"
        >
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center h-full">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-800 mb-2" />
              <p className="text-xs font-semibold text-slate-400">Log ledger is clear</p>
              <p className="text-[10px] text-slate-500 mt-1">Actions you trigger will populate here.</p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-5 py-2 border-l border-slate-200 dark:border-slate-850 max-h-[300px] overflow-y-auto pr-1">
              {activities.map((activity) => {
                let dotColor = 'bg-blue-500 ring-blue-100 dark:ring-blue-950/40';
                if (activity.type === 'add') dotColor = 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950/40';
                if (activity.type === 'edit') dotColor = 'bg-amber-500 ring-amber-100 dark:ring-amber-950/40';
                if (activity.type === 'delete') dotColor = 'bg-rose-500 ring-rose-100 dark:ring-rose-950/40';

                return (
                  <div key={activity.id} className="relative group">
                    <span className={`absolute -left-[22.5px] top-1.5 h-3 w-3 rounded-full ring-4 ${dotColor} transition-transform duration-200 group-hover:scale-110`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Critical Stock Warnings */}
      {criticalStockItems.length > 0 && (
        <Card
          title="Stock Health Warnings"
          subtitle="Listed active items running dangerously low or out of stock"
          className="border-rose-100 dark:border-rose-950/20 bg-rose-50/20 dark:bg-rose-950/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {criticalStockItems.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/products/edit/${item.id}`)}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-200/50 dark:border-rose-950/20 bg-white/80 dark:bg-slate-900/60 hover:shadow-xs hover:border-rose-350 dark:hover:border-rose-800 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-500 transition-colors duration-200">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {item.category}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                      item.quantity === 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                    {item.quantity === 0 ? 'Out of Stock' : `${item.quantity} Left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
