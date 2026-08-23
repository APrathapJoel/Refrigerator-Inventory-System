import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Printer, CheckCircle, Plus, Zap, Search, ArrowRight } from 'lucide-react';

export default function ShoppingListModal({ isOpen, onClose, shoppingList = [], onQuickRestock, onCustomStockIn }) {
  if (!isOpen) return null;

  const [searchFilter, setSearchFilter] = useState('');
  const [restockingId, setRestockingId] = useState(null);

  const filteredList = useMemo(() => {
    if (!searchFilter.trim()) return shoppingList;
    return shoppingList.filter(item => 
      item.item_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.category_name && item.category_name.toLowerCase().includes(searchFilter.toLowerCase()))
    );
  }, [shoppingList, searchFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleQuickRestockClick = async (item) => {
    setRestockingId(item.item_id);
    if (onQuickRestock) {
      await onQuickRestock(item);
    }
    setRestockingId(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
            <ShoppingCart size={24} /> Auto-Generated Reorder Shopping List
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {shoppingList.length} item(s) below minimum threshold requiring replenishment.
          </p>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search shopping list..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '6px 10px 6px 30px', background: '#0f172a' }}
            />
          </div>
        </div>

        {/* List Content */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #334155', borderRadius: '12px', background: '#0f172a' }}>
          {filteredList && filteredList.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', background: '#1e293b' }}>
                  <th style={{ padding: '10px 14px' }}>Item & Category</th>
                  <th style={{ padding: '10px 14px' }}>Stock / Min</th>
                  <th style={{ padding: '10px 14px' }}>Suggested Order</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map(item => (
                  <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.item_name}
                        {item.urgency === 'CRITICAL' && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category_name}</div>
                    </td>
                    
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: item.current_stock <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{item.current_stock}</span>
                      <span style={{ color: 'var(--text-muted)' }}> / {item.min_threshold} {item.unit}</span>
                    </td>

                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#34d399' }}>
                      + {item.suggested_reorder_quantity} {item.unit}
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleQuickRestockClick(item)}
                          disabled={restockingId === item.item_id}
                          className="btn btn-primary"
                          style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
                          title={`Instantly Stock In ${item.suggested_reorder_quantity} ${item.unit}`}
                        >
                          <Zap size={14} />
                          {restockingId === item.item_id ? 'Restocking...' : `+${item.suggested_reorder_quantity}`}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (onCustomStockIn) onCustomStockIn(item);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                          title="Custom Stock In with Expiration Date"
                        >
                          <Plus size={14} /> Custom
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: '#34d399', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={36} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>All Stock Levels Are Sufficient!</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {searchFilter ? 'No items match your search filter.' : 'All inventory items are currently above their minimum threshold.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ gap: '6px' }}>
            <Printer size={16} /> Print / Export List
          </button>
          <button onClick={onClose} className="btn btn-cyan">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
