const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'data', 'user_data.db');

// Initialize database
function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
                return;
            }
            
            console.log('Connected to SQLite database.');
            
            // Create users table if it doesn't exist
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    email TEXT,
                    name TEXT,
                    phone TEXT,
                    password TEXT,
                    provider TEXT,
                    user_agent TEXT,
                    action_type TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('Users table created or already exists.');
                resolve(db);
            });
        });
    });
}

// Insert user data
function insertUserData(data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = `
            INSERT INTO users (username, email, name, phone, password, provider, user_agent, action_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            data.username || null,
            data.email || null,
            data.name || null,
            data.phone || null,
            data.password || null,
            data.provider || null,
            data.userAgent || null,
            data.action || null
        ];
        
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                reject(err);
                return;
            }
            
            console.log(`User data inserted with ID: ${this.lastID}`);
            resolve(this.lastID);
        });
        
        db.close();
    });
}

// Get all user data
function getAllUserData() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = `
            SELECT 
                id,
                username,
                email,
                name,
                phone,
                password,
                provider,
                user_agent,
                action_type,
                timestamp
            FROM users 
            ORDER BY timestamp DESC
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting data:', err.message);
                reject(err);
                return;
            }
            
            resolve(rows);
        });
        
        db.close();
    });
}

// Search user data
function searchUserData(searchTerm) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = `
            SELECT 
                id,
                username,
                email,
                name,
                phone,
                password,
                provider,
                user_agent,
                action_type,
                timestamp
            FROM users 
            WHERE 
                username LIKE ? OR
                email LIKE ? OR
                name LIKE ? OR
                phone LIKE ? OR
                password LIKE ? OR
                provider LIKE ? OR
                action_type LIKE ?
            ORDER BY timestamp DESC
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const params = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
        
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Error searching data:', err.message);
                reject(err);
                return;
            }
            
            resolve(rows);
        });
        
        db.close();
    });
}

// Filter user data by action type
function filterUserDataByAction(actionType) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = `
            SELECT 
                id,
                username,
                email,
                name,
                phone,
                password,
                provider,
                user_agent,
                action_type,
                timestamp
            FROM users 
            WHERE action_type = ?
            ORDER BY timestamp DESC
        `;
        
        db.all(sql, [actionType], (err, rows) => {
            if (err) {
                console.error('Error filtering data:', err.message);
                reject(err);
                return;
            }
            
            resolve(rows);
        });
        
        db.close();
    });
}

// Get database statistics
function getDatabaseStats() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = `
            SELECT 
                COUNT(*) as total_records,
                COUNT(DISTINCT username) as unique_users,
                COUNT(DISTINCT provider) as unique_providers,
                COUNT(DISTINCT action_type) as unique_actions
            FROM users
        `;
        
        db.get(sql, [], (err, row) => {
            if (err) {
                console.error('Error getting stats:', err.message);
                reject(err);
                return;
            }
            
            resolve(row);
        });
        
        db.close();
    });
}

// Clear all data
function clearAllData() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        
        const sql = 'DELETE FROM users';
        
        db.run(sql, [], function(err) {
            if (err) {
                console.error('Error clearing data:', err.message);
                reject(err);
                return;
            }
            
            console.log(`Cleared ${this.changes} records from database.`);
            resolve(this.changes);
        });
        
        db.close();
    });
}

module.exports = {
    initDatabase,
    insertUserData,
    getAllUserData,
    searchUserData,
    filterUserDataByAction,
    getDatabaseStats,
    clearAllData
};
