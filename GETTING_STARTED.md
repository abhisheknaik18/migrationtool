# Getting Started - Data Migration App

## ⚡ Quick Start (Simplest Way)

### 1. Open Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run backend
```
*Wait for: "✅ Server running on http://localhost:3001"*

**Terminal 2 - Frontend:**
```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run dev
```
*Wait for: "Local: http://localhost:5173"*

### 2. Open Browser
Navigate to: **http://localhost:5173**

### 3. Create Account
- Click "Sign up"
- Enter your details
- Click "Create Account"

**You're in! 🎉**

---

## 📖 First Migration Tutorial

### Step 1: Configure NovaTab (One-time setup)

1. In the dashboard, click **"NovaTab Settings"**
2. Click **"New Configuration"**
3. Fill in:
   - **Config Name**: "My First Config"
   - **API Endpoint**: `https://restaurant.novatab.com/api`
   - **API Key**: *(Your NovaTab API key)*
   - **Field Mappings**: 
     - NovaTab field: `customer_name` → Source field: `name`
     - NovaTab field: `customer_email` → Source field: `email`
     - *(Click "Add Mapping" for more fields)*
4. Click **"Save Configuration"**

### Step 2: Create Sample Data

Create a file called `test-data.csv`:
```csv
name,email,phone
John Doe,john@example.com,555-1234
Jane Smith,jane@example.com,555-5678
Bob Johnson,bob@example.com,555-9012
```

Or `test-data.json`:
```json
[
  {"name": "John Doe", "email": "john@example.com", "phone": "555-1234"},
  {"name": "Jane Smith", "email": "jane@example.com", "phone": "555-5678"},
  {"name": "Bob Johnson", "email": "bob@example.com", "phone": "555-9012"}
]
```

### Step 3: Create Migration

1. Click **"New Migration"** in dashboard
2. **Step 1**: Enter name "Test Migration"
3. **Step 2**: Upload your `test-data.csv` or `test-data.json`
4. **Step 3**: 
   - Select your NovaTab configuration
   - Review the field mappings
   - Click **"Create Migration"**

### Step 4: Execute Migration

1. Find "Test Migration" in your dashboard
2. Click the **▶️ (Play)** button
3. Confirm the execution
4. Watch it process!
5. View results:
   - Green = Successfully migrated
   - Red = Failed records

**Congratulations!** You've completed your first migration! 🎊

---

## 🎯 What Can You Do?

### ✅ User Management
- Register multiple accounts
- Secure login with JWT tokens
- Each user has their own data

### ✅ Data Import
- **CSV files**: Excel exports, database exports
- **JSON files**: API responses, NoSQL exports
- **Multiple formats**: Flexible parsing

### ✅ Field Mapping
- Visual mapping interface
- Save configurations for reuse
- Map any source field to any destination field

### ✅ Migration Tracking
- See all your migrations
- Real-time status updates
- Success/failure statistics
- Detailed error logs

### ✅ NovaTab Integration
- Multiple configurations
- Test connections before migrating
- Direct push to restaurant.novatab.com

---

## 🔧 Configuration Tips

### NovaTab API Key
Your API key is like a password for NovaTab. Get it from:
- restaurant.novatab.com admin panel
- Contact NovaTab support

### Field Mapping Strategy
Think of it like a translation:
- **Left side (NovaTab field)**: What NovaTab expects
- **Right side (Source field)**: What your data has

Example:
```
NovaTab expects → Your data has
customer_name   → name
customer_email  → email
phone_number    → phone
```

---

## 💡 Pro Tips

### 1. Test with Small Data First
- Start with 5-10 records
- Verify mappings are correct
- Then scale up

### 2. Save Multiple Configurations
- Different configs for different data types
- Restaurant menu vs customer data
- Orders vs inventory

### 3. Review Before Executing
- Check field mappings carefully
- One wrong mapping can affect all records
- Can't undo after execution

### 4. Monitor Errors
- Check failed records
- Common issues:
  - Missing required fields
  - Wrong data format
  - Invalid values

### 5. Keep Source Data
- Never delete original files
- Use as backup
- Re-run if needed

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:**
```bash
# Check if backend is running
# Should see: ✅ Server running on http://localhost:3001

# If not, start it:
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run backend
```

### Issue: "Port 3001 already in use"
**Solution:**
```bash
# Find what's using the port
lsof -ti:3001

# Kill that process
kill -9 <PID>

# Or change the port in backend/.env
PORT=3002
```

### Issue: "No configurations found"
**Solution:**
- Go to "NovaTab Settings"
- Create at least one configuration
- Can't create migrations without a config

### Issue: "File upload failed"
**Solution:**
- Check file format (CSV or JSON only)
- Ensure file has data
- Check file size (< 50MB)

### Issue: "All records failed"
**Solution:**
- Check NovaTab API key is correct
- Verify field mappings match NovaTab's requirements
- Test connection in NovaTab Settings

---

## 📊 Understanding the Dashboard

### Migration Card Colors
- **Gray/Pending**: Not yet executed
- **Orange/Processing**: Currently running
- **Green/Completed**: Finished successfully
- **Red/Failed**: Encountered errors

### Statistics
- **Total Records**: How many in your file
- **Processed**: Successfully migrated
- **Failed**: Had errors (see logs)

### Actions
- **▶️ Play**: Execute a pending migration
- **🗑️ Delete**: Remove a migration (can't undo!)

---

## 🎨 UI Features

### Responsive Design
- Works on desktop, tablet, mobile
- Adapts to your screen size

### Modern Aesthetics
- Clean, professional look
- Smooth animations
- Easy to read

### Intuitive Navigation
- Clear labels
- Helpful icons
- Step-by-step wizards

---

## 🚀 Advanced Usage

### Multiple Users
- Each user has isolated data
- Can't see other users' migrations
- Safe for team use

### Bulk Operations
- Upload files with thousands of records
- Processes in batches
- Handles large datasets

### Error Recovery
- Failed records are logged
- Can export failed records
- Fix and re-migrate

---

## 📱 Mobile Access

The app works on mobile devices:
1. Ensure both phones are on same network
2. Find your computer's IP address
3. Access from mobile: `http://<your-ip>:5173`

---

## 🔐 Security Notes

### Passwords
- Hashed with bcrypt
- Never stored in plain text
- Use strong passwords

### API Keys
- Stored securely in database
- Only visible to you
- Change if compromised

### Tokens
- Expire after 7 days
- Auto-refresh on activity
- Log out on all devices by changing password

---

## 📞 Need Help?

### Documentation
1. **README.md** - Full feature guide
2. **SETUP.md** - Installation help
3. **ARCHITECTURE.md** - Technical details
4. **PROJECT_SUMMARY.md** - Overview
5. **This file** - Getting started

### Check Logs
**Frontend errors:**
- Open browser console (F12)
- Check Console tab

**Backend errors:**
- Look at backend terminal
- Red text indicates errors

---

## ✨ You're All Set!

Everything you need to know to get started. Just remember:

1. **Start backend first** → `npm run backend`
2. **Then start frontend** → `npm run dev`
3. **Create NovaTab config** → One-time setup
4. **Upload data** → CSV or JSON
5. **Map fields** → Source to destination
6. **Execute** → Push to NovaTab

**Happy migrating! 🎉**

---

*Made with ❤️ for seamless data migration to NovaTab*

