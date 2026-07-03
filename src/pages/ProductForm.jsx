import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, ShieldCheck, ShieldAlert, Check, AlertCircle, Monitor, PenTool, Laptop, Utensils, Shirt, Dumbbell, Package } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../context/ToastContext';

const PRESETS_CATEGORIES = [
  'Electronics',
  'Home Office',
  'Stationery',
  'Kitchen',
  'Apparel',
  'Fitness',
  'Cosmetics',
  'Others'
];

// Local themed style resolver matching ProductList grid cards
const getCategoryStyles = (category) => {
  const cat = (category || 'Others').toLowerCase();

  if (cat.includes('elect')) {
    return {
      gradient: 'from-violet-500/20 to-indigo-600/30 text-indigo-500 dark:text-indigo-400',
      tag: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-100/40 dark:border-indigo-950/30',
      icon: Monitor
    };
  }
  if (cat.includes('station') || cat.includes('pen') || cat.includes('book')) {
    return {
      gradient: 'from-emerald-500/20 to-teal-600/30 text-teal-500 dark:text-teal-400',
      tag: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border-teal-100/40 dark:border-teal-950/30',
      icon: PenTool
    };
  }
  if (cat.includes('office') || cat.includes('desk') || cat.includes('lamp')) {
    return {
      gradient: 'from-amber-500/20 to-orange-600/30 text-amber-500 dark:text-amber-400',
      tag: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100/40 dark:border-amber-950/30',
      icon: Laptop
    };
  }
  if (cat.includes('kitchen') || cat.includes('cook')) {
    return {
      gradient: 'from-rose-500/20 to-orange-500/30 text-rose-500 dark:text-rose-400',
      tag: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100/40 dark:border-rose-950/30',
      icon: Utensils
    };
  }
  if (cat.includes('cloth') || cat.includes('apparel') || cat.includes('wear')) {
    return {
      gradient: 'from-pink-500/20 to-fuchsia-600/30 text-pink-500 dark:text-pink-400',
      tag: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border-pink-100/40 dark:border-pink-950/30',
      icon: Shirt
    };
  }
  if (cat.includes('fit') || cat.includes('sport') || cat.includes('gym')) {
    return {
      gradient: 'from-emerald-500/20 to-cyan-600/30 text-emerald-500 dark:text-emerald-400',
      tag: 'bg-emerald-50 text-emerald-600 dark:bg-teal-950/40 dark:text-teal-400 border-emerald-100/40 dark:border-emerald-950/30',
      icon: Dumbbell
    };
  }
  if (cat.includes('cosmetic') || cat.includes('beauty') || cat.includes('care')) {
    return {
      gradient: 'from-fuchsia-500/20 to-pink-600/30 text-fuchsia-500 dark:text-fuchsia-400',
      tag: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 border-fuchsia-100/40 dark:border-fuchsia-950/30',
      icon: Sparkles
    };
  }
  return {
    gradient: 'from-slate-500/20 to-slate-600/30 text-slate-500 dark:text-slate-400',
    tag: 'bg-slate-50 text-slate-600 dark:bg-slate-950/40 dark:text-slate-400 border-slate-100/40 dark:border-slate-950/30',
    icon: Package
  };
};

