# Security Headers Guide

This guide explains which security headers can be set via HTML meta tags and which must be set via HTTP headers.

## 🔒 Security Headers Overview

### ✅ Can be set via HTML Meta Tags
These headers can be set using `<meta http-equiv="...">` tags in the HTML:

```html
<!-- Content Type Options -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />

<!-- XSS Protection -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />

<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';" />

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

### ❌ Must be set via HTTP Headers
These headers **cannot** be set via meta tags and must be configured on the server:

```http
# Frame Options (Prevents clickjacking)
X-Frame-Options: DENY

# Strict Transport Security (HSTS)
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Content Type Options
X-Content-Type-Options: nosniff

# XSS Protection
X-XSS-Protection: 1; mode=block

# Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin

# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';

# Permissions Policy
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 🚨 Why X-Frame-Options Can't Be Set via Meta Tags

The `X-Frame-Options` header is specifically designed to prevent clickjacking attacks by controlling whether a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`. 

**Security Reason**: If this could be set via meta tags, malicious websites could override the header by injecting their own meta tags, defeating the security purpose.

## 🔧 Server Configuration Examples

### Nginx Configuration
```nginx
# Security Headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;
```

### Apache Configuration (.htaccess)
```apache
# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
```

### Express.js (Node.js)
```javascript
const helmet = require('helmet');

app.use(helmet({
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
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
  }
}));
```

## 🧪 Testing Security Headers

### Check Current Headers
```bash
# Using curl
curl -I https://yourdomain.com

# Expected output should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Online Tools
- **SecurityHeaders.com**: https://securityheaders.com/?q=yourdomain.com
- **Mozilla Observatory**: https://observatory.mozilla.org/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

## 📋 Security Headers Checklist

### Essential Headers (Must be set via HTTP)
- [ ] `X-Frame-Options: DENY`
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy` (comprehensive policy)

### Optional Headers
- [ ] `Permissions-Policy` (for feature policies)
- [ ] `Cross-Origin-Embedder-Policy`
- [ ] `Cross-Origin-Opener-Policy`
- [ ] `Cross-Origin-Resource-Policy`

## 🚨 Common Mistakes

1. **Setting X-Frame-Options in meta tags** ❌
   ```html
   <!-- This will cause a console error -->
   <meta http-equiv="X-Frame-Options" content="DENY" />
   ```

2. **Not setting headers on all pages** ❌
   - Headers must be set for all HTML, CSS, JS, and image files

3. **Inconsistent header values** ❌
   - Ensure the same security policy across all pages

4. **Missing HTTPS redirect** ❌
   - Always redirect HTTP to HTTPS for security headers to work

## 🔍 Debugging

### Console Errors
If you see errors like:
```
X-Frame-Options may only be set via an HTTP header sent along with a document. It may not be set inside <meta>.
```

**Solution**: Remove the meta tag and set the header via server configuration.

### Testing Locally
For local development, you can use tools like:
- **Live Server** (VS Code extension)
- **http-server** with custom headers
- **Express.js** with helmet middleware

## 📚 Resources

- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Security Headers Best Practices](https://web.dev/security-headers/)

