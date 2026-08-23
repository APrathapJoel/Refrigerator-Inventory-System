import React from 'react';
import { X, ShoppingCart, Printer, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ShoppingListModal({ isOpen, onClose, shoppingList }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
            <ShoppingCart size={24} /> Auto-Generated Reorder Shopping List
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Items automatically surfaced when current stock drops below the minimum defined threshold.
        </p>

        {/* List Content */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #334155', borderRadius: '12px', background: '#0f172a' }}>
          {shoppingList && shoppingList.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>Item Name</th>
                  <th style={{ padding: '10px 14px' }}>Category</th>
                  <th style={{ padding: '10px 14px' }}>Stock / Min</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Suggested Reorder</th>
                </tr>
              </thead>
              <tbody>
                {shoppingList.map(item => (
                  <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>
                      {item.item_name}
                      {item.urgency === 'CRITICAL' && (
                        <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>
                          OUT OF STOCK
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{item.category_name}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: item.current_stock <= 0 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{item.current_stock}</span> / {item.min_threshold} {item.unit}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#34d399' }}>
                      + {item.suggested_reorder_quantity} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: '#34d399', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={32} />
              <div style={{ fontWeight: 600 }}>All Stock Levels Are Sufficient!</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No items currently require reordering.</div>
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
