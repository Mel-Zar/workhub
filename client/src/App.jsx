import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// ✅ Importera AuthProvider från rätt fil
import { AuthProvider } from "./context/AuthProvider";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";

// PrivateRoute wrapper
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    // AuthProvider omsluter hela appen
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Skyddad home route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/task/:id"
          element={
            <PrivateRoute>
              <Task />
            </PrivateRoute>
          }
        />

        {/* Offentliga routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Alla andra routes skickas till login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
