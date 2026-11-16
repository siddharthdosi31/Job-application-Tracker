
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [preference, setPreference] = useState(
        () => localStorage.getItem("theme") || "system"
    );

    const [systemDark, setSystemDark] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (event) => {
            setSystemDark(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const theme =
        preference === "system"
            ? systemDark ? "dark" : "light"
            : preference;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");

        if (preference === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", preference);
        }
    }, [theme, preference]);

    const toggleTheme = () => {
        setPreference(theme === "dark" ? "light" : "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
