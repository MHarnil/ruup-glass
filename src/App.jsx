import React, { useState, useEffect } from 'react';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { QuoteDrawer } from './components/QuoteDrawer';
import { RfqModal } from './components/RfqModal';
import { AdminModal } from './components/AdminModal';
import { LogisticsSection } from './components/LogisticsSection';
import { Footer } from './components/Footer';
import { COMPANY_INFO } from './data/categories';
import { 
  PackageSearch, 
  MessageCircle, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

const PAGE_SIZE = 32; // Balanced for 4-column desktop and 2-column mobile

const CatalogContent = () => {
  const { filteredProducts, searchQuery, selectedCategory, setSelectedCategory, setSearchQuery } = useProducts();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible count when category or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      
      {/* Mobile Filter Toggle Bar */}
      <div className="flex md:hidden items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
          <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter & Sort'}</span>
        </button>

        <span className="text-[11px] font-semibold text-slate-500">
          {filteredProducts.length} Products
        </span>
      </div>

      {/* Main Grid Layout: Sidebar + 4-Column / 2-Column Product Grid */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Filter Sidebar (Desktop & Mobile toggle) */}
        <div className={`w-full md:w-60 lg:w-64 shrink-0 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <FilterSidebar />
        </div>

        {/* Product Cards Grid Area: 4 columns on desktop, 2 columns on mobile */}
        <div className="flex-1 w-full">
          {searchQuery && (
            <div className="mb-3.5 p-2.5 sm:p-3 bg-brand-50 rounded-xl border border-brand-200 flex items-center justify-between text-xs">
              <span>
                Search results for: <strong className="text-brand-900">"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-brand-700 hover:underline font-bold"
              >
                Clear
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Matching Glassware Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your search query or reset your price and category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Showing <strong>1 – {displayedProducts.length}</strong> of <strong>{filteredProducts.length}</strong> Products</span>
                <span className="text-[10px] sm:text-[11px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                  Carton Trade Supply
                </span>
              </div>

              {/* Responsive 4-col Desktop / 2-col Mobile Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-4.5">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4 sm:pt-6 pb-2">
                  <button
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Load More Products ({filteredProducts.length - displayedProducts.length} remaining)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

const MainLayout = () => {
  const { activeProduct, closeProductPage } = useProducts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-brand-500 selection:text-white">
      <Navbar />
      
      {activeProduct ? (
        /* Dedicated Full Product Page View */
        <main className="flex-1">
          <ProductPage product={activeProduct} onBack={closeProductPage} />
        </main>
      ) : (
        /* Catalog & Homepage View */
        <>
          <Hero />
          <CategoryFilter />
          <main className="flex-1">
            <CatalogContent />
            <LogisticsSection />
          </main>
        </>
      )}

      <Footer />

      {/* Modals and Drawers */}
      <QuoteDrawer />
      <RfqModal />
      <AdminModal />

      {/* Floating WhatsApp Quick Action */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Ruup Glass, I want to inquire about bulk glassware orders.')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 p-3 sm:p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};

export function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
