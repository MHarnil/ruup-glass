import React from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Truck, 
  Warehouse, 
  BadgePercent, 
  ShieldCheck, 
  Package, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { COMPANY_INFO } from '../data/categories';

export const Hero = () => {
  const { selectCategoryView, openAllProducts, setIsRfqOpen } = useProducts();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white border-b border-slate-800">
      {/* Background Subtle Glass Refraction Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
              <Warehouse className="w-3.5 h-3.5 text-brand-400" />
              <span>Direct Importers • Surat Ready Stock</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Glassware, Jars & Bottles <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-sky-400 via-brand-300 to-indigo-300 bg-clip-text text-transparent">
                Supplied by the Carton.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl font-normal leading-relaxed mx-auto sm:mx-0">
              Wholesale trade supply for FMCG packers, dairy brands, hotels, cafes, gift retailers, and e-commerce sellers. Select your category below to explore all trade products.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={openAllProducts}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Ruup Glass team, I want to inquire about bulk wholesale glassware pricing and availability.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us Directly</span>
              </a>

              <button
                onClick={() => setIsRfqOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm border border-slate-700 transition-colors"
              >
                <span>Request Custom Quote</span>
              </button>
            </div>

            {/* Micro USP Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Carton MOQ</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">From 1 Box to Truck</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <BadgePercent className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Trade Pricing</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Ex-Surat Godown</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Pan-India</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Transporter Supply</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase Collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-3.5">
            <div className="space-y-3 sm:space-y-3.5">
              <div 
                onClick={() => selectCategoryView('jars')}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800 shadow-xl cursor-pointer hover:border-brand-500/50 transition-all"
              >
                <img 
                  src="https://assets.brahmanicrm.com/products/23256/56630af2-538b-48f2-97c9-8802503a06fa.jpg" 
                  alt="Glass Jars" 
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3">
                  <div>
                    <span className="text-[10px] font-semibold text-brand-300">Category</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">Glass Jars & Storage</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => selectCategoryView('bottles')}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800 shadow-xl cursor-pointer hover:border-brand-500/50 transition-all"
              >
                <img 
                  src="https://assets.brahmanicrm.com/products/22951/cd16f4da-ca11-4e46-95a6-abed19619c03.jpg" 
                  alt="Milk Bottles" 
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-300">Category</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">Milk & Water Bottles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-3.5 pt-4">
              <div 
                onClick={() => selectCategoryView('decanters')}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800 shadow-xl cursor-pointer hover:border-brand-500/50 transition-all"
              >
                <img 
                  src="https://assets.brahmanicrm.com/products/21664/0.jpg" 
                  alt="AK47 Decanter" 
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3">
                  <div>
                    <span className="text-[10px] font-semibold text-amber-300">Category</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">Luxury Decanter Sets</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => selectCategoryView('drinkware')}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800 shadow-xl cursor-pointer hover:border-brand-500/50 transition-all"
              >
                <img 
                  src="https://assets.brahmanicrm.com/products/23324/00600027-d699-4076-aea4-3e2b144733c1.jpg" 
                  alt="Whisky Glasses" 
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-3">
                  <div>
                    <span className="text-[10px] font-semibold text-sky-300">Category</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">Drinkware & Barware</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
