import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Package, 
  Truck, 
  ShieldCheck, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Share2, 
  FileText,
  Warehouse,
  Plus,
  Minus,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { COMPANY_INFO } from '../data/categories';
import { ProductCard } from './ProductCard';

export const ProductPage = ({ product, onBack }) => {
  const { products, setIsRfqOpen } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartons, setCartons] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setCartons(1);
  }, [product.id]);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'];

  const pcsPerCarton = product.piecesPerCarton || 1;
  const totalPieces = cartons * pcsPerCarton;
  const totalCartonPrice = totalPieces * product.price;

  // Format exact SKU
  const skuText = product.aliasName 
    ? `${product.itemCode} · ${product.aliasName}` 
    : String(product.itemCode);

  // Related products from the same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, cartons);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsCartOpen(true);
    }, 500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const productWhatsAppLink = () => {
    let text = `📦 *PRODUCT TRADE INQUIRY - RUUP GLASS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🏷️ *Product:* ${product.name}\n`;
    text += `🔢 *Exact SKU:* ${skuText}\n`;
    text += `📦 *Order Quantity:* ${cartons} Carton(s) (${totalPieces} pcs @ ₹${product.price}/pc)\n`;
    text += `💰 *Est. Trade Total:* ₹${totalCartonPrice.toLocaleString('en-IN')} (Ex-Surat Godown)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💬 *Message:* Please share stock availability, transporter freight to my city, and final proforma invoice.`;
    return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-5 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 font-bold shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 font-medium text-[11px] sm:text-xs">
            <span className="cursor-pointer hover:underline" onClick={onBack}>Catalog</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{product.categoryName}</span>
            <span>/</span>
            <span className="font-mono text-brand-700 font-bold bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
              SKU: {skuText}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors text-[11px]"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Main Product Section: 2 Columns */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs sm:shadow-sm overflow-hidden p-4 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              {/* Main Active Image with Zoom Frame */}
              <div className="relative aspect-square rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center p-3 sm:p-4 group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-1.5">
                  <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                    SKU: {skuText}
                  </span>
                  {product.inStock && (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">
                      In Stock • Surat Godown
                    </span>
                  )}
                </div>

                {/* Image Navigation Arrows for Multi-image products */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/90 shadow-md text-slate-700 hover:text-brand-600 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/90 shadow-md text-slate-700 hover:text-brand-600 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* Image counter indicator */}
                {images.length > 1 && (
                  <span className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 text-[9px] sm:text-[11px] font-bold bg-slate-900/70 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    {selectedImageIndex + 1} / {images.length} Photos
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 border-2 shrink-0 transition-all p-1 ${
                        selectedImageIndex === idx
                          ? 'border-brand-600 ring-2 ring-brand-200 shadow-xs'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info, Carton Pricing Math & Actions */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              
              {/* Category, Title & Prominent SKU */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-brand-600 uppercase tracking-wider">
                  <div className="inline-flex items-center gap-1 bg-brand-50 border border-brand-200 text-brand-800 px-2 py-0.5 rounded-md font-mono font-bold text-[11px]">
                    <Tag className="w-3 h-3 text-brand-600" />
                    <span>SKU: {skuText}</span>
                  </div>

                  <span className="text-slate-400">•</span>

                  <span>{product.categoryName}</span>
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Wholesale Pricing Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 border border-slate-200 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      ₹{product.price}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1">/ piece (Ex-Tax)</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-brand-200 shadow-xs">
                      {pcsPerCarton} Pcs / Master Box
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 sm:pt-3 border-t border-slate-200/80">
                  <span className="text-slate-600 font-medium">Single Carton (1 Box) Total:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    ₹{(product.price * pcsPerCarton).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Carton Stepper & Live Calculation */}
                <div className="pt-2 sm:pt-3 border-t border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Order Quantity (Cartons):</span>
                    
                    <div className="flex items-center border border-slate-300 rounded-lg sm:rounded-xl bg-white p-0.5 sm:p-1 shadow-xs">
                      <button
                        onClick={() => setCartons(prev => Math.max(1, prev - 1))}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 rounded text-slate-700 active:scale-95 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <div className="px-3 sm:px-4 text-center min-w-[40px] sm:min-w-[54px]">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">{cartons}</span>
                        <span className="text-[9px] text-slate-400 block -mt-1 font-semibold">Boxes</span>
                      </div>
                      <button
                        onClick={() => setCartons(prev => prev + 1)}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 rounded text-slate-700 active:scale-95 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calculated summary pill */}
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-brand-200 text-xs font-bold text-brand-950">
                    <span>Total: {totalPieces.toLocaleString('en-IN')} pcs</span>
                    <span className="text-sm sm:text-base text-brand-700 font-extrabold">₹{totalCartonPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Quote & Add to Trade Cart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98"
                >
                  {addedAnimation ? (
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
                  href={productWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Trade Order</span>
                </a>
              </div>

              {/* Technical Specifications Table */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  <span>Technical & Packaging Specifications</span>
                </h3>

                <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] sm:text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Exact SKU / Code</span>
                    <span className="font-mono font-bold text-brand-800">{skuText}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Category</span>
                    <span className="font-semibold text-slate-800">{product.categoryName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Capacity / Volume</span>
                    <span className="font-semibold text-slate-800">{product.capacity || 'Commercial Standard'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Neck / Mouth Fit</span>
                    <span className="font-semibold text-slate-800">{product.mouthSize || 'Standard Lug / Closure'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Packaging Carton</span>
                    <span className="font-bold text-brand-700">{pcsPerCarton} pcs / Master Carton</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Glass Quality</span>
                    <span className="font-semibold text-slate-800">{product.material || 'Lead-Free Soda Lime Glass'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Dispatch Godown</span>
                    <span className="font-semibold text-slate-800">Surat, Gujarat</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] sm:text-[11px]">Minimum Trade Order</span>
                    <span className="font-semibold text-slate-800">1 Master Carton Box</span>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              {product.description && (
                <div className="space-y-1.5 pt-1">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Product Description & Application
                  </h3>
                  <div className="text-[11px] sm:text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Bulk Container / Custom Printing banner */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900">Need Bulk Truckload or Custom Printing?</p>
                  <p className="text-amber-800/80 text-[10px] sm:text-[11px]">We offer custom silk screen branding & direct container pricing.</p>
                </div>
                <button
                  onClick={() => setIsRfqOpen(true)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg sm:rounded-xl shrink-0 transition-colors text-[11px] sm:text-xs"
                >
                  Custom RFQ
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Grid: 4 columns on desktop, 2 columns on mobile */}
        {relatedProducts.length > 0 && (
          <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Related {product.categoryName}
              </h2>
              <button
                onClick={onBack}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                View All in Category →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-4.5">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
