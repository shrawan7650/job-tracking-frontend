# Orbit Frontend

Premium dashboard for the Smart Job Application Tracker.

## Run

```powershell
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and connects to
`http://localhost:5000/api/v1` by default.

## Structure

```text
frontend/
├── components/
│   ├── dashboard/       # Dashboard feature components
│   ├── layout/          # App shell and navigation
│   └── ui/              # shadcn-style reusable primitives
├── lib/
│   ├── api.js           # Backend API client
│   └── utils.js         # cn() Tailwind class helper
├── pages/
│   ├── _app.js          # Global page layout entry
│   ├── index.js         # Marketing landing page
│   ├── signup.js        # Google-only sign-up page
│   └── dashboard.js     # Application dashboard
├── styles/
│   └── globals.css      # Tailwind layers and global styles
├── tailwind.config.js
└── postcss.config.js
```

The project uses the Next.js Pages Router, Tailwind CSS, Lucide icons, and
shadcn-compatible component patterns (`Button`, `Card`, and `Badge`).

## Auth integration

The Google sign-up button is intentionally ready for the backend auth flow but
posts the Google ID token to `POST /api/v1/auth/google` as
`{ credential: googleIdToken }`. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the same
Google client ID configured in the backend. The returned JWT is stored in
`localStorage` and automatically sent as `Authorization: Bearer <token>` for
application requests.
