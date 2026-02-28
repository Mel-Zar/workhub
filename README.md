# 🚀 WorkHub

### Fullstack MERN Task Management Application

WorkHub is a production-style fullstack task management application built using the **MERN stack (MongoDB, Express, React, Node.js)**.

It features secure **JWT authentication with refresh tokens**, protected routes, scalable API architecture, image uploads, filtering, pagination, and a modular frontend structure.

This project demonstrates real-world fullstack development practices including token lifecycle management, API abstraction layers, separation of concerns, and reusable component architecture.

---

### 🌐 Live Demo

#### Add deployment link here (Render / Railway / Vercel)

---

## ✨ Core Features

### 🔐 Authentication & Security

- JWT Authentication (Access + Refresh Tokens)

- Automatic token refresh handling

- Protected routes (PrivateRoute)

- Password hashing with bcrypt

- Logout & session invalidation

- Account deletion

### 🗂 Task Management

- Create / Edit / Delete tasks

- Upload task images (Multer)

- Filter by:

- Priority

- Category

- Status

- Date

- Search tasks

- Sort tasks

- Pagination

### 👤 User Features

- Profile update

- Toast notifications

- Context-based state management

- Clean UI separation

- Modular architecture

---

## 🧠 Technical Highlights

- Centralized API layer (apiFetch)

- Service-based data handling

- Custom React hooks

- Context API for global state

- Clean MVC-like backend structure

- Token refresh flow implemented manually

- Scalable folder architecture

- Production-style separation of concerns

---

## 🖥️ Tech Stack

### Frontend

- React (Vite)

- React Router DOM

- Context API

- Custom Hooks

- React Toastify

- jwt-decode

### Backend

- Node.js

- Express

- MongoDB + Mongoose

- JSON Web Tokens

- bcryptjs

- Multer

- CORS

- dotenv

---

## 🧱 System Architecture & Code Structure

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
│       ├── uploads/
│       │   └── img.jpeg
│       │
│       └── utils/
│           └── generateToken.js
│
├── .gitignore
└── README.md
```

---

## Frontend Architecture

- api/ → Centralized fetch wrapper

- services/ → API communication layer

- hooks/ → Custom logic abstraction

- context/ → Auth & Theme providers

- components/ → Reusable UI components

- pages/ → Route-based views

- routes/ → Protected routing

## Backend Architecture

- controllers/ → Business logic

- routes/ → API endpoints

- models/ → Mongoose schemas

- middleware/ → Authentication & file handling

- config/ → Database connection

- utils/ → Token generation

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Mel-Zar/workhub.git
cd workhub
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `env` inside `/server`:

```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
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

### 3️⃣ Frontend Setup

Open new terminal:

```bash
cd client
npm install
```

Install required frontend dependencies:

```bash
npm install react react-dom react-router-dom react-toastify jwt-decode
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

## 🔐 Authentication Flow

1. User logs in

2. Backend returns:

- `accessToken`

- `refreshToken`

3. Tokens stored in localStorage

4. All requests go through apiFetch()

5. If access token expires → automatic refresh

6. If refresh fails → forced logout

---

## 🌍 API Flow

```bash
Component → Service → apiFetch → Backend
```

### Why this structure?

**✔** Centralized error handling

**✔** Automatic authorization headers

**✔** Automatic token refresh

**✔** Cleaner components

**✔** Scalable architecture

---

## 🛡 Protected Routes

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

## 🧰 Utilities

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

## 🖼 Screenshots

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

## 🚀 Why This Project Matters

This project demonstrates:

- Real-world authentication implementation

- Token lifecycle management

- Scalable folder structure

- Production-style API architecture

- Clean separation of frontend & backend concerns

- Practical fullstack development skills

It reflects how a real SaaS-style dashboard would be structured.

---

## 📈 Future Improvements

- Drag & Drop tasks

- Role-Based Access Control (RBAC)

- Dark Mode toggle

- Task sharing between users

- Email notifications

- Unit & integration testing

- Docker containerization

- CI/CD pipeline

---

## 👩‍💻 Author

Melissa Zarinnegar
Web Developer (E-commerce specialization)
Junior Fullstack Developer

---

## ⭐ If You Like This Project

Consider giving it a star on GitHub.

---
