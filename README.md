# Shueki Tech - Professional Engineering Services Website

A modern website built with React 18, Vite, Tailwind CSS (frontend) and Laravel with Sanctum auth (backend).

## Project Structure

```
shueki-tech-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, Footer, Hero, etc.)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Constants, API, auth, theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Laravel API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/api.php
│   └── .env
└── README.md
```

## Quick Start

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
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan serve
```

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Hook Form, Lucide Icons
**Backend:** Laravel, Sanctum Auth, SQLite (local) / MySQL (production)

## Services

1. Website Development
2. Machine Integration & Automation
3. AI Pipelines
4. PCB Designing
5. App Development
6. R&D Consultancy

## Customization

Update company info in `client/src/utils/constants.js`:
```javascript
export const COMPANY_INFO = {
  name: 'Shueki Tech',
  email: 'info@shuekitech.com',
  // ...
}
```

## Deployment (Hostinger)

1. Build frontend: `cd client && npm run build`
2. Upload `client/dist/` to `public_html/`
3. Upload `server/` to hosting
4. Set `.env` with MySQL credentials from hPanel
5. Run `php artisan migrate && php artisan db:seed --class=AdminUserSeeder`

## License

This project is proprietary software for Shueki Tech.

---

**Built by Shueki Tech Engineering Team**
