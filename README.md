🗂 WorkHub – Task Manager (Fullstack)

WorkHub är en fullstack webbapplikation där användare kan skapa konto, logga in och hantera sina tasks.
Applikationen är byggd för att visa kunskap inom modern frontend, backend, autentisering och databas.

🚀 Funktioner

Registrera konto & logga in
JWT-autentisering med access & refresh tokens
Skapa, redigera, radera tasks
Markera tasks som klara
Sök, filtrera & sortera tasks
Pagination
Skyddade routes
Responsivt gränssnitt

🛠 Teknologier

Frontend
React
React Router
Context API

Backend
Node.js
Express
MongoDB
Mongoose
JSON Web Tokens (JWT)

📁 Projektstruktur
workhub/
├─ client/ (React frontend)
└─ server/ (Node/Express backend)

⚙️ Installation

1. Klona projektet
   git clone https://github.com/Mel-Zar/workhub.git
   cd workhub

2. Installera backend
   cd server
   npm install

Skapa en .env fil i server:
MONGO_URI=din_mongodb_connection_string
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=superrefreshsecret
PORT=5001

Starta backend:
npm run dev

Servern körs på:
http://localhost:5001

🔐 Inloggning

Skapa konto via registreringssidan och logga in.
Efter inloggning får användaren tillgång till dashboard och sina tasks.

📌 Syfte

Detta projekt är byggt som ett portfolio-projekt för att visa färdigheter inom:
Fullstack-utveckling
Autentisering
REST API
State management
CRUD-funktionalitet

👤 Utvecklare

Melissa Zarinnegar
