import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, text, position = 'top', delay = 0.2 }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2'
    };

    const arrowPositions = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-700 dark:border-t-gray-300 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-700 dark:border-b-gray-300 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-700 dark:border-l-gray-300 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-700 dark:border-r-gray-300 border-t-transparent border-b-transparent border-l-transparent'
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="inline-block"
            >
                {children}
            </div>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay, duration: 0.2 }}
                        className={`absolute ${positions[position]} whitespace-nowrap bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 text-xs font-semibold py-1 px-2 rounded pointer-events-none z-50`}
                    >
                        {text}
                        <div className={`absolute border-4 ${arrowPositions[position]}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
