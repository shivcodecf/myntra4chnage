# Mantra4Change PBL Dashboard

A full-stack **Project-Based Learning (PBL) Program Monitoring Dashboard** for monitoring school participation, evidence submission, attendance, district/block performance, risks, trends, and monthly program reviews.

## Live Deployment

- **Frontend:** https://myntra4chnage-uafn.vercel.app
- **Backend API:** https://myntra4chnage.onrender.com

The frontend is deployed on **Vercel** and the backend API is deployed on **Render**.

---

## Features

### PBL Dashboard

- School participation monitoring
- Evidence submission monitoring
- Attendance monitoring
- Total enrollment
- Risk indicators
- Month-over-month movement
- Filtering by:
  - Month
  - District
  - Block
  - Grade
  - Subject

### Analytics

The dashboard provides multiple analytics views:

- Monthly Trends
- District Analysis
- Block Analysis
- Movement Analysis
- Performance Trends

### Risk & Exceptions

The dashboard identifies districts and blocks that may require follow-up.

Risk classification uses deterministic thresholds:

| Performance | Risk Status |
|---|---|
| >= 75% | On Track |
| 60% - <75% | Behind |
| 35% - <60% | At Risk |
| <35% | Critical |

The Risk & Exceptions section also identifies the weakest core indicator among:

- Participation
- Evidence Submission
- Attendance

Risk classification does **not** use AI.

### Monthly Program Review

The monthly review provides:

- Summary KPIs
- Achievements
- Month-over-month changes
- Risks
- Priority districts
- Priority blocks
- Discussion points

---

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
- MongoDB

### Deployment

- Vercel - Frontend
- Render - Backend

---

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
        │
        ├── lib/
        │   └── api.ts
        │
        ├── types/
        │   └── pbl.ts
        │
        ├── public/
        └── package.json
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB or access to a MongoDB database

## Clone the Repository

```bash
git clone https://github.com/shivcodecf/myntra4chnage.git
cd mantra4change-dashboard
```

The project contains separate frontend and backend applications.

---

# Backend Setup

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=1000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

**Do not commit the `.env` file to Git.**

## 3. Start the Backend

For development:

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

---

# Frontend Setup

## 1. Install Dependencies

Open a new terminal:

```bash
cd frontend/my-app
npm install
```

## 2. Configure Environment Variables

Create a `.env.local` file inside:

```text
frontend/my-app
```

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:1000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://myntra4chnage.onrender.com/api
```

The `NEXT_PUBLIC_` prefix is required because the API URL is accessed by the browser-side Next.js application.

**Do not commit `.env.local` to Git.**

## 3. Start the Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# API Integration

The frontend uses a shared Axios client to communicate with the backend.

Example:

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

Example API request:

```ts
api.get("/pbl/dashboard");
```

---

# Main PBL API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/pbl/dashboard` | Dashboard metrics and movement |
| GET | `/pbl/districts` | District performance data |
| GET | `/pbl/blocks` | Block performance data |
| GET | `/pbl/review-summary` | Monthly review summary |

### Dashboard Filters

The dashboard supports:

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

---

# Risk Logic

Risk classification is based on the core performance indicators.

```text
>= 75%       -> On Track
60% - <75%   -> Behind
35% - <60%   -> At Risk
< 35%        -> Critical
```

The Risk & Exceptions section compares:

- Participation
- Evidence Submission
- Attendance

The weakest indicator is highlighted as the main performance gap.

Example:

```text
Attendance is the main gap at 58.4%.
```

Risk classification is deterministic and does not depend on an AI model.

---

# Month-over-Month Movement

When at least two reporting months are available, the dashboard calculates movement between reporting periods.

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

---

# Production Deployment

## Frontend - Vercel

The Next.js application is deployed from:

```text
frontend/my-app
```

### Vercel Root Directory

```text
frontend/my-app
```

Vercel automatically detects the Next.js application and runs the production build.

### Production Environment Variable

```env
NEXT_PUBLIC_API_URL=https://myntra4chnage.onrender.com/api
```

After changing environment variables in Vercel, redeploy the application.

---

## Backend - Render

The backend is deployed from:

```text
backend
```

### Render Root Directory

```text
./backend
```

### Build Command

```bash
npm install
```

### Start Command

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

Use the actual backend entry file used by the project.

### Render Environment Variables

Configure the following environment variables in Render:

```env
PORT=1000
MONGO_URI=your_mongodb_connection_string
```

Keep the MongoDB connection string private.

---

# Production Verification

## Frontend

Verify that:

- Dashboard loads correctly
- Filters work correctly
- Analytics pages load
- Risk page loads
- Monthly review loads
- No browser console errors are present
- API requests go to the deployed backend

## Backend

Verify that:

- Render service is running
- MongoDB connection succeeds
- API endpoints respond successfully
- Render logs contain no application errors

## Frontend → Backend

The deployed frontend should use:

```text
https://myntra4chnage.onrender.com/api
```

It should **not** use:

```text
http://localhost:1000/api
```

---

# Build Verification

Before deployment, verify the frontend production build:

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

---

# Git Workflow

After making changes:

```bash
git status
git add .
git commit -m "Update PBL dashboard"
git push
```

If Vercel and Render are connected to the GitHub repository, new pushes can trigger deployments automatically.

---

# Environment & Security Notes

- Do not commit `.env` or `.env.local`.
- Keep `MONGO_URI` and other backend secrets private.
- Do not expose database credentials in frontend code.
- Use `NEXT_PUBLIC_API_URL` for the browser-accessible frontend API URL.
- Production frontend requests must point to the deployed backend.
- Do not use `localhost` as the production API URL.
- Risk classification is deterministic and does not use AI.

---

# Author

**Shivam Yadav**

Built as a full-stack PBL program monitoring dashboard using:

**Next.js · React · TypeScript · Tailwind CSS · Axios · Node.js · Express · MongoDB · Vercel · Render**