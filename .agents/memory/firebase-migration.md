---
name: Firebase Direct Migration
description: All frontend API calls replaced with Firebase SDK calls; Express backend only used for admin pages.
---

## Rule
All frontend components must use `src/lib/firestore.js` for data operations — never call `/api/*` routes from the browser (except admin pages which deliberately stay on Express).

**Why:** The app is being deployed to Vercel as a pure SPA. Express runs only in Replit dev mode. Vercel deployment fails if the frontend makes backend calls.

**How to apply:**
- New features that need data: add a function to `src/lib/firestore.js`, import and call it from the component.
- n8n webhooks: use `import.meta.env.VITE_N8N_*_WEBHOOK_URL` — the VITE_ versions are set in shared env.
- Admin pages (`AdminDashboardPage`, `AdminLoginPage`) are the ONLY exceptions — they stay on Express.

## VITE_ env vars set for browser access
- `VITE_N8N_AI_WEBHOOK_URL` — AI text rewrite (AITextarea.jsx)
- `VITE_N8N_CHAT_WEBHOOK_URL` — Chat widget (ChatWidget.jsx)
- `VITE_N8N_PAYMENT_WEBHOOK_URL` — Payment notification (UpgradePage.jsx)
- `VITE_FIREBASE_*` — Firebase client SDK config (already set)

## Firestore collections
- `users/{uid}` — user profiles + plan
- `cvs/{cvId}` — resumes (userId field links to user)
- `templateConfig/{templateId}` — isFree flag per template
- `appConfig/pricing` — pricing config
- `appConfig/navbar` — nav labels
- `paymentRequests/{id}` — payment receipt submissions
- `businessContacts/{id}` — business plan contact submissions
