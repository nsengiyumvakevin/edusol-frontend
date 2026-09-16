import React, { useState, useEffect, useCallback } from 'react';
import { api, assetUrl } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiEdit, FiPlus, FiCalendar } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

const SubjectModal = ({ subject, isOpen, onClose }) => {
    if (!subject) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-800 text-white p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{subject.title}</h2>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-2 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <FiCalendar className="text-blue-600 dark:text-blue-400" size={20} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Created: {new Date(subject.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {subject.description}
                                </p>
                            </div>

                            {subject.content && (
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Content</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {subject.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MySubjects = () => {
    const { t } = useLanguage();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [editSubject, setEditSubject] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPdfFile, setEditPdfFile] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await api.get('/subjects/my-subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast.error(t('Failed to fetch subjects'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await api.delete(`/subjects/${id}`);
                toast.success(t('Subject deleted successfully'));
                fetchSubjects();
            } catch {
                toast.error(t('Failed to delete subject'));
            }
        }
    };

    const handleOpenEdit = (subject) => {
        setEditSubject(subject);
        setEditTitle(subject.title);
        setEditDescription(subject.description || '');
        setEditPdfFile(null);
    };

    const handleCloseEdit = () => {
        setEditSubject(null);
        setEditTitle('');
        setEditDescription('');
        setEditPdfFile(null);
        setEditLoading(false);
    };

    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        if (!editSubject) return;
        setEditLoading(true);

        try {
            if (editPdfFile) {
                const formData = new FormData();
                formData.append('title', editTitle);
                formData.append('description', editDescription);
                formData.append('pdfFile', editPdfFile);

                await api.put(
                    `/subjects/${editSubject._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            } else {
                await api.put(
                    `/subjects/${editSubject._id}`,
                    {
                        title: editTitle,
                        description: editDescription
                    },
                    {
                    }
                );
            }

            toast.success(t('Subject updated successfully'));
            fetchSubjects();
            handleCloseEdit();
        } catch (error) {
            toast.error(error.response?.data?.message || t('Failed to update subject'));
            setEditLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{t('My Subjects')}</h1>
                        <p className="text-blue-100">{t('Manage and track your created subjects')}</p>
                    </div>
                    <Link
                        to="/create-subject"
                        className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105"
                    >
                        <FiPlus size={20} />
                        {t('Create Subject')}
                    </Link>
                </motion.div>
            </section>

            {/* Subjects Grid */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                {subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {subjects.map((subject, index) => (
                                <motion.div
                                    key={subject._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="h-2 bg-gradient-to-r from-green-600 to-green-800" />
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {subject.title}
                                        </h2>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                            {subject.description}
                                        </p>

                                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <FiCalendar size={14} />
                                                {new Date(subject.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                                <span>{subject.studentsRead?.length || 0} student(s) read</span>
                                                {subject.pdfUrl && (
                                                    <a
                                                        href={assetUrl(subject.pdfUrl)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 dark:text-blue-300 hover:underline"
                                                    >
                                                        View PDF
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedSubject(subject)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(subject)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                                                    title="Edit subject"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subject._id)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                                                    title="Delete subject"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg"
                    >
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            You haven't created any subjects yet.
                        </p>
                        <Link
                            to="/create-subject"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold rounded-lg transition-colors duration-200"
                        >
                            <FiPlus size={20} />
                            Create Your First Subject
                        </Link>
                    </motion.div>
                )}
            </section>

            {/* Subject Modal */}
            <SubjectModal
                subject={selectedSubject}
                isOpen={!!selectedSubject}
                onClose={() => setSelectedSubject(null)}
            />

            {/* Edit Subject Modal */}
            <AnimatePresence>
                {editSubject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseEdit}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-800 text-white p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Edit Subject</h2>
                                <button
                                    onClick={handleCloseEdit}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubject} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows="5"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Upload PDF (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setEditPdfFile(e.target.files[0])}
                                        className="w-full text-gray-700 dark:text-gray-300"
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {editLoading ? 'Updating...' : 'Update Subject'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseEdit}
                                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MySubjects;