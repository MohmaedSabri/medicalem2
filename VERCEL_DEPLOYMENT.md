<!-- @format -->

# Vercel Deployment Guide

## Fixing 404 Errors

The 404 errors you're experiencing are caused by client-side routing not being properly configured on Vercel. When users navigate directly to routes like `/about` or `/products`, Vercel's server looks for physical files that don't exist.

## Solution

I've created two configuration files to fix this issue:

### 1. vercel.json (Primary Solution)

This file tells Vercel to serve your `index.html` file for all routes, allowing React Router to handle the routing client-side.

### 2. public/\_redirects (Alternative Solution)

This file provides an alternative approach that some hosting platforms prefer.

## Deployment Steps

1. **Commit and push your changes:**

   ```bash
   git add .
   git commit -m "Add Vercel configuration for client-side routing"
   git push
   ```

2. **Redeploy on Vercel:**

   - Go to your Vercel dashboard
   - Trigger a new deployment (it should happen automatically after pushing)
   - Wait for the build to complete

3. **Verify the fix:**
   - Test direct navigation to routes like `/about`, `/products`, `/contact`
   - All routes should now work without 404 errors

## How It Works

The `vercel.json` configuration uses the `rewrites` feature to:

- Catch all routes (`"source": "/(.*)"`)
- Redirect them to your main `index.html` file
- Allow React Router to handle the routing on the client side

## Additional Security Headers

The configuration also includes security headers:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection

## Troubleshooting

If you still experience issues:

1. Clear your browser cache
2. Check Vercel build logs for any errors
3. Ensure the `vercel.json` file is in your project root
4. Verify that your build process completes successfully

## Alternative Solutions

If the above doesn't work, you can also try:

1. Using Vercel's "Framework Preset" during project setup
2. Setting the "Build Command" to `npm run build`
3. Setting the "Output Directory" to `dist`
4. Setting the "Install Command" to `npm install`
