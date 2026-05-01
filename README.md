# Team Task Manager (Full-Stack)

## Tech Stack
- Backend: Node.js, Express, MongoDB Atlas, JWT
- Frontend: React (Vite), Axios, React Router
- Deployment: Railway (backend), Vercel (frontend)

## 1) Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Backend APIs
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/projects` (auth)
- `POST /api/projects` (Admin only)
- `PATCH /api/projects/:id/members` (Admin only)
- `GET /api/tasks` (auth)
- `POST /api/tasks` (auth)
- `PATCH /api/tasks/:id/status` (assignee/Admin)
- `GET /api/tasks/dashboard/summary` (auth)

## 2) Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` if backend is not local:
```bash
VITE_API_URL=https://<your-railway-backend>/api
```

## 3) Deployment

### Deploy backend to Railway
1. Push this repo to GitHub.
2. Railway → New Project → Deploy from GitHub Repo.
3. Set env vars:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=5000` (optional)
4. Start command: `npm start` in `backend` folder.
5. Copy backend URL.

### Deploy frontend to Vercel
1. Import repo in Vercel.
2. Set root directory to `frontend`.
3. Add env var:
   - `VITE_API_URL=https://<railway-backend-url>/api`
4. Deploy.
