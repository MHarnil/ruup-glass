import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Mail, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2, 
  PackageCheck 
} from 'lucide-react';
import { COMPANY_INFO, CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';

export const Footer = () => {
  const { setSelectedCategory, setIsRfqOpen } = useProducts();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & About Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold shadow-md">
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M6 2h12a2 2 0 0 1 2 2v2a8 8 0 0 1-8 8 8 8 0 0 1-8-8V4a2 2 0 0 1 2-2Z"/>
                  <path d="M12 14v8"/>
                  <path d="M8 22h8"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {COMPANY_INFO.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Premier B2B wholesale supplier and direct importer of food-grade glass jars, beverage bottles, luxury decanters, whisky glasses, and lug closures. Dispatched in cartons across all states of India.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Product Categories */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Product Categories
            </p>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.id);
                      window.scrollTo({ top: 550, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">• {c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Wholesale Trade Info */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Trade Desk
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setIsRfqOpen(true)} className="hover:text-white transition-colors">
                  • Bulk Container RFQ
                </button>
              </li>
              <li>• Carton MOQ Guidelines</li>
              <li>• Safe Transporter Bilty</li>
              <li>• GST Billing & Invoice</li>
              <li>• Sample Ordering Policy</li>
            </ul>
          </div>

          {/* Direct Contact & WhatsApp Box */}
          <div className="lg:col-span-3 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Instant Order Desk
            </p>
            
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-emerald-400 font-semibold">WhatsApp Chat Desk</p>
                <p className="text-sm font-bold text-white group-hover:text-emerald-200">{COMPANY_INFO.whatsapp}</p>
              </div>
            </a>

            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-850 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold">Calling Line</p>
                <p className="text-sm font-bold text-white group-hover:text-brand-300">{COMPANY_INFO.phone}</p>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name} • All Rights Reserved. Surat, Gujarat, India.</p>
          <div className="flex items-center gap-4">
            <span>B2B Wholesale Portal</span>
            <span>•</span>
            <span className="text-slate-400">GST Registered Supplier</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
