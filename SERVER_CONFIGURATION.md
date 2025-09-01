# Server Configuration Guide

This guide provides the necessary server configurations to properly serve the optimized Medical Equipment application with security headers and performance optimizations.

## 🔒 Security Headers Configuration

### For Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/dist;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;

    # Brotli Compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;

    # Cache Headers
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Service Worker
    location = /sw.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # HTML files
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### For Apache (.htaccess)
```apache
# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType text/plain "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType application/x-font-otf "access plus 1 year"
</IfModule>

# Service Worker
<Files "sw.js">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</Files>

# SPA Routing
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### For Express.js (Node.js)
```javascript
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      frameAncestors: ["'none'"]
    }
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Compression
app.use(compression());

// Static files with caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    if (path.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🚀 Performance Optimizations

### CDN Configuration
If using a CDN (Cloudflare, AWS CloudFront, etc.):

1. **Enable Brotli compression**
2. **Set cache headers**:
   - Static assets: 1 year
   - HTML files: No cache
   - Service worker: No cache

3. **Enable HTTP/2 or HTTP/3**
4. **Configure edge caching**

### Environment Variables
```bash
# Production
NODE_ENV=production
PORT=3000
HTTPS=true

# Security
HSTS_MAX_AGE=31536000
CSP_REPORT_URI=https://yourdomain.com/csp-report
```

## 🔍 Monitoring and Testing

### Test Security Headers
```bash
# Using curl
curl -I https://yourdomain.com

# Using securityheaders.com
# Visit: https://securityheaders.com/?q=yourdomain.com
```

### Test Performance
```bash
# Lighthouse CLI
npx lighthouse https://yourdomain.com --output=json --output-path=./lighthouse-report.json

# WebPageTest
# Visit: https://www.webpagetest.org/
```

### Monitor Core Web Vitals
- Set up Google Analytics 4
- Configure Real User Monitoring (RUM)
- Monitor Core Web Vitals in Search Console

## 📋 Checklist

- [ ] Security headers configured
- [ ] Compression enabled (Gzip + Brotli)
- [ ] Cache headers set properly
- [ ] Service worker caching configured
- [ ] SPA routing working
- [ ] HTTPS enabled
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] CDN configured (if applicable)
- [ ] Monitoring set up
- [ ] Performance tested
- [ ] Security tested

## 🆘 Troubleshooting

### Common Issues

1. **Service Worker not updating**: Clear browser cache and reload
2. **Security headers not working**: Check server configuration
3. **Compression not working**: Verify server supports Gzip/Brotli
4. **PWA not installable**: Check manifest and service worker

### Debug Commands
```bash
# Check headers
curl -I https://yourdomain.com

# Test compression
curl -H "Accept-Encoding: gzip, deflate, br" -I https://yourdomain.com

# Check service worker
# Open DevTools > Application > Service Workers
```

