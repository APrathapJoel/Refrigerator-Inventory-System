import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import CategoryGrid from './components/CategoryGrid';
import InventoryTable from './components/InventoryTable';
import StockInModal from './components/StockInModal';
import StockOutModal from './components/StockOutModal';
import ShoppingListModal from './components/ShoppingListModal';
import NewItemModal from './components/NewItemModal';
import { Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Fruits' },
  { id: 2, name: 'Vegetables' },
  { id: 3, name: 'Dairy Products' },
  { id: 4, name: 'Baking Products' },
  { id: 5, name: 'Dessert Products' },
  { id: 6, name: 'Raw Materials & Other' }
];

export default function App() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [items, setItems] = useState([]);
  const [expiringAlerts, setExpiringAlerts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal States
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [modalSelectedItem, setModalSelectedItem] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // 1. Fetch Categories
      const catRes = await fetch(`${API_BASE}/categories`);
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      // 2. Fetch Summary Metrics
      const sumRes = await fetch(`${API_BASE}/dashboard/summary`);
      const sumData = await sumRes.json();
      if (sumData.success) setSummary(sumData.data);

      // 3. Fetch Items with current filters
      let itemsUrl = `${API_BASE}/items?`;
      if (selectedCategory) itemsUrl += `category_id=${selectedCategory}&`;
      if (searchQuery) itemsUrl += `search=${encodeURIComponent(searchQuery)}&`;
      if (selectedStatus) itemsUrl += `status=${selectedStatus}&`;

      const itemsRes = await fetch(itemsUrl);
      const itemsData = await itemsRes.json();
      if (itemsData.success) setItems(itemsData.data);

      // 4. Fetch Expiring Alerts
      const expRes = await fetch(`${API_BASE}/alerts/expiring`);
      const expData = await expRes.json();
      if (expData.success) setExpiringAlerts(expData.data);

      // 5. Fetch Auto Shopping List
      const shopRes = await fetch(`${API_BASE}/alerts/shopping-list`);
      const shopData = await shopRes.json();
      if (shopData.success) setShoppingList(shopData.data);

    } catch (err) {
      console.error('Error connecting to backend API:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery, selectedStatus]);

  // Handlers for Stock In & Out
  const handleStockInSubmit = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Stock In Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to execute Stock In');
    }
  };

  const handleStockOutSubmit = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Stock Out Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to execute Stock Out');
    }
  };

  const handleCreateNewItem = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setModalSelectedItem(data.data);
        setIsStockInOpen(true);
      } else {
        alert('Create Item Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to create new item');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
      
      {/* Navbar Header */}
      <Header
        summary={summary}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onRefresh={fetchData}
      />

      {/* Urgent Expiring Alert Banner */}
      {expiringAlerts && expiringAlerts.length > 0 && (
        <div className="glass-panel" style={{
          padding: '14px 20px',
          marginBottom: '20px',
          borderLeft: '4px solid #f97316',
          background: 'rgba(249, 115, 22, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={22} color="#f97316" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                Expiration Alert: {expiringAlerts.length} batch(es) near expiration!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Prioritize using: {expiringAlerts.slice(0, 3).map(a => `${a.item_name} (${a.expiration_date})`).join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus('EXPIRING_SOON')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Filter Expiring Items
          </button>
        </div>
      )}

      {/* Metric Summary Cards */}
      <SummaryCards
        summary={summary}
        onFilterStatus={(status) => setSelectedStatus(status)}
      />

      {/* 6 Food Category Grid */}
      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        items={items}
      />

      {/* Primary Inventory Table */}
      <InventoryTable
        items={items}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onStockIn={(item) => {
          setModalSelectedItem(item);
          setIsStockInOpen(true);
        }}
        onStockOut={(item) => {
          setModalSelectedItem(item);
          setIsStockOutOpen(true);
        }}
        onAddNewItem={() => setIsNewItemOpen(true)}
      />

      {/* Action Modals */}
      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => { setIsStockInOpen(false); setModalSelectedItem(null); }}
        items={items}
        categories={categories}
        preSelectedItem={modalSelectedItem}
        onSubmit={handleStockInSubmit}
        onOpenNewItemModal={() => { setIsStockInOpen(false); setIsNewItemOpen(true); }}
      />

      <StockOutModal
        isOpen={isStockOutOpen}
        onClose={() => { setIsStockOutOpen(false); setModalSelectedItem(null); }}
        items={items}
        categories={categories}
        preSelectedItem={modalSelectedItem}
        onSubmit={handleStockOutSubmit}
      />

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        shoppingList={shoppingList}
      />

      <NewItemModal
        isOpen={isNewItemOpen}
        onClose={() => setIsNewItemOpen(false)}
        categories={categories}
        onSubmit={handleCreateNewItem}
      />

    </div>
  );
}
