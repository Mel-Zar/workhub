import React from "react";
import AuthProvider from "../AuthContext/AuthProvider";
import ThemeProvider from "../ThemeContext/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GlobalProvider({ children }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                {children}
                <ToastContainer position="top-right" autoClose={3000} pauseOnHover draggable />
            </AuthProvider>
        </ThemeProvider>
    );
}
