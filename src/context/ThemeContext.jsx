/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || saved === 'light' ? saved : 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const html = document.documentElement;
        html.classList.remove('dark');
        html.classList.remove('green-theme');
        if (theme === 'dark') html.classList.add('dark');
        html.style.colorScheme = theme;
    }, [theme]);

    const set = (value) => setTheme(value === 'dark' ? 'dark' : 'light');

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
