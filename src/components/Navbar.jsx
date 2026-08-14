import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  ShoppingBag, 
  Search, 
  X, 
  SlidersHorizontal, 
  Layers, 
  ShieldCheck, 
  Truck,
  Sparkles,
  Settings
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/categories';

// Toggle to show/hide Admin button (set to false to keep hidden)
const SHOW_ADMIN_ICON = false;

export const Navbar = () => {
  const { searchQuery, setSearchQuery, setIsRfqOpen, setIsAdminOpen } = useProducts();
  const { uniqueItemsCount, totalCartons, setIsCartOpen } = useCart();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top B2B Announcement & Quick Contact Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              B2B Wholesale
            </span>
            <span className="text-slate-300 hidden md:inline">
              Stocked by Container in Surat • Carton-based Trade Supply Pan-India
            </span>
            <span className="text-slate-300 md:hidden">
              Surat Godown • Pan-India Supply
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a 
              href={`tel:${COMPANY_INFO.phoneRaw}`} 
              className="hidden sm:inline-flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>Call: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-8">
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2h12a2 2 0 0 1 2 2v2a8 8 0 0 1-8 8 8 8 0 0 1-8-8V4a2 2 0 0 1 2-2Z"/>
                <path d="M12 14v8"/>
                <path d="M8 22h8"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                {COMPANY_INFO.name}
              </span>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Glassware & Jars Wholesale
              </p>
            </div>
          </a>

          {/* Search Bar with Live Clear */}
          <div className="flex-1 max-w-xl relative">
            <div className={`relative flex items-center w-full transition-all rounded-xl border ${
              isSearchFocused 
                ? 'border-brand-500 ring-2 ring-brand-100 bg-white shadow-sm' 
                : 'border-slate-300 bg-slate-50/80 hover:border-slate-400'
            }`}>
              <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search jars, bottles, whisky glasses, caps, SKU codes (e.g. 23256)..."
                className="w-full py-2.5 pl-2.5 pr-8 text-sm bg-transparent rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Custom RFQ, Trade Cart Drawer, Admin (hidden) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Custom RFQ button */}
            <button
              onClick={() => setIsRfqOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Bulk RFQ</span>
            </button>

            {/* Admin Settings Button (Hidden as requested) */}
            {SHOW_ADMIN_ICON && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Catalog Manager / Admin"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {/* Trade Cart / Enquiry Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-medium text-sm shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Trade Quote</span>
              {uniqueItemsCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-amber-400 text-slate-950 rounded-full animate-pulse">
                  {totalCartons} bxs
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
