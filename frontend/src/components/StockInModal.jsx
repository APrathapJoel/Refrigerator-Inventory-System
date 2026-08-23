import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Calendar, PackagePlus, Filter, Search, Tag } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Fruits' },
  { id: 2, name: 'Vegetables' },
  { id: 3, name: 'Dairy Products' },
  { id: 4, name: 'Baking Products' },
  { id: 5, name: 'Dessert Products' },
  { id: 6, name: 'Raw Materials & Other' }
];

export default function StockInModal({ isOpen, onClose, items = [], categories = [], preSelectedItem, onSubmit, onOpenNewItemModal }) {
  if (!isOpen) return null;

  const validCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemId, setItemId] = useState(preSelectedItem ? preSelectedItem.id : '');
  const [quantity, setQuantity] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState('');
  const [reason, setReason] = useState('Stock In');
  const [error, setError] = useState('');

  // Filter items according to selected category and search input
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = filterCategory ? String(item.category_id) === String(filterCategory) : true;
      const matchSearch = searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchCategory && matchSearch;
    });
  }, [items, filterCategory, searchQuery]);

  // Handle preselection and category updates
  useEffect(() => {
    if (preSelectedItem) {
      setItemId(preSelectedItem.id);
      if (preSelectedItem.category_id) {
        setFilterCategory(String(preSelectedItem.category_id));
      }
    } else if (filteredItems.length > 0 && (!itemId || !filteredItems.some(i => String(i.id) === String(itemId)))) {
      setItemId(filteredItems[0].id);
    }
  }, [preSelectedItem, filterCategory, searchQuery]);

  const selectedItemObj = items.find(i => String(i.id) === String(itemId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemId) {
      setError('Please select an ingredient / material');
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid positive quantity');
      return;
    }

    onSubmit({
      item_id: parseInt(itemId),
      quantity: parseFloat(quantity),
      purchase_date: purchaseDate,
      expiration_date: expirationDate || null,
      reason: reason
    });
    onClose();
  };

  // Group filtered items by category name
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach(item => {
      const catName = item.category_name || 'Other';
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
            <PackagePlus size={24} /> Stock In (Add to Inventory)
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quick Filter Section: Category + Search */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} /> Filter Ingredients by Category & Search
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              {/* Category Filter */}
              <div>
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                  }}
                  style={{ fontSize: '0.84rem', padding: '8px 10px', background: '#1e293b' }}
                >
                  <option value="">📂 All Categories ({items.length})</option>
                  {validCategories.map(cat => {
                    const count = items.filter(i => String(i.category_id) === String(cat.id)).length;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Keyword Quick Search */}
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Quick find material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.84rem', padding: '8px 10px 8px 32px', background: '#1e293b' }}
                />
              </div>
            </div>
          </div>

          {/* Select Item dropdown with Optgroups */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Selected Material ({filteredItems.length} available)
              </label>
              <button
                type="button"
                onClick={onOpenNewItemModal}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                + Create New Item
              </button>
            </div>
            
            {filteredItems.length === 0 ? (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', borderRadius: '8px', fontSize: '0.85rem', color: '#fca5a5' }}>
                No materials match the filter. <button type="button" onClick={() => { setFilterCategory(''); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer' }}>Reset filters</button> or create a new item.
              </div>
            ) : (
              <select
                className="form-select"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                required
              >
                {Object.keys(groupedItems).map(catName => (
                  <optgroup key={catName} label={`── ${catName} ──`}>
                    {groupedItems[catName].map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name} [Current: {i.current_stock} {i.unit}]
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}

            {/* Current Item Quick Info Pill */}
            {selectedItemObj && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span className="badge" style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8' }}>
                  <Tag size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {selectedItemObj.category_name}
                </span>
                <span>Current Stock: <strong style={{ color: '#fff' }}>{selectedItemObj.current_stock} {selectedItemObj.unit}</strong></span>
                <span>• Min Threshold: <strong style={{ color: '#fff' }}>{selectedItemObj.min_threshold} {selectedItemObj.unit}</strong></span>
              </div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Intake Quantity</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="e.g. 5.0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input
                type="text"
                className="form-input"
                value={selectedItemObj ? selectedItemObj.unit : 'units'}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                className="form-input"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                className="form-input"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Stock In Reason</label>
            <select
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Stock In">Initial Stock / Regular Purchase</option>
              <option value="Restock">Supplier Restock</option>
              <option value="Fresh Restock">Fresh Produce Restock</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={filteredItems.length === 0}>
              <Plus size={18} /> Confirm Stock In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
