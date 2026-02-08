import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext/ThemeContext";

export function useTheme() {
    return useContext(ThemeContext);
}
