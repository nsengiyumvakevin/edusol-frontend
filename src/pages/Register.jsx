import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiGlobe, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { fieldGroups } from '../data/fieldOptions';
import { nationalities } from '../data/nationalities';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [nationality, setNationality] = useState('');
    const [fieldInterest, setFieldInterest] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            showSnackbar(t('Password must be at least 6 characters'), 'error');
            return;
        }
        setLoading(true);
        const result = await register(name, email, password, role, nationality, fieldInterest);
        setLoading(false);
        
        if (result.success) {
            showSnackbar(t('Registration successful! Redirecting to login...'), 'success');
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } else {
            showSnackbar(result.message || t('Registration failed'), 'error');
        }
    };

    const roles = [
        { value: 'student', label: 'Student', icon: '👤', description: 'Learn from subjects' },
        { value: 'teacher', label: 'Teacher', icon: '🎓', description: 'Create subjects' }
    ];

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
                    🚀
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white"
                >
                    {t('Join Us')}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-600 dark:text-gray-400 mb-8"
                >
                    {t('Create your Education Solution account')}
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
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
                            Email Address
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
                        transition={{ delay: 0.7 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Password
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

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Nationality
                        </label>
                        <div className="relative">
                            <FiGlobe className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            >
                                <option value="">Select your nationality</option>
                                {nationalities.map((n) => (
                                    <option key={n.value} value={n.value}>{n.label}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Field of Interest
                        </label>
                        <div className="relative">
                            <FiBriefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                            <select
                                value={fieldInterest}
                                onChange={(e) => setFieldInterest(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            >
                                <option value="">Select a field</option>
                                {fieldGroups.map((group) => (
                                    <optgroup key={group.id} label={`${group.icon} ${group.label}`}>
                                        {group.fields.map((field) => (
                                            <option key={field.value} value={field.value}>{field.icon} {field.label}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Choose the field you want to read subjects from
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Account Type
                        </label>
                        <div className="space-y-2">
                            {roles.map(r => (
                                <label
                                    key={r.value}
                                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        role === r.value
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value={r.value}
                                        checked={role === r.value}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="text-xl mr-2">{r.icon}</span>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{r.label}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{r.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <FiArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-6 text-center text-gray-600 dark:text-gray-400"
                >
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                        Sign in here
                    </Link>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500"
                >
                    <Link to="/home" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;