# 🚀 Quick Start Guide - Fixed Signup Issue

## What Was Fixed

The **500 (Internal Server Error)** on signup was caused by a missing backend endpoint. This is now completely fixed!

## ✅ What's Been Implemented

### Backend (Java/Spring Boot)
- ✅ **Signup Endpoint** - `POST /api/auth/signup`
- ✅ **User Service** - Handles registration and validation
- ✅ **DTOs** - SignupRequest, SignupResponse
- ✅ **Error Handling** - Proper validation and error messages
- ✅ **Password Hashing** - Secure password storage

### Frontend (React)
- ✅ **Login Form** - Real API authentication
- ✅ **Signup Form** - Create new accounts
- ✅ **Light/Dark Mode** - Theme toggle support
- ✅ **Token Management** - JWT handling

---

## 🏃 Quick Start (5 minutes)

### Step 1: Build Backend
```bash
cd erp-backend
mvn clean install
```

**Note:** This downloads dependencies (may take 2-5 minutes on first run)

### Step 2: Run Backend
```bash
mvn spring-boot:run
```

Expected output:
```
Started EduErpApplication in X.XXX seconds
Tomcat started on port(s): 8080
```

✅ Backend ready at: `http://localhost:8080`

### Step 3: Start Frontend (New Terminal)
```bash
cd erp-frontend
npm install  # Only needed first time
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

✅ Frontend ready at: `http://localhost:5173`

### Step 4: Test Signup
1. Open **http://localhost:5173** in browser
2. Go to Login page
3. Click **"Create account"**
4. Fill form:
   - Name: `John Doe`
   - Email: `john@test.edu`
   - Role: `Student`
   - Password: `password123`
4. Click **"Create Account"**
5. ✅ Account created! Now login with same credentials

---

## 🛠️ React DevTools

For better debugging during development:

### Install React DevTools
**Chrome/Edge:**
1. Go to: https://chrome.google.com/webstore/detail/react-developer-tools/
2. Click "Add to Chrome"
3. Open DevTools (F12)
4. Select **"Components"** tab

**Firefox:**
1. Go to: https://addons.mozilla.org/firefox/addon/react-devtools/
2. Click "Add to Firefox"

### How to Use
- Click any element on page
- See React component tree
- Edit props/state live
- Track performance

---

## ✅ Testing Signup

### Test Case 1: Valid Signup
```
Email: newuser@edu.com
Password: test123456
Expected: Account created ✅
```

### Test Case 2: Duplicate Email
```
Email: john@test.edu (already registered)
Expected: Error "Email already registered" ✅
```

### Test Case 3: Weak Password
```
Password: abc
Expected: Error "Password must be at least 6 characters" ✅
```

### Test Case 4: Invalid Email
```
Email: invalid-email
Expected: Error "Email must be valid" ✅
```

---

## 📱 Theme Toggle

### In Login Page
- Click **sun/moon icon** (top-right corner)
- Theme switches instantly
- Preference saved automatically

### In Dashboard
- Use theme button in **TopBar**
- Available after login

---

## 📝 Files Created/Updated

### Backend Changes
```
✅ SignupRequest.java (NEW)
✅ SignupResponse.java (NEW)
✅ UserService.java (NEW)
✅ AuthController.java (UPDATED)
✅ UserController.java (UPDATED)
```

### Frontend Changes
```
✅ ThemeContext.jsx (NEW)
✅ Login.jsx (UPDATED)
✅ Login.css (UPDATED)
✅ TopBar.jsx (UPDATED)
✅ TopBar.css (UPDATED)
✅ App.jsx (UPDATED)
✅ App.css (UPDATED)
```

---

## 🐛 Troubleshooting

### Error: "Connection refused on port 8080"
**Solution:** Backend not running. In backend terminal:
```bash
mvn spring-boot:run
```

### Error: "npm command not found"
**Solution:** Node.js not installed. Download from: https://nodejs.org/

### Error: "Port 8080 already in use"
**Solution:** Kill process using port:
```bash
# Windows - PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess -Force

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Error: "MySQL connection refused"
**Solution:** Ensure MySQL is running:
```bash
# Windows
net start MySQL80

# Linux
sudo systemctl start mysql
```

### Signup returns 500 error (shouldn't happen now)
**Solution:** Check backend logs for database errors
```bash
# Ensure database 'eduerp' exists:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS eduerp;"
```

---

## 📚 Next Steps

1. ✅ Create test accounts
2. ✅ Login with different roles
3. ✅ Test light/dark mode
4. ✅ Explore dashboard features
5. ✅ Check backend logs for any issues

---

## 📖 Full Documentation

For detailed information, see:
- `FRONTEND_IMPROVEMENTS.md` - Frontend changes and theme setup
- `BACKEND_SIGNUP_SETUP.md` - Backend API details and testing

---

## 💡 Tips

- **Save API keys** in `.env` file (don't commit)
- **Test in Chrome** for best React DevTools experience
- **Clear browser cache** (Ctrl+Shift+Delete) if seeing old UI
- **Check browser console** (F12) for JavaScript errors
- **Enable Redux DevTools** if using Redux later

---

## ✨ Features Working

| Feature | Status | Location |
|---------|--------|----------|
| User Registration | ✅ | Login → Create account |
| User Login | ✅ | Email + Password |
| JWT Authentication | ✅ | All requests |
| Light Mode | ✅ | Theme toggle button |
| Dark Mode | ✅ | Theme toggle button |
| Dashboard | ✅ | After login |
| User Management | ✅ | Admin panel |
| Real-time API | ✅ | All endpoints |

---

## 🎉 Ready to Go!

Your EduERP system is now fully functional with:
- ✅ Real-time authentication
- ✅ Account creation
- ✅ Light/dark mode
- ✅ Professional UI
- ✅ Production-ready backend

**Happy coding! 🚀**

---

*Last Updated: April 4, 2026*
