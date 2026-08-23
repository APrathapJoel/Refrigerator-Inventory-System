import React from 'react';
import { Package, AlertCircle, Clock, AlertOctagon } from 'lucide-react';

export default function SummaryCards({ summary, onFilterStatus }) {
  if (!summary) return null;

  const cards = [
    {
      id: 'ALL',
      title: 'Total Stocked Items',
      count: summary.total_items,
      icon: <Package size={24} color="#10b981" />,
      borderColor: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      subtitle: 'Across 6 Food Categories'
    },
    {
      id: 'LOW_STOCK',
      title: 'Low Stock Items',
      count: summary.low_stock_count,
      icon: <AlertCircle size={24} color="#f59e0b" />,
      borderColor: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
      subtitle: 'Below Min Threshold'
    },
    {
      id: 'EXPIRING_SOON',
      title: 'Expiring Soon',
      count: summary.expiring_soon_count,
      icon: <Clock size={24} color="#f97316" />,
      borderColor: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.1)',
      subtitle: 'Within 3 Days'
    },
    {
      id: 'EXPIRED',
      title: 'Expired / Out of Stock',
      count: summary.expired_count + summary.out_of_stock_count,
      icon: <AlertOctagon size={24} color="#ef4444" />,
      borderColor: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.1)',
      subtitle: 'Requires Immediate Action'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {cards.map(card => (
        <div
          key={card.id}
          className="glass-panel glass-panel-interactive"
          onClick={() => onFilterStatus && onFilterStatus(card.id === 'ALL' ? '' : card.id)}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderLeft: `4px solid ${card.borderColor}`,
            background: `linear-gradient(135deg, ${card.bgGlow}, transparent)`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{card.title}</span>
            {card.icon}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {card.count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {card.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
}
