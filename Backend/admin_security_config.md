# 🔒 Admin Panel Security Configuration

## Environment Variables Required

Create a `.env` file in your Backend directory with these variables:

```bash
# Admin Panel Security (REQUIRED - Change these!)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_JWT_SECRET=your_super_secret_admin_jwt_key_here

# Session Security
SESSION_SECRET=your_session_secret_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_DATABASE=cybercrux

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Security Features Implemented

### ✅ **Backend Security**
- **JWT-based authentication** with secure tokens
- **HTTP-only cookies** (cannot be accessed via JavaScript)
- **Rate limiting** (max 5 login attempts per 15 minutes)
- **Session expiration** (8 hours)
- **IP-based brute force protection**
- **Secure middleware** protecting all admin routes

### ✅ **Frontend Security**
- **No hardcoded credentials** in source code
- **Backend verification** on every admin page load
- **Automatic logout** on session expiry
- **Secure logout** clearing both frontend and backend sessions

### ✅ **Route Protection**
- **All admin API endpoints** require authentication
- **Admin middleware** validates every request
- **Automatic redirect** to login for unauthorized access

## Security Best Practices

### 🔐 **Password Requirements**
- Use a **strong, unique password** (12+ characters)
- Include **uppercase, lowercase, numbers, symbols**
- **Never reuse** passwords from other services

### 🌐 **Production Deployment**
- Set `NODE_ENV=production` for HTTPS cookies
- Use **strong, unique** JWT secrets
- **Rotate secrets** regularly
- **Monitor access logs** for suspicious activity

### 🚫 **What NOT to Do**
- ❌ Don't commit `.env` files to version control
- ❌ Don't use default credentials
- ❌ Don't share admin credentials
- ❌ Don't access admin panel from public networks

## Testing Security

1. **Try accessing admin routes without login** → Should redirect to login
2. **Try brute force login** → Should be rate limited after 5 attempts
3. **Try accessing admin APIs directly** → Should return 401/403 errors
4. **Check browser dev tools** → No credentials should be visible

## Emergency Access

If you lose admin access:
1. Stop the server
2. Reset credentials in `.env` file
3. Restart server
4. Login with new credentials

## Monitoring

The system logs:
- ✅ Successful admin logins with IP addresses
- ✅ Failed login attempts
- ✅ Admin API access
- ✅ Authentication errors

Check server console for security events.
