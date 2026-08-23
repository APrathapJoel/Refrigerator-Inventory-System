import React from 'react';
import { Apple, Carrot, Milk, Cookie, Cake, Flame, Layers } from 'lucide-react';

const categoryIcons = {
  'Fruits': <Apple size={22} color="#f43f5e" />,
  'Vegetables': <Carrot size={22} color="#10b981" />,
  'Dairy Products': <Milk size={22} color="#38bdf8" />,
  'Baking Products': <Cookie size={22} color="#f59e0b" />,
  'Dessert Products': <Cake size={22} color="#ec4899" />,
  'Raw Materials & Other': <Flame size={22} color="#a855f7" />
};

export default function CategoryGrid({ categories, selectedCategory, onSelectCategory, items }) {
  if (!categories) return null;

  // Calculate item counts per category
  const counts = {};
  if (items) {
    items.forEach(item => {
      counts[item.category_id] = (counts[item.category_id] || 0) + 1;
    });
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-cyan)" /> Food Category Architecture
        </h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            Show All Categories
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px'
      }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === String(cat.id);
          const count = counts[cat.id] || 0;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? '' : String(cat.id))}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                borderRadius: '14px',
                border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                background: '#0f172a',
                padding: '10px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #334155'
              }}>
                {categoryIcons[cat.name] || <Apple size={20} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {count} {count === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
