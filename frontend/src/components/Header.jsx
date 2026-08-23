import React from 'react';
import { Refrigerator, ShoppingBag, RefreshCw } from 'lucide-react';

export default function Header({ summary, onOpenShoppingList, onRefresh }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', borderRadius: '0 0 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            padding: '12px',
            borderRadius: '14px',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Refrigerator size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Refrigerator Inventory System
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Smart Food & Grocery Tracker
            </p>
          </div>
        </div>

        {/* Actions & Shopping List Quick Launcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenShoppingList}
            className="btn btn-cyan"
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={18} /> Reorder Shopping List
            {summary && summary.low_stock_count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
              }}>
                {summary.low_stock_count}
              </span>
            )}
          </button>
          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            title="Refresh Data"
            style={{ padding: '10px' }}
          >
            <RefreshCw size={18} />
          </button>
        </div>

      </div>
    </header>
  );
}
