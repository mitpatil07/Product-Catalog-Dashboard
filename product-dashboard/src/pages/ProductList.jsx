import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Edit2, Trash2, Filter, ArrowUpDown, LayoutGrid, List,
  AlertTriangle, ShieldCheck, ShieldAlert, Check, Monitor, PenTool,
  Laptop, Utensils, Shirt, Dumbbell, Sparkles, Package, Layers, Eye
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { useToast } from '../context/ToastContext';

// Dynamic theme mapper for categories to render specific gradients, glow styles, and icons
const getCategoryStyles = (category) => {
  const cat = (category || 'Others').toLowerCase();
  
  if (cat.includes('elect')) {
    return {
      gradient: 'from-violet-500/20 to-indigo-600/30 text-indigo-500 dark:text-indigo-400',
      glow: 'hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-400/50',
      tag: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-100/40 dark:border-indigo-950/30',
      icon: Monitor
    };
  }
  if (cat.includes('station') || cat.includes('pen') || cat.includes('book')) {
    return {
      gradient: 'from-emerald-500/20 to-teal-600/30 text-teal-500 dark:text-teal-400',
      glow: 'hover:shadow-lg hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 hover:border-teal-400/50',
      tag: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border-teal-100/40 dark:border-teal-950/30',
      icon: PenTool
    };
  }
  if (cat.includes('office') || cat.includes('desk') || cat.includes('lamp')) {
    return {
      gradient: 'from-amber-500/20 to-orange-600/30 text-amber-500 dark:text-amber-400',
      glow: 'hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5 hover:border-amber-400/50',
      tag: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100/40 dark:border-amber-950/30',
      icon: Laptop
    };
  }
  if (cat.includes('kitchen') || cat.includes('cook')) {
    return {
      gradient: 'from-rose-500/20 to-orange-500/30 text-rose-500 dark:text-rose-400',
      glow: 'hover:shadow-lg hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 hover:border-rose-400/50',
      tag: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100/40 dark:border-rose-950/30',
      icon: Utensils
    };
  }
  if (cat.includes('cloth') || cat.includes('apparel') || cat.includes('wear')) {
    return {
      gradient: 'from-pink-500/20 to-fuchsia-600/30 text-pink-500 dark:text-pink-400',
      glow: 'hover:shadow-lg hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 hover:border-pink-400/50',
      tag: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border-pink-100/40 dark:border-pink-950/30',
      icon: Shirt
    };
  }
  if (cat.includes('fit') || cat.includes('sport') || cat.includes('gym')) {
    return {
      gradient: 'from-emerald-500/20 to-cyan-600/30 text-emerald-500 dark:text-emerald-400',
      glow: 'hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:border-emerald-400/50',
      tag: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100/40 dark:border-emerald-950/30',
      icon: Dumbbell
    };
  }
  if (cat.includes('cosmetic') || cat.includes('beauty') || cat.includes('care')) {
    return {
      gradient: 'from-fuchsia-500/20 to-pink-600/30 text-fuchsia-500 dark:text-fuchsia-400',
      glow: 'hover:shadow-lg hover:shadow-fuchsia-500/10 dark:hover:shadow-fuchsia-500/5 hover:border-fuchsia-400/50',
      tag: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 border-fuchsia-100/40 dark:border-fuchsia-950/30',
      icon: Sparkles
    };
  }
  return {
    gradient: 'from-slate-500/20 to-slate-600/30 text-slate-500 dark:text-slate-400',
    glow: 'hover:shadow-lg hover:shadow-slate-500/10 dark:hover:shadow-slate-500/5 hover:border-slate-400/50',
    tag: 'bg-slate-50 text-slate-600 dark:bg-slate-950/40 dark:text-slate-400 border-slate-100/40 dark:border-slate-950/30',
    icon: Package
  };
};

