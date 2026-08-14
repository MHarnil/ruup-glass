import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Package, 
  Truck, 
  ShieldCheck, 
  Layers, 
  FileText,
  Minus,
  Plus
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/categories';

export const ProductModal = () => {
  const { selectedProductForModal, setSelectedProductForModal } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();
  const [cartons, setCartons] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!selectedProductForModal) return null;
  const p = selectedProductForModal;

  const pcsPerCarton = p.piecesPerCarton || 1;
  const totalPieces = cartons * pcsPerCarton;
  const totalCartonPrice = totalPieces * p.price;

  const handleAddAndClose = () => {
    addToCart(p, cartons);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedProductForModal(null);
      setIsCartOpen(true);
    }, 600);
  };

  const singleProductWhatsAppLink = () => {
    const text = `Hello Ruup Glass Team,\n\nI want to inquire about wholesale trade pricing for:\n📦 *${p.name}*\n• Item Code: #${p.itemCode} (Alias: ${p.aliasName || 'N/A'})\n• Required Cartons: *${cartons} Box(es)* (${totalPieces} pcs @ ₹${p.price}/pc)\n• Estimated Total: ₹${totalCartonPrice.toLocaleString('en-IN')}\n\nPlease share dispatch timeline from Surat godown.`;
    return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          
          {/* Left Product Image Section */}
          <div className="relative aspect-square md:aspect-auto bg-slate-100 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-200">
            <img
              src={p.image}
              alt={p.name}
              className="max-h-[380px] w-auto object-contain drop-shadow-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="bg-slate-900/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                Code: {p.itemCode}
              </span>
              {p.aliasName && (
                <span className="bg-brand-50 text-brand-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-brand-200">
                  {p.aliasName}
                </span>
              )}
            </div>
          </div>

          {/* Right Product Details & Trade Calculator */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                <Package className="w-3.5 h-3.5" />
                <span>{p.categoryName}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {p.name}
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            {/* Technical Specification Table */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Wholesale Specifications
              </p>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Capacity / Volume:</span>
                  <span className="font-semibold">{p.capacity || 'Standard Size'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Neck / Mouth Fit:</span>
                  <span className="font-semibold">{p.mouthSize || 'Standard Lug / Cap'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Carton Packing:</span>
                  <span className="font-semibold text-brand-700">{pcsPerCarton} Pieces / Box</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Material Quality:</span>
                  <span className="font-semibold">{p.material || 'Lead-Free Clear Glass'}</span>
                </div>
              </div>
            </div>

            {/* Pricing & Carton Calculator Box */}
            <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{p.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1">/ piece</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">
                    ₹{(p.price * pcsPerCarton).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">per carton</span>
                </div>
              </div>

              {/* Carton Incrementer */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-brand-200/60">
                <span className="text-xs font-bold text-slate-700">Select Cartons:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white p-0.5">
                  <button
                    onClick={() => setCartons(prev => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="px-3 text-center min-w-[48px]">
                    <span className="text-sm font-bold text-slate-900">{cartons}</span>
                    <span className="text-[9px] text-slate-400 block -mt-0.5">cartons</span>
                  </div>
                  <button
                    onClick={() => setCartons(prev => prev + 1)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-brand-900 bg-white p-2 rounded-xl border border-brand-200">
                <span>Calculated Total ({totalPieces} pcs):</span>
                <span className="text-base text-brand-700">₹{totalCartonPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={handleAddAndClose}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Trade Quote!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {cartons} Cartons to Quote</span>
                  </>
                )}
              </button>

              <a
                href={singleProductWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Quote</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
