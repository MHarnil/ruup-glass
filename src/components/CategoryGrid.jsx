import React from 'react';
import { Package, Wine, Milk, Sparkles, Disc, Soup, ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';

const ICON_MAP = { Container: Package, Wine: Wine, Milk: Milk, Sparkles: Sparkles, Disc: Disc, Soup: Soup, Layers: Layers };

const CategoryImageGrid = ({ categoryId, catImage }) => {
  const { products } = useProducts();
  const catProducts = React.useMemo(() => {
    return products.filter(p => p.category === categoryId && p.images && p.images.length > 0).slice(0, 4);
  }, [products, categoryId]);
  const slots = Array.from({ length: 4 }, (_, i) => catProducts[i] ? catProducts[i].images[0] : catImage);
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-slate-100">
      {slots.map((imgSrc, idx) => (
        <div key={idx} className="aspect-square overflow-hidden bg-slate-200">
          <img src={imgSrc} alt="" loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = catImage; }} />
        </div>
      ))}
    </div>
  );
};

export const CategoryGrid = () => {
  const { categoryCounts, selectCategoryView, openAllProducts } = useProducts();
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /><span>Wholesale Product Categories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Explore Glassware by Category</h2>
          <p className="text-xs sm:text-sm text-slate-600">Click on any category below to view all available products, carton packing specs, and wholesale trade prices.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            const count = categoryCounts[cat.id] || 0;
            return (
              <div key={cat.id} onClick={() => selectCategoryView(cat.id)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400/60 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1">
                <CategoryImageGrid categoryId={cat.id} catImage={cat.image} />
                <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium shrink-0 ml-1">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /><span>Full Wholesale Catalog</span></div>
            <h3 className="text-xl sm:text-2xl font-black">Want to see all {categoryCounts.all || 760} Glassware products at once?</h3>
            <p className="text-xs text-slate-300">Browse complete master inventory with price slider, instant SKU search and multi-carton quote maker.</p>
          </div>
          <button onClick={openAllProducts} className="px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 inline-flex items-center gap-2">
            <span>View All {categoryCounts.all || 760} Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
