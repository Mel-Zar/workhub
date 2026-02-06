# 🚀 Task Manager Dashboard – Fullstack MERN Application

A fullstack task management application built with **React, Node.js, Express, MongoDB** and **JWT authentication**.

Users can register, log in, create tasks, upload images, edit tasks, filter, search, sort and manage their profile.

This project demonstrates a **real-world architecture** with services, hooks, reusable components, protected routes, token refresh and clean folder structure.

---

## 🧠 Features

✅ User Authentication (JWT + Refresh Tokens)

✅ Register & Login

✅ Protected Routes

✅ Create / Update / Delete Tasks

✅ Task filtering (priority, category, status, date)

✅ Search & Sort tasks

✅ Pagination

✅ Auto token refresh

✅ Profile update & delete account

✅ Toast notifications

✅ Clean architecture with services & hooks

---

## 🖥️ Tech Stack

###Frontend

- React

- React Router

- Context API

- Custom Hooks

- Vite

- React Toastify

### Backend

- Node.js

- Express

- MongoDB + Mongoose

- JWT Authentication

- Multer (file uploads)

## 📁 Folder Structure

### Frontend & Backend

```bash
workhub/
│
├── client/
│   ├── package.json
│   ├── .env
│   └── src/
│       │
│       ├── api/
│       │   ├── ApiFetch.js
│       │   └── http.js
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── TaskFilters.jsx
│       │   ├── TaskForm.jsx
│       │   ├── TaskItem.jsx
│       │   ├── TaskSearch.jsx
│       │   └── TaskSort.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── AuthProvider.js
│       │
│       ├── hooks/
│       │   └── useTasks.js
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   ├── Task.jsx
│       │   └── Tasks.jsx
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
│       ├── App.jsx
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
│       ├── uploads/img.jpeg
│       │
│       └── utils/
│           └── generateToken.js
│
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables (.env)

Create a .env file in the **root of frontend project**:

```bash
VITE_API_URL=http://localhost:5000
```

Create a .env file in the **backend**:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

⚠️ Never commit .env files to GitHub.

---

## ⚙️ Installation

### 1️⃣ Clone repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### 2️⃣ Install backend

```bash
cd backend
npm install
npm run dev
```

```bash
3️⃣ Install frontend
cd frontend
npm install
npm run dev
```

---

## 🔁 Authentication Flow

1. User logs in

2. Backend returns:
   - accessToken

   - refreshToken

3. Tokens saved in localStorage

4. Every request uses apiFetch()

5. If accessToken expires → auto refresh

6. If refresh fails → logout

---

## 🌍 API Architecture

All requests go through:

```bash
apiFetch → request → service → component
```

This gives:

✔ Centralized error handling

✔ Automatic headers

✔ Token refresh

✔ Cleaner components

---

## 🧰 Utils Usage

```bash
utils/formatters.js
```

Used for:

- Capitalizing titles

- Cleaning categories

- Formatting user input

Example:

```bash
capitalize("hello") → "Hello"
formatCategory("work123") → "Work"
```

## 🖼️ Screenshots

Add images inside:

```bash
/screenshots
```

Then reference in README:

```bash
![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Create Task](screenshots/create-task.png)
![Edit Task](screenshots/edit-task.png)
```

Example sections:

## **🔑 Login Page**

## **📊 Dashboard**

## **Create Task**

## **✏️ Edit Task**

---

## 🛡️ Protected Routes

Pages requiring login:

- /dashboard

- /tasks

- /task/:id

- /profile

Handled by:

```bash
<PrivateRoute>
```

---

# 🚀 Why This Project?

This project demonstrates:

✅ Fullstack architecture
✅ Real authentication system
✅ Scalable folder structure
✅ Clean code separation
✅ Production-style API layer

Perfect as a portfolio project.

---

## 👨‍💻 Author

**Melissa Zarinnegar**

Web Developer (E-commerce specialization)

Junior Fullstack Developer

---

## ⭐ Future Improvements

- Drag & drop tasks

- Dark mode

- Role based access

- Task sharing

- Notifications
