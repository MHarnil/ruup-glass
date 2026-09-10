import React from 'react';
import { 
  Package, 
  Wine, 
  Milk, 
  Sparkles, 
  Disc, 
  Soup, 
  ArrowRight, 
  Layers,
  CheckCircle2,
  TrendingUp,
  Warehouse
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';

const ICON_MAP = {
  Container: Package,
  Wine: Wine,
  Milk: Milk,
  Sparkles: Sparkles,
  Disc: Disc,
  Soup: Soup,
  Layers: Layers
};

export const CategoryGrid = () => {
  const { categoryCounts, selectCategoryView, openAllProducts } = useProducts();

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Wholesale Product Categories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Glassware by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Click on any category below to view all available products, carton packing specs, and wholesale trade prices.
          </p>
        </div>

        {/* Categories Grid (2 cols mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Package;
            const count = categoryCounts[cat.id] || 0;

            return (
              <div
                key={cat.id}
                onClick={() => selectCategoryView(cat.id)}
                className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                {/* Category Image Cover */}
                <div className="relative aspect-video sm:aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  {/* Top Badge: Category Count */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
                    <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md border border-white/10 inline-flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-brand-400" />
                      <span>{count} Products</span>
                    </span>
                  </div>

                  {/* Bottom overlay text on image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
                    <h3 className="text-lg sm:text-xl font-extrabold group-hover:text-brand-300 transition-colors leading-snug drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Category Details & Popular Items */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {cat.popular && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 block mb-0.5">Popular Items:</span>
                      <span className="line-clamp-1">{cat.popular}</span>
                    </div>
                  )}

                  {/* CTA button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700 group-hover:text-brand-600">
                    <span>Explore {cat.name} ({count})</span>
                    <div className="w-7 h-7 rounded-full bg-brand-50 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Full Wholesale Catalog</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Want to see all {categoryCounts.all || 760} Glassware products at once?
            </h3>
            <p className="text-xs text-slate-300">
              Browse complete master inventory with price slider, instant SKU search & multi-carton quote maker.
            </p>
          </div>

          <button
            onClick={openAllProducts}
            className="px-6 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 inline-flex items-center gap-2"
          >
            <span>View All {categoryCounts.all || 760} Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
