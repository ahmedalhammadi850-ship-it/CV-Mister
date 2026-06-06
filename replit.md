# CV Mister

An AI-powered resume builder that lets users create, customize, and export professional, ATS-optimized resumes. Supports both English and Arabic (RTL) layouts with multiple templates (Modern, Elite, ATS-friendly).

## Architecture

- **Frontend:** React 19 + Vite, Tailwind CSS 4, Framer Motion, React Router 7
- **Backend:** Express 5 server (`server/index.ts`) on port 3001, proxied through Vite on port 5000
- **Database:** Firebase Firestore (Admin SDK) — `api/_lib/firebase.js`
- **Auth:** Firebase Auth (client) + custom HMAC cookie session (`api/_lib/token.js`)
- **AI / Chat:** n8n webhooks (`N8N_AI_WEBHOOK_URL`, `N8N_CHAT_WEBHOOK_URL`)
- **PDF:** Client-side jsPDF/html2canvas + server-side Puppeteer (Chromium via `replit.nix`)

## Running

- **Dev:** `npm run dev` — starts Express on :3001 and Vite on :5000 (Vite proxies `/api/*` to Express)
- **Build:** `npm run build` → `npm start` (Express serves the `dist/` static files)

## Required Secrets

| Secret | Purpose |
|--------|---------|
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK service account private key |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK service account email |
| `SESSION_SECRET` | HMAC secret for signing auth cookies |

## Environment Variables (shared)

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase client SDK key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `FIREBASE_PROJECT_ID` | Firebase project ID (server-side) |
| `N8N_AI_WEBHOOK_URL` | n8n webhook for AI resume rewriting |
| `N8N_CHAT_WEBHOOK_URL` | n8n webhook for chat assistant |
| `N8N_PAYMENT_WEBHOOK_URL` | n8n webhook for payment notifications |

## User Preferences

- Keep Firebase Auth (not Replit Auth) — existing user base relies on Firebase Auth flows
- Arabic/RTL support is a core feature; do not remove or break it
