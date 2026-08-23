# Refrigerator & Pantry Inventory System - Simplified Prototype Specification

A clean, realistic, and lightweight **Refrigerator & Pantry Inventory Management System** built with **Node.js/Express + SQLite** and **React + Vite**.

---

## 1. Core Food Categories

1. **Fruits** (e.g., Gala Apples, Strawberries, Lemons, Bananas)
2. **Vegetables** (e.g., Baby Spinach, Carrots, Yellow Onions, Garlic Cloves, Roma Tomatoes)
3. **Dairy Products** (e.g., Whole Milk, Cheddar Cheese, Unsalted Butter, Heavy Cream)
4. **Baking Products** (e.g., All-Purpose Flour, Granulated Sugar, Active Dry Yeast, Baking Powder)
5. **Dessert Products** (e.g., Dark Chocolate Chips, Tart Pastry Shells, Maple Syrup)
6. **Raw Materials & Other** (e.g., Chicken Breast, Extra Virgin Olive Oil, Black Pepper, Soy Sauce)

---

## 2. Database Schema (SQLite)

```sql
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
    unit TEXT NOT NULL, -- kg, liters, units, g, etc.
    min_threshold REAL NOT NULL DEFAULT 1.0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. Inventory Transactions Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('IN', 'OUT')),
    quantity REAL NOT NULL,
    purchase_date TEXT,
    expiration_date TEXT,
    timestamp TEXT DEFAULT (datetime('now', 'localtime')),
    reason TEXT, -- 'Stock In', 'Used / Consumed', 'Spoiled / Expired', 'Transferred'
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
```

---

## 3. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all 6 food categories |
| `GET` | `/api/items` | List inventory items with calculated current stock and health badges |
| `POST` | `/api/items` | Add a new food item definition (with unit & min threshold) |
| `POST` | `/api/transactions/in` | Stock In (add quantity, purchase date, and expiration date) |
| `POST` | `/api/transactions/out` | Stock Out (deduct quantity with reason) |
| `GET` | `/api/dashboard/summary` | Get metric counts (total items, low stock, expiring soon, expired, out of stock) |
| `GET` | `/api/alerts/expiring` | Get items expiring within 3 days or already expired |
| `GET` | `/api/alerts/shopping-list` | Get auto-generated restock shopping list for items below threshold |
| `GET` | `/api/transactions/history` | Get complete transaction audit history |

---

## 4. How to Run Locally

### Start Backend Server (Express + SQLite)
```bash
cd backend
npm install
node server.js
```
*Runs on: `http://localhost:5000`*

### Start Frontend Web App (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Runs on: `http://localhost:5173`*
