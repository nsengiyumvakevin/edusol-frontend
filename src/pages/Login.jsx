import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [postLoginLoading, setPostLoginLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            showSnackbar(t('Password must be at least 6 characters'), 'error');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        
        if (result.success) {
            showSnackbar(t('Login successful!'), 'success');
            setPostLoginLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            setTimeout(() => {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else if (user.role === 'teacher') {
                    navigate('/my-subjects');
                } else {
                    navigate('/subjects');
                }
                setPostLoginLoading(false);
            }, 500);
        } else {
            showSnackbar(result.message || t('Login failed'), 'error');
        }
    };

    if (postLoginLoading) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-4xl text-center mb-6"
                >
                    📚
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white"
                >
                    {t('Welcome Back')}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-600 dark:text-gray-400 mb-8"
                >
                    {t('Sign in to your Education Solution account')}
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('Email Address')}
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('Password')}
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {t('Signing in...')}
                            </>
                        ) : (
                            <>
                                {t('Sign In')}
                                <FiArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-center text-gray-600 dark:text-gray-400"
                >
                    {t("Don't have an account?")} {' '}
                    <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                        {t('Create one now')}
                    </Link>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500"
                >
                    <Link to="/home" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {t('Back to Home')}
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;