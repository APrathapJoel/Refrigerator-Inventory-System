import React from 'react';
import { Search, Plus, Minus, Filter, AlertTriangle, Calendar, Layers } from 'lucide-react';

export default function InventoryTable({
  items,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onStockIn,
  onStockOut,
  onAddNewItem
}) {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      
      {/* Controls & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        
        {/* Left: Search input & Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search ingredient (e.g., Apple, Chicken, Milk)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '170px' }}
          >
            <option value="">All Statuses</option>
            <option value="SUFFICIENT">🟢 Sufficient</option>
            <option value="LOW_STOCK">🟡 Low Stock</option>
            <option value="EXPIRING_SOON">🟠 Expiring Soon</option>
            <option value="EXPIRED">🔴 Expired</option>
            <option value="OUT_OF_STOCK">🔴 Out of Stock</option>
          </select>
        </div>

        {/* Right: Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onAddNewItem} className="btn btn-secondary">
            + New Ingredient
          </button>
          <button onClick={onStockIn} className="btn btn-primary">
            <Plus size={18} /> Stock In
          </button>
          <button onClick={onStockOut} className="btn btn-danger">
            <Minus size={18} /> Stock Out
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Item Name</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Current Stock</th>
              <th style={{ padding: '12px 16px' }}>Min Threshold</th>
              <th style={{ padding: '12px 16px' }}>Expiry Info</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => {
                // Stock level bar percentage
                const ratio = item.min_threshold > 0 ? Math.min(100, Math.round((item.current_stock / item.min_threshold) * 100)) : 100;
                let progressColor = '#10b981';
                if (item.status === 'LOW_STOCK') progressColor = '#f59e0b';
                if (item.status === 'EXPIRING_SOON') progressColor = '#f97316';
                if (item.status === 'EXPIRED' || item.status === 'OUT_OF_STOCK') progressColor = '#ef4444';

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s' }}>
                    
                    {/* Item Name */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>
                      {item.name}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ background: '#0f172a', padding: '4px 10px', borderRadius: '6px', border: '1px solid #334155' }}>
                        {item.category_name}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: item.current_stock <= 0 ? '#ef4444' : '#fff' }}>
                        {item.current_stock} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>{item.unit}</span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div style={{ width: '100px', height: '4px', background: '#334155', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${ratio}%`, height: '100%', background: progressColor, transition: 'width 0.3s' }} />
                      </div>
                    </td>

                    {/* Min Threshold */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {item.min_threshold} {item.unit}
                    </td>

                    {/* Nearest Expiration */}
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                      {item.nearest_expiration ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: item.status === 'EXPIRING_SOON' ? '#f97316' : item.status === 'EXPIRED' ? '#ef4444' : 'var(--text-muted)' }}>
                          <Calendar size={14} />
                          {item.nearest_expiration}
                        </div>
                      ) : (
                        <span style={{ color: '#64748b' }}>No batch date</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${
                        item.status === 'SUFFICIENT' ? 'sufficient' :
                        item.status === 'LOW_STOCK' ? 'low' :
                        item.status === 'EXPIRING_SOON' ? 'expiring' : 'expired'
                      }`}>
                        {item.status_label}
                      </span>
                    </td>

                    {/* Quick In / Out buttons */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onStockIn(item)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}
                          title="Quick Add Stock In"
                        >
                          + In
                        </button>
                        <button
                          onClick={() => onStockOut(item)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }}
                          title="Quick Deduct Stock Out"
                          disabled={item.current_stock <= 0}
                        >
                          - Out
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No items found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
