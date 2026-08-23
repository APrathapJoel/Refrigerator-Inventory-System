import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Fruits' },
  { id: 2, name: 'Vegetables' },
  { id: 3, name: 'Dairy Products' },
  { id: 4, name: 'Baking Products' },
  { id: 5, name: 'Dessert Products' },
  { id: 6, name: 'Raw Materials & Other' }
];

export default function NewItemModal({ isOpen, onClose, categories = [], onSubmit }) {
  if (!isOpen) return null;

  const validCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [categoryId, setCategoryId] = useState(validCategories[0].id);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minThreshold, setMinThreshold] = useState('1.0');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter item name');
      return;
    }
    onSubmit({
      category_id: parseInt(categoryId),
      name: name.trim(),
      unit: unit.trim(),
      min_threshold: parseFloat(minThreshold) || 1.0
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
            <PlusCircle size={24} /> Create New Ingredient
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Category</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {validCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Extra Virgin Olive Oil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <select
                className="form-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="g">g (Grams)</option>
                <option value="lbs">lbs (Pounds)</option>
                <option value="oz">oz (Ounces)</option>
                <option value="liters">liters (Liters)</option>
                <option value="ml">ml (Milliliters)</option>
                <option value="units">units (Items / Pieces)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Threshold</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-cyan" style={{ flex: 2 }}>
              Save Ingredient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
