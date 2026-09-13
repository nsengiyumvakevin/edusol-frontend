/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbars, setSnackbars] = useState([]);

    const showSnackbar = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setSnackbars(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setSnackbars(prev => prev.filter(s => s.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeSnackbar = useCallback((id) => {
        setSnackbars(prev => prev.filter(s => s.id !== id));
    }, []);

    const icons = {
        success: <FiCheck className="text-green-600 dark:text-green-400" />,
        error: <FiXCircle className="text-red-600 dark:text-red-400" />,
        warning: <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" />,
        info: <FiInfo className="text-blue-600 dark:text-blue-400" />
    };

    const colors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, removeSnackbar }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {snackbars.map(snackbar => (
                        <motion.div
                            key={snackbar.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${colors[snackbar.type]} border rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-xs`}
                        >
                            {icons[snackbar.type]}
                            <span className="text-sm font-medium dark:text-gray-100">{snackbar.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within SnackbarProvider');
    }
    return context;
};
