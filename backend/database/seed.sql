-- Seed Data for Refrigerator & Pantry Inventory System

-- Insert 6 Core Food Categories
INSERT OR IGNORE INTO categories (id, name, description) VALUES
(1, 'Fruits', 'Fresh fruits, berries, citrus, apples, and seasonal produce'),
(2, 'Vegetables', 'Leafy greens, root vegetables, onions, garlic, and fresh herbs'),
(3, 'Dairy Products', 'Milk, cheeses, butter, yogurt, and fresh cream'),
(4, 'Baking Products', 'Flour, sugar, yeast, baking powder, cocoa, and extracts'),
(5, 'Dessert Products', 'Chocolate, pastry shells, fruit syrups, and dessert toppings'),
(6, 'Raw Materials & Other', 'Meats, poultry, oils, vinegars, spices, sauces, and dry grains');

-- Insert Sample Items across categories
INSERT OR IGNORE INTO items (id, category_id, name, unit, min_threshold) VALUES
-- Fruits
(1, 1, 'Organic Gala Apples', 'kg', 3.0),
(2, 1, 'Fresh Strawberries', 'kg', 1.5),
(3, 1, 'Lemons', 'units', 10.0),
(4, 1, 'Bananas', 'kg', 2.0),

-- Vegetables
(5, 2, 'Baby Spinach', 'kg', 1.0),
(6, 2, 'Carrots', 'kg', 2.5),
(7, 2, 'Yellow Onions', 'kg', 3.0),
(8, 2, 'Garlic Cloves', 'units', 15.0),
(9, 2, 'Roma Tomatoes', 'kg', 2.0),

-- Dairy Products
(10, 3, 'Whole Milk', 'liters', 4.0),
(11, 3, 'Cheddar Cheese', 'kg', 1.0),
(12, 3, 'Unsalted Butter', 'kg', 1.0),
(13, 3, 'Heavy Cream', 'liters', 1.5),

-- Baking Products
(14, 4, 'All-Purpose Flour', 'kg', 5.0),
(15, 4, 'Granulated Sugar', 'kg', 3.0),
(16, 4, 'Active Dry Yeast', 'units', 10.0),
(17, 4, 'Baking Powder', 'g', 250.0),

-- Dessert Products
(18, 5, 'Dark Chocolate Chips', 'kg', 1.5),
(19, 5, 'Tart Pastry Shells', 'units', 12.0),
(20, 5, 'Maple Syrup', 'liters', 0.5),

-- Raw Materials & Other
(21, 6, 'Chicken Breast', 'kg', 4.0),
(22, 6, 'Extra Virgin Olive Oil', 'liters', 2.0),
(23, 6, 'Black Pepper', 'g', 100.0),
(24, 6, 'Soy Sauce', 'liters', 1.0);

-- Insert Sample Inventory Transactions (Stock In & Out)
-- Sufficient items
INSERT OR IGNORE INTO inventory_transactions (id, item_id, transaction_type, quantity, purchase_date, expiration_date, reason) VALUES
(1, 1, 'IN', 5.0, '2026-08-15', '2026-09-15', 'Stock In'),
(2, 4, 'IN', 4.0, '2026-08-18', '2026-08-25', 'Stock In'),
(3, 7, 'IN', 6.0, '2026-08-10', '2026-09-30', 'Stock In'),
(4, 10, 'IN', 6.0, '2026-08-18', '2026-08-28', 'Stock In'),
(5, 14, 'IN', 10.0, '2026-08-01', '2027-02-01', 'Stock In'),
(6, 15, 'IN', 8.0, '2026-08-01', '2027-08-01', 'Stock In'),
(7, 21, 'IN', 6.0, '2026-08-18', '2026-08-24', 'Stock In'),
(8, 22, 'IN', 3.0, '2026-08-05', '2027-01-01', 'Stock In'),

-- Expiring Soon items
(9, 2, 'IN', 2.0, '2026-08-14', '2026-08-25', 'Stock In'),
(10, 5, 'IN', 1.5, '2026-08-15', '2026-08-24', 'Stock In'),
(11, 13, 'IN', 2.0, '2026-08-14', '2026-08-25', 'Stock In'),

-- Low Stock items
(13, 3, 'IN', 5.0, '2026-08-10', '2026-09-10', 'Stock In'),
(14, 3, 'OUT', 3.0, '2026-08-17', NULL, 'Consumed'),

(15, 6, 'IN', 2.0, '2026-08-12', '2026-09-12', 'Stock In'),

(16, 18, 'IN', 1.0, '2026-08-10', '2026-11-10', 'Stock In'),

(17, 19, 'IN', 20.0, '2026-08-01', '2026-09-01', 'Stock In'),
(18, 19, 'OUT', 15.0, '2026-08-16', NULL, 'Consumed');
