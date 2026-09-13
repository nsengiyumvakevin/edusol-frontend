import React, { useState } from 'react';
import { api } from '../api';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useSnackbar } from '../context/SnackbarContext';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const { t } = useLanguage();

    const contactInfo = [
        {
            icon: FiMail,
            title: t('Email'),
            content: 'support@educationsolution.com',
            description: t('We respond within 24 hours')
        },
        {
            icon: FiPhone,
            title: t('Phone'),
            content: '+1 (555) 123-4567',
            description: t('Mon-Fri, 9AM-6PM EST')
        },
        {
            icon: FiMapPin,
            title: t('Location'),
            content: 'Global Education Hub',
            description: t('Serving educators worldwide')
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/contact', formData);
            showSnackbar(t('Thank you! Your message was received.'), 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            const message = error?.response?.data?.message || t('Unable to submit your message. Please try again.');
            showSnackbar(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Contact Us')}</h1>
                    <p className="text-lg text-blue-100">
                        {t("We'd love to hear from you. Get in touch with our team!")}
                    </p>
                </motion.div>
            </section>

            {/* Contact Info Cards */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300"
                            >
                                <Icon className="text-3xl text-blue-600 dark:text-blue-400 mx-auto mb-4" size={32} />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {info.title}
                                </h3>
                                <p className="text-gray-900 dark:text-white font-semibold mb-1">
                                    {info.content}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {info.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Contact Form and Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('Send us a Message')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Full Name')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t('Your name')}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Email Address')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Subject')}
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={t('What is this about?')}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Message')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder={t('Your message here...')}
                                    rows="5"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <FiSend size={18} />
                                {loading ? t('Sending...') : t('Send Message')}
                            </button>
                        </form>
                    </motion.div>

                    {/* Map and Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🌍</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t('Global Reach')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('Serving educators and students in 50+ countries')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                {t('Response Times')}
                            </h4>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li>✓ {t('Email inquiries: 24 hours')}</li>
                                <li>✓ {t('Phone support: Available daily')}</li>
                                <li>✓ {t('Emergency support: 2 hours')}</li>
                                <li>✓ {t('Community forum: Real-time responses')}</li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded">
                            <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-2">
                                {t('Business Hours')}
                            </h4>
                            <p className="text-orange-800 dark:text-orange-100">
                                Every time some who want to communicate with other
                                he/she can engage.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
