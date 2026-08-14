import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  Printer, 
  CheckCircle2, 
  Truck, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  User, 
  FileSpreadsheet,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/categories';

export const QuoteDrawer = () => {
  const { 
    cartItems, 
    updateCartons, 
    removeFromCart, 
    clearCart, 
    totalCartons, 
    totalPieces, 
    totalAmount, 
    isCartOpen, 
    setIsCartOpen,
    generateWhatsAppLink
  } = useCart();

  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    firm: '',
    city: '',
    note: ''
  });

  if (!isCartOpen) return null;

  const handleWhatsAppSend = () => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }

    const url = generateWhatsAppLink(buyerInfo);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Slide-over Panel */}
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">B2B Trade Quotation</h2>
              <p className="text-xs text-slate-300">
                {cartItems.length} Product(s) • {totalCartons} Total Cartons
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Your Trade Quote is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse our wholesale catalog and select carton quantities to prepare your trade order enquiry.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Product Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Trade Cartons
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>

                {cartItems.map((item) => {
                  const p = item.product;
                  const pcsPerCarton = p.piecesPerCarton || 1;
                  const cartonPrice = pcsPerCarton * p.price;
                  const skuText = p.aliasName ? `${p.itemCode} · ${p.aliasName}` : String(p.itemCode);

                  return (
                    <div 
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5 hover:border-slate-300 transition-colors"
                    >
                      <img
                        src={p.image || (p.images && p.images[0])}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {p.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
                            SKU: {skuText}
                          </span>
                          <span className="text-[11px] text-slate-400">• ₹{p.price}/pc ({pcsPerCarton} pcs/box)</span>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          {/* Carton Stepper */}
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5">
                            <button
                              onClick={() => updateCartons(p.id, item.cartons - 1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-700 active:scale-95"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <div className="px-2 text-center min-w-[32px]">
                              <span className="text-xs font-bold text-slate-900">{item.cartons}</span>
                            </div>
                            <button
                              onClick={() => updateCartons(p.id, item.cartons + 1)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-700 active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900">
                              ₹{item.totalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              ({item.totalPieces} pcs)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buyer Info Form */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>Buyer & Dispatch Details</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Firm / Shop Name"
                    value={buyerInfo.firm}
                    onChange={(e) => setBuyerInfo(prev => ({ ...prev, firm: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Delivery City & State (e.g. Surat, Mumbai, Delhi) *"
                    value={buyerInfo.city}
                    onChange={(e) => setBuyerInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <textarea
                    rows="2"
                    placeholder="Optional: GST Number / Transport preference / Notes..."
                    value={buyerInfo.note}
                    onChange={(e) => setBuyerInfo(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Order Calculation Summary */}
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Cartons:</span>
                  <span className="font-bold text-slate-900">{totalCartons} Box(es)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Quantity:</span>
                  <span className="font-bold text-slate-900">{totalPieces.toLocaleString('en-IN')} Pieces</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Dispatch Location:</span>
                  <span className="font-bold text-brand-800">Godown, Surat (Gujarat)</span>
                </div>
                <div className="pt-2 border-t border-brand-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Estimated Total:</span>
                  <span className="text-xl font-extrabold text-brand-700">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  *Ex-godown trade pricing. Transport & GST will be calculated on proforma invoice.
                </p>
              </div>
            </>
          )}

        </div>

        {/* Footer Action Buttons */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-2.5">
            <button
              onClick={handleWhatsAppSend}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Trade Order on WhatsApp</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Quotation</span>
              </button>

              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                <span>Call Sales Desk</span>
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
