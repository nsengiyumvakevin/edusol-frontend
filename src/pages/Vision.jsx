import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Vision = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
            <section className="bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <p className="text-indigo-100 uppercase tracking-[0.2em] text-sm mb-4">{t('Our Vision')}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('A world where learning is connected, accessible, and inspiring')}</h1>
                    <p className="text-lg text-indigo-100">
                        {t('We aim to become a global reference for modern education by combining technology, collaboration, and practical learning support.')}
                    </p>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-300">{t('Our objective')}</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {t('To empower educators with digital tools for content delivery, assessment management, and student engagement while giving learners a collaborative environment to grow.')}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Inclusive learning', text: 'Create a welcoming space for teachers and students from different backgrounds and regions.' },
                            { title: 'Practical support', text: 'Combine tools, guidance, and learning resources to improve everyday teaching and study experiences.' },
                            { title: 'Global impact', text: 'Scale educational support through partnerships and community learning networks worldwide.' }
                        ].map((item, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{t(item.title)}</h3>
                                <p className="text-gray-700 dark:text-gray-300">{t(item.text)}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Vision;
