import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Mission = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <p className="text-blue-100 uppercase tracking-[0.2em] text-sm mb-4">{t('Our Mission')}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Empowering education through connection')}</h1>
                    <p className="text-lg text-blue-100">
                        {t('We build a collaborative learning environment where teachers and students can learn, share, and grow together.')}
                    </p>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-blue-50 dark:bg-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">{t('What we do')}</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {t('Education Solution connects educators, students, and resources in a single platform. We make it easier to share quality learning materials, conduct assessments, and maintain active communication across the teaching journey.')}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('Why it matters')}</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {t('We believe access to quality education should be inclusive, practical, and community-driven. Our platform helps learners stay motivated while giving teachers the tools they need to guide progress effectively.')}
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Mission;
