# CBDC Platform — Frontend (`client/`)

The web client for the Central Bank Digital Currency platform, built with
**Next.js 14** (pages router), **React 18**, **Tailwind CSS**, and **Recharts**.

## Features

- Landing page with product overview
- Authentication (login / register) with JWT token handling
- Wallet **dashboard** with balance, 7-day activity chart, and recent activity
- **Send CBDC** transfer flow
- **Transactions** history with type filters and search
- **KYC** verification flow with status tracking
- **Profile** page with wallet address
- **Admin** console: mint/burn tokens, supply stats, and user management (admin role only)

## Getting started

```bash
cd client
cp .env.local.example .env.local   # adjust values if needed
npm install
npm run dev
# open http://localhost:3000
```

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the CBDC backend API | `http://localhost:5000/api` |
| `NEXT_PUBLIC_DEMO_MODE` | When `true`, uses an in-browser mock backend (no server needed) | `true` |

### Demo mode

With `NEXT_PUBLIC_DEMO_MODE=true` the app runs entirely against an in-browser
mock backend (`utils/mockData.js`), so you can explore every page without a
running API server. Seeded accounts:

- **Citizen** — `demo@cbdc.gov` / `demo123`
- **Admin** — `admin@cbdc.gov` / `admin123`

Set `NEXT_PUBLIC_DEMO_MODE=false` to point the client at a real backend defined
by `NEXT_PUBLIC_API_URL`. The API client in `utils/api.js` maps each call to the
REST endpoints described in the project README (e.g. `POST /auth/login`,
`POST /user/transfer`, `GET /transactions/history`, `POST /admin/mint`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (`next lint`) |
