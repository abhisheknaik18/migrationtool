# 🧪 Complete Testing Guide

## 📦 Sample Data Files

I've created 3 test files for you in the `sample-data/` folder:

1. **customers.csv** - 10 customer records
2. **orders.json** - 5 order records
3. **restaurant-menu.csv** - 10 menu items

---

## 🚀 Step-by-Step Testing Guide

### Step 1: Start the App

Make sure both servers are running:

**Terminal 1 - Backend:**
```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run backend
```

**Terminal 2 - Frontend:**
```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run dev
```

Open browser: **http://localhost:5173**

---

### Step 2: Access Dashboard

Since demo mode is enabled, you'll go straight to the dashboard.

---

### Step 3: Configure NovaTab (One-Time Setup)

1. **Click "Settings" button** (top-right)

2. **Click "New Configuration"**

3. **Fill in the form:**
   - **Config Name**: `Test Restaurant Config`
   - **API Endpoint**: `https://restaurant.novatab.com/api` (or use `http://localhost:3001/api` for testing)
   - **API Key**: `test-api-key-12345` (dummy key for testing)

4. **Add Field Mappings** (for restaurant menu):
   - NovaTab field: `name` → Source field: `item_name`
   - NovaTab field: `price` → Source field: `price`
   - NovaTab field: `category` → Source field: `category`
   - NovaTab field: `description` → Source field: `description`
   - Click "Add Mapping" for each

5. **Click "Save Configuration"**

---

### Step 4: Create Your First Migration

1. **Go back to dashboard** (close settings modal)

2. **Click "New Migration"** button

3. **Step 1 - Name:**
   - Enter: `Restaurant Menu Import`
   - Click "Next"

4. **Step 2 - Upload Data:**
   - Click "Choose File"
   - Navigate to: `/Users/168abhishek/Desktop/CursorApps/migrationrecord/sample-data/`
   - Select `restaurant-menu.csv`
   - You'll see: "10 records loaded"
   - Click "Next"

5. **Step 3 - Configure Mapping:**
   - Select your config: `Test Restaurant Config`
   - Review the field mappings
   - Click "Create Migration"

---

### Step 5: Execute Migration

1. **Find your migration** in the dashboard
2. **Click the "Execute" button** (Play icon)
3. **Confirm** the execution
4. **Watch it process!**

You'll see:
- Status changes to "Processing"
- Then "Completed"
- Statistics: 10 processed, 0 failed

---

### Step 6: Try Different Data Files

Repeat the process with:

**Test 2 - Customer Data:**
- File: `customers.csv`
- Config mappings:
  - `name` → `customer_name`
  - `email` → `email`
  - `phone` → `phone`
  - `city` → `city`

**Test 3 - Order Data:**
- File: `orders.json`
- Config mappings:
  - `order_id` → `order_id`
  - `customer_email` → `customer_email`
  - `amount` → `total_amount`
  - `status` → `status`

---

## 🎯 What to Test

### ✅ Basic Functionality
- [ ] Configuration creation works
- [ ] File upload accepts CSV
- [ ] File upload accepts JSON
- [ ] Field mapping shows correct fields
- [ ] Migration job is created
- [ ] Execute button works
- [ ] Job status updates

### ✅ UI/UX Testing
- [ ] Dashboard loads correctly
- [ ] Buttons are clickable
- [ ] Modals open and close
- [ ] Forms validate input
- [ ] Success messages appear
- [ ] Error handling works

### ✅ Responsive Testing

**Desktop (> 768px):**
- [ ] 3-column job grid
- [ ] Button labels visible
- [ ] Spacious layout

**Tablet (481-768px):**
- [ ] 2-column job grid
- [ ] Compact but readable

**Mobile (< 480px):**
- [ ] Single column
- [ ] Icon-only buttons
- [ ] Easy to tap
- [ ] No horizontal scroll

### ✅ Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)

---