export function ProductList({ products = [], setProducts, logActivity }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Search, Filter, Sort and Paging State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  
  // Selection states for Bulk Action Batching
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals gates
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const itemsPerPage = 6;

  // Retrieve category types
  const categories = useMemo(() => {
    const list = products.map(p => p.category);
    return ['All', ...new Set(list)];
  }, [products]);

  // Pre-filter/Sort catalog
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return a.name.localeCompare(b.name);
      });
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Pagination scope
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const productToBeDeleted = useMemo(() => {
    return products.find(p => p.id === deletingProductId);
  }, [products, deletingProductId]);

  // Selectors management helpers
  const handleSelectToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedProducts.map(p => p.id);
    const allSelectedOnPage = pageIds.every(id => selectedIds.includes(id));
    
    if (allSelectedOnPage) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  // Single Item Delete Confirmed
  const handleDeleteConfirm = () => {
    if (!deletingProductId) return;
    const targetProduct = products.find(p => p.id === deletingProductId);
    
    setProducts(prev => prev.filter(p => p.id !== deletingProductId));
    setSelectedIds(prev => prev.filter(id => id !== deletingProductId));
    
    // Log activity
    logActivity(`Product "${targetProduct?.name}" was deleted from inventory database.`, 'delete');
    addToast(`"${targetProduct?.name}" has been deleted.`, 'success');
    setDeletingProductId(null);

    // Dynamic pagination alignment
    const totalPages = Math.ceil((products.length - 1) / itemsPerPage);
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(totalPages);
    }
  };

  // Bulk Operations
  const handleBulkStatusChange = (newStatus) => {
    setProducts(prev =>
      prev.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p)
    );
    logActivity(`Bulk updated status to "${newStatus}" for ${selectedIds.length} catalog items.`, 'edit');
    addToast(`Successfully marked ${selectedIds.length} items as ${newStatus}.`, 'success');
    setSelectedIds([]);
  };

  const handleBulkDeleteConfirm = () => {
    setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    logActivity(`Bulk deleted ${selectedIds.length} products from catalog database.`, 'delete');
    addToast(`Successfully deleted ${selectedIds.length} items.`, 'success');
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 relative">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Audit catalog assets, manage listing states, and implement bulk inventory changes.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/products/new')}
          className="shadow-md shadow-indigo-200 dark:shadow-none self-start sm:self-auto hover:scale-102 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Polish Filter Deck */}
      <Card className="!p-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-4xl">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by product name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>
            
            {/* Category dropdown */}
            <div className="relative sm:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Selectors */}
            <div className="inline-flex p-1 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-2xs">
              {['All', 'Active', 'Inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    selectedStatus === status
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="relative w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
              >
                <option value="name-asc">Sort: A-Z</option>
                <option value="name-desc">Sort: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-1 bg-white dark:bg-slate-950 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Table List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Select All on Page helper bar */}
      {paginatedProducts.length > 0 && (
        <div className="flex items-center gap-2 pl-3 py-1 text-xs select-none">
          <input
            type="checkbox"
            id="select-page-checkbox"
            checked={paginatedProducts.every(p => selectedIds.includes(p.id))}
            onChange={handleSelectAllOnPage}
            className="w-4 h-4 rounded-sm accent-indigo-600 border-slate-300 dark:border-slate-800 text-white cursor-pointer"
          />
          <label htmlFor="select-page-checkbox" className="text-slate-500 font-semibold cursor-pointer">
            Select All on page
          </label>
        </div>
      )}

      {/* Empty / Error Gates */}
      {products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/30 rounded-3xl">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 animate-pulse">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white">Database is Empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
            There are no products listed in the system. Launch your inventory listing by clicking add product.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/products/new')}
            className="mt-6 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Entry</span>
          </Button>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center bg-white/40 rounded-3xl border border-slate-100 dark:border-slate-800/40">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-slate-700 dark:text-white">No Inventory Matches</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
            Your search parameters didn't map to any catalog listing. Try resetting filters.
          </p>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="mt-6"
          >
            Clear Filters
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        
        /* Premium Grid cards with Geometric Cover illustration */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map(product => {
              const isSelected = selectedIds.includes(product.id);
              const theme = getCategoryStyles(product.category);
              const IconComp = theme.icon;

              return (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/50 shadow-xs flex flex-col justify-between overflow-hidden transition-[transform,shadow,border-color] duration-300 relative group/card ${theme.glow} ${
                    isSelected ? 'ring-2 ring-indigo-500 border-indigo-400 dark:border-indigo-600 scale-[1.01]' : ''
                  }`}
                >
                  
                  {/* Select Checkbox over cover */}
                  <div className="absolute top-3 left-3 z-20">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectToggle(product.id)}
                      className="w-5 h-5 rounded-md accent-indigo-600 border-white text-white cursor-pointer shadow-md"
                    />
                  </div>

                  {/* Geometric Category Cover Art */}
                  <div className={`h-36 w-full bg-gradient-to-br ${theme.gradient} relative overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50`}>
                    
                    {/* Visual concentric rings in backdrop */}
                    <div className="absolute w-24 h-24 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 blur-xs" />
                    <div className="absolute w-36 h-36 rounded-full bg-white/5 dark:bg-white/5 border border-white/5" />
                    
                    <IconComp className="w-12 h-12 text-slate-800/25 dark:text-white/20 relative z-10 transition-transform group-hover/card:scale-115 duration-300" />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${theme.tag}`}>
                        {product.category}
                      </span>
                      
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          product.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                        }`}
                      >
                        {product.status === 'Active' ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2 h-8 leading-relaxed">
                      {product.description || 'No description cataloged for this inventory listing.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Price</p>
                        <p className="font-heading text-base font-extrabold text-slate-950 dark:text-white mt-0.5">
                          ${parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Inventory</p>
                        <p
                          className={`text-xs font-bold mt-0.5 ${
                            product.quantity === 0
                              ? 'text-rose-500'
                              : product.quantity <= 5
                              ? 'text-amber-500'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} units`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions overlay footer */}
                  <div className="px-5 py-3 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      className="!py-1.5 !px-2.5 text-xs hover:border-indigo-500 hover:text-indigo-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingProductId(product.id)}
                      className="!py-1.5 !px-2.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-500 dark:hover:border-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        
        /* Table / List View */
        <div className="space-y-4">
          <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800/60">
                <tr>
                  <th className="px-4 py-3.5 w-10">Select</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedProducts.map(product => {
                  const isSelected = selectedIds.includes(product.id);
                  const theme = getCategoryStyles(product.category);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors ${
                        isSelected ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                      }`}
                    >
                      <td className="px-4 py-4.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectToggle(product.id)}
                          className="w-4.5 h-4.5 rounded-sm accent-indigo-600 text-white cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs">
                          {product.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs mt-0.5 leading-relaxed">
                          {product.description || 'No description listed.'}
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${theme.tag}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-slate-100">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4.5">
                        <span
                          className={`text-xs font-bold ${
                            product.quantity === 0
                              ? 'text-rose-500'
                              : product.quantity <= 5
                              ? 'text-amber-500 font-extrabold'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} units`}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            product.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            product.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                          }`} />
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(product.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-slate-900/95 text-white backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between gap-6 border border-slate-800 animate-slide-in w-[90%] max-w-2xl select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-indigo-300 uppercase">Batch Selection</p>
              <p className="text-sm font-extrabold text-slate-100 mt-0.5">
                {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange('Active')}
              className="!text-white !border-slate-700 hover:!bg-white/10 !py-1.5"
            >
              <span>Activate</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange('Inactive')}
              className="!text-white !border-slate-700 hover:!bg-white/10 !py-1.5"
            >
              <span>Suspend</span>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowBulkDeleteModal(true)}
              className="!py-1.5 shadow-md shadow-rose-900/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Single Item Delete Modal Gate */}
      <Modal
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingProductId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">Delete catalog entry?</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{productToBeDeleted?.name}"</span>? 
              This product will be permanently removed. This action is irreversible.
            </p>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Modal Gate */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Bulk Deletion Confirmation"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowBulkDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleBulkDeleteConfirm}>Delete Selected</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl flex-shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">Delete selected merchandise?</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
              Are you sure you want to delete the <span className="font-extrabold text-rose-500">{selectedIds.length}</span> selected items? 
              This will permanently delete all selected products. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
}
