import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const HelpCenter = () => {
    const { t } = useLanguage();
    const faqs = [
        {
            question: t('How do I access my account?'),
            answer: t('Use the login page and enter the email and password tied to your teacher or student account.')
        },
        {
            question: t('Can I create or manage subjects?'),
            answer: t('Teachers can create and manage teaching materials from their dashboard, while students can view and access available subjects.')
        },
        {
            question: t('Where do I ask for support?'),
            answer: t('You can contact our support team through the Contact page or email us directly at support@educationsolution.com.')
        },
        {
            question: t('How do assessments work?'),
            answer: t('Students can submit work and receive feedback, while teachers can review submissions and assign marks in the assessment dashboard.')
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
            <section className="bg-gradient-to-r from-orange-500 to-amber-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <p className="text-orange-100 uppercase tracking-[0.2em] text-sm mb-4">{t('Help Center')}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('We’re here to help')}</h1>
                    <p className="text-lg text-orange-100">
                        {t('Find guidance for account access, subjects, assessments, and general platform support.')}
                    </p>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="space-y-6">
                    {faqs.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.question}</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
