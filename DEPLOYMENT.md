# Shueki Tech — Deployment Guide & Learning Document

## Table of Contents
1. [Project Architecture](#1-project-architecture)
2. [Why Shared Hosting Has Rules](#2-why-shared-hosting-has-rules)
3. [Every Important File Explained](#3-every-important-file-explained)
4. [The Deployment Process Step by Step](#4-the-deployment-process-step-by-step)
5. [Common Errors and How to Diagnose](#5-common-errors-and-how-to-diagnose)
6. [Switching to Real Domain](#6-switching-to-real-domain)
7. [Admin Password Management](#7-admin-password-management)
8. [What to Learn Next](#8-what-to-learn-next)

---

## 1. Project Architecture

This project has two parts that work together:

```
Browser (User)
     │
     ▼
shuekitech.com
     │
     ├── / (homepage, /about, /services, /contact, /admin)
     │        └── Served by React (index.html) — Frontend
     │
     └── /api/* (form submissions, admin login, data)
              └── Handled by Laravel (index.php) — Backend
```

### Frontend — React + Vite (client/)
- React is a JavaScript library that builds Single Page Applications (SPA)
- Vite is the build tool that compiles your JSX/CSS into plain HTML/JS/CSS
- After `npm run build`, everything compiles into the `dist/` folder
- The output is just static files — no server needed to run them, Apache serves them directly

### Backend — Laravel + PHP (server/)
- Laravel is a PHP framework that handles API requests
- It connects to MySQL database, sends emails, handles authentication
- PHP needs to run on the server — Apache executes it

### How they communicate
- React makes HTTP requests to `/api/enquiry`, `/api/admin/login` etc.
- Laravel receives those requests, processes them, returns JSON
- The URL that React uses is set in `client/.env` as `VITE_API_URL`

---

## 2. Why Shared Hosting Has Rules

### What is shared hosting?
On shared hosting (like Hostinger), your website lives on a server shared with hundreds of other websites. You don't control the whole server — you only control your assigned folder.

### The webroot concept
Only files inside `public_html/` are accessible from the internet.
Everything outside is private — only your PHP code can access it.

```
/home/u346088292/
├── public_html/     ← Internet can access this  (yourdomain.com)
├── laravel/         ← Internet CANNOT access this (safe)
└── anything-else/   ← Internet CANNOT access this (safe)
```

### Why you MUST keep Laravel outside public_html
Laravel has sensitive files:
- `.env` — contains database password, email password, secret keys
- `config/` — application configuration
- `app/` — your business logic code
- `vendor/` — thousands of PHP library files

If you put all of Laravel inside `public_html/`, anyone could visit:
```
https://yourdomain.com/.env          ← sees your database password!
https://yourdomain.com/config/       ← sees your configuration!
```

**The correct structure on Hostinger:**
```
/home/u346088292/
├── public_html/          ← only web-accessible files
│   ├── index.html        ← React app entry point
│   ├── index.php         ← Laravel entry point (2-line modified copy)
│   ├── .htaccess         ← Apache routing rules
│   ├── robots.txt        ← Search engine rules
│   └── assets/           ← React JS/CSS files
└── laravel/              ← entire Laravel app (private)
    ├── app/
    ├── config/
    ├── .env              ← database password lives here (safe)
    ├── vendor/
    └── ...
```

---

## 3. Every Important File Explained

### `public_html/index.html` — React Entry Point
- Created by `npm run build` from `client/`
- This is a simple HTML file with a `<div id="root">` and a script tag
- The browser downloads this, then loads the React JS bundle
- React takes over and renders the full UI inside `#root`
- All your pages (Home, About, Services, Contact, Admin) are in the JS bundle

### `public_html/index.php` — Laravel Entry Point
This is taken from `server/public/index.php` with **only 2 lines changed**.

**Why 2 lines need changing:**

Locally, `server/public/index.php` sits inside the Laravel folder, so `../` goes up to `server/` where `vendor/` is:
```php
// Original (works locally):
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

On Hostinger, `public_html/index.php` is outside the Laravel folder (Laravel is in `laravel/`), so the path needs `../laravel/` to reach it:
```php
// Modified for Hostinger (2 lines changed):
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```

**There is no need for a separate `deployment/` folder.** Just take `server/public/index.php`, change those 2 lines, and upload it to `public_html/index.php`.

### `public_html/.htaccess` — The Traffic Director
This is the most important file for making both React and Laravel work on the same domain. Apache reads this file on every request. Source: `client/public/.htaccess`.

```apache
RewriteRule ^api(/.*)?$ index.php [L]
RewriteRule ^sanctum(/.*)?$ index.php [L]
```
Any URL starting with `/api/` or `/sanctum/` → send to `index.php` (Laravel handles it).

```apache
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
```
If the requested file actually exists (like `assets/main.js`, `favicon.svg`) → serve it directly.

```apache
RewriteRule ^ index.html [L]
```
Everything else (like `/about`, `/contact`, `/admin`) → serve `index.html` and let React Router handle it.

### `laravel/.env` — Environment Configuration
This file tells Laravel where it is and how to behave. **Never commit this to git.**

Key values to change per environment:
| Variable | Local | Production |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` (never show errors to users) |
| `APP_URL` | `http://localhost:8000` | `https://shuekitech.com` |
| `DB_CONNECTION` | `sqlite` | `mysql` |
| `SESSION_DOMAIN` | `localhost` | `shuekitech.com` |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost` | `shuekitech.com,www.shuekitech.com` |

### `client/.env` — React Environment Variables
- Variables here are baked into the React build at compile time
- `VITE_API_URL` tells React where the Laravel API is
- **Important**: After changing this, you MUST rebuild (`npm run build`) and re-upload `dist/`

### `laravel/config/cors.php` — Cross-Origin Resource Sharing
Lists which domains are allowed to make API calls to Laravel.
If a domain is NOT in `allowed_origins`, the browser blocks the request with a CORS error.

### `vendor/` — PHP Dependencies
- Created by running `composer install`
- **Never uploaded manually** — always run `composer install` on the server
- **Never committed to git** (too large)

### `storage/` — Laravel's Write Folder
Laravel writes to this folder:
- `storage/logs/laravel.log` — error logs (your debugging best friend)
- `storage/framework/sessions/` — session data
- `storage/framework/cache/` — cached data

Must have write permissions: `chmod -R 775 storage/`

### `bootstrap/cache/` — Config Cache
When you run `php artisan config:cache`, Laravel compiles all config files into one fast file here.
Must have write permissions: `chmod -R 775 bootstrap/cache/`

---

## 4. The Deployment Process Step by Step

### Phase 1 — Prepare Locally

**Step 1: Set production API URL**
```
client/.env → VITE_API_URL=https://shuekitech.com/api
```
React bakes this URL into the compiled JS. If wrong, API calls go nowhere.

**Step 2: Build React**
```bash
cd client
npm run build
```
Output: `client/dist/` — these files go to `public_html/`

**Step 3: Prepare the modified index.php**

Copy `server/public/index.php` and change the 2 path lines:
```php
// Change from:
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Change to:
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```
Save this as your upload-ready `index.php`.

---

### Phase 2 — What to Upload Where

**Complete upload map with tree diagram:**

```
LOCAL                                   →  HOSTINGER SERVER
─────────────────────────────────────────────────────────────

client/dist/index.html                  →  public_html/index.html
client/dist/assets/                     →  public_html/assets/
client/dist/favicon.svg                 →  public_html/favicon.svg
client/dist/robots.txt                  →  public_html/robots.txt

server/public/index.php (2 lines       →  public_html/index.php
  modified for Hostinger paths)

client/public/.htaccess                 →  public_html/.htaccess

server/app/                             →  laravel/app/
server/bootstrap/                       →  laravel/bootstrap/
server/config/                          →  laravel/config/
server/database/                        →  laravel/database/
server/routes/                          →  laravel/routes/
server/storage/                         →  laravel/storage/
server/artisan                          →  laravel/artisan
server/composer.json                    →  laravel/composer.json
server/composer.lock                    →  laravel/composer.lock

(create manually with real credentials) →  laravel/.env
```

**Do NOT upload these:**
```
server/vendor/          ← run composer install on server instead
server/public/          ← only index.php from here (modified)
client/node_modules/    ← not needed on server
client/dist/            ← already uploaded above, don't upload the folder itself
```

**Final Hostinger file structure should look like:**
```
/home/u346088292/
├── public_html/
│   ├── index.html          ← from client/dist/
│   ├── index.php           ← from server/public/ (2 lines modified)
│   ├── .htaccess           ← from client/public/
│   ├── robots.txt          ← from client/dist/
│   ├── favicon.svg         ← from client/dist/
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── laravel/
    ├── app/
    │   └── Http/
    │       └── Controllers/
    │           ├── Controller.php        ← IMPORTANT: must exist!
    │           ├── API/
    │           └── Admin/
    ├── bootstrap/
    ├── config/
    │   └── cors.php                      ← must have your domain in allowed_origins
    ├── database/
    ├── routes/
    │   └── api.php
    ├── storage/
    │   └── logs/
    │       └── laravel.log               ← check here when 500 errors occur
    ├── vendor/                           ← created by composer install (NOT uploaded)
    ├── artisan
    ├── composer.json
    ├── composer.lock
    └── .env                              ← created manually, never committed to git
```

---

### Phase 3 — SSH Commands After Upload

**Step 4: Create MySQL database**
- Hostinger hPanel → Databases → MySQL Databases
- Note: database name, username, password — put them in `laravel/.env`

**Step 5: Install PHP dependencies**
```bash
cd ~/domains/yourdomain.com/laravel
composer install --no-dev --optimize-autoloader
```
`--no-dev` skips testing packages not needed in production.
`--optimize-autoloader` makes class loading faster.

**Step 6: Set permissions**
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```
Without this, Laravel cannot write logs or cache — leads to cryptic errors.

**Step 7: Run migrations and create admin**
```bash
php artisan migrate --force
php artisan db:seed --class=AdminSeeder
php artisan config:cache
php artisan route:cache
```

---

### Phase 4 — Fix Email

**Step 8: Get Gmail App Password**
- Google Account → Security → 2-Step Verification → App Passwords
- Generate one, copy the 16-character code

**Step 9: Update .env**
```bash
nano ~/domains/yourdomain.com/laravel/.env
# Set MAIL_PASSWORD to the app password
php artisan config:cache
```

---

## 5. Common Errors and How to Diagnose

### How to debug — mental flowchart

```
Something broken?
    │
    ├── Frontend not loading / looks wrong
    │       └── Browser DevTools → Console tab → look for red JS errors
    │
    ├── API call failing (form submit, login, data not loading)
    │       └── Browser DevTools → Network tab → click the failing request
    │               ├── Status 500 → check laravel.log (see below)
    │               ├── Status 404 → route doesn't exist or .htaccess wrong
    │               ├── Status 422 → validation error → check Response tab for message
    │               ├── Status 401 → not authenticated
    │               └── CORS error → domain not in cors.php allowed_origins
    │
    └── Page loads but data is wrong
            └── Network tab → check what the API actually returned in Response tab
```

### Checking Laravel logs (for 500 errors)

**Via File Manager:** Navigate to `laravel/storage/logs/laravel.log`, open, scroll to bottom.

**Via SSH:**
```bash
tail -100 ~/domains/yourdomain.com/laravel/storage/logs/laravel.log
```

The last `production.ERROR:` line tells you exactly what broke.

### Temporarily enabling debug mode

If the log isn't detailed enough, SSH in and set:
```
APP_DEBUG=true
```
Hit the URL — Laravel will show the full error in the browser response.
**Set it back to `false` immediately after.** Never leave debug on in production.

### Common error log messages and fixes

| Log message | Fix |
|---|---|
| `vendor/autoload.php not found` | Run `composer install` |
| `Class "App\Http\Controllers\Controller" not found` | Upload `server/app/Http/Controllers/Controller.php` |
| `Table 'sessions' doesn't exist` | Run `php artisan migrate --force` |
| `No application encryption key` | Run `php artisan key:generate` |
| `Permission denied` | Run `chmod -R 775 storage bootstrap/cache` |
| `Access denied for user` | Wrong DB credentials in `laravel/.env` |

### React loads but shows 404 on refresh
`.htaccess` is missing or wrong. The `RewriteRule ^ index.html [L]` line sends all unknown URLs to React.

### API calls fail with CORS error
The frontend domain is not in `laravel/config/cors.php` `allowed_origins`. Add it, re-upload `config/cors.php`, run `php artisan config:cache`.

### React shows right page but no data loads
`VITE_API_URL` in `client/.env` is wrong. Update it, rebuild React, re-upload `dist/`.

### Email not sending
Gmail requires an App Password. Plain password returns error `534-5.7.9`.

---

## 6. Switching to Real Domain (shuekitech.com)

When your real domain is ready:

### Step 1 — Locally:
Update `client/.env`:
```
VITE_API_URL=https://shuekitech.com/api
```
Rebuild React:
```bash
cd client && npm run build
```
Re-upload `client/dist/*` to `public_html/`.

### Step 2 — On server via SSH:
```bash
nano ~/domains/shuekitech.com/laravel/.env
```
Update these values:
```
APP_URL=https://shuekitech.com
SESSION_DOMAIN=shuekitech.com
SANCTUM_STATEFUL_DOMAINS=shuekitech.com,www.shuekitech.com
```

### Step 3 — Update CORS:
Make sure `server/config/cors.php` `allowed_origins` has:
```php
'https://shuekitech.com',
'https://www.shuekitech.com',
```
Upload `config/cors.php` to `laravel/config/cors.php`, then:
```bash
php artisan config:cache
php artisan route:cache
```

### Step 4 — Hostinger hPanel:
- Point your domain DNS to Hostinger nameservers
- Enable SSL certificate for the domain

---

## 7. Admin Password Management

### How the admin password works

```
.env has ADMIN_PASSWORD=YourPassword
        ↓
setup.php runs Hash::make("YourPassword") → stores bcrypt hash in DB
        ↓
Login checks the DB hash — the .env value is NEVER checked again
```

After setup runs successfully:
- The password is safely hashed in the `users` table
- The `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` lines in `.env` are no longer needed
- You can safely remove them from `.env` and run `php artisan config:cache`

### How to change the admin password later

**Via SSH (recommended):**
```bash
cd ~/domains/yourdomain.com/laravel
php artisan tinker
```
Then in the tinker prompt:
```php
\App\Models\User::where('email', 'admin@shuekitech.com')
    ->update(['password' => \Hash::make('YourNewPassword123!')]);
```
Type `exit` to quit tinker.

---

## 8. What to Learn Next

### Understand the tools used
| Tool | What to learn | Resource |
|---|---|---|
| Apache / .htaccess | How mod_rewrite works, RewriteRule syntax | Apache docs, DigitalOcean tutorials |
| Laravel | Routing, Eloquent ORM, Middleware, Sanctum auth | laravel.com/docs |
| React | Components, React Router, useEffect, fetch/axios | react.dev |
| Vite | Build config, env variables, code splitting | vitejs.dev |
| Composer | Package management for PHP | getcomposer.org |
| MySQL | Basic SQL, indexes, migrations | mysqltutorial.org |
| SSH | Linux commands, file permissions, nano editor | linuxcommand.org |

### Concepts to understand deeply
1. **How HTTP works** — request/response cycle, headers, status codes
2. **DNS** — how domain names point to servers
3. **SSL/HTTPS** — why it matters, how certificates work
4. **Environment variables** — why secrets must never be in code
5. **File permissions (chmod)** — read/write/execute, why 775 vs 755 vs 777
6. **SPAs vs traditional websites** — why React needs `.htaccess` routing
7. **CORS** — why browsers enforce it, how to configure it

### Practice projects to build skill
1. Deploy a simple PHP script on shared hosting
2. Deploy a standalone Laravel API (no React)
3. Deploy a standalone React app (no backend)
4. Then combine both (like this project)

---

## Quick Reference — SSH Commands

```bash
# Navigate to Laravel folder
cd ~/domains/yourdomain.com/laravel

# Check error logs
tail -100 storage/logs/laravel.log

# Run migrations
php artisan migrate --force

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Rebuild caches (faster app)
php artisan config:cache
php artisan route:cache

# Change admin password interactively
php artisan tinker

# Check Laravel is working
php artisan --version

# Check PHP version
php -v

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
chmod -R 775 storage bootstrap/cache

# Edit a file
nano filename

# Delete a file
rm filename

# Check folder contents
ls -la
```
