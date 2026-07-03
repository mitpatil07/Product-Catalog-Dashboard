import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useRecentActivity } from './hooks/useRecentActivity';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/ProductList';
import { ProductForm } from './pages/ProductForm';

function AppContent() {
  const [products, setProducts] = useLocalStorage('products', []);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const { activities, logActivity, clearActivities } = useRecentActivity();

  // Sync theme changes with CSS root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                products={products}
                activities={activities}
                clearActivities={clearActivities}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductList
                products={products}
                setProducts={setProducts}
                logActivity={logActivity}
              />
            }
          />
          <Route
            path="/products/new"
            element={
              <ProductForm
                products={products}
                setProducts={setProducts}
                logActivity={logActivity}
              />
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProductForm
                products={products}
                setProducts={setProducts}
                logActivity={logActivity}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200/60 dark:border-slate-800/50 py-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-white/40 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StockSync Product Catalog. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}
