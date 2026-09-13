import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Training = () => {
    const { t } = useLanguage();
    const modules = [
        {
            title: t('Teaching Essentials'),
            description: t('Learn how to organize classes, create engaging content, and manage learner progress effectively.')
        },
        {
            title: t('Assessment Strategies'),
            description: t('Explore practical ways to evaluate performance, give feedback, and support student improvement.')
        },
        {
            title: t('Digital Collaboration'),
            description: t('Use communication and sharing tools to build stronger connections with students and peers.')
        },
        {
            title: t('Career Readiness'),
            description: t('Develop the skills needed to learn and teach in a modern, technology-driven environment.')
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
            <section className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-gray-800 dark:to-gray-900 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <p className="text-green-100 uppercase tracking-[0.2em] text-sm mb-4">{t('Training')}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Build skills that improve learning outcomes')}</h1>
                    <p className="text-lg text-green-100">
                        {t('Access practical resources, guided learning paths, and support designed for teachers and students.')}
                    </p>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {modules.map((module, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                            <div className="text-3xl mb-4">{index + 1}</div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{module.title}</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{module.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Training;
