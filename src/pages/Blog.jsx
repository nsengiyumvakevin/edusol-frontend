import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { t } = useLanguage();

    const blogPosts = [
        {
            id: 1,
            title: 'From Hesitant Learner to Tech Creator',
            excerpt: 'Amina discovered that shared subject resources and live teacher feedback helped her move from passive learning to building digital projects with confidence.',
            author: 'Amina Yusuf',
            date: 'March 15, 2026',
            category: 'success',
            image: '🌟',
            readTime: '5 min read'
        },
        {
            id: 2,
            title: 'How Daniel Built a Strong Network Through Collaborative Learning',
            excerpt: 'By joining peer discussions and sharing completed assessments, Daniel developed the confidence to work on real-world ICT and multimedia projects.',
            author: 'Daniel K.',
            date: 'March 12, 2026',
            category: 'success',
            image: '🤝',
            readTime: '8 min read'
        },
        {
            id: 3,
            title: 'Grace Turned Her Study Routine Around with Organized Subjects',
            excerpt: 'Grace now uses field-based subject groups and teacher guidance to focus on construction and engineering content with a clear weekly plan.',
            author: 'Grace M.',
            date: 'March 10, 2026',
            category: 'success',
            image: '📚',
            readTime: '6 min read'
        },
        {
            id: 4,
            title: 'Technology Tools for Modern Education',
            excerpt: 'Explore the latest educational technology tools that enhance learning and improve teaching efficiency.',
            author: 'James Rodriguez',
            date: 'March 8, 2026',
            category: 'technology',
            image: '💻',
            readTime: '7 min read'
        },
        {
            id: 5,
            title: 'Student Success Stories',
            excerpt: 'Inspiring stories from students who transformed their learning journey using collaborative platforms and guided feedback.',
            author: 'Lisa Anderson',
            date: 'March 5, 2026',
            category: 'success',
            image: '⭐',
            readTime: '6 min read'
        },
        {
            id: 8,
            title: 'Moses Turned Practical Skills into a Career Path',
            excerpt: 'After joining field-based learning groups, Moses moved from struggling with assignments to confidently building practical solutions in ICT and multimedia.',
            author: 'Moses P.',
            date: 'March 3, 2026',
            category: 'success',
            image: '🚀',
            readTime: '5 min read'
        },
        {
            id: 9,
            title: 'Fatima Found Her Voice Through Shared Feedback',
            excerpt: 'With regular teacher feedback and collaborative submissions, Fatima developed a stronger workflow and became more confident in her technical projects.',
            author: 'Fatima H.',
            date: 'February 27, 2026',
            category: 'success',
            image: '💡',
            readTime: '4 min read'
        },
        {
            id: 6,
            title: 'Overcoming Common Online Learning Challenges',
            excerpt: 'Practical solutions to tackle distractions, time management, and staying motivated in virtual learning.',
            author: 'David Thompson',
            date: 'March 1, 2026',
            category: 'education',
            image: '🚀',
            readTime: '9 min read'
        },
        {
            id: 7,
            title: 'How Teachers Can Share PDF Subjects Seamlessly',
            excerpt: 'A quick guide for educators on sharing valuable PDF subject content and tracking student reading progress.',
            author: 'Amina Yusuf',
            date: 'April 10, 2026',
            category: 'technology',
            image: '📄',
            readTime: '6 min read'
        }
    ];

    const categories = [
        { value: 'all', label: 'All Articles' },
        { value: 'education', label: 'Education' },
        { value: 'teaching', label: 'Teaching' },
        { value: 'collaboration', label: 'Collaboration' },
        { value: 'technology', label: 'Technology' },
        { value: 'success', label: 'Success Stories' }
    ];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Our Blog')}</h1>
                    <p className="text-lg text-blue-100">
                        {t('Insights, tips, and stories from educators and learners around the world')}
                    </p>
                </motion.div>
            </section>

            {/* Search and Filter */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    {/* Search Bar */}
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('Search articles...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                                    selectedCategory === cat.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                {t(cat.label)}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Blog Posts Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="p-6">
                                    <div className="text-4xl mb-4">{post.image}</div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta Information */}
                                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FiCalendar size={14} />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FiUser size={14} />
                                            {t('By')} {post.author}
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {post.readTime}
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="flex justify-between items-center">
                                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full capitalize">
                                            {post.category}
                                        </span>
                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
                                            {t('Read More')} →
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center py-12"
                    >
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {t('No articles found. Try adjusting your search or filters.')}
                        </p>
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default Blog;
