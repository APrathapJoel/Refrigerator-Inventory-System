const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = process.env.VERCEL 
    ? path.join('/tmp', 'pantry.db') 
    : path.join(__dirname, 'pantry.db');

const schemaPath = path.join(__dirname, 'database', 'schema.sql');
const seedPath = path.join(__dirname, 'database', 'seed.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
    }
});

// Helper for running single queries
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// Helper for fetching single row
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Helper for fetching all rows
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Helper for executing raw SQL scripts
function exec(sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Initialize Database with Schema and Seed Data
async function initDb() {
    try {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await exec(schemaSql);
        console.log('Database schema verified.');

        // Check if categories table is empty, if so, seed
        const catCount = await get('SELECT COUNT(*) as count FROM categories');
        if (catCount.count === 0) {
            console.log('Seeding initial pantry database...');
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            await exec(seedSql);
            console.log('Database successfully seeded!');
        }
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

module.exports = {
    db,
    run,
    get,
    all,
    exec,
    initDb
};
