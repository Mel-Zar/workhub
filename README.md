# 🚀 WorkHub

### Fullstack MERN Task Management Application

**Production-Style Fullstack MERN Task Management Application**

WorkHub is a fullstack task management application built with the **MERN stack (MongoDB, Express, React, Node.js).**

The project demonstrates real-world backend security practices, scalable architecture, token lifecycle management, and clean frontend structure using reusable components and centralized API handling.

This project was built to reflect how a real SaaS-style dashboard application would be structured.

---

### 🌐 Live Demo

#### Add deployment link here (Render / Railway / Vercel)

---

### ✨ Core Features

#### 🔐 Authentication & Security

- JWT Authentication (Access + Refresh Tokens)

- Refresh token rotation

- Protected routes with middleware

- Login rate limiting

- Password hashing with bcrypt

- Session invalidation (logout)

- Account deletion with password confirmation

- Token expiration handling

- Ownership-based authorization (users can only access their own tasks)

#### 🗂 Task Management

- Create / Edit / Delete tasks

- Upload multiple task images (Multer)

- Automatic image cleanup on delete

- Image reordering with validation

- Filter by:
  - Priority

  - Category

  - Status

  - Deadline

- Full-text search

- Sort with whitelist validation

- Pagination with max-limit protection

#### 👤 User Features

- Profile update

- Toast notifications

- Context-based state management

- Clean UI separation

- Modular architecture

---

### 🧠 Technical Highlights

- Centralized API layer (apiFetch)

- Service-based data handling

- Custom React hooks

- Context API for global state

- Clean MVC-like backend structure

- Token refresh flow implemented manually

- Scalable folder architecture

- Production-style separation of concerns

- 401 vs 403 status code handling

- Login rate limiter (anti brute-force)

- Ownership validation on all task operations

- Safe query handling (sort whitelist)

- Defensive max-limit pagination

- Image cleanup on task deletion (prevents orphan files)

---

### 🔐 Security Design

- Access Token expiry: 15 minutes

- Refresh Token expiry: 7 days

- Refresh token rotation

- Token verification middleware

- Ownership-based authorization

- Rate limiting on login route

- Helmet security headers

- Controlled CORS configuration

- Input sanitization logic

---

### 🖥️ Tech Stack

#### Frontend

- React (Vite)

- React Router DOM

- Context API

- Custom Hooks

- React Toastify

#### Backend

- Node.js

- Express

- MongoDB + Mongoose

- JSON Web Tokens

- bcryptjs

- Multer

- CORS

- dotenv

- Helmet (security headers)

- express-rate-limit (brute force protection)

---

### 🧱 System Architecture & Code Structure

```bash
workhub/
│
├── client/
│   ├── package.json
│   ├── .env
│   └── src/
│       │
│       ├── api/
│       │   └── ApiFetch.js
│       │
│       ├── app/
│       │   └── App.jsx
│       │
│       ├── components/
│       │   ├── Footer/
│       │   │   └── Footer.jsx
│       │   │
│       │   ├── Navbar/
│       │   │   └── Navbar.jsx
│       │   │
│       │   ├── TaskControl/
│       │   │   └── TaskControl.jsx
│       │   │
│       │   ├── TaskFilters/
│       │   │   └── TaskFilters.jsx
│       │   │
│       │   ├── TaskForm/
│       │   │   └── TaskForm.jsx
│       │   │
│       │   ├── TaskItem/
│       │   │   ├── TaskImages.jsx
│       │   │   └── TaskItem.jsx
│       │   │
│       │   ├── TaskSearch/
│       │   │   └── TaskSearch.jsx
│       │   │
│       │   ├── TaskSort/
│       │   │   └── TaskSort.jsx
│       │   │
│       │   └── Ui/
│       │       └── DropDown.jsx
│       │
│       ├── context/
│       │   ├── AuthContext/
│       │   │   ├── AuthContext.js
│       │   │   └── AuthProvider.jsx
│       │   │
│       │   └── ThemeContext/
│       │       ├── ThemeContext.js
│       │       └── ThemeProvider.jsx
│       │
│       ├── hooks/
│       │   ├── useTasks.js
│       │   └── useTheme.js
│       │
│       ├── pages/
│       │   ├── Dashboard/
│       │   │   └── Dashboard.jsx
│       │   │
│       │   ├── Home/
│       │   │   └── Home.jsx
│       │   │
│       │   ├── Login/
│       │   │   └── Login.jsx
│       │   │
│       │   ├── Profile/
│       │   │   └── Profile.jsx
│       │   │
│       │   ├── Register/
│       │   │   └── Register.jsx
│       │   │
│       │   ├── Task/
│       │   │   └── Task.jsx
│       │   │
│       │   └── Tasks/
│       │       └── Tasks.jsx
│       │
│       ├── routes/
│       │   └── PrivateRoute.jsx
│       │
│       ├── services/
│       │   ├── authService.js
│       │   └── taskService.js
│       │
│       ├── utils/
│       │   └── formatters.js
│       │
│       └── main.jsx
│
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   │
│   └── src/
│       ├── config/
│       │   └── connectDB.js
│       │
│       ├── controllers/
│       │   ├── authController.js
│       │   └── taskController.js
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── uploadMiddleware.js
│       │
│       ├── models/
│       │   ├── User.js
│       │   └── Task.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── taskRoutes.js
│       │
│       └── uploads/
│           └── img.jpeg
│
├── .gitignore
└── README.md
```

