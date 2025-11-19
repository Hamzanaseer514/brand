# Quick Start: MongoDB Setup

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Easiest option - no installation needed!**

1. **Sign up for free MongoDB Atlas account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (M0 cluster is free forever)

2. **Create a cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region
   - Click "Create"

3. **Set up database access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"

4. **Set up network access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get connection string**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/mybrand?retryWrites=true&w=majority`

6. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mybrand?retryWrites=true&w=majority
   ```

7. **Restart your server**
   ```bash
   npm run dev
   ```

✅ Done! Your app is now using cloud MongoDB.

---

## Option 2: Local MongoDB Installation

### Windows Installation

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and run the installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (GUI tool - optional but helpful)

3. **Start MongoDB Service**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

   Or MongoDB should start automatically as a Windows service.

4. **Verify MongoDB is running**
   ```powershell
   # Check if service is running
   Get-Service MongoDB
   ```

5. **Test connection**
   - MongoDB should be running on `mongodb://localhost:27017`
   - Your `.env` file should have:
     ```env
     MONGODB_URI=mongodb://localhost:27017/mybrand
     ```

6. **Restart your server**
   ```bash
   npm run dev
   ```

### Mac Installation

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux Installation

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Troubleshooting

### "MongoDB connection error" on Windows

**Problem**: MongoDB service is not running

**Solution**:
```powershell
# Start MongoDB service
net start MongoDB

# If service doesn't exist, install MongoDB first
# Download from: https://www.mongodb.com/try/download/community
```

### "Access denied" error

**Problem**: MongoDB service requires admin privileges

**Solution**: Run PowerShell/Command Prompt as Administrator

### Port 27017 already in use

**Problem**: Another MongoDB instance is running

**Solution**:
```powershell
# Check what's using the port
netstat -ano | findstr :27017

# Stop MongoDB service
net stop MongoDB

# Or kill the process using the port
taskkill /PID <process_id> /F
```

### Connection timeout

**Problem**: Firewall blocking MongoDB

**Solution**:
- Windows: Allow MongoDB through Windows Firewall
- Or use MongoDB Atlas (cloud) instead

---

## Verify Installation

After setup, you should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

If you see connection errors, check:
1. MongoDB is running (service status)
2. Connection string in `.env` is correct
3. No firewall blocking port 27017
4. For Atlas: IP address is whitelisted

---

## Using MongoDB Compass (Optional GUI)

MongoDB Compass is a visual tool to view your database:

1. Download: https://www.mongodb.com/products/compass
2. Connect using your `MONGODB_URI`
3. Browse collections and documents visually

---

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Community Forum: https://developer.mongodb.com/community/forums/

