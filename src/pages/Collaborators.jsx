import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Collaborators = () => {
    const { t } = useLanguage();
    const collaborators = [
        {
            name: 'W3Schools',
            logo: '/w3.png',
            description: 'The world\'s largest web development learning community with comprehensive tutorials and reference materials.',
            specialties: ['Web Development', 'Programming', 'Tutorials'],
            color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30',
            borderColor: 'border-blue-500',
            link: 'https://www.w3schools.com'
        },
        {
            name: 'JavaTPoint',
            logo: '/javatpoint.png',
            description: 'A comprehensive platform for learning Java, web development, and various programming languages with practical examples.',
            specialties: ['Java', 'Web Development', 'Programming Languages'],
            color: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30',
            borderColor: 'border-orange-500',
            link: 'https://www.javatpoint.com'
        },
        {
            name: 'Codecademy',
            logo: '/codecademy.png',
            description: 'An interactive learning platform offering guided coding exercises, projects, and structured career-focused paths.',
            specialties: ['Coding Practice', 'Project Labs', 'Career Paths'],
            color: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/30',
            borderColor: 'border-teal-500',
            link: 'https://www.codecademy.com'
        },
        {
            name: 'Programiz',
            logo: '/programiz.png',
            description: 'An easy-to-follow programming resource for learners who want clear explanations and guided examples.',
            specialties: ['Python', 'Algorithms', 'Beginners'],
            color: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30',
            borderColor: 'border-indigo-500',
            link: 'https://www.programiz.com'
        },
        {
            name: 'CodeCamp',
            logo: '/codecamp.png',
            description: 'A collaborative learning community focused on coding practice, peer support, and project-based tutorials.',
            specialties: ['Coding Practice', 'Project Labs', 'Peer Support'],
            color: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30',
            borderColor: 'border-emerald-500',
            link: 'https://www.freecodecamp.org'
        }
    ];

    const benefits = [
        {
            icon: '🎯',
            title: 'Quality Content',
            description: 'Access to curated, high-quality learning material from industry leaders'
        },
        {
            icon: '🌍',
            title: 'Global Reach',
            description: 'Connect with a worldwide community of educators and learners'
        },
        {
            icon: '📖',
            title: 'Diverse Resources',
            description: 'Comprehensive tutorials, documentation, and reference materials'
        },
        {
            icon: '🚀',
            title: 'Continuous Learning',
            description: 'Stay updated with the latest technologies and best practices'
        }
    ];

    const partnerships = [
        {
            category: 'Educational Content',
            items: ['Tutorial Integration', 'Resource Library Access', 'Curriculum Support']
        },
        {
            category: 'Community Support',
            items: ['Expert Forums', 'Q&A Sessions', 'Community Events']
        },
        {
            category: 'Technology Integration',
            items: ['API Access', 'Content Embedding', 'Real-time Updates']
        }
    ];

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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Our Global Collaborators')}</h1>
                    <p className="text-lg text-blue-100">
                        {t('Partnering with leading educational platforms to enhance learning experiences')}
                    </p>
                </motion.div>
            </section>

            {/* Collaborators Showcase */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {collaborators.map((collab, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${collab.color} border-l-4 ${collab.borderColor} rounded-lg p-8 hover:shadow-lg transition-all duration-300`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {typeof collab.logo === 'string' && collab.logo.startsWith('/') ? (
                                        <img
                                            src={collab.logo}
                                            alt={collab.name}
                                            className="h-16 w-16 object-contain rounded-xl bg-white/70 p-2 shadow-sm"
                                        />
                                    ) : (
                                        <span className="text-5xl mb-4 block">{collab.logo}</span>
                                    )}
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {collab.name}
                                    </h3>
                                </div>
                                <motion.a
                                    href={collab.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    <FiExternalLink size={24} />
                                </motion.a>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {collab.description}
                            </p>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    {t('Specialties')}:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {collab.specialties.map((specialty, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-50 dark:bg-gray-800 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto"
                >
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        {t('Why Our Partnerships Matter')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-white dark:bg-gray-700 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Partnership Features */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                >
                    {t('What Our Partnerships Provide')}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {partnerships.map((partnership, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {partnership.category}
                            </h3>
                            <ul className="space-y-3">
                                {partnership.items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                    >
                                        <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">
                        {t('Join Our Learning Community')}
                    </h2>
                    <p className="text-lg text-blue-100 mb-8">
                        {t('Access world-class educational content through our collaborative network')}
                    </p>
                    <a
                        href="/register"
                        className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
                    >
                        {t('Get Started Today')}
                    </a>
                </motion.div>
            </section>
        </div>
    );
};

export default Collaborators;
