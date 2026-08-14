import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Eye, 
  Check, 
  Sparkles,
  Images,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { openProductPage } = useProducts();
  const [cartons, setCartons] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const pcsPerCarton = product.piecesPerCarton || 1;
  const totalPieces = cartons * pcsPerCarton;
  const totalCartonPrice = totalPieces * product.price;

  const imagesCount = product.images ? product.images.length : 1;
  
  // Format exact SKU
  const skuText = product.aliasName 
    ? `${product.itemCode} · ${product.aliasName}` 
    : String(product.itemCode);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, cartons);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1200);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    setCartons(prev => prev + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    setCartons(prev => Math.max(1, prev - 1));
  };

  return (
    <div 
      onClick={() => openProductPage(product)}
      className="group relative flex flex-col justify-between bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs sm:shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image || (product.images && product.images[0])}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-mono font-bold px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded shadow-sm">
            #{product.itemCode}
          </span>
          {product.featured && (
            <span className="bg-amber-500 text-slate-950 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:px-2 rounded shadow-sm inline-flex items-center gap-0.5">
              <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Best
            </span>
          )}
        </div>

        {/* Multi-image count badge */}
        {imagesCount > 1 && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 z-10">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:px-2 rounded shadow-sm inline-flex items-center gap-1">
              <Images className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-300" />
              <span>{imagesCount} Photos</span>
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductPage(product);
          }}
          className="absolute bottom-2 right-2 p-1.5 sm:p-2 bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-600 rounded-lg sm:rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
          title="Open Product Page"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* In Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body Content */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-2.5">
        
        {/* Title and Exact SKU */}
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 font-semibold mb-1">
            <span className="text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-100 truncate max-w-[130px] sm:max-w-none">
              SKU: {skuText}
            </span>
          </div>

          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Wholesale Price & Packaging Specs */}
        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ₹{product.price}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium ml-0.5">/pc</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-bold text-brand-700">
                {pcsPerCarton} pcs
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">/carton</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] sm:text-[11px]">
            <span className="text-slate-500">Box Total:</span>
            <span className="font-bold text-slate-800">
              ₹{(product.price * pcsPerCarton).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Carton Selector & Add to Enquiry Actions */}
        <div className="space-y-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center border border-slate-200 rounded-lg sm:rounded-xl bg-white p-0.5">
              <button
                onClick={handleDecrement}
                className="p-1 sm:p-1.5 hover:bg-slate-100 rounded text-slate-600 active:scale-95 transition-transform"
                title="Decrease cartons"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <div className="px-1 sm:px-2 text-center min-w-[24px] sm:min-w-[32px]">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900">{cartons}</span>
              </div>
              <button
                onClick={handleIncrement}
                className="p-1 sm:p-1.5 hover:bg-slate-100 rounded text-slate-600 active:scale-95 transition-transform"
                title="Increase cartons"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-brand-600 text-white shadow-xs active:scale-98'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{cartons > 1 ? `${cartons} Boxes` : 'Add Box'}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[9px] sm:text-[10px] text-center text-slate-400 truncate">
            {totalPieces.toLocaleString('en-IN')} pcs • ₹{totalCartonPrice.toLocaleString('en-IN')}
          </p>
        </div>

      </div>

    </div>
  );
};
