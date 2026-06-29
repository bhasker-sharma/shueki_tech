# Shueki Tech — Deployment Guide

## Server Structure on Hostinger

```
/home/u346088292/domains/shuekitech.com/
├── public_html/       ← frontend files go here (internet accessible)
└── laravel/           ← backend files go here (private)
```

---

## First-Time Deployment

### Step 1 — Build Frontend Locally

<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
```bash
cd client
npm run build
```

### Step 2 — Upload Frontend Files

Upload the **contents** of `client/dist/` into `public_html/` (not the dist folder itself):

```
client/dist/index.html          →  public_html/index.html
client/dist/assets/             →  public_html/assets/
client/dist/favicon.svg         →  public_html/favicon.svg
client/dist/robots.txt          →  public_html/robots.txt
client/dist/sitemap.xml         →  public_html/sitemap.xml
client/dist/.htaccess           →  public_html/.htaccess
client/dist/googlebd2d1107ad3d8255.html  →  public_html/googlebd2d1107ad3d8255.html
```

### Step 3 — Upload Backend Files

Upload these folders/files from `server/` into `laravel/`:

```
server/app/           →  laravel/app/
server/bootstrap/     →  laravel/bootstrap/
server/config/        →  laravel/config/
server/database/      →  laravel/database/
server/resources/     →  laravel/resources/
server/routes/        →  laravel/routes/
server/storage/       →  laravel/storage/
server/artisan        →  laravel/artisan
server/composer.json  →  laravel/composer.json
server/composer.lock  →  laravel/composer.lock
```

**Do NOT upload:**
- `server/vendor/` — will be generated on server via composer
- `server/public/` — only index.php from here (see Step 4)
- `server/.env` — create a fresh one on the server (see Step 5)

### Step 4 — Upload Modified index.php

Take `server/public/index.php` and change these 2 lines before uploading:

```php
// Change from:
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Change to:
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```

Upload this modified file to `public_html/index.php`.

### Step 5 — Create .env on Server

SSH into the server and create the `.env` file:

<<<<<<< Updated upstream
```
LOCAL                                   →  HOSTINGER SERVER
─────────────────────────────────────────────────────────────

client/dist/index.html                  →  public_html/index.html
client/dist/assets/                     →  public_html/assets/
client/dist/favicon.svg                 →  public_html/favicon.svg
client/dist/robots.txt                  →  public_html/robots.txt
client/dist/sitemap.xml                 →  public_html/sitemap.xml
client/dist/googlebd2d1107ad3d8255.html →  public_html/googlebd2d1107ad3d8255.html

server/public/index.php (2 lines       →  public_html/index.php
  modified for Hostinger paths)

client/public/.htaccess                 →  public_html/.htaccess

server/app/                             →  laravel/app/
server/bootstrap/                       →  laravel/bootstrap/
server/config/                          →  laravel/config/
server/database/                        →  laravel/database/
server/resources/                       →  laravel/resources/
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
│   ├── index.html                      ← from client/dist/
│   ├── index.php                       ← from server/public/ (2 lines modified)
│   ├── .htaccess                       ← from client/public/
│   ├── robots.txt                      ← from client/dist/
│   ├── sitemap.xml                     ← from client/dist/
│   ├── favicon.svg                     ← from client/dist/
│   ├── googlebd2d1107ad3d8255.html     ← Google Search Console verification
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
    ├── resources/
    │   └── views/
    │       └── emails/
    │           ├── enquiry-confirmation.blade.php  ← confirmation email to enquirer
    │           └── enquiry-received.blade.php      ← notification email to admin
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
=======
>>>>>>> Stashed changes
```bash
ssh -p 65002 u346088292@147.93.99.159
cd domains/shuekitech.com/laravel
nano .env
```

Paste this and fill in your real database credentials:

```
APP_NAME="Shueki Tech"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://shuekitech.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_gmail@gmail.com
MAIL_FROM_NAME="Shueki Tech"

SESSION_DRIVER=file
SESSION_DOMAIN=shuekitech.com
SANCTUM_STATEFUL_DOMAINS=shuekitech.com,www.shuekitech.com

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@shuekitech.com
ADMIN_PASSWORD=YourStrongPassword123!
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

### Step 6 — Run SSH Commands

```bash
cd ~/domains/shuekitech.com/laravel

# Install PHP dependencies (generates vendor/ folder)
composer install --no-dev --optimize-autoloader

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Generate app key
php artisan key:generate

# Clear config, run migrations, seed admin user
php artisan config:clear
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder

# Cache for performance
php artisan config:cache
php artisan route:cache
```

Done. Visit `https://shuekitech.com/admin` to log in.

---

## Updating the Website (After First Deployment)

### Frontend changed (React code, styles, content)

```bash
# Locally:
cd client
npm run build

# Upload contents of client/dist/ to public_html/ (overwrite existing files)
```

### Backend changed (PHP controllers, routes, models)

Upload only the changed files/folders to `laravel/` on the server.

Then SSH in and run:

```bash
cd ~/domains/shuekitech.com/laravel
php artisan config:cache
php artisan route:cache
```

### Database migrations added

```bash
cd ~/domains/shuekitech.com/laravel
php artisan migrate --force
```

---

## Common Errors

| Error | Fix |
|---|---|
| 500 on any API call | Check logs: `tail -50 storage/logs/laravel.log` |
| `vendor/autoload.php not found` | Run `composer install --no-dev --optimize-autoloader` |
| `No application encryption key` | Run `php artisan key:generate` |
| `Table doesn't exist` | Run `php artisan migrate --force` |
| `Permission denied` | Run `chmod -R 775 storage bootstrap/cache` |
| CORS error in browser | Add domain to `config/cors.php` allowed_origins, re-upload, run `php artisan config:cache` |
| React shows 404 on page refresh | `.htaccess` is missing or not uploaded to `public_html/` |
| API calls go to wrong URL | Update `VITE_API_URL` in `client/.env`, rebuild, re-upload `dist/` |

---

## Change Admin Password

SSH in and run:

```bash
cd ~/domains/shuekitech.com/laravel
php artisan tinker
```

Then:

```php
\App\Models\User::where('email', 'admin@shuekitech.com')
    ->update(['password' => \Hash::make('YourNewPassword!')]);
exit
```

---

## SSH Quick Reference

```bash
# Connect
ssh -p 65002 u346088292@147.93.99.159

# Go to Laravel folder
cd ~/domains/shuekitech.com/laravel

# Check error logs
tail -50 storage/logs/laravel.log

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache

# Check PHP version
php -v
```
