# SkillSync India — AI-Powered Freelancing Platform (MVP)

This repository contains a minimal full-stack hackathon MVP: a localized freelancing platform for India that uses AI (Gemini) for matching, proposal generation, and simple scam detection.

Folder structure

- `frontend/` — static frontend built with HTML, Bootstrap 5 and vanilla JS
- `backend/` — Node.js + Express API server
- `package.json` — project manifest

Quick local setup

1. Install dependencies

```bash
cd "c:/Users/USER/OneDrive/Desktop/skill sync india"
npm install
```

2. Configure environment

- Copy `backend/.env.example` to `backend/.env` and fill values.
- Provide `FIREBASE_SERVICE_ACCOUNT_PATH` that points to your Firebase service account JSON, or set `FIREBASE_SERVICE_ACCOUNT_JSON` with the JSON contents.
- If you have access to Google Generative API (Gemini), set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in the `.env` file.

3. Run the backend

```bash
cd "c:/Users/USER/OneDrive/Desktop/skill sync india"
npm run start
# or for development with auto-reload:
npm run dev
```

4. Open the frontend

- Open `frontend/index.html` in your browser (or serve the `frontend` folder via a static server).
- The frontend expects the backend at `http://localhost:5000` by default. Update `frontend/js/main.js` `API_BASE` if you run the backend on another host/port.

API Endpoints

- `POST /api/projects` — Save a new project. Body: `{ title, skills, budget, deadline, description }`.
- `POST /api/match` — Get AI matches for a freelancer. Body: `{ skills, experience }`.
- `POST /api/proposal` — Generate proposal text. Body: `{ projectId, freelancer }`.
- `POST /api/scamcheck` — Check scam risk for a project. Body: project object.

Notes & tips

- The Gemini integration in `backend/gemini.js` attempts to call Google's Generative API using `GEMINI_API_KEY`. Behavior depends on the exact Google setup; no API key yields mocked responses for local development.
- Firestore is accessed via the Firebase Admin SDK in `backend/firebase.js`. Provide a service account to enable writes.
- For hosting: Frontend can be deployed on Vercel (deploy `frontend` folder). Backend is ready for Render (set environment variables and use `node backend/server.js`).

Security

- Keep your Firebase service account and Gemini credentials secret. Do not commit them to source control.

Next steps (suggestions)

- Add user authentication (Firebase Auth) for clients and freelancers.
- Add pagination and better ranking logic in the matching endpoint.
- Improve prompt engineering for Gemini to produce more stable JSON outputs.
- ## How to Run Locally

### Backend

```bash
cd backend
npm install
node server.js


Enjoy building SkillSync India!

