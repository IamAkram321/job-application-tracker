# Quick Fixes for Common Issues

## 🐛 Troubleshooting Guide

### Issue: "Cannot GET /" Error

**Problem**: Backend shows "Cannot GET /" when accessing root

**Solution**: This is normal! The backend API doesn't have a root route. Use:
- Health check: http://localhost:5000/api/health
- API endpoints: http://localhost:5000/api/applications

### Issue: Backend Not Starting

**Error**: Port 5000 already in use

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: MongoDB Connection Failed

**Error**: `MongoNetworkError: failed to connect`

**Solutions**:

1. **Check if MongoDB is running**:
   ```bash
   # Windows
   Get-Service MongoDB
   Start-Service MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

2. **Use MongoDB Atlas** (Cloud):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Update `backend/.env`: `MONGO_URI=<your-atlas-uri>`

3. **Try alternative connection**:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/jobtrackr
   ```

### Issue: Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or CORS errors

**Solutions**:

1. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check .env file**:
   ```env
   # frontend/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Restart frontend** after changing .env

### Issue: No Data Loading

**Problem**: Dashboard shows 0 applications

**Solution**: Seed the database:
```bash
cd backend
npm run seed
```

Then refresh the frontend and login with:
- Email: test@example.com
- Password: password123

### Issue: Authentication Not Working

**Error**: "Token is not valid" or auto-logout

**Solutions**:

1. **Check JWT_SECRET** in `backend/.env`:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   ```

2. **Clear localStorage** and login again:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   ```

3. **Re-register** user:
   - Go to /register
   - Create new account
   - Login

### Issue: Apps Showing "Cannot read property..."

**Error**: `Cannot read property 'total' of undefined`

**Solution**: This was fixed in ApplicationContext. Make sure:
```bash
cd frontend
npm install
npm run dev
```

### Issue: Build Errors

**Error**: Module not found or dependency errors

**Solution**: Clean install:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite Dev Server Issues

**Error**: Port 5173 in use or HMR not working

**Solutions**:

1. **Change port**:
   ```bash
   npm run dev -- --port 5174
   ```

2. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue: Protected Routes Redirecting

**Problem**: Always redirected to login

**Solutions**:

1. **Clear auth state**:
   ```javascript
   localStorage.clear()
   ```

2. **Login again** with test credentials

3. **Check token** in Application tab → Local Storage

### Issue: Stats Not Updating

**Problem**: Statistics show old data

**Solutions**:

1. **Refresh the page**
2. **Check backend route** is working:
   ```bash
   curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/applications/stats/summary
   ```
3. **Clear cache** and hard refresh (Ctrl+Shift+R)

### Issue: Form Validation Errors

**Error**: Can't save application

**Solutions**:

1. **Check required fields**: Company and Role are required
2. **Check format**: Salary must be a number
3. **Check backend logs** for validation errors

### Issue: Search Not Working

**Problem**: Search doesn't filter results

**Solution**: Search is case-insensitive and searches:
- Company name
- Role/position

Refresh page if needed.

### Issue: Charts Not Displaying

**Problem**: Charts show "No data" or errors

**Solutions**:

1. **Seed database** with sample data
2. **Check browser console** for errors
3. **Verify applications exist** in database

## 🔧 Quick Commands

### Restart Everything
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2 (in new terminal)
cd frontend
npm run dev
```

### Clear Database and Start Fresh
```bash
cd backend
npm run seed  # This clears and reseeds
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
# or
curl http://localhost:5000/api/health | powershell -command "$input"
```

### Check MongoDB
```bash
# Windows
mongo
use jobtrackr
db.applications.count()

# Mac/Linux
mongo
use jobtrackr
db.applications.count()
```

## ✅ Verification Steps

Run these to verify everything works:

1. ✅ Backend: `curl http://localhost:5000/api/health`
2. ✅ Database: `npm run seed` completes successfully
3. ✅ Frontend: http://localhost:5173 loads
4. ✅ Login: Can login with test credentials
5. ✅ Dashboard: Shows statistics
6. ✅ Applications: Lists applications
7. ✅ Add: Can create new application
8. ✅ Edit: Can update application
9. ✅ Delete: Can delete application
10. ✅ Analytics: Charts display

## 📞 Still Having Issues?

1. **Check all .env files** exist and are configured
2. **Check both terminals** for error messages
3. **Check browser console** (F12)
4. **Verify MongoDB** is running
5. **Clear all caches** and restart
6. **Read the logs** in terminal for specific errors

## 🎯 Environment Checklist

Before starting, ensure:

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed OR Atlas account
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] All dependencies installed
- [ ] Ports 5000 and 5173 free
- [ ] No firewall blocking localhost

---

**Still stuck? Check [SETUP_GUIDE.md](SETUP_GUIDE.md) or [BACKEND_SETUP.md](BACKEND_SETUP.md)**


