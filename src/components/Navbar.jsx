import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiSun, FiMoon, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import Tooltip from './Tooltip';
import io from 'socket.io-client';
import { assetUrl, socketUrl } from '../api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io(socketUrl, {
            transports: ['websocket'],
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST']
            }
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-connected', {
                userId: user.id || user._id,
                role: user.role,
                name: user.name
            });
        });

        const addNotification = (notification) => {
            setNotifications(prev => [notification, ...prev].slice(0, 6));
            setNotificationCount(prev => prev + 1);
        };

        socketRef.current.on('new-message', (message) => {
            addNotification({
                title: t('New message'),
                description: `Message from ${message.sender.name}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        socketRef.current.on('new-subject', (subject) => {
            addNotification({
                title: t('New subject available'),
                description: `${subject.teacherName} shared ${subject.title}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        socketRef.current.on('new-assessment', (assessment) => {
            addNotification({
                title: t('New assessment posted'),
                description: `${assessment.teacherName} created ${assessment.title}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        socketRef.current.on('message-read', (data) => {
            addNotification({
                title: t('Message read'),
                description: `${data.readerName} read your message`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        socketRef.current.on('subject-read', (data) => {
            addNotification({
                title: t('Subject read'),
                description: `${data.readerName} marked your subject as read`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user, t]);

    const handleLogout = () => {
        logout();
        setProfileDropdown(false);
        setNotificationDropdown(false);
        navigate('/login');
    };

    const navLinks = [
        { label: t('Home'), path: '/', show: true },
        { label: t('Subjects'), path: '/subjects', show: user?.role === 'student' },
        { label: t('Assessments'), path: '/assessments', show: user?.role === 'student' },
        { label: t('Create Subject'), path: '/create-subject', show: user?.role === 'teacher' },
        { label: t('My Subjects'), path: '/my-subjects', show: user?.role === 'teacher' },
        { label: t('Assessments'), path: '/teacher-assessments', show: user?.role === 'teacher' },
        { label: t('Chat'), path: '/chat', show: user?.role !== 'admin' },
        { label: t('Admin'), path: '/admin', show: user?.role === 'admin' },
        { label: t('Blog'), path: '/blog', show: true },
        { label: t('Contact'), path: '/contact', show: true },
        { label: t('Collaborators'), path: '/collaborators', show: true }
    ];

    return (
        <nav className="sticky top-0 z-40 relative bg-transparent backdrop-blur-sm text-white transition-colors duration-300">
            {/* Decorative angled shapes that intentionally overflow the viewport */}
            {/* <div className="absolute inset-0 pointer-events-none overflow-visible">
                <div className="absolute -left-48 -top-24 w-[680px] h-[320px] transform -rotate-12  opacity-80 blur-xl" />
                <div className="absolute -right-56 -bottom-28 w-[760px] h-[360px] transform rotate-12  opacity-70 blur-2xl" />
            </div> */}

            <div className="relative max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-20 backdrop-blur-md bg-white/6 dark:bg-gray-900/40 border border-white/10 rounded-b-xl shadow-xl px-4 py-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 font-extrabold text-2xl hover:text-white transition transform hover:scale-105">
                        <span className="text-3xl drop-shadow-lg">📚</span>
                        <span className="tracking-tight text-white">EduSol</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {navLinks.map((link) => {
                            if (!link.show) return null;
                            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${isActive ? 'text-yellow-300' : 'text-white hover:text-yellow-200 hover:underline'}`}
                                >
                                    {link.label}
                                    {isActive && <span className="block h-0.5 w-full bg-yellow-300 mt-2 rounded" />}
                                </Link>
                            );
                        })}
                        {!user && (
                            <Link to="/create-subject" className="ml-2 hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold shadow-md hover:scale-105 transform transition">Get Started</Link>
                        )}
                    </div>

                    {/* Right Side Items */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Selector */}
                        <div className="flex items-center gap-2">
                            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded-lg p-2 bg-white/10 text-white">
                                    <option value="dark" className="text-black">{t('Dark')}</option>
                                    <option value="green" className="text-green-600">{t('Green')}</option>
                            </select>
                        </div>

                        {/* Language Selector */}
                        <div>
                            <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg p-2 bg-white/10 text-white">
                                <option value="en" className="text-black">EN</option>
                                <option value="fr" className="text-black">FR</option>
                                <option value="es" className="text-black">ES</option>
                            </select>
                        </div>

                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <Tooltip text="Notifications">
                                    <button
                                        onClick={() => setNotificationDropdown(prev => !prev)}
                                        className="relative p-2 rounded-lg hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                                    >
                                        <FiBell size={20} />
                                        {notificationCount > 0 && (
                                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </button>
                                </Tooltip>

                                <AnimatePresence>
                                    {notificationDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-24 top-16 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Notifications')}</p>
                                                    <button
                                                        onClick={() => {
                                                            setNotificationCount(0);
                                                            setNotifications([]);
                                                        }}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        {t('Clear')}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="max-h-72 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-sm text-gray-600 dark:text-gray-300">{t('No new notifications')}</div>
                                                ) : (
                                                    notifications.map((notification, index) => (
                                                        <div key={index} className="px-4 py-3 border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.description}</p>
                                                            <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-2">{notification.time}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Profile Dropdown */}
                                <div className="relative group hidden md:block">
                                    <button
                                        onClick={() => setProfileDropdown(!profileDropdown)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                                    >
                                        {user.profilePicture ? (
                                            <img
                                                src={assetUrl(user.profilePicture)}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                                        <FiChevronDown size={16} />
                                    </button>

                                    <AnimatePresence>
                                        {profileDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2"
                                            >
                                                <div className="px-4 py-2 border-b dark:border-gray-700">
                                                    <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                                                    onClick={() => setProfileDropdown(false)}
                                                >
                                                    <FiUser size={16} />
                                                    <span>{t('Profile')}</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        navigate('/settings');
                                                        setProfileDropdown(false);
                                                    }}
                                                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700 transition text-left"
                                                >
                                                    <FiSettings size={16} />
                                                    <span>{t('Settings')}</span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition text-left border-t dark:border-gray-700 mt-2"
                                                >
                                                    <FiLogOut size={16} />
                                                    <span>{t('Logout')}</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="md:hidden p-2 rounded-lg hover:bg-red-500 transition"
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition"
                                >
                                    {t('Login')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 transition"
                                >
                                    {t('Register')}
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-blue-700 dark:bg-gray-800 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-4 space-y-2">
                                {navLinks.map((link) => {
                                    if (!link.show) return null;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 dark:hover:bg-gray-700 transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                {!user && (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 dark:hover:bg-gray-700 transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 dark:hover:bg-gray-700 transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;