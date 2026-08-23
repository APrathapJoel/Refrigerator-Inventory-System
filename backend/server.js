const express = require('express');
const cors = require('cors');
const { initDb, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database on Startup
initDb();

/**
 * Utility function to compute stock status badge for an item
 * Badges:
 * - 'Expired' (Red): Has positive stock batch that is past expiration
 * - 'Out of Stock' (Red): Stock <= 0
 * - 'Expiring Soon' (Orange): Has positive stock batch expiring within 3 days
 * - 'Low Stock' (Yellow): Total stock < min_threshold
 * - 'Sufficient' (Green): Total stock >= min_threshold & no urgent expiration
 */
function computeStatus(totalStock, minThreshold, expiringBatches, expiredBatches) {
    if (totalStock <= 0) return { code: 'OUT_OF_STOCK', label: 'Out of Stock', color: 'red' };
    if (expiredBatches > 0) return { code: 'EXPIRED', label: 'Expired', color: 'red' };
    if (expiringBatches > 0) return { code: 'EXPIRING_SOON', label: 'Expiring Soon', color: 'orange' };
    if (totalStock < minThreshold) return { code: 'LOW_STOCK', label: 'Low Stock', color: 'yellow' };
    return { code: 'SUFFICIENT', label: 'Sufficient', color: 'green' };
}

// -------------------------------------------------------------
// 1. Categories Endpoints
// -------------------------------------------------------------
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await all('SELECT * FROM categories ORDER BY id ASC');
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 2. Inventory Items & Stock Endpoints
// -------------------------------------------------------------
app.get('/api/items', async (req, res) => {
    try {
        const { category_id, search, status } = req.query;

        // Query items with calculated current_stock
        let sql = `
            SELECT 
                i.id,
                i.category_id,
                c.name as category_name,
                i.name,
                i.unit,
                i.min_threshold,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'IN' THEN t.quantity ELSE -t.quantity END), 0) as current_stock
            FROM items i
            JOIN categories c ON i.category_id = c.id
            LEFT JOIN inventory_transactions t ON i.id = t.item_id
        `;

        const params = [];
        const conditions = [];

        if (category_id) {
            conditions.push('i.category_id = ?');
            params.push(category_id);
        }
        if (search) {
            conditions.push('i.name LIKE ?');
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY i.id ORDER BY c.id ASC, i.name ASC';

        const rawItems = await all(sql, params);

        // Fetch active stock batches with expiration dates to compute detailed expiration statuses
        const today = new Date().toISOString().split('T')[0];
        const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const batchStats = await all(`
            SELECT 
                item_id,
                expiration_date,
                SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE -quantity END) as net_batch_qty
            FROM inventory_transactions
            WHERE expiration_date IS NOT NULL
            GROUP BY item_id, expiration_date
            HAVING net_batch_qty > 0
        `);

        // Map items with badge metadata
        const enrichedItems = rawItems.map(item => {
            const itemBatches = batchStats.filter(b => b.item_id === item.id);
            
            const expiredBatches = itemBatches.filter(b => b.expiration_date < today).length;
            const expiringSoonBatches = itemBatches.filter(b => b.expiration_date >= today && b.expiration_date <= threeDaysLater).length;

            // Find nearest expiration date for display
            const activeDates = itemBatches.map(b => b.expiration_date).sort();
            const nearestExpiration = activeDates.length > 0 ? activeDates[0] : null;

            const statusObj = computeStatus(item.current_stock, item.min_threshold, expiringSoonBatches, expiredBatches);

            return {
                ...item,
                nearest_expiration: nearestExpiration,
                status: statusObj.code,
                status_label: statusObj.label,
                status_color: statusObj.color,
                expired_batches_count: expiredBatches,
                expiring_soon_batches_count: expiringSoonBatches
            };
        });

        // Filter by status if requested
        let filteredItems = enrichedItems;
        if (status) {
            filteredItems = enrichedItems.filter(item => item.status === status);
        }

        res.json({ success: true, count: filteredItems.length, data: filteredItems });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new Item definition
app.post('/api/items', async (req, res) => {
    try {
        const { category_id, name, unit, min_threshold } = req.body;

        if (!category_id || !name || !unit) {
            return res.status(400).json({ success: false, error: 'Category, Name, and Unit are required' });
        }

        const result = await run(
            'INSERT INTO items (category_id, name, unit, min_threshold) VALUES (?, ?, ?, ?)',
            [category_id, name.trim(), unit.trim(), min_threshold || 1.0]
        );

        const newItem = await get('SELECT i.*, c.name as category_name FROM items i JOIN categories c ON i.category_id = c.id WHERE i.id = ?', [result.id]);

        res.status(201).json({ success: true, message: 'Item created successfully', data: newItem });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 3. Stock In & Stock Out Operations
// -------------------------------------------------------------

/**
 * Stock In Endpoint (Add to Pantry)
 * Body: { item_id, quantity, unit (optional check), purchase_date, expiration_date, reason }
 */
app.post('/api/transactions/in', async (req, res) => {
    try {
        const { item_id, quantity, purchase_date, expiration_date, reason } = req.body;

        if (!item_id || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, error: 'Valid item_id and positive quantity are required' });
        }

        // Verify item exists
        const item = await get('SELECT * FROM items WHERE id = ?', [item_id]);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        const pDate = purchase_date || new Date().toISOString().split('T')[0];
        const txReason = reason || 'Stock In';

        const result = await run(
            `INSERT INTO inventory_transactions 
            (item_id, transaction_type, quantity, purchase_date, expiration_date, reason) 
            VALUES (?, 'IN', ?, ?, ?, ?)`,
            [item_id, parseFloat(quantity), pDate, expiration_date || null, txReason]
        );

        // Fetch updated stock level
        const stockRow = await get(`
            SELECT COALESCE(SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE -quantity END), 0) as current_stock
            FROM inventory_transactions WHERE item_id = ?
        `, [item_id]);

        res.status(201).json({
            success: true,
            message: `Successfully added ${quantity} ${item.unit} of ${item.name} to pantry.`,
            transaction_id: result.id,
            item_name: item.name,
            current_stock: stockRow.current_stock
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * Stock Out Endpoint (Remove from Refrigerator/Pantry)
 * Body: { item_id, quantity, reason }
 * Reasons: 'Used / Consumed', 'Spoiled / Expired', 'Transferred'
 */
app.post('/api/transactions/out', async (req, res) => {
    try {
        const { item_id, quantity, reason } = req.body;

        if (!item_id || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, error: 'Valid item_id and positive quantity are required' });
        }

        const item = await get('SELECT * FROM items WHERE id = ?', [item_id]);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Check available stock
        const stockRow = await get(`
            SELECT COALESCE(SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE -quantity END), 0) as current_stock
            FROM inventory_transactions WHERE item_id = ?
        `, [item_id]);

        const currentStock = stockRow.current_stock;
        if (currentStock < parseFloat(quantity)) {
            return res.status(400).json({
                success: false,
                error: `Insufficient stock! Requested: ${quantity} ${item.unit}, Available: ${currentStock} ${item.unit}`
            });
        }

        const txReason = reason || 'Used / Consumed';

        const result = await run(
            `INSERT INTO inventory_transactions 
            (item_id, transaction_type, quantity, reason) 
            VALUES (?, 'OUT', ?, ?)`,
            [item_id, parseFloat(quantity), txReason]
        );

        const newStock = currentStock - parseFloat(quantity);

        res.status(201).json({
            success: true,
            message: `Deducted ${quantity} ${item.unit} of ${item.name} (${txReason}).`,
            transaction_id: result.id,
            item_name: item.name,
            current_stock: newStock,
            warning: newStock < item.min_threshold ? `Low stock alert! Current stock (${newStock} ${item.unit}) is below minimum threshold (${item.min_threshold} ${item.unit}).` : null
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 4. Dashboard Summary & Alerts
// -------------------------------------------------------------
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Fetch all items with current stock
        const items = await all(`
            SELECT 
                i.id,
                i.name,
                i.min_threshold,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'IN' THEN t.quantity ELSE -t.quantity END), 0) as current_stock
            FROM items i
            LEFT JOIN inventory_transactions t ON i.id = t.item_id
            GROUP BY i.id
        `);

        // Batch expiration stats
        const batches = await all(`
            SELECT 
                item_id,
                expiration_date,
                SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE -quantity END) as net_qty
            FROM inventory_transactions
            WHERE expiration_date IS NOT NULL
            GROUP BY item_id, expiration_date
            HAVING net_qty > 0
        `);

        const totalItems = items.length;
        const lowStockCount = items.filter(i => i.current_stock > 0 && i.current_stock < i.min_threshold).length;
        const outOfStockCount = items.filter(i => i.current_stock <= 0).length;
        const expiringSoonCount = batches.filter(b => b.expiration_date >= today && b.expiration_date <= threeDaysLater).length;
        const expiredCount = batches.filter(b => b.expiration_date < today).length;

        res.json({
            success: true,
            data: {
                total_items: totalItems,
                low_stock_count: lowStockCount,
                out_of_stock_count: outOfStockCount,
                expiring_soon_count: expiringSoonCount,
                expired_count: expiredCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Expiration Alerts Endpoint
app.get('/api/alerts/expiring', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const batches = await all(`
            SELECT 
                t.item_id,
                i.name as item_name,
                c.name as category_name,
                i.unit,
                t.expiration_date,
                t.purchase_date,
                SUM(CASE WHEN t.transaction_type = 'IN' THEN t.quantity ELSE -t.quantity END) as remaining_quantity
            FROM inventory_transactions t
            JOIN items i ON t.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            WHERE t.expiration_date IS NOT NULL
            GROUP BY t.item_id, t.expiration_date
            HAVING remaining_quantity > 0 AND t.expiration_date <= ?
            ORDER BY t.expiration_date ASC
        `, [threeDaysLater]);

        const alerts = batches.map(b => {
            const isExpired = b.expiration_date < today;
            return {
                ...b,
                status: isExpired ? 'EXPIRED' : 'EXPIRING_SOON',
                status_label: isExpired ? 'Expired' : 'Expiring Soon',
                days_until_expiration: Math.ceil((new Date(b.expiration_date) - new Date(today)) / (1000 * 60 * 60 * 24))
            };
        });

        res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Auto-generated Shopping & Reorder List Endpoint
app.get('/api/alerts/shopping-list', async (req, res) => {
    try {
        const items = await all(`
            SELECT 
                i.id as item_id,
                i.name as item_name,
                c.name as category_name,
                i.unit,
                i.min_threshold,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'IN' THEN t.quantity ELSE -t.quantity END), 0) as current_stock
            FROM items i
            JOIN categories c ON i.category_id = c.id
            LEFT JOIN inventory_transactions t ON i.id = t.item_id
            GROUP BY i.id
            HAVING current_stock < i.min_threshold
            ORDER BY c.id ASC, i.name ASC
        `);

        const shoppingList = items.map(item => {
            // Target stock level is double the min threshold or minimum 1
            const targetStock = item.min_threshold * 2;
            const suggestedReorderQty = Math.max(1, targetStock - item.current_stock);
            
            return {
                ...item,
                suggested_reorder_quantity: Math.round(suggestedReorderQty * 100) / 100,
                urgency: item.current_stock <= 0 ? 'CRITICAL' : 'HIGH'
            };
        });

        res.json({ success: true, count: shoppingList.length, data: shoppingList });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Transaction Audit History Endpoint
app.get('/api/transactions/history', async (req, res) => {
    try {
        const { item_id, type, limit } = req.query;

        let sql = `
            SELECT 
                t.id,
                t.item_id,
                i.name as item_name,
                c.name as category_name,
                i.unit,
                t.transaction_type,
                t.quantity,
                t.purchase_date,
                t.expiration_date,
                t.timestamp,
                t.reason
            FROM inventory_transactions t
            JOIN items i ON t.item_id = i.id
            JOIN categories c ON i.category_id = c.id
        `;

        const params = [];
        const conditions = [];

        if (item_id) {
            conditions.push('t.item_id = ?');
            params.push(item_id);
        }
        if (type) {
            conditions.push('t.transaction_type = ?');
            params.push(type.toUpperCase());
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY t.timestamp DESC';
        if (limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const history = await all(sql, params);
        res.json({ success: true, count: history.length, data: history });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start Express Server (for local standalone run)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Refrigerator Inventory API Server running on port ${PORT}`);
    });
}

module.exports = app;
