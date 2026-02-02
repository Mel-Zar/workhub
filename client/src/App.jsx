import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthProvider";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Profile from "./pages/Profile";

import PrivateRoute from "./routes/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>

      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar />

      <Routes>

        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/tasks" element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        } />

        <Route path="/task/:id" element={
          <PrivateRoute>
            <Task />
          </PrivateRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

    </AuthProvider>
  );
}

export default App;
