import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export const FilterSidebar = () => {
  const { 
    priceRange, 
    setPriceRange, 
    inStockOnly, 
    setInStockOnly, 
    sortBy, 
    setSortBy,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useProducts();

  const handleReset = () => {
    setPriceRange({ min: 0, max: 5000 });
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900">Filter Products</h3>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Sort Catalog
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="carton-size">Carton: Large Volume First</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Price Range (₹ / Piece)
          </label>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                className="w-full pl-6 pr-2 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <span className="text-slate-400 text-xs font-bold">–</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min={priceRange.min}
                max="10000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 5000 }))}
                className="w-full pl-6 pr-2 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
            className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Stock Availability */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 rounded-md"
            />
            <span>Show In-Stock Godown Items Only</span>
          </label>
        </div>

        {/* Current Filter Result Badge */}
        <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-center">
          <p className="text-xs text-brand-900 font-semibold">
            Showing <span className="font-bold text-brand-700">{filteredProducts.length}</span> wholesale products
          </p>
        </div>

      </div>

      {/* Wholesale Assistance Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-xs space-y-2.5">
        <p className="font-bold text-sm text-amber-300">Need Bulk Container Loads?</p>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          For full truckloads or import containers of bottles and jars, contact our trade desk for customized factory pricing.
        </p>
        <a
          href="https://wa.me/917984086684?text=Hi%2C%20I%20need%20a%20quote%20for%20full%20truckload%20%2F%20container%20glassware%20supply."
          target="_blank"
          rel="noreferrer"
          className="block text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
        >
          WhatsApp Trade Desk
        </a>
      </div>
    </aside>
  );
};
