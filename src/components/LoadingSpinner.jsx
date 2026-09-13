import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const spinner = (
        <motion.div
            className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
