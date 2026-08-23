-- Refrigerator & Pantry Inventory System Database Schema
-- Core Tables: categories, items, inventory_transactions

PRAGMA foreign_keys = ON;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 2. Items Table
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g., kg, lbs, liters, units, g, oz
    min_threshold REAL NOT NULL DEFAULT 1.0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. Inventory Transactions Table (Stock In & Stock Out)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('IN', 'OUT')),
    quantity REAL NOT NULL,
    purchase_date TEXT, -- YYYY-MM-DD
    expiration_date TEXT, -- YYYY-MM-DD
    timestamp TEXT DEFAULT (datetime('now', 'localtime')),
    reason TEXT, -- e.g., 'Initial Stock', 'Used/Consumed', 'Spoiled/Wasted', 'Transferred', 'Restock'
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_item ON inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_exp ON inventory_transactions(expiration_date);
