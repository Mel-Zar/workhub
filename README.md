# 📝 Task Manager – MERN Fullstack Application

En fullstack Task Manager byggd med **MongoDB, Express, React och Node.js** där användare kan registrera konto, logga in och hantera sina egna tasks.

Projektet innehåller autentisering med JWT, bilduppladdning, filtrering, sortering, sökning och pagination.

---

## 🚀 Funktioner

- 🔐 Registrera & logga in användare
- 🔁 Access Token + Refresh Token
- 📝 Skapa, visa, uppdatera och radera tasks
- 🖼 Ladda upp bilder till tasks
- 🔍 Sök på titel & kategori
- 🎯 Filtrera på prioritet, kategori, status och datum
- 🔃 Sortering på skapad datum, deadline, prioritet och titel
- 📄 Pagination
- 🔒 Alla tasks är kopplade till inloggad användare

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- React Toastify

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- Multer
- Bcryptjs
- Dotenv
- CORS

---

## 📦 Packages

### Client

axios
react
react-dom
react-router-dom
react-toastify
vite
eslint
@vitejs/plugin-react

### Server

express
mongoose
mongodb
jsonwebtoken
bcryptjs
cors
dotenv
multer
nodemon

---

## 📁 Mappstruktur

```bash
project-root/
│
├── client/
│ └── src/
│ ├── api/
│ ├── components/
│ ├── pages/
│ └── main.jsx
│
├── server/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ └── server.js
│
└── README.md
```

## ⚙️ Installation

### 1. Klona projekt

```bash
git clone <repo-url>
cd project-folder
```

### 2. Installera Backend

```bash
cd server
npm install
```

Skapa .env i server-mappen:

```bash
MONGO_URI=din_mongodb_connection_string
JWT_SECRET=din_jwt_secret
REFRESH_SECRET=din_refresh_secret
```

Starta server:

```bash
npm run dev
```

Server körs på:

```bash
http://localhost:5001
```

### 3. Installera Frontend

```bash
cd client
npm install
npm run dev
```

Frontend körs på:

```bash
http://localhost:5173
```

### 🔐 Autentisering

Alla skyddade requests kräver header:

```bash
Authorization: Bearer <accessToken>
```

### 📡 API Routes

### Auth

```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Tasks

```bash
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/tasks/:id/images
DELETE /api/tasks/:id/images
```

### 🔍 Query Params (GET /api/tasks)

```bash
search
priority
category
completed
fromDate
toDate
sortBy
page
limit
```

Exempel:

```bash
/api/tasks?page=1&limit=5&sortBy=deadline
```

---

### 🖼 Bilduppladdning

- Max 5 bilder per request
- Sparas i server/uploads
- Filväg lagras i MongoDB

---

🧪 Scripts
Client
npm run dev
npm run build
npm run preview
npm run lint

Server
npm run dev
npm start

👩‍💻 Developer

Melissa – Fullstack Developer Student

📜 License

ISC

---

När du klistrat in:

```bash
git add README.md
git commit -m "Add README"
git push
```
