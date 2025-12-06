# Deployment Configuration Guide

## Environment Variables Required for Production

When deploying to `https://shop.medicova.net`, you need to set the following environment variables on your hosting platform:

### Required Environment Variables

```bash
# Backend API URL (the backend server)
BASE_URL=http://82.112.255.49/api/v1

# NextAuth Configuration (your frontend URL)
NEXTAUTH_URL=https://shop.medicova.net

# NextAuth Secret (generate a random string)
NEXTAUTH_SECRET=your-secret-key-here
```

### How to Set Environment Variables

#### On Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for "Production" environment

#### On Other Platforms:
- Set them in your platform's environment variable settings
- Make sure they're available at build time and runtime

## Important Notes

### 1. BASE_URL
- This is your backend API server URL
- Currently set to: `http://82.112.255.49/api/v1`
- **IMPORTANT**: If your backend server also has HTTPS, update this to use `https://` instead

### 2. NEXTAUTH_URL
- This MUST match your frontend domain exactly
- Currently: `https://shop.medicova.net`
- Must include the protocol (`https://`) and no trailing slash

### 3. NEXTAUTH_SECRET
- Generate a random secret key (at least 32 characters)
- You can generate one using: `openssl rand -base64 32`
- Keep this secret and never commit it to git

## Troubleshooting Login Issues

### Issue: Login doesn't work on production

**Possible Causes:**

1. **Environment variables not set correctly**
   - Check that `BASE_URL` is set to `http://82.112.255.49/api/v1`
   - Check that `NEXTAUTH_URL` is set to `https://shop.medicova.net`
   - Check that `NEXTAUTH_SECRET` is set

2. **Backend server not accessible**
   - Verify that `http://82.112.255.49/api/v1/auth/login` is accessible
   - Check server logs for failed requests
   - Ensure backend allows requests from your hosting provider's IP

3. **Network/Firewall issues**
   - The server where Next.js is running needs to access the backend
   - If using Vercel, check if the backend allows Vercel's IP ranges
   - Consider using HTTPS for the backend if possible

4. **CORS Issues**
   - If making client-side requests, ensure backend has CORS configured
   - Allow origin: `https://shop.medicova.net`

## Testing

After setting environment variables:

1. Redeploy your application
2. Clear browser cache and cookies
3. Try logging in
4. Check browser console for errors
5. Check server logs for API call errors

## Recommended Backend Configuration

For better security and compatibility:

1. **Use HTTPS for backend** (if possible)
   - Update `BASE_URL` to: `https://your-backend-domain.com/api/v1`

2. **CORS Configuration** (if needed)
   ```
   Access-Control-Allow-Origin: https://shop.medicova.net
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

3. **Verify Backend Endpoints**
   - POST `/api/v1/auth/login` - Login endpoint
   - GET `/api/v1/auth/refresh` - Refresh token endpoint
   - POST `/api/v1/auth/register` - Registration endpoint


