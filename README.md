# Shueki Tech — Company Website

Company website for Shueki Tech with a built-in admin portal. Currently live on Hostinger shared hosting.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** PHP Laravel 11, Sanctum Auth
- **Database:** SQLite (local) / MySQL (production)
- **Hosting:** Hostinger shared hosting

## Project Structure

```
shueki_tech/
├── client/          # React frontend
├── server/          # Laravel backend
├── README.md
└── DEPLOYMENT.md    # Full deployment guide
```

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Services list |
| `/services/:slug` | Service detail |
| `/projects` | Projects |
| `/projects/:slug` | Project detail |
| `/contact` | Contact form |
| `/faq` | FAQ |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard |

## Admin Portal Features

- Manage enquiries (from contact form)
- Manage projects
- Manage FAQs
- Manage testimonials

## Local Setup

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminSeeder
php artisan serve
```

## Deployment

See `DEPLOYMENT.md` for the full step-by-step Hostinger deployment guide.

## Current Status

- Website live on Hostinger
- Admin portal active
- FAQ and Testimonials section complete
- Technical SEO done (meta tags, sitemap, headings)
- WhatsApp button added
- Email sender feature in progress (`feature/emailsender` branch)

---

**Shueki Tech — Punjab, India**
