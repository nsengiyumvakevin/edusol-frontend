import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiToggleLeft, FiToggleRight, FiBell, FiLock, FiGlobe, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
    const { user, logout } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { theme, toggleTheme } = useTheme();
    const { t } = useLanguage();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
        weeklyNewsletter: false,
        dataCollection: true,
        twoFactorAuth: false
    });
    const [loading, setLoading] = useState(false);

    const toggleSetting = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSnackbar(t('Settings saved successfully!'), 'success');
        } catch {
            showSnackbar(t('Failed to save settings'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            showSnackbar('New passwords do not match', 'error');
            setLoading(false);
            return;
        }

        try {
            await axios.put(
                `http://localhost:5000/api/users/${user.id || user._id}`,
                {
                    currentPassword,
                    password: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            showSnackbar('Password changed successfully!', 'success');
            e.target.reset();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setLoading(true);
            try {
                await axios.delete(
                    `http://localhost:5000/api/users/${user.id || user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                showSnackbar('Account deleted successfully', 'success');
                logout();
                navigate('/home');
            } catch (error) {
                showSnackbar(error.response?.data?.message || 'Failed to delete account', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const settingSections = [
        {
            title: 'Notifications',
            icon: FiBell,
            items: [
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account activity' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Get real-time push notifications on your device' },
                { key: 'messageNotifications', label: 'Message Alerts', description: 'Be notified when you receive new messages' },
                { key: 'weeklyNewsletter', label: 'Weekly Newsletter', description: 'Get the latest news and updates in your inbox' }
            ]
        },
        {
            title: 'Privacy & Security',
            icon: FiLock,
            items: [
                { key: 'dataCollection', label: 'Allow Analytics', description: 'Help us improve by sharing anonymous usage data' },
                { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add extra security to your account' }
            ]
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-2">{t('Settings')}</h1>
                    <p className="text-blue-100">{t('Manage your preferences and account settings')}</p>
                </motion.div>
            </section>

            {/* Settings Content */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                {/* Appearance Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FiGlobe size={24} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Appearance')}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t('Dark Mode')}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{t('Switch between light and dark theme')}</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="text-3xl cursor-pointer transition-all duration-200"
                            >
                                {isDark ? (
                                    <FiToggleRight className="text-blue-600" />
                                ) : (
                                    <FiToggleLeft className="text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Notification Settings */}
                {settingSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="bg-white dark:bg-gray-600 p-4 rounded-lg flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting(item.key)}
                                            className="text-3xl cursor-pointer transition-all duration-200"
                                        >
                                            {settings[item.key] ? (
                                                <FiToggleRight className="text-blue-600" />
                                            ) : (
                                                <FiToggleLeft className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Save Settings Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex gap-4 mb-8"
                >
                    <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </motion.div>

                {/* Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FiLock size={24} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Change Password')}</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </motion.div>

                {/* Delete Account */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FiTrash2 size={24} className="text-red-600 dark:text-red-400" />
                        <h2 className="text-2xl font-bold text-red-900 dark:text-red-200">{t('Danger Zone')}</h2>
                    </div>

                    <p className="text-red-800 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Delete Account'}
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

export default Settings;
