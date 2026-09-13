import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useLanguage();

    const collaborators = [
        { name: 'W3Schools', logo: '/w3.png' },
        { name: 'JavaTPoint', logo: '/javatpoint.png' },
        { name: 'Codecademy', logo: '/codecademy.png' },
        { name: 'Programiz', logo: '/programiz.png' },
        {name:'CodeCamp',logo:'/codecamp.png'}
    ];

    const footerSections = [
        {
            title: t('About Us'),
            links: [
                { label: t('Mission'), href: '/mission' },
                { label: t('Vision'), href: '/vision' },
                { label: t('Team'), href: '/contact' },
                { label: t('Careers'), href: '/contact' }
            ]
        },
        {
            title: t('Resources'),
            links: [
                { label: t('Blog'), href: '/blog' },
                { label: t('Subjects'), href: '/subjects' },
                { label: t('Assessments'), href: '/assessments' },
                { label: t('Community'), href: '/chat' }
            ]
        },
        {
            title: t('Support'),
            links: [
                { label: t('Help Center'), href: '/help-center' },
                { label: t('Contact Us'), href: '/contact' },
                { label: t('Training'), href: '/training' },
                { label: t('Feedback'), href: '/contact' }
            ]
        }
    ];

    return (
        <footer className="bg-gradient-to-b from-blue-900 to-blue-950 dark:from-gray-900 dark:to-gray-950 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-bold text-blue-300">Education Solution</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {t('Connecting teachers and students for efficient, collaborative learning experiences.')}
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ scale: 1.2, color: '#60a5fa' }}
                                    className="text-gray-300 hover:text-blue-400 transition"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    {footerSections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <h4 className="font-semibold text-lg mb-4 text-blue-300">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link to={link.href} className="text-gray-300 hover:text-blue-400 transition text-sm">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Collaborators Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-blue-800 pt-8 mb-8"
                >
                    <h4 className="font-semibold text-lg mb-4 text-blue-300">{t('Global Collaborators')}</h4>
                    <div className="flex flex-wrap items-center gap-6 md:gap-8">
                        {collaborators.map((collab, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {typeof collab.logo === 'string' && collab.logo.startsWith('/') ? (
                                    <img
                                        src={collab.logo}
                                        alt={collab.name}
                                        className="h-8 w-8 object-contain rounded-sm bg-white/10 p-1"
                                    />
                                ) : (
                                    <span className="text-2xl">{collab.logo}</span>
                                )}
                                <span className="text-gray-300 font-semibold">{collab.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Info */}
                <div className="border-t border-blue-800 pt-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: FiMail, text: 'support@educationsolution.com' },
                        { icon: FiPhone, text: '+1 (555) 123-4567' },
                        { icon: FiMapPin, text: 'Global Education Hub' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 text-gray-300"
                        >
                            <item.icon className="text-blue-400" size={20} />
                            <span className="text-sm">{item.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Copyright */}
                <div className="border-t border-blue-800 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {currentYear} Education Solution. {t('All rights reserved.')} | {t('Empowering Education Globally')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
