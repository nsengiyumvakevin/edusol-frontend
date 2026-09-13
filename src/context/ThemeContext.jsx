/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // theme can be 'dark', 'light', or 'green'
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const html = document.documentElement;
        // clear theme classes
        html.classList.remove('dark');
        html.classList.remove('green-theme');
        if (theme === 'dark') html.classList.add('dark');
        if (theme === 'green') html.classList.add('green-theme');
    }, [theme]);

    const set = (value) => setTheme(value);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, setTheme: set, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
