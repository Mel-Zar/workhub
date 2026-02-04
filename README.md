# 📝 Task Manager – MERN Fullstack Application

En fullstack Task Manager byggd med **MongoDB, Express, React och Node.js** där användare kan registrera konto, logga in och hantera sina egna tasks.

Projektet stödjer:

- Autentisering med JWT & Refresh Tokens
- CRUD-operationer
- Bilduppladdning
- Filtrering, sortering, sökning & pagination

---

## 🚀 Funktioner

- 🔐 Registrera & logga in användare
- 🔁 Access Token + Refresh Token-flöde
- 📝 Skapa, visa, uppdatera och radera tasks
- 🖼 Ladda upp upp till 5 bilder per task
- 🔍 Sök på titel & kategori
- 🎯 Filtrera på:
  - Prioritet
  - Kategori
  - Klara / Ej klara
  - Datumintervall
- 🔃 Sortering:
  - Skapad datum
  - Deadline
  - Prioritet
  - Titel
- 📄 Pagination
- 🔒 Alla tasks är knutna till inloggad användare

---

# 🧰 Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Axios
- React Toastify

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- Multer
- Bcryptjs
- CORS
- Dotenv

---

# 📦 Installerade Packages

## Client

```txt
axios
react
react-dom
react-router-dom
react-toastify
```

# Client Dev

vite
eslint
@vitejs/plugin-react
eslint-plugin-react-hooks
eslint-plugin-react-refresh
@types/react
@types/react-dom
globals

# Server

express
mongoose
mongodb
jsonwebtoken
bcryptjs
cors
dotenv
multer

# Server Dev

nodemon

## 📁 Projektstruktur

project-root/
│
├─ client/
│ └─ src/
│ ├─ api/
│ ├─ components/
│ ├─ context/
│ ├─ pages/
│ ├─ routes/
│ └─ main.jsx
│
├─ server/
├─ config/
│ ├─ controllers/
│ ├─ middleware/
│ ├─ models/
│ ├─ routes/
│ ├─ uploads/
│ └─ server.js
│
└─ README.md

## ⚙️ Installation

# 1️⃣ Klona projekt

git clone <repo-url>
cd project-folder

# 2️⃣ Installera Backend

cd server
npm install

# Skapa .env i server-mappen:

MONGO_URI=din_mongodb_connection_string
JWT_SECRET=din_jwt_secret
REFRESH_SECRET=din_refresh_secret

# Starta backend:

npm run dev

# Server körs på:

http://localhost:5001

# 3️⃣ Installera Frontend

cd client
npm install
npm run dev

# Frontend körs på:

http://localhost:5173

## 🔐 Autentisering

Alla skyddade requests kräver header:

Authorization: Bearer <accessToken>

Access token förnyas automatiskt via refresh token.

## 📡 API Routes

# Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

# Tasks

GET /api/tasks
GET /api/tasks/:id
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

POST /api/tasks/:id/images
DELETE /api/tasks/:id/images

# 🔍 Query Parameters (GET /api/tasks)

search
priority
category
completed
fromDate
toDate
sortBy
page
limit

# Exempel:

/api/tasks?page=1&limit=5&sortBy=deadline&priority=high

## 🖼 Bilduppladdning

Max 5 bilder per request

Lagring i /server/uploads

Filvägar sparas i MongoDB

## 🧪 Scripts

# Client

npm run dev
npm run build
npm run preview
npm run lint

# Server

npm run dev
npm start

## 👩‍💻 Utvecklare

Melissa
Fullstack Developer Student

## 📜 License

ISC

---

# ✅ Push till GitHub

```bash
git add README.md
git commit -m "Add complete project README"
git push
```
