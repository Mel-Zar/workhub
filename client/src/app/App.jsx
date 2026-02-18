import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";


import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Tasks from "../pages/Tasks/Tasks";
import Dashboard from "../pages/Dashboard/Dashboard";
import Task from "../pages/Task/Task";
import Profile from "../pages/Profile/Profile";

import PrivateRoute from "../routes/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer/Footer";
import "./App.scss";

function App() {
  return (
    <div className="app">

      {/* ✅ ONE GLOBAL CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        draggable
      />

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

      <Footer />

    </div>
  );
}

export default App;
