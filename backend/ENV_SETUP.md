# Environment Variables Setup (.env file)

## 📝 Create `.env` file in `backend/` folder

Create a new file named `.env` (not `.env.example`) in the `backend/` folder with the following content:

```env
PORT=5000
JWT_SECRET=mybrand-secret-key-2024-change-this-in-production
ADMIN_EMAIL=admin@mybrand.com
ADMIN_PASSWORD=admin123
```

## 🔍 Explanation of Each Variable

### 1. `PORT=5000`
- **What it does:** Sets the port number where the backend server will run
- **Default:** 5000 (if not set)
- **Example:** `http://localhost:5000`
- **Change if:** You want to use a different port (e.g., 3001, 8000)

### 2. `JWT_SECRET=mybrand-secret-key-2024-change-this-in-production`
- **What it does:** Secret key used to sign and verify JWT tokens for authentication
- **Important:** 
  - Use a long, random string in production
  - Never share this key publicly
  - Change it if compromised
- **Example:** `JWT_SECRET=your-super-secret-random-string-here-123456789`
- **Generate secure key:** Use a password generator or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. `ADMIN_EMAIL=admin@mybrand.com`
- **What it does:** Default admin email for login
- **Used for:** Initial admin authentication
- **Change if:** You want a different default admin email
- **Note:** You can add more admins later through the register endpoint

### 4. `ADMIN_PASSWORD=admin123`
- **What it does:** Default admin password for login
- **Used for:** Initial admin authentication
- **Important:** 
  - Change this to a strong password in production!
  - Use a combination of letters, numbers, and special characters
- **Example:** `ADMIN_PASSWORD=MySecure@Pass123!`

## 📋 Quick Setup Steps

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create `.env` file:**
   - Windows: Create new file named `.env` in `backend/` folder
   - Or use command: `type nul > .env` (Windows) or `touch .env` (Mac/Linux)

3. **Copy this content into `.env`:**
   ```env
   PORT=5000
   JWT_SECRET=mybrand-secret-key-2024-change-this-in-production
   ADMIN_EMAIL=admin@mybrand.com
   ADMIN_PASSWORD=admin123
   ```

4. **Save the file**

5. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔒 Security Recommendations

### For Development:
- Current settings are fine for local development
- Keep `.env` file in `.gitignore` (already done)

### For Production:
1. **Change JWT_SECRET:**
   ```env
   JWT_SECRET=generate-a-very-long-random-string-here
   ```

2. **Change ADMIN_PASSWORD:**
   ```env
   ADMIN_PASSWORD=YourStrongPassword123!@#
   ```

3. **Use environment-specific values:**
   ```env
   PORT=5000
   JWT_SECRET=production-secret-key-min-32-characters-long
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=VerySecurePassword!2024
   ```

## ✅ Verification

After creating `.env` file, start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

If you see this, your `.env` file is working correctly!

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
- Run: `npm install` in the backend folder

### "Port 5000 already in use"
- Change `PORT=5001` (or any available port) in `.env`
- Update frontend API calls to match new port

### "Invalid credentials" on login
- Check if `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match what you're using
- Make sure `.env` file is in `backend/` folder (not root folder)

### Server not reading .env
- Make sure file is named exactly `.env` (not `.env.txt` or `.env.example`)
- Make sure file is in `backend/` folder
- Restart the server after creating/modifying `.env`

