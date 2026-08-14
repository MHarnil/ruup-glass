import React from 'react';
import { Truck, Warehouse, ShieldCheck, MapPin, Clock, PhoneCall, CheckCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/categories';

export const LogisticsSection = () => {
  const hubs = [
    { state: 'Gujarat & Mumbai', hubs: 'Surat, Ahmedabad, Rajkot, Vadodara, Vapi, Mumbai, Pune', time: '24 - 48 Hours' },
    { state: 'North India', hubs: 'Delhi NCR, Jaipur, Indore, Kanpur, Lucknow, Chandigarh', time: '2 - 4 Days' },
    { state: 'South & East India', hubs: 'Bengaluru, Hyderabad, Chennai, Kolkata, Patna', time: '3 - 6 Days' },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-100/70 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-brand-600" />
            <span>Pan-India Supply Chain</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dispatched Directly From Our Surat Godown
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            We work with trusted transport operators (V-Trans, ARC, TCI, Mahaveer, etc.) to deliver cartons and pallet containers safely to your doorstep or local transporter godown.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Warehouse className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Ready Container Stock</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We maintain massive inventory in our central Surat warehouse, enabling same-day or next-day truck loading for regular trade items.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">5-Ply Heavy Corrugated Packing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every carton is packed with inner partition separators and heavy 5-ply corrugated sheets to minimize transit breakage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Transparent Transporter Bilty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once dispatched, we share the transporter LR / Bilty receipt on WhatsApp so you can track delivery smoothly.
            </p>
          </div>
        </div>

        {/* Major Delivery Hubs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Regular Transport Hubs & Estimated Transit Times:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {hubs.map((hub, idx) => (
              <div key={idx} className={`space-y-1.5 ${idx > 0 ? 'pt-4 md:pt-0 md:pl-4' : ''}`}>
                <span className="text-xs font-bold text-slate-900">{hub.state}</span>
                <p className="text-xs text-slate-600 leading-normal">{hub.hubs}</p>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3" />
                  <span>Est. {hub.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
