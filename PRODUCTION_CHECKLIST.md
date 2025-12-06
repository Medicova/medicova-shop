# Production Deployment Checklist

## Critical: Environment Variables Setup

On your hosting platform (Vercel, Netlify, etc.), you **MUST** set these environment variables:

```bash
BASE_URL=http://82.112.255.49/api/v1
NEXTAUTH_URL=https://shop.medicova.net
NEXTAUTH_SECRET=<generate-a-random-32-character-string>
```

### How to Set on Vercel:
1. Go to: Project Settings → Environment Variables
2. Add each variable
3. Select "Production" environment
4. Redeploy after adding variables

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Why Login Fails on Production

### Root Causes:

1. **Missing Environment Variables** (Most Common)
   - If `BASE_URL` is not set, the API calls will fail
   - If `NEXTAUTH_URL` is not set, NextAuth redirects won't work
   - If `NEXTAUTH_SECRET` is not set, session encryption fails

2. **Network Connectivity**
   - The server hosting your Next.js app needs to access `http://82.112.255.49`
   - Check if your hosting provider allows outgoing HTTP requests
   - Some platforms block non-HTTPS backend connections

3. **Backend Server Issues**
   - Verify backend is running and accessible
   - Check backend logs for authentication errors
   - Ensure backend allows requests from your hosting provider's IP

## Quick Diagnostic Steps

### 1. Check Environment Variables
Log into your hosting platform and verify:
- ✅ `BASE_URL` is set to `http://82.112.255.49/api/v1`
- ✅ `NEXTAUTH_URL` is set to `https://shop.medicova.net`
- ✅ `NEXTAUTH_SECRET` is set and is at least 32 characters

### 2. Test Backend Connectivity
From your hosting platform's server logs or a test endpoint, verify:
```bash
curl http://82.112.255.49/api/v1/auth/login
```

### 3. Check Browser Console
When trying to login, open browser DevTools:
- Check Console tab for errors
- Check Network tab for failed requests
- Look for 401, 403, or 500 errors

### 4. Check Server Logs
Look for errors in your hosting platform's logs:
- Authentication errors
- API connection failures
- Timeout errors

## Common Error Messages

### "Login failed. Please try again."
- Backend API call failed
- Check `BASE_URL` environment variable
- Check backend server is running

### "Redirect loop" or staying on login page
- `NEXTAUTH_URL` not set correctly
- Session not being created
- Check `NEXTAUTH_SECRET` is set

### Network errors in console
- Backend server not accessible from hosting platform
- Firewall blocking connection
- Backend server is down

## Solution: Set Environment Variables

**This is the most likely fix!**

1. Log into your hosting platform
2. Navigate to Environment Variables settings
3. Add all three variables listed above
4. **Redeploy your application** (important!)
5. Clear browser cache and try login again

## After Setting Environment Variables

1. **Redeploy**: Most platforms require a redeploy for env vars to take effect
2. **Clear Cache**: Clear browser cache and cookies
3. **Test Login**: Try logging in again
4. **Check Logs**: Monitor server logs for any remaining errors

## Need Help?

If login still doesn't work after setting environment variables:
1. Check server logs for specific error messages
2. Verify backend server is accessible from the internet
3. Test backend API directly: `curl -X POST http://82.112.255.49/api/v1/auth/login`
4. Contact your hosting provider support


