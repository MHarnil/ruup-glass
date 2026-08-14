import React from 'react';
import { 
  Layers, 
  Package, 
  Wine, 
  Sparkles, 
  Disc, 
  Coffee,
  UtensilsCrossed
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';

const ICON_MAP = {
  Layers: Layers,
  Container: Package,
  Milk: Coffee,
  Wine: Wine,
  Sparkles: Sparkles,
  Disc: Disc,
  Soup: UtensilsCrossed,
};

export const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, categoryCounts } = useProducts();

  return (
    <div className="w-full border-b border-slate-200 bg-white shadow-sm sticky top-[69px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Layers;
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
