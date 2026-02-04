📌 README.md

# 📝 Task Manager – MERN Stack

En fullstack Task Manager byggd med **MongoDB, Express, React och Node.js**.  
Applikationen har autentisering, CRUD på tasks, uppladdning av bilder, filtrering, sortering, pagination och JWT-baserad säkerhet.

---

## 🚀 Funktioner

- ✅ Registrering & inloggning (JWT + Refresh Token)

- ✅ Skapa, läsa, uppdatera och radera tasks

- ✅ Ladda upp flera bilder per task

- ✅ Filtrera på:
  - Prioritet
  - Kategori
  - Klara / Ej klara
  - Datumintervall

- ✅ Sök på titel & kategori
- ✅ Sortering:
  - Skapad datum
  - Deadline
  - Prioritet
  - Titel
- ✅ Pagination
- ✅ Skyddade routes (backend)

---

## 🧰 Tech Stack

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Multer (filuppladdning)
- Bcryptjs

### Frontend

- React (Vite)
- Context API
- Fetch API

---

## 📂 Projektstruktur

client/
src/
api/
context/
components/
pages/

server/
controllers/
middleware/
models/
routes/
uploads/
server.js

---

## ⚙️ Installation

### 1️⃣ Klona projektet

````bash
git clone <repo-url>
cd project-folder

2️⃣ Backend
cd server
npm install


Skapa .env i server-mappen:

MONGO_URI=din_mongodb_connection_string
JWT_SECRET=din_jwt_secret
REFRESH_SECRET=din_refresh_secret


Starta backend:

npm run dev


Server körs på:

http://localhost:5001

3️⃣ Frontend
cd client
npm install
npm run dev


Frontend körs på:

http://localhost:5173

🔐 Auth Flow

Access token lagras i memory

Refresh token används för att hämta ny access token automatiskt

Alla /api/tasks routes kräver Authorization-header

Authorization: Bearer <accessToken>

📡 API Routes
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

Tasks
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/tasks/:id/images
DELETE /api/tasks/:id/images

🧪 Query Params (GET /api/tasks)
search
priority
category
completed
fromDate
toDate
sortBy
page
limit


Exempel:

/api/tasks?page=1&limit=5&sortBy=deadline&priority=high

🖼 Bildhantering

Max 5 bilder per request

Lagring i /uploads

Filvägar sparas i databasen

🧑‍💻 Utvecklad av

Melissa 💙
Fullstack Developer Student

📜 License

ISC


---

# ✅ Sen kör:

```bash
git add README.md
git commit -m "Add project README"
git push
````
