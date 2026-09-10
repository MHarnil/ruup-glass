import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ruup_products_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_PRODUCTS.length && parsed[0].images && parsed[0].images.length > 0) {
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch (e) {
      console.error('Error loading products from local storage:', e);
      return INITIAL_PRODUCTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('featured');
  const [activeProduct, setActiveProduct] = useState(null);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ruup_products_v7', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  // Handle URL hash navigation (e.g. #product-23328)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const codeOrId = hash.replace('#product-', '');
        const found = products.find(p => String(p.itemCode) === codeOrId || p.id === codeOrId || p.id === `prod-${codeOrId}`);
        if (found) {
          setActiveProduct(found);
        }
      } else if (!hash || hash === '#catalog-section' || hash === '#') {
        setActiveProduct(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  const openProductPage = (product) => {
    setActiveProduct(product);
    window.location.hash = `product-${product.itemCode || product.id}`;
  };

  const closeProductPage = () => {
    setActiveProduct(null);
    window.location.hash = '';
  };

  // Admin Actions
  const addProduct = (newProduct) => {
    const item = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      price: Number(newProduct.price),
      piecesPerCarton: Number(newProduct.piecesPerCarton) || 1,
      moqCartons: 1,
      inStock: newProduct.inStock ?? true,
      images: newProduct.images || [newProduct.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'],
      tags: newProduct.tags ? (Array.isArray(newProduct.tags) ? newProduct.tags : newProduct.tags.split(',').map(s => s.trim())) : []
    };
    setProducts(prev => [item, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('ruup_products_v7');
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // In stock check
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Price range
      if (p.price < priceRange.min || p.price > priceRange.max) {
        return false;
      }
      // Search query across name, code, alias, tags, brahmani/jds categories
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesCode = String(p.itemCode || '').toLowerCase().includes(q);
        const matchesAlias = String(p.aliasName || '').toLowerCase().includes(q);
        const matchesTags = p.tags?.some(tag => tag.toLowerCase().includes(q));
        const matchesCat = p.categoryName?.toLowerCase().includes(q);
        const matchesBrahmaniCat = p.brahmaniCategories?.some(bc => bc.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesAlias && !matchesTags && !matchesCat && !matchesBrahmaniCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'carton-size') return b.piecesPerCarton - a.piecesPerCarton;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, priceRange, sortBy]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      categoryCounts,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      inStockOnly,
      setInStockOnly,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      activeProduct,
      openProductPage,
      closeProductPage,
      isRfqOpen,
      setIsRfqOpen,
      isAdminOpen,
      setIsAdminOpen,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
