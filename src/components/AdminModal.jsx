import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  Package, 
  Settings, 
  AlertCircle 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';

export const AdminModal = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefault 
  } = useProducts();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editCartonPcs, setEditCartonPcs] = useState('');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    itemCode: '',
    aliasName: '',
    category: 'jars',
    categoryName: 'Glass Jars & Storage',
    price: '',
    piecesPerCarton: '',
    image: '',
    capacity: '',
    mouthSize: '',
    material: 'Clear Soda Lime Glass',
    description: '',
    inStock: true,
    featured: false
  });

  if (!isAdminOpen) return null;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.piecesPerCarton) {
      alert('Please fill product name, price, and pieces per carton.');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === newProduct.category);
    addProduct({
      ...newProduct,
      categoryName: catObj ? catObj.name : 'Glassware',
      image: newProduct.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
    });

    alert('Product added successfully!');
    setActiveTab('list');
    setNewProduct({
      name: '',
      itemCode: '',
      aliasName: '',
      category: 'jars',
      categoryName: 'Glass Jars & Storage',
      price: '',
      piecesPerCarton: '',
      image: '',
      capacity: '',
      mouthSize: '',
      material: 'Clear Soda Lime Glass',
      description: '',
      inStock: true,
      featured: false
    });
  };

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditCartonPcs(p.piecesPerCarton || 1);
  };

  const handleSaveEdit = (id) => {
    updateProduct(id, {
      price: Number(editPrice),
      piecesPerCarton: Number(editCartonPcs)
    });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-600 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Catalog & Inventory Management</h2>
              <p className="text-xs text-slate-400">
                Add new glassware items, update carton rates, or change stock availability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'list' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                activeTab === 'add' 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Add New Item
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset catalog to default Ruup Glass products? Custom added items will be reset.')) {
                resetToDefault();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
          </button>
        </div>

        {/* Tab 1: Product List */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Code / Alias</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Rate (₹/Pc)</th>
                    <th className="p-3">Carton Size</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((p) => {
                    const isEditing = editingId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 flex items-center gap-2.5">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" 
                          />
                          <span className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                            {p.name}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          #{p.itemCode} {p.aliasName && `(${p.aliasName})`}
                        </td>
                        <td className="p-3 text-slate-600">
                          {p.categoryName}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-16 px-2 py-1 border border-brand-500 rounded font-bold"
                            />
                          ) : (
                            <span className="font-bold text-slate-900">₹{p.price}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editCartonPcs}
                              onChange={(e) => setEditCartonPcs(e.target.value)}
                              className="w-16 px-2 py-1 border border-brand-500 rounded font-bold"
                            />
                          ) : (
                            <span className="font-semibold text-slate-700">{p.piecesPerCarton || 1} pcs</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.inStock 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded font-bold"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="p-1 text-slate-500 hover:text-brand-600 rounded"
                              title="Edit Price & Packaging"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Add New Product Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 500ML HEXAGONAL HONEY GLASS JAR"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Code</label>
                <input
                  type="text"
                  placeholder="e.g. 23500"
                  value={newProduct.itemCode}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, itemCode: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alias / Model</label>
                <input
                  type="text"
                  placeholder="e.g. HEX-500"
                  value={newProduct.aliasName}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, aliasName: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate (₹ / Pc) *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 25"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pcs / Carton *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 24"
                  value={newProduct.piecesPerCarton}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, piecesPerCarton: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. 500ml / 500gm"
                  value={newProduct.capacity}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, capacity: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mouth / Neck Size</label>
                <input
                  type="text"
                  placeholder="e.g. 63mm Lug"
                  value={newProduct.mouthSize}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, mouthSize: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows="2"
                placeholder="Product wholesale highlights..."
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Add Product to Live Catalog
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