---

### Frontend Architecture

- api/ → Centralized fetch wrapper

- services/ → API communication layer

- hooks/ → Custom logic abstraction

- context/ → Auth & Theme providers

- components/ → Reusable UI components

- pages/ → Route-based views

- routes/ → Protected routing

### Backend Architecture

- controllers/ → Business logic

- routes/ → API endpoints

- models/ → Mongoose schemas

- middleware/ → Authentication & file handling

- config/ → Database connection

- utils/ → Token generation

---

### ⚙️ Installation

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Mel-Zar/workhub.git
cd workhub
```

---

#### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `env` inside `/server`:

```bash
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workhub?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secure_access_token_secret
JWT_REFRESH_SECRET=your_super_secure_refresh_token_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5001
```

---

#### 3️⃣ Frontend Setup

Open new terminal:

```bash
cd client
npm install
```

Install required frontend dependencies:

```bash
npm install react react-dom react-router-dom react-toastify
```

Create `.env` inside `/client`:

```bash
VITE_API_URL=http://localhost:5001
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### 🌐 Deployment

Recommended deployment stack:

Frontend:

- Vercel / Netlify

Backend:

- Render / Railway / Fly.io

Database:

- MongoDB Atlas

Environment variables handled via platform secrets.

---

### 🔐 Authentication Flow

**1.** User logs in

**2.** Backend returns:

- `accessToken`

- `refreshToken`

**3.** Tokens stored in localStorage

**4.** All requests go through apiFetch()

**5.** If access token expires → automatic refresh

**6.** If refresh fails → forced logout

---

### 🌍 API Flow

```bash
Component → Service → apiFetch → Backend
```

#### Why this structure?

**✔** Centralized error handling

**✔** Automatic authorization headers

**✔** Automatic token refresh

**✔** Cleaner components

**✔** Scalable architecture

---

### 🛡 Protected Routes

Protected pages:

- `/dashboard`

- `/tasks`

- `/task/:id`

- `/profile`

Implemented using:

```bash
<PrivateRoute />
```

---

### 🧰 Utilities

`utils/formatters.js`

Used for:

- Capitalizing titles

- Cleaning categories

- Formatting user input

Example:

```bash
capitalize("hello") // "Hello"
formatCategory("work123") // "Work"
```

---

### 🖼 Screenshots

Create folder:

```bash
/screenshots
```

Then reference:

```bash
![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Create Task](screenshots/create-task.png)
![Edit Task](screenshots/edit-task.png)
```

---

### 🚀 Why This Project Matters

This project demonstrates:

- Real-world authentication implementation

- Token lifecycle management

- Scalable folder structure

- Production-style API architecture

- Clean separation of frontend & backend concerns

- Practical fullstack development skills

- Demonstrates secure token lifecycle handling

- Shows defensive backend design decisions

- Implements production-style separation of concerns

- Reflects scalable REST API structure

It reflects how a real SaaS-style dashboard would be structured.

---

### 📈 Future Improvements

- Drag & Drop tasks

- Role-Based Access Control (RBAC)

- Dark Mode toggle

- Task sharing between users

- Email notifications

- Unit & integration testing

- Docker containerization

- CI/CD pipeline

---

### 👩‍💻 Author

**Melissa Zarinnegar**

Web Developer (E-commerce specialization)

Fullstack Developer (MERN)

---

### ⭐ If You Like This Project

Consider giving it a star on GitHub.

---
