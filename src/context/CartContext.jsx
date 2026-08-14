import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/categories';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ruup_trade_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ruup_trade_cart_v2', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, cartonsToAdd = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      const cartons = Math.max(1, cartonsToAdd);

      if (existingIndex > -1) {
        const updated = [...prev];
        const newCartons = updated[existingIndex].cartons + cartons;
        const totalPieces = newCartons * (product.piecesPerCarton || 1);
        const totalPrice = totalPieces * product.price;
        updated[existingIndex] = {
          ...updated[existingIndex],
          cartons: newCartons,
          totalPieces,
          totalPrice
        };
        return updated;
      } else {
        const totalPieces = cartons * (product.piecesPerCarton || 1);
        const totalPrice = totalPieces * product.price;
        return [...prev, {
          product,
          cartons,
          totalPieces,
          totalPrice
        }];
      }
    });
  };

  const updateCartons = (productId, newCartons) => {
    const qty = parseInt(newCartons, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const totalPieces = qty * (item.product.piecesPerCarton || 1);
        const totalPrice = totalPieces * item.product.price;
        return { ...item, cartons: qty, totalPieces, totalPrice };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const totalCartons = cartItems.reduce((sum, item) => sum + item.cartons, 0);
  const totalPieces = cartItems.reduce((sum, item) => sum + item.totalPieces, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const uniqueItemsCount = cartItems.length;

  // WhatsApp formatted quotation message builder
  const generateWhatsAppLink = (buyer = {}) => {
    const { name = '', city = '', firm = '', note = '' } = buyer;
    
    let text = `📦 *NEW B2B TRADE ENQUIRY - RUUP GLASS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (name) text += `👤 *Client Name:* ${name}\n`;
    if (firm) text += `🏢 *Business/Firm:* ${firm}\n`;
    if (city) text += `📍 *Delivery City/State:* ${city}\n`;
    if (note) text += `📝 *Requirement Note:* ${note}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `📋 *ORDERED ITEMS & SKUs:*\n\n`;

    cartItems.forEach((item, idx) => {
      const p = item.product;
      const sku = p.aliasName ? `${p.itemCode} · ${p.aliasName}` : String(p.itemCode);
      const cartonRate = p.price * (p.piecesPerCarton || 1);
      text += `${idx + 1}. *${p.name}*\n`;
      text += `   • *SKU:* [${sku}]\n`;
      text += `   • Cartons: *${item.cartons} Box(es)* (${item.totalPieces} pcs @ ₹${p.price}/pc)\n`;
      text += `   • Rate/Carton: ₹${cartonRate.toLocaleString('en-IN')}\n`;
      text += `   • Subtotal: *₹${item.totalPrice.toLocaleString('en-IN')}*\n\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📦 *Total Cartons:* ${totalCartons} Box(es)\n`;
    text += `🔢 *Total Pieces:* ${totalPieces.toLocaleString('en-IN')} Units\n`;
    text += `💰 *Est. Trade Total:* ₹${totalAmount.toLocaleString('en-IN')} (Ex-Surat Godown)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💬 *Requesting:* Please confirm godown stock for these SKUs, transport freight to ${city || 'my city'}, and proforma invoice.\n`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encoded}`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateCartons,
      removeFromCart,
      clearCart,
      totalCartons,
      totalPieces,
      totalAmount,
      uniqueItemsCount,
      isCartOpen,
      setIsCartOpen,
      generateWhatsAppLink
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
