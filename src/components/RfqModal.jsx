import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Send, CheckCircle2, Factory, PackageCheck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { COMPANY_INFO } from '../data/categories';

export const RfqModal = () => {
  const { isRfqOpen, setIsRfqOpen } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    firm: '',
    city: '',
    requirementType: 'container_import',
    estimatedQuantity: '1000+ Cartons / Full Truck',
    message: ''
  });

  if (!isRfqOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let text = `🏭 *CUSTOM B2B RFQ / CONTAINER INQUIRY - RUUP GLASS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Client:* ${formData.name}\n`;
    text += `📞 *Phone:* ${formData.phone}\n`;
    text += `🏢 *Company/Firm:* ${formData.firm || 'N/A'}\n`;
    text += `📍 *Destination City:* ${formData.city}\n`;
    text += `📋 *Inquiry Type:* ${formData.requirementType.replace('_', ' ').toUpperCase()}\n`;
    text += `📦 *Est. Quantity:* ${formData.estimatedQuantity}\n`;
    text += `📝 *Specifications/Notes:* ${formData.message || 'Please send catalog & factory pricing'}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💬 *Requesting:* Urgent custom quote & proforma invoice.`;

    const url = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsRfqOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={() => setIsRfqOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Volume Trade Desk</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            Request Custom Quotation (RFQ)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            For Full Truckloads, Container Direct Imports, or Custom Silk-Screen Printing.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Ramesh Patel"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
              <input
                required
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business / Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Pure Agro Foods"
                value={formData.firm}
                onChange={(e) => setFormData(prev => ({ ...prev, firm: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination City & State *</label>
              <input
                required
                type="text"
                placeholder="e.g. Ahmedabad, Gujarat"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Type</label>
              <select
                value={formData.requirementType}
                onChange={(e) => setFormData(prev => ({ ...prev, requirementType: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="container_import">Full Container Load (FCL)</option>
                <option value="truckload_dispatch">Full Truck Load (FTL)</option>
                <option value="custom_printing">Bottle / Jar Custom Branding</option>
                <option value="custom_caps">Custom Lug / Plastic Caps</option>
                <option value="regular_supply">Monthly Contract Supply</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Quantity</label>
              <input
                type="text"
                placeholder="e.g. 5,000 Jars / 200 Cartons"
                value={formData.estimatedQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedQuantity: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specific Product Requirements</label>
            <textarea
              rows="3"
              placeholder="Mention sizes, shapes, cap colors, or special packing requirements..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-5 h-5 text-emerald-300" />
            <span>Submit RFQ on WhatsApp</span>
          </button>
        </form>

      </div>

    </div>
  );
};