## 🧪 Advanced Testing Scenarios

### Test 1: Large File
Create a CSV with 100+ records to test performance.

### Test 2: Invalid Data
Upload a file with missing fields to test error handling.

### Test 3: Multiple Configurations
Create 3-4 different configs and switch between them.

### Test 4: Delete Operations
Create several jobs and delete them one by one.

### Test 5: Concurrent Operations
Try creating multiple migrations quickly.

---

## 📱 Mobile Testing

### Option 1: Remote Device Testing
1. Find your computer's IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100
```

2. On your phone's browser:
   - Open Safari/Chrome
   - Go to: `http://192.168.1.100:5173`
   - Test the app!

### Option 2: Browser DevTools
1. Press F12 (DevTools)
2. Click device icon (Ctrl+Shift+M)
3. Select device:
   - iPhone 12 Pro
   - Galaxy S20
   - iPad Air
4. Test touch interactions
5. Rotate (portrait/landscape)

---

## 🎨 Visual Testing Checklist

### Header
- [ ] Logo/icon displays
- [ ] User name shows correctly
- [ ] Settings button works
- [ ] Logout button works

### Dashboard
- [ ] Job cards display nicely
- [ ] Status colors are correct
- [ ] Statistics are readable
- [ ] Empty state shows when no jobs

### Modals
- [ ] Open smoothly
- [ ] Close with X button
- [ ] Forms are clear
- [ ] Buttons work
- [ ] Scroll works on mobile

### Forms
- [ ] Input fields work
- [ ] File upload works
- [ ] Dropdowns populate
- [ ] Validation shows errors
- [ ] Success messages appear

---

## 🐛 Common Issues & Solutions

### "Loading migrations..." never finishes
**Issue**: Backend not connected
**Fix**: Check backend is running on port 3001

### Can't upload file
**Issue**: File size or format
**Fix**: Use provided sample files (small & valid)

### Field mappings empty
**Issue**: No NovaTab config created
**Fix**: Create a config in Settings first

### Execute button doesn't work
**Issue**: Backend error
**Fix**: Check backend terminal for errors

---

## 📊 Expected Results

After successful test, you should see:

**Dashboard:**
```
✅ 1-3 migration jobs created
✅ All showing "completed" status
✅ 10 processed records each
✅ 0 failed records
```

**Backend Terminal:**
```
✅ Server running messages
📝 Registration/login logs
🔐 Migration execution logs
✅ Success messages
```

**Frontend:**
```
✅ Smooth animations
✅ No console errors
✅ Fast load times
✅ Responsive layout
```

---

## 🎯 Success Criteria

You've successfully tested when:
- [x] Created NovaTab configuration
- [x] Uploaded all 3 sample files
- [x] Created 3 migration jobs
- [x] Executed all jobs successfully
- [x] Viewed job statistics
- [x] Tested on mobile (or DevTools)
- [x] No errors in console
- [x] Smooth user experience

---

## 💡 Next Steps After Testing

### If Everything Works:
1. ✅ Enable authentication (disable demo mode)
2. ✅ Add real NovaTab API credentials
3. ✅ Test with your actual data
4. ✅ Deploy to production

### If Issues Found:
1. Check backend terminal for errors
2. Check browser console (F12)
3. Try with smaller data files
4. Share error messages for help

---

## 🚀 Ready to Test!

**Start with this simple flow:**

1. Open app → Dashboard loads ✓
2. Click Settings → Create config ✓
3. Click New Migration → Upload `restaurant-menu.csv` ✓
4. Select config → Create migration ✓
5. Click Execute → See it process ✓
6. Check results → 10 records processed ✓

**Total time: 2-3 minutes!**

---

## 📞 Need Help?

If you encounter issues:
1. Check backend terminal for error messages
2. Check browser console (F12) for frontend errors
3. Try the simple test flow above first
4. Test with provided sample files before custom data

**Happy testing! 🎉**

