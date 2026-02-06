import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userName: "",
    loading: true,
    login: () => { },
    logout: () => { },
    updateUserName: () => { }
});
