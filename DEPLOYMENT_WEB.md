# 🎨 PhishGuard Frontend Deployment Guide (Separate Repository)

Since you have the frontend in a **separate repository**, follow these steps:

---

## 📦 What You Need in Your Frontend Repository

Your `web` folder should contain:
- ✅ `index.html` - Landing page
- ✅ `style.css` - Dark violet theme
- ✅ `script.js` - API integration
- ✅ `vercel.json` - Vercel configuration

---

## 🔧 Step 1: Update API URL

Before deploying, update the API endpoint in `script.js`:

**Find line 2:**
```javascript
const API_URL = 'https://phishguard-api.onrender.com'; // Update this after deploying to Render
```

**Replace with your actual Render URL** (after deploying the API):
```javascript
const API_URL = 'https://your-actual-api.onrender.com';
```

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. **Install Vercel CLI**:
```powershell
npm install -g vercel
```

2. **Deploy**:
```powershell
cd web
vercel
```

3. **Follow prompts**:
   - Set up and deploy: `Y`
   - Which scope: (select your account)
   - Link to existing project: `N`
   - Project name: `phishguard-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

4. **Production deployment**:
```powershell
vercel --prod
```

### Option B: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"**
3. Import your GitHub repository (the web/frontend repo)
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: (leave empty)
   - **Output Directory**: `./` (or leave empty)
   - **Install Command**: (leave empty)

5. Click **"Deploy"**
6. Wait 30-60 seconds
7. You'll get a URL like: `https://phishguard-frontend.vercel.app`

---

## ✅ Step 3: Verify Deployment

### Test Frontend

1. Open your Vercel URL: `https://phishguard-frontend.vercel.app`
2. Page should load with dark violet theme
3. Enter a test URL: `facebook.com`
4. Click **"Scan URL"**
5. Results should display (if API is deployed)

### Check Browser Console

Press **F12** → **Console** tab:
- No CORS errors
- No 404 errors
- API calls should succeed

### Test Different URLs

**Legitimate Sites** (should be LEGITIMATE):
- `facebook.com`
- `google.com`
- `github.com`

**Phishing Examples** (should be PHISHING):
- `http://192.168.1.1/paypal-login.php`
- `http://secure-verify-account.tk/update.php`

---

## 📂 Your Repository Structure

### Frontend Repository (web or similar)
```
web/
├── .git/
├── index.html
├── style.css
├── script.js
└── vercel.json
```

---

## 🔄 Auto-Deployment

Vercel automatically redeploys when you push to GitHub:

```powershell
# Make changes to script.js or any file
git add .
git commit -m "Update API URL"
git push

# Vercel auto-deploys in 30-60 seconds
```

---

## 🎨 Customization

### Change API URL Later

Edit `script.js` line 2:
```javascript
const API_URL = 'https://your-new-api-url.com';
```

Then push:
```powershell
git add script.js
git commit -m "Update API URL"
git push
```

### Change Theme Colors

Edit `style.css` CSS variables:
```css
:root {
  --violet-900: #4c1d95;
  --violet-800: #5b21b6;
  --violet-700: #6d28d9;
  --violet-600: #7c3aed;  /* Primary */
  --violet-500: #8b5cf6;  /* Secondary */
  --violet-400: #a78bfa;  /* Accent */
}
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
**Cause**: API URL is incorrect or API is not deployed  
**Solution**: 
1. Check `script.js` has correct API URL
2. Test API health: `curl https://your-api.onrender.com/api/health`
3. Ensure API is deployed and running

### Error: CORS Policy
**Cause**: Backend doesn't have CORS enabled  
**Solution**: Ensure API `app.py` has:
```python
from flask_cors import CORS
CORS(app)
```

### Page Shows Demo Data
**Cause**: API call failed, showing fallback data  
**Solution**: Check Network tab (F12) for failed requests

### Vercel Build Failed
**Cause**: Wrong configuration  
**Solution**: Ensure `vercel.json` exists with correct settings

---

## 📊 Deployment Checklist

- [ ] API deployed and working (test health endpoint)
- [ ] `script.js` updated with correct API URL
- [ ] All files committed and pushed to GitHub
- [ ] Vercel project created
- [ ] Frontend deployed successfully
- [ ] Page loads with dark violet theme
- [ ] Test scan works (returns results)
- [ ] No console errors
- [ ] Mobile responsive design works

---

## 🎉 Success!

Once deployed, your frontend will be available at:
**`https://phishguard-frontend.vercel.app`**

This frontend will call your backend API at:
**`https://phishguard-api.onrender.com`**

---

## 💡 Quick Commands

```powershell
# Update API URL
cd web
# Edit script.js line 2 with your API URL
git add script.js
git commit -m "Update API URL to production"
git push

# Vercel auto-deploys

# Test locally before deploying
python -m http.server 8000
# Open http://localhost:8000
```

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Your API Health**: https://your-api.onrender.com/api/health

---

**Need help?** Check the main `DEPLOYMENT.md` or Vercel documentation.
