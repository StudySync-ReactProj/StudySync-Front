# Netlify Deployment Guide

## ✅ Setup Complete!

Your frontend is now configured for deployment to Netlify with your backend on Render.

---

## 📁 Files Created

1. **`.env.production`** - Used during production builds
   - Contains: `VITE_API_URL=https://studysync-server-xzsu.onrender.com`

2. **`.env.development`** - Used during local development
   - Contains: `VITE_API_URL=http://localhost:3000`

3. **`.env.example`** - Template for team members

---

## 🔧 How It Works

Your `src/api/axiosConfig.js` is already configured correctly:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**Behavior:**
- **Local Dev** (`npm run dev`): Uses `.env.development` → `http://localhost:3000`
- **Production Build** (`npm run build`): Uses `.env.production` → `https://studysync-server-xzsu.onrender.com`
- **Fallback**: If no env file exists → `http://localhost:3000`

---

## 🚀 Deploy to Netlify

### Option 1: Netlify UI (Recommended for First Deploy)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add production environment config for Netlify"
   git push
   ```

2. **Go to Netlify Dashboard**
   - Log in to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"

3. **Connect Repository**
   - Choose GitHub and select your `StudySync-Front` repository
   - Netlify will auto-detect Vite

4. **Configure Build Settings**
   - **Base directory**: `studysync_front`
   - **Build command**: `npm run build`
   - **Publish directory**: `studysync_front/dist`

5. **Deploy!**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Option 2: Netlify CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to your project
cd studysync_front

# Login to Netlify
netlify login

# Initialize (first time only)
netlify init

# Deploy
netlify deploy --prod
```

---

## 📋 Netlify Configuration File (Optional)

Create `netlify.toml` in your project root for advanced configuration:

```toml
[build]
  base = "studysync_front"
  command = "npm run build"
  publish = "studysync_front/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🔐 Environment Variables in Netlify UI

If you prefer to set env vars through Netlify UI instead of `.env.production`:

1. Go to **Site settings** → **Environment variables**
2. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://studysync-server-xzsu.onrender.com`
   - **Scopes**: Production

**Note:** Netlify will use `.env.production` file by default if it exists.

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] `.env.production` exists with correct Render URL
- [ ] Backend is deployed and running on Render
- [ ] Backend CORS is configured to allow your Netlify domain
- [ ] All components use `import.meta.env.VITE_API_URL` (already done ✅)
- [ ] Code is pushed to GitHub

---

## 🔍 Testing Production Build Locally

Test your production build before deploying:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

This will use `.env.production` and show exactly what Netlify will deploy.

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors

**Problem**: Backend blocks requests from Netlify domain

**Solution**: Update your backend CORS configuration:
```javascript
// In your backend server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local dev
    'https://your-app.netlify.app',    // Netlify URL
  ],
  credentials: true
}));
```

### Issue 2: 404 on Page Refresh

**Problem**: Refreshing a route gives 404

**Solution**: Add redirect rules in `netlify.toml` (see above) or in Netlify UI:
- **From**: `/*`
- **To**: `/index.html`
- **Status**: `200`

### Issue 3: Environment Variable Not Working

**Problem**: API calls still go to localhost

**Solutions**:
1. Make sure you ran `npm run build` (not `npm run dev`)
2. Clear build cache: `rm -rf dist && npm run build`
3. Verify `.env.production` is in the correct directory
4. Check Netlify build logs for environment variable loading

---

## 📱 Post-Deployment

After successful deployment:

1. **Test all features** on your Netlify URL
2. **Check browser console** for any errors
3. **Verify API calls** go to Render (Network tab)
4. **Test authentication** flow
5. **Update README** with live demo link

---

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push
```

Netlify will:
1. Detect the push
2. Run `npm run build`
3. Deploy the new version
4. Update your site (usually within 1-2 minutes)

---

## 📊 Monitoring

- **Netlify Dashboard**: Check build logs and deploy status
- **Render Dashboard**: Monitor backend health and logs
- **Browser DevTools**: Network tab shows API calls

---

## 🎉 Success!

Your app is now production-ready! Visit your Netlify URL after deployment.

**Questions?** Check:
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Docs](https://render.com/docs)
