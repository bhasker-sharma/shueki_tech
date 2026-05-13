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
| `/what-we-build` | Services overview |
| `/what-we-build/desktop-applications` | Desktop Applications detail |
| `/what-we-build/web-dashboards` | Web Dashboards detail |
| `/what-we-build/edge-integration` | Edge Integration detail |
| `/projects` | Projects |
| `/projects/:id` | Project detail |
| `/contact` | Contact form |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard |

## Admin Portal Features

- Manage enquiries by service type (Desktop Applications, Web Dashboards, Edge Integration, General)
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
php artisan config:clear
php artisan db:seed --class=AdminUserSeeder
php artisan serve
```

## Deployment

See `DEPLOYMENT.md` for the full step-by-step Hostinger deployment guide.

## Current Status

- Website live on Hostinger (shuekitech.com)
- Repositioned to "Software for Connected Products and Operations" (3 focused services)
- Admin portal active with enquiry management per service type
- FAQ and Testimonials section complete
- Technical SEO done (meta tags, sitemap, structured headings)
- WhatsApp button active
- Email notifications working (confirmation to enquirer + notification to admin)

---

**Shueki Tech — Punjab, India**
