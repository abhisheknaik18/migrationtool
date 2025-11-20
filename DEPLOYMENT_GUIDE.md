# 🚀 Deployment Guide - Publish Your App Online

## 📋 Overview

We'll deploy your app to make it accessible via URL:
- **Frontend**: Vercel (free, easy, fast)
- **Backend**: Railway (free tier available)
- **Database**: SQLite (included with backend)

**Result**: Your app will be live at URLs like:
- Frontend: `https://migrationtool.vercel.app`
- Backend: `https://your-app.up.railway.app`

---

## 🎯 Option 1: Deploy to Vercel + Railway (Recommended)

### Part A: Deploy Backend to Railway

#### Step 1: Sign Up for Railway
1. Go to: https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose repository: `abhisheknaik18/migrationtool`
4. Railway will detect the backend

#### Step 3: Configure Backend
1. Click on your project
2. Go to "Variables" tab
3. Add environment variables:
   ```
   PORT=3001
   JWT_SECRET=your-super-secret-key-change-this
   NODE_ENV=production
   NOVATAB_API_URL=https://restaurant.novatab.com/api
   NOVATAB_API_KEY=your-actual-novatab-key
   ```
4. Click "Save"

#### Step 4: Deploy Backend
1. Go to "Settings" → "Start Command"
2. Set: `cd backend && npm install && npm run db:push && npm start`
3. Click "Deploy"
4. Wait 2-3 minutes
5. Railway will give you a URL like: `https://migrationtool-production.up.railway.app`

### Part B: Deploy Frontend to Vercel

#### Step 1: Sign Up for Vercel
1. Go to: https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import `abhisheknaik18/migrationtool`
3. Click "Import"

#### Step 3: Configure Frontend
1. In "Environment Variables" section, add:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```
   (Replace with your actual Railway URL from Part A)

2. In "Build and Output Settings":
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

3. Click "Deploy"

#### Step 4: Wait for Deployment
- Takes 1-2 minutes
- Vercel will give you a URL like: `https://migrationtool.vercel.app`
- Click the URL to see your live app! 🎉

---

## 🎯 Option 2: Deploy to Netlify + Render

### Backend on Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Configure:
   - **Name**: `migrationtool-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run db:push && npm start`
   - **Environment Variables**: Add same as Railway above
6. Click "Create Web Service"
7. Copy your Render URL

### Frontend on Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select your repo
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: `VITE_API_URL=your-render-url/api`
6. Click "Deploy"
7. Get your Netlify URL

---

## 🎯 Option 3: Quick Deploy (Simplest)

### Use Vercel for Everything

**Note**: This deploys frontend easily, but backend needs separate hosting.

1. Push code to GitHub (already done ✅)
2. Go to https://vercel.com
3. Import your repository
4. Vercel auto-detects and deploys
5. Done! (But backend won't work yet - need Railway/Render for that)

---

## 📝 Pre-Deployment Checklist

Before deploying, update these files:

### 1. Update `.gitignore` (Already done ✅)
Make sure these are ignored:
```
.env
backend/.env
backend/database.sqlite
node_modules/
```

### 2. Create Production Environment File

**For Backend** (Railway/Render will use their UI for this):
- Strong JWT_SECRET
- Real NovaTab API credentials
- Production mode

**For Frontend** (Set in Vercel/Netlify):
- VITE_API_URL pointing to your backend

### 3. Database Consideration

**SQLite** (current):
- ✅ Simple, works for demo
- ⚠️ Data lost on deployment restarts
- ⚠️ Not scalable for production

**PostgreSQL** (recommended for production):
- Would need to migrate database
- Railway/Render offer free PostgreSQL
- Better for production use

---

## 🚀 Deployment Steps Summary

### Quick Path (15 minutes):

1. **Backend to Railway** (5 min)
   - Sign up → Import repo → Add env vars → Deploy
   - Get URL: `https://xxx.up.railway.app`

2. **Frontend to Vercel** (5 min)
   - Sign up → Import repo → Add API URL → Deploy
   - Get URL: `https://xxx.vercel.app`

3. **Test** (5 min)
   - Visit your Vercel URL
   - Try creating a migration
   - Success! 🎉

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS (If Needed)

In `backend/src/server.ts`, update CORS to allow your Vercel domain:

```typescript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### 2. Test Your Live App

Visit your Vercel URL and:
- ✅ Dashboard loads
- ✅ Can create NovaTab config
- ✅ Can upload files
- ✅ Can execute migrations
- ✅ Mobile works

### 3. Custom Domain (Optional)

**Vercel:**
- Settings → Domains → Add your domain
- Follow DNS instructions

**Railway:**
- Settings → Networking → Custom Domain

---

## 📊 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free for personal projects

### Railway (Backend)
- ✅ $5 free credit/month
- ✅ 500 hours runtime
- ✅ Good for small projects
- ⚠️ Upgrade for heavy use

### Render (Alternative)
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ⚠️ Sleeps after inactivity

---

## 🐛 Common Deployment Issues

### Issue 1: "Module not found"
**Solution**: Make sure package.json includes all dependencies
```bash
npm install --legacy-peer-deps
```

### Issue 2: "API Connection Failed"
**Solution**: Check VITE_API_URL in Vercel points to Railway URL

### Issue 3: "Database Error"
**Solution**: Make sure Railway runs `npm run db:push` on startup

### Issue 4: "CORS Error"
**Solution**: Update CORS in backend to allow your Vercel domain

---

## 📱 After Deployment

### Share Your App!

Your live URLs will be:
- **Frontend**: `https://migrationtool.vercel.app`
- **Backend**: `https://migrationtool.up.railway.app`

Share the frontend URL with users!

### Monitor Your App

**Vercel Dashboard**:
- View deployment logs
- Check analytics
- Monitor performance

**Railway Dashboard**:
- View logs
- Check usage
- Monitor database

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel + Railway (15 min)
2. ✅ Test the live app
3. ✅ Share URL with team
4. ✅ Monitor usage
5. ✅ Add custom domain (optional)
6. ✅ Upgrade to PostgreSQL (for production)

---

## 💡 Tips for Success

1. **Test locally first**: Make sure app works before deploying
2. **Use environment variables**: Never commit secrets
3. **Check logs**: Both platforms show deployment logs
4. **Start small**: Free tiers work great for testing
5. **Monitor usage**: Keep eye on free tier limits

---

## 🆘 Need Help?

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

### Railway Support
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

**Ready to deploy? Start with Railway for backend, then Vercel for frontend!** 🚀

