---
name: security-checks
description: Security patterns and detection rules for automated code review. Automatically loaded when performing security reviews, checking for vulnerabilities, or when "security check", "vulnerability", "CVE", "security patterns", or "security audit" are mentioned.
---

# Security Checks

## Stable Detection Patterns

These patterns have low false-positive rates and rarely change. Apply consistently across all reviews.

### 1. Hardcoded Credentials

**Detection**: API keys, passwords, tokens, secrets embedded in source code.

**Search patterns**: String literals matching `password`, `secret`, `api_key`, `token`, `apiKey`, `API_KEY`, `Bearer`, `Basic` followed by base64-like strings, AWS access key patterns (`AKIA...`), private key headers (`-----BEGIN`).

```
BAD:  const API_KEY = "sk-abc123def456";
BAD:  password: "admin123"
BAD:  Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."

GOOD: const API_KEY = process.env.API_KEY;
GOOD: password: config.get("db.password")
GOOD: Authorization: `Bearer ${getToken()}`
```

**Severity**: Critical (always blocked)

### 2. SQL Injection

**Detection**: User input concatenated into SQL queries instead of parameterized queries.

**Search patterns**: String concatenation or template literals containing SQL keywords (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`) with variable interpolation.

```
BAD:  db.query(`SELECT * FROM users WHERE id = ${userId}`);
BAD:  db.query("SELECT * FROM users WHERE name = '" + name + "'");

GOOD: db.query("SELECT * FROM users WHERE id = $1", [userId]);
GOOD: db.query("SELECT * FROM users WHERE name = ?", [name]);
```

**Severity**: Critical

### 3. Cross-Site Scripting (XSS)

**Detection**: Unescaped user input rendered in HTML output.

**Search patterns**: `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `eval()` with user-controlled input, template literals in HTML context without sanitization.

```
BAD:  element.innerHTML = userInput;
BAD:  <div dangerouslySetInnerHTML={{__html: userComment}} />

GOOD: element.textContent = userInput;
GOOD: <div>{userComment}</div>   // React escapes text content
GOOD: <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userHtml)}} />   // only when HTML must render
```

**Severity**: High

### 4. Path Traversal

**Detection**: User input used in file system paths without sanitization.

**Search patterns**: `fs.readFile`, `fs.writeFile`, `path.join`, `path.resolve` with user-controlled segments, presence of `../` in path inputs without validation.

```
BAD:  fs.readFile(path.join(uploadsDir, req.params.filename));
BAD:  const file = `./data/${userInput}`;

GOOD: const safeName = path.basename(req.params.filename);
      fs.readFile(path.join(uploadsDir, safeName));
GOOD: const resolved = path.resolve(allowedDir, userInput);
      if (resolved.startsWith(allowedDir + path.sep)) { fs.readFile(resolved); }
      // a bare startsWith(allowedDir) also admits a sibling such as /data-evil
```

**Severity**: High

### 5. Insecure Deserialization

**Detection**: Deserializing data from untrusted sources without validation.

**Search patterns**: `JSON.parse` on external input without schema validation, `eval()` for data parsing, `unserialize` on user data, YAML loaded with an unsafe loader (PyYAML `yaml.load` without `SafeLoader`, js-yaml before v4 `load`; use `yaml.safe_load` / js-yaml v4 `load`).

```
BAD:  const data = JSON.parse(req.body);
      processOrder(data.orderId, data.amount);

GOOD: const data = orderSchema.parse(JSON.parse(req.body));
      processOrder(data.orderId, data.amount);
```

**Severity**: High

### 6. Weak Cryptography

**Detection**: Use of deprecated or weak cryptographic algorithms for security purposes.

**Search patterns**: `MD5`, `SHA1` used for password hashing or security tokens, `DES`, `3DES`, `RC4` for encryption, `ECB` mode, symmetric keys below 128 bits.

```
BAD:  crypto.createHash("md5").update(password).digest("hex");
BAD:  crypto.createCipheriv("aes-128-ecb", key, null);

GOOD: await bcrypt.hash(password, 12);
GOOD: crypto.createCipheriv("aes-256-gcm", key, iv);
```

**Severity**: High (passwords), Medium (other uses)

### 7. Server-Side Request Forgery (SSRF)

**Detection**: User-controlled URLs used in server-side HTTP requests.

**Search patterns**: `fetch`, `axios`, `http.get`, `request` with user-provided URL or hostname, URL construction from user input without allowlist validation.

```
BAD:  const response = await fetch(req.query.url);
BAD:  const data = await axios.get(`http://${userHost}/api`);

GOOD: if (ALLOWED_HOSTS.includes(new URL(url).hostname)) {
        const response = await fetch(url);
      }
```

**Severity**: High

### 8. Open Redirects

**Detection**: User-controlled redirect targets without validation.

**Search patterns**: `res.redirect`, `window.location`, `location.href` with user input, `returnUrl`, `redirectTo`, `next` parameters used directly.

```
BAD:  res.redirect(req.query.returnUrl);
BAD:  window.location.href = params.get("next");

GOOD: const url = new URL(req.query.returnUrl, APP_ORIGIN);
      if (url.origin === APP_ORIGIN) res.redirect(url.toString());
```

**Severity**: Medium

## Trend-Sensitive Patterns

These patterns require awareness of current threats. Use WebSearch to verify latest advisories when reviewing.

### 9. Dependency Vulnerabilities

**Detection**: Known CVEs in project dependencies.

**Action**: Check `package.json`, `requirements.txt`, `go.mod`, or equivalent against recent advisories.

**WebSearch queries**:
- "[package-name] CVE [current-year]"
- "[package-name] security advisory"
- "npm audit [package-name]"

**Severity**: Varies by CVE (Critical to Low)

### 10. API Key Exposure

**Detection**: API keys, tokens, or secrets accessible in client-side code or git history.

**Search patterns**:
- Keys in client-side bundles (files under `public/`, `static/`, client-side imports)
- Keys committed to git history (`git log -p --all -S "API_KEY"`)
- Keys in `.env` files committed to repository
- Environment variables prefixed with `NEXT_PUBLIC_`, `VITE_`, `REACT_APP_` containing secrets

```
BAD:  // client-side file
      const STRIPE_SECRET = "sk_live_abc123";

GOOD: // server-side only, never exposed to client
      const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
```

**Severity**: Critical (production keys), High (development keys)

### 11. JWT Misconfigurations

**Detection**: Insecure JWT implementation patterns.

**Search patterns**: `algorithm: "none"`, `algorithms: ["HS256", "none"]`, missing `expiresIn`, symmetric secrets < 256 bits, `verify: false`, missing audience/issuer validation.

```
BAD:  jwt.sign(payload, "secret123");
BAD:  jwt.verify(token, secret, { algorithms: ["HS256", "none"] });

GOOD: jwt.sign(payload, privateKey, {   // RS256 signs with the private key
        algorithm: "RS256",
        expiresIn: "1h",
        audience: "api.example.com",
        issuer: "auth.example.com"
      });
GOOD: jwt.verify(token, publicKey, { algorithms: ["RS256"], audience: "api.example.com", issuer: "auth.example.com" });
```

**Severity**: Critical (algorithm none), High (weak secret/no expiry)

## Severity Classification Guide

| Severity | Impact |
|----------|--------|
| **Critical** | Direct exploitation possible, data breach risk |
| **High** | Exploitable with moderate effort, significant impact |
| **Medium** | Limited exploitability or impact |
| **Low** | Minimal risk, defense-in-depth improvement |

The review verdict is decided by `security-reviewer` (Verdict Criteria), not by this table.