export function ProductForm({ products = [], setProducts, logActivity }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isEditMode = !!id;

  // Form input bindings
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');

  // Special Category Fields
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Validation touch trackers
  const [touched, setTouched] = useState({
    name: false,
    category: false,
    price: false,
    quantity: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve current product in edit mode
  const existingProduct = useMemo(() => {
    if (!isEditMode) return null;
    return products.find(p => p.id === id);
  }, [products, id, isEditMode]);

  // Load existing details
  useEffect(() => {
    if (isEditMode) {
      if (existingProduct) {
        setName(existingProduct.name);
        setDescription(existingProduct.description || '');
        setPrice(existingProduct.price.toString());
        setQuantity(existingProduct.quantity.toString());
        setStatus(existingProduct.status);

        const isPreset = PRESETS_CATEGORIES.includes(existingProduct.category);
        if (isPreset) {
          setCategory(existingProduct.category);
          setShowCustomCategory(false);
        } else {
          setCategory('Custom');
          setCustomCategoryName(existingProduct.category);
          setShowCustomCategory(true);
        }
      } else {
        addToast('Selected item does not exist.', 'error');
        navigate('/products');
      }
    }
  }, [isEditMode, existingProduct, navigate, addToast]);

  const handleCategorySelectChange = (val) => {
    if (val === 'Custom') {
      setCategory('Custom');
      setShowCustomCategory(true);
    } else {
      setCategory(val);
      setShowCustomCategory(false);
      setCustomCategoryName('');
    }
    setTouched(prev => ({ ...prev, category: true }));
  };

  // Form validations logic
  const errors = useMemo(() => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Product name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    const actualCategory = showCustomCategory ? customCategoryName : category;
    if (!actualCategory || !actualCategory.trim()) {
      errs.category = 'Category must be selected or specified';
    }

    if (price === '') {
      errs.price = 'Price is required';
    } else {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errs.price = 'Price must be a valid positive number';
      }
    }

    if (quantity === '') {
      errs.quantity = 'Stock quantity is required';
    } else {
      const numQty = parseInt(quantity, 10);
      const floatQty = parseFloat(quantity);
      if (isNaN(numQty) || numQty < 0 || numQty !== floatQty) {
        errs.quantity = 'Quantity must be a whole non-negative integer';
      }
    }

    return errs;
  }, [name, category, price, quantity, showCustomCategory, customCategoryName]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Submissions controller
  const handleSubmit = (e) => {
    e.preventDefault();

    // Touch all to trigger warnings
    setTouched({
      name: true,
      category: true,
      price: true,
      quantity: true
    });

    if (!isFormValid) {
      addToast('Please correct validation warnings before saving.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Artificial small delay for polished loading micro-interaction
    setTimeout(() => {
      const finalCategory = showCustomCategory ? customCategoryName.trim() : category;
      const productPayload = {
        id: isEditMode ? id : `prod-${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        category: finalCategory,
        price: parseFloat(parseFloat(price).toFixed(2)),
        quantity: parseInt(quantity, 10),
        status,
        description: description.trim()
      };

      if (isEditMode) {
        setProducts(prev => prev.map(p => p.id === id ? productPayload : p));
        logActivity(`Updated details for product "${productPayload.name}".`, 'edit');
        addToast(`"${productPayload.name}" updated successfully.`, 'success');
      } else {
        setProducts(prev => [productPayload, ...prev]);
        logActivity(`Added new product "${productPayload.name}" to category "${productPayload.category}".`, 'add');
        addToast(`"${productPayload.name}" added to catalog.`, 'success');
      }

      setIsSubmitting(false);
      navigate('/products');
    }, 600);
  };

  // Form previews getters
  const previewCategory = useMemo(() => {
    const currentCat = showCustomCategory ? customCategoryName : category;
    return currentCat && currentCat.trim() ? currentCat : 'Category';
  }, [category, showCustomCategory, customCategoryName]);

  const previewPrice = useMemo(() => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) || numPrice < 0 ? 0.00 : numPrice;
  }, [price]);

  const previewQuantity = useMemo(() => {
    const numQty = parseInt(quantity, 10);
    return isNaN(numQty) || numQty < 0 ? 0 : numQty;
  }, [quantity]);

  // Preview Card details themed
  const previewTheme = useMemo(() => {
    return getCategoryStyles(previewCategory);
  }, [previewCategory]);

  const PreviewIcon = previewTheme.icon;

  // Glow helper styling
  const getInputStyles = (field, hasError) => {
    if (touched[field]) {
      return hasError
        ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] bg-rose-50/10'
        : 'border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] bg-emerald-50/10';
    }
    return 'border-slate-200 dark:border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]';
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/products')}
          className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 transition-colors shadow-2xs cursor-pointer"
          aria-label="Back to catalog"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Product details' : 'Add Product'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isEditMode ? 'Modify key specifications for catalog item.' : 'Introduce new merchandise items to active database logs.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Input Form Fields (2/3 width) */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              Specifications
            </h3>

            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="prod-name" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="prod-name"
                  type="text"
                  placeholder="e.g. Ergonomic Office Chair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 dark:text-slate-200 ${getInputStyles(
                    'name',
                    errors.name
                  )}`}
                />
                {touched.name && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {errors.name ? (
                      <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                    ) : (
                      <Check className="w-4.5 h-4.5 text-emerald-500" />
                    )}
                  </span>
                )}
              </div>
              {touched.name && errors.name && (
                <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Categories Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="prod-category" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="prod-category"
                    value={showCustomCategory ? 'Custom' : category}
                    onChange={(e) => handleCategorySelectChange(e.target.value)}
                    onBlur={() => handleBlur('category')}
                    className={`w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 dark:text-slate-200 appearance-none cursor-pointer ${getInputStyles(
                      'category',
                      errors.category
                    )}`}
                  >
                    <option value="">Choose category...</option>
                    {PRESETS_CATEGORIES.map(preset => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                    <option value="Custom">Custom Category...</option>
                  </select>
                </div>
                {touched.category && errors.category && !showCustomCategory && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.category}</p>
                )}
              </div>

              {/* Custom Category Input */}
              {showCustomCategory && (
                <div className="flex flex-col gap-2 animate-slide-in">
                  <label htmlFor="prod-custom-category" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Custom Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="prod-custom-category"
                      type="text"
                      placeholder="e.g. Smart Wearables"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      onBlur={() => handleBlur('category')}
                      className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 dark:text-slate-200 ${getInputStyles(
                        'category',
                        errors.category
                      )}`}
                    />
                    {touched.category && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {errors.category ? (
                          <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                        ) : (
                          <Check className="w-4.5 h-4.5 text-emerald-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {touched.category && errors.category && (
                    <p className="text-xs text-rose-500 font-semibold">{errors.category}</p>
                  )}
                </div>
              )}
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="flex flex-col gap-2">
                <label htmlFor="prod-price" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Pricing ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={() => handleBlur('price')}
                    className={`w-full pl-8 pr-8 py-2.5 text-sm bg-white dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 dark:text-slate-200 ${getInputStyles(
                      'price',
                      errors.price
                    )}`}
                  />
                  {touched.price && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {errors.price ? (
                        <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                      ) : (
                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                      )}
                    </span>
                  )}
                </div>
                {touched.price && errors.price && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.price}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-2">
                <label htmlFor="prod-quantity" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Inventory Stock <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="prod-quantity"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onBlur={() => handleBlur('quantity')}
                    className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 dark:text-slate-200 ${getInputStyles(
                      'quantity',
                      errors.quantity
                    )}`}
                  />
                  {touched.quantity && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {errors.quantity ? (
                        <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                      ) : (
                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                      )}
                    </span>
                  )}
                </div>
                {touched.quantity && errors.quantity && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.quantity}</p>
                )}
              </div>
            </div>

            {/* Status Options */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Visibility State
              </span>
              <div className="flex items-center gap-3">
                <label className={`flex-1 border rounded-xl p-3 flex items-center justify-between cursor-pointer select-none transition-all duration-200 ${status === 'Active'
                  ? 'border-emerald-500 bg-emerald-50/15 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="accent-indigo-600 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Active</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Listed in front-facing customer catalogs.</p>
                    </div>
                  </div>
                  <ShieldCheck className={`w-5 h-5 ${status === 'Active' ? 'text-emerald-500' : 'text-slate-350'}`} />
                </label>

                <label className={`flex-1 border rounded-xl p-3 flex items-center justify-between cursor-pointer select-none transition-all duration-200 ${status === 'Inactive'
                  ? 'border-rose-500 bg-rose-50/15 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="accent-indigo-600 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-850 dark:text-slate-200">Inactive</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Dlisted from frontend view templates.</p>
                    </div>
                  </div>
                  <ShieldAlert className={`w-5 h-5 ${status === 'Inactive' ? 'text-rose-500' : 'text-slate-350'}`} />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="prod-description" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Description <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                id="prod-description"
                rows="3"
                placeholder="Details regarding quality materials, dimensions, or warranties..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>

            {/* Submits row */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="shadow-md shadow-indigo-100 dark:shadow-none"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Catalog' : 'Add to Catalog'}</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Real-time Dynamic Preview Card (1/3 width) */}
        <div className="sticky top-20 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-extrabold self-start select-none">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>CATALOG PREVIEW</span>
          </div>

          <div
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/50 shadow-md flex flex-col justify-between overflow-hidden select-none opacity-90 transition-[transform,shadow,border-color] duration-300 h-[380px] hover:shadow-lg`}
          >

            {/* Visual Cover Art */}
            <div className={`h-36 w-full bg-gradient-to-br ${previewTheme.gradient} relative overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50`}>
              <div className="absolute w-24 h-24 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 blur-xs animate-pulse" />
              <PreviewIcon className="w-12 h-12 text-slate-800/25 dark:text-white/20 relative z-10" />
            </div>

            {/* Visual Content body */}
            <div className="p-5 flex-grow">
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${previewTheme.tag} truncate max-w-[120px]`}>
                  {previewCategory}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                    }`}
                >
                  {status === 'Active' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Inactive</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
                {name.trim() || 'Product Name'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-3 h-12 leading-relaxed">
                {description.trim() || 'Product Desc.'}
              </p>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Price</p>
                  <p className="font-heading text-lg font-extrabold text-slate-950 dark:text-white mt-0.5">
                    ${previewPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Inventory</p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${previewQuantity === 0
                      ? 'text-rose-500'
                      : previewQuantity <= 5
                        ? 'text-amber-500'
                        : 'text-slate-600 dark:text-slate-300'
                      }`}
                  >
                    {previewQuantity === 0 ? 'Out of Stock' : `${previewQuantity} units`}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
