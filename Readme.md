# Mantra4Change PBL Dashboard

A full-stack **Project-Based Learning (PBL) Program Monitoring
Dashboard** for monitoring school participation, evidence submission,
attendance, district/block performance, risks, trends, and monthly
program reviews.


## Live Deployment

- **Frontend:** [https://myntra4chnage-uafn.vercel.app](https://myntra4chnage-uafn.vercel.app)
- **Backend API:** [https://myntra4chnage.onrender.com](https://myntra4chnage.onrender.com)

## Features

### PBL Dashboard

- School participation monitoring
- Evidence submission monitoring
- Attendance monitoring
- Total enrollment
- Risk indicators
- Month-over-month movement
- Filtering by month, district, block, grade, and subject

### Analytics

Available analytics sections include:

- Monthly Trends
- District Analysis
- Block Analysis
- Movement Analysis
- Performance Trends

### Risk & Exceptions

Identifies districts and blocks requiring follow-up.

Risk thresholds:

Risk Status Indicator

---

On Track \>= 75%
Behind 60% - \<75%
At Risk 35% - \<60%
Critical \<35%

Risk classification is deterministic and does not use AI.

The Risk & Exceptions page also identifies the weakest core indicator
among:

- Participation
- Evidence Submission
- Attendance

### Monthly Program Review

Provides:

- Summary KPIs
- Achievements
- Month-over-month changes
- Risks
- Priority districts
- Priority blocks
- Discussion points

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- REST APIs

### Deployment

- Frontend: Vercel
- Backend: Render

## Project Structure

```text
mantra4change-dashboard/
├── backend/
│   ├── package.json
│   └── ...
│
└── frontend/
    └── my-app/
        ├── app/
        │   ├── pbl/
        │   │   ├── page.tsx
        │   │   ├── blocks/
        │   │   ├── districts/
        │   │   ├── monthly/
        │   │   ├── movement/
        │   │   ├── review/
        │   │   ├── risk/
        │   │   └── trends/
        │   └── ...
        ├── lib/
        │   └── api.ts
        ├── types/
        │   └── pbl.ts
        ├── public/
        └── package.json
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/shivcodecf/myntra4chnage.git
cd mantra4change-dashboard
```

## Backend Setup

```bash
cd backend
npm install
```

Create the backend environment file and add the environment variables
required by your backend.

Example:

```env
PORT=1000
```

Start the backend in development mode:

```bash
npm run dev
```

For production:

```bash
npm start
```

The local backend normally runs at:

```text
http://localhost:1000
```

## Frontend Setup

Open another terminal:

```bash
cd frontend/my-app
npm install
```

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:1000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:1000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://myntra4chnage.onrender.com
```

The `NEXT_PUBLIC_` prefix is required because the Axios client is used
by browser-side Next.js components.

### Backend

Add backend-specific environment variables to the Render service.

Never commit secrets such as API keys, database passwords, JWT secrets,
or `.env` files containing credentials.

## API Integration

The frontend uses a shared Axios client:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

Example request:

```ts
api.get("/pbl/dashboard");
```

## Main PBL API Endpoints

Method Endpoint Purpose

---

GET `/pbl/dashboard` Dashboard metrics and movement
GET `/pbl/districts` District performance data
GET `/pbl/blocks` Block performance data
GET `/pbl/review-summary` Monthly review summary

Dashboard filters can include:

```text
month
district
block
grade
subject
```

Example:

```text
GET /pbl/dashboard?month=2025-09&district=Example&grade=6&subject=Math
```

## Risk Logic

Risk classification uses the core performance indicators and the
following thresholds:

```text
>= 75%        -> On Track
60% - <75%    -> Behind
35% - <60%    -> At Risk
< 35%         -> Critical
```

The risk explanation on the exceptions page is based on the weakest
value among participation, evidence submission, and attendance.

Example:

```text
Attendance is the main gap at 58.4%.
```

No AI model is required for risk classification.

## Month-over-Month Movement

When at least two reporting months are available, the dashboard
calculates movement between reporting periods.

Example:

```text
July -> August

Participation: +4.2 pp
Attendance:    -1.5 pp
```

The dashboard can display:

- Previous value
- Current value
- Percentage-point change
- Improved / declined / unchanged direction

## Production Deployment

### Frontend - Vercel

The Next.js application is deployed from:

```text
frontend/my-app
```

Vercel Root Directory:

```text
frontend/my-app
```

Vercel automatically detects Next.js and uses the Next.js production
build.

Production environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

After changing environment variables, redeploy the application.

### Backend - Render

The backend is deployed from:

```text
backend
```

Render Root Directory:

```text
./backend
```

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Make sure the backend `package.json` contains a valid `start` script.

Example:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Use the actual backend entry file used by your project.

## Production Verification

### Frontend

Verify:

- Dashboard loads
- Filters work
- Analytics pages load
- Risk page loads
- Monthly review loads
- No browser console errors

### Backend

Verify:

- Render service is running
- API endpoints respond successfully
- Render logs contain no application errors

### Frontend -\> Backend

The deployed frontend must call the deployed Render backend and not
`localhost`.

Production example:

```text
https://myntra4chnage.onrender.com
```

## Build Verification

Before deployment:

```bash
cd frontend/my-app
npm run build
```

To test the production build locally:

```bash
npm run start
```

Then open:

```text
http://localhost:3000
```

## Git Workflow

```bash
git status
git add .
git commit -m "Update PBL dashboard"
git push
```

If Vercel and Render are connected to the Git repository, new pushes can
trigger deployments automatically.

## Important Notes

- Do not commit `.env` or `.env.local`.
- Use `NEXT_PUBLIC_API_URL` for the browser-accessible frontend API
  URL.
- Keep backend secrets in backend environment variables.
- Frontend and backend are deployed separately.
- Risk classification is deterministic rather than AI-generated.
- Production API URLs must not point to `localhost`.

## Author

**Shivam Yadav**

Built as a full-stack PBL program monitoring dashboard using Next.js,
React, TypeScript, Axios, Node.js/Express, Vercel, and Render.
