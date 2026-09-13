import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Typewriter = ({ text, speed = 50 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.substring(0, index + 1));
                index++;
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <span>{displayedText}</span>;
};

const Home = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            title: t('Real-time Chat'),
            description: t('Connect with teachers and students instantly with our real-time messaging system'),
            icon: '💬'
        },
        {
            title: t('Smart Subjects'),
            description: t('Create, share, and explore educational subjects with rich content support'),
            icon: '📚'
        },
        {
            title: t('User Profiles'),
            description: t('Build your learning profile with photos, achievements, and progress tracking'),
            icon: '👤'
        },
        {
            title: t('Responsive Design'),
            description: t('Learn from anywhere - seamless experience on all devices'),
            icon: '📱'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section with Parallax */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Parallax Background Layers */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center opacity-80 -z-20"
                    animate={{ y: scrollY * 0.25 }}
                    transition={{ duration: 0 }}
                    style={{
                        y: scrollY * 0.25,
                        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1500&q=80)'
                    }}
                />
                <motion.div
                    className="absolute inset-0 bg-cover bg-center opacity-70 -z-10"
                    animate={{ y: scrollY * 0.55 }}
                    transition={{ duration: 0 }}
                    style={{
                        y: scrollY * 0.55,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.18), rgba(255,255,255,0.18)), url(https://images.unsplash.com/photo-1532375810709-95f63c6cdd3c?auto=format&fit=crop&w=1500&q=80)'
                    }}
                />

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {t('Welcome to')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Education Solution</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 h-12"
                    >
                        <Typewriter
                            text={t('Connecting Teachers & Students for Exceptional Learning')}
                            speed={30}
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
                    >
                        {t('Our mission is to empower educators and learners with a platform that supports real-time collaboration, resource sharing, and community building. Join thousands of students and teachers worldwide.')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'teacher' ? '/my-subjects' : '/subjects'}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 group"
                                >
                                    {t('Go to Dashboard')}
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 group"
                                >
                                    {t('Get Started')}
                                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-all duration-300"
                                >
                                    {t('Sign In')}
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="text-3xl text-blue-600 dark:text-blue-400">↓</div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                >
                    {t('Why Choose Education Solution?')}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-12 text-white"
                >
                    <h2 className="text-4xl font-bold mb-6">{t('Our Vision')}</h2>
                    <div className="space-y-4 text-lg">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">🎯 {t('Mission')}</h3>
                            <p>{t('To create an inclusive, accessible learning platform that bridges the gap between educators and learners worldwide, enabling transformative educational experiences.')}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">🌟 {t('Objective')}</h3>
                            <p>{t('Empower educators with tools to create engaging content, facilitate real-time communication, and track student progress while providing students with a collaborative learning environment.')}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">🤝 {t('Support')}</h3>
                            <p>{t('Through partnerships with leading educational platforms like W3Schools and JavaTPoint, we ensure quality content delivery and continuous learning support for our community.')}</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('Ready to Transform Your Learning?')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            {t('Join our global learning community and start your educational journey today.')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300"
                            >
                                {t('Sign Up Today')}
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </section>
            )}
        </div>
    );
};

export default Home;
