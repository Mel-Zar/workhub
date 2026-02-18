import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthContext/AuthProvider";
import ThemeProvider from "./context/ThemeContext/ThemeProvider";

import "./styles/main.scss";
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
