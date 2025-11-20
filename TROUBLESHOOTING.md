# Troubleshooting Registration Issue

## Quick Fix

The backend might not be running with the latest code. **Restart it:**

### Stop the Backend
Press `Ctrl+C` in the terminal running the backend

### Restart the Backend
```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
npm run backend
```

Wait for:
```
✅ Server running on http://localhost:3001
📊 Database initialized
🚀 Ready to accept requests
```

Then try registering again!

---

## Alternative: Manual Start

If `npm run backend` doesn't work:

```bash
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord/backend
npm run dev
```

---

## Still Having Issues?

### Check Backend Logs
Look at the terminal where backend is running. When you click "Create Account", you should see logs appear. Share any RED error messages you see.

### Check Frontend Console
1. Open browser (where the app is running)
2. Press `F12` or `Cmd+Option+I`
3. Click "Console" tab
4. Try to register again
5. Look for RED error messages

Share the error message you see!

---

## Common Errors & Solutions

### "ECONNREFUSED" or "Network Error"
**Issue**: Frontend can't reach backend

**Solution**:
```bash
# Make sure backend is running on port 3001
lsof -ti:3001

# If nothing shows, backend isn't running. Start it:
npm run backend
```

### "Registration failed" (no details)
**Issue**: Backend caught an error but isn't logging it

**Solution**: Restart backend with logging enabled (see above)

### "Email already exists"
**Issue**: You already registered with that email

**Solution**: Try a different email or login with existing credentials

---

## Debug Steps

1. **Restart backend** (see above)
2. **Try registering** with:
   - Email: `debug@test.com`
   - Password: `test1234`
   - Name: `Debug User`
3. **Check backend terminal** for errors
4. **Check browser console** (F12) for errors
5. **Share the error message** for specific help

---

## Test Backend Directly

Open a new terminal:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@test.com","password":"test1234","fullName":"Curl Test"}'
```

**Expected**: Should return a token
```json
{"token":"...", "user":{...}}
```

**If you see an error**: Backend has an issue - check backend terminal logs

---

## Nuclear Option: Full Reset

```bash
# Stop everything (Ctrl+C in both terminals)

# Clean and reinstall
cd /Users/168abhishek/Desktop/CursorApps/migrationrecord
rm -rf node_modules backend/node_modules
npm install --legacy-peer-deps
npm run backend:install

# Reset database
cd backend
rm database.sqlite*
npm run db:push
cd ..

# Start fresh
npm run backend  # Terminal 1
npm run dev      # Terminal 2
```

---

## Get Detailed Error

**In backend/src/routes/auth.ts**, temporarily add logging:

Look for the register route and check console output in backend terminal when you try to register.

---

Need more help? Share:
1. The exact error message from backend terminal
2. The error from browser console (F12)
3. What email/password you're trying to use

