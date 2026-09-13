import React, { useState, useEffect, useRef } from 'react';
import { api, assetUrl, socketUrl } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiBook, FiCheckCircle, FiDownload, FiShare2, FiLayers, FiSearch, FiUser } from 'react-icons/fi';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { fieldGroups, getFieldLabel, getFieldIcon } from '../data/fieldOptions';
import { useLanguage } from '../context/LanguageContext';

const SubjectModal = ({ subject, isOpen, onClose, onDownload, onShare }) => {
    if (!subject) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 text-white p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{getFieldIcon(subject.fieldCategory)}</span>
                                <h2 className="text-2xl font-bold">{subject.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                                {subject.teacher.profilePicture ? (
                                    <img
                                        src={assetUrl(subject.teacher.profilePicture)}
                                        alt={subject.teacher.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                        {subject.teacher.name[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Posted by</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{subject.teacher.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(subject.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {subject.description}
                                </p>
                            </div>

                            {subject.content && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Content</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {subject.content}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-200">
                                    <FiLayers size={14} />
                                    {getFieldLabel(subject.fieldCategory)}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-200">
                                    <FiDownload size={14} />
                                    {subject.downloadCount || 0} downloads
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {subject.pdfUrl && (
                                    <a
                                        href={assetUrl(subject.pdfUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => onDownload(subject._id)}
                                        className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                                    >
                                        <FiDownload size={18} />
                                        Download PDF
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShare(subject);
                                    }}
                                    className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                                >
                                    <FiShare2 size={18} />
                                    Share with a Student
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ShareModal = ({ subject, isOpen, onClose }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sharing, setSharing] = useState(false);
    const { user } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        setSearchTerm('');

        socketRef.current = io(socketUrl, { transports: ['websocket'] });

        api.get('/messages/students')
            .then((res) => setStudents(Array.isArray(res.data) ? res.data : (res.data.data || [])))
            .catch(() => toast.error('Failed to load students'))
            .finally(() => setLoading(false));
    }, [isOpen]);

    useEffect(() => () => socketRef.current?.disconnect(), []);

    const handleShare = async (student) => {
        if (!subject) return;
        setSharing(true);
        try {
            await api.post(`/subjects/${subject._id}/share`, { studentId: student._id });
            socketRef.current?.emit('subject-shared', {
                studentId: student._id,
                subjectId: subject._id,
                title: subject.title,
                sharerName: user.name
            });
            toast.success(`Subject shared to ${student.name}`);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to share subject');
        } finally {
            setSharing(false);
        }
    };

    const filtered = students.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AnimatePresence>
            {isOpen && subject && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-gray-900 dark:to-gray-800 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Share Subject</h3>
                                <p className="text-sm text-indigo-100 truncate max-w-[240px]">{subject.title}</p>
                            </div>
                            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                                <FiX size={22} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="relative mb-4">
                                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto space-y-2">
                                {loading ? (
                                    <div className="text-center text-gray-500 py-8">Loading students...</div>
                                ) : filtered.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <FiUser className="mx-auto mb-2" size={32} />
                                        No students found.
                                    </div>
                                ) : (
                                    filtered.map((student) => (
                                        <button
                                            key={student._id}
                                            disabled={sharing}
                                            onClick={() => handleShare(student)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-left"
                                        >
                                            {student.profilePicture ? (
                                                <img
                                                    src={assetUrl(student.profilePicture)}
                                                    alt={student.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {student.name[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                                            </div>
                                            <FiShare2 className="text-indigo-600 dark:text-indigo-400" />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [shareSubject, setShareSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState('all');
    const { user } = useAuth();
    const { t } = useLanguage();
    const socketRef = useRef(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io(socketUrl, {
            transports: ['websocket']
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-connected', {
                userId: user.id || user._id,
                role: user.role,
                name: user.name
            });
        });

        socketRef.current.on('new-subject', () => {
            fetchSubjects();
        });

        socketRef.current.on('new-shared-subject', (data) => {
            toast.success(`${data.sharerName} shared "${data.title}" with you`);
            fetchSubjects();
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    async function fetchSubjects() {
        try {
            const response = await api.get('/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenSubject = async (subject) => {
        setSelectedSubject(subject);

        if (subject.hasRead) return;

        try {
            await api.post(`/subjects/${subject._id}/read`);
            socketRef.current?.emit('subject-read', {
                teacherId: subject.teacher._id,
                subjectId: subject._id,
                readerName: user.name
            });
            setSubjects(prev => prev.map(s =>
                s._id === subject._id ? { ...s, hasRead: true, readCount: (s.readCount || 0) + 1 } : s
            ));
        } catch (error) {
            console.error('Error marking subject as read:', error);
        }
    };

    const handleDownload = async (subjectId) => {
        try {
            await api.post(`/subjects/${subjectId}/download`);
            toast.success('Download started');
        } catch (error) {
            console.error('Error recording download:', error);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = subject.title.toLowerCase().includes(searchTerm.toLowerCase()) || subject.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesField = selectedField === 'all' || subject.fieldCategory === selectedField;
        return matchesSearch && matchesField;
    });

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 dark:from-gray-800 dark:to-gray-900 text-white py-14 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Available Subjects')}</h1>
                    <p className="text-blue-100">{t('Choose a field below and explore subjects uploaded for your field')}</p>
                </motion.div>
            </section>

            {/* Field Selector with icons */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <input
                        type="text"
                        placeholder={t('Search subjects...')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </motion.div>

                <div className="space-y-8">
                    {fieldGroups.map((group, gi) => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: gi * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{group.icon}</span>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{group.label}</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{group.description}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                <button
                                    onClick={() => setSelectedField('all')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                        selectedField === 'all'
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="text-3xl">📚</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">All Fields</span>
                                </button>
                                {group.fields.map((field) => (
                                    <button
                                        key={field.value}
                                        onClick={() => setSelectedField(field.value)}
                                        title={field.description}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedField === field.value
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-105'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-3xl">{field.icon}</span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">{field.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Subjects Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-12">
                {filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredSubjects.map((subject, index) => (
                                <motion.div
                                    key={subject._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    onClick={() => handleOpenSubject(subject)}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
                                >
                                    <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">{getFieldIcon(subject.fieldCategory)}</span>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                                {subject.title}
                                            </h2>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                            {subject.description}
                                        </p>

                                        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <FiCalendar size={14} />
                                                {new Date(subject.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
                                                <FiLayers size={14} />
                                                {getFieldLabel(subject.fieldCategory)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1"><FiDownload size={14} /> {subject.downloadCount || 0}</span>
                                                <span className="flex items-center gap-1"><FiShare2 size={14} /> {subject.shareCount || 0}</span>
                                                {subject.hasRead && (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <FiCheckCircle size={14} /> Read
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {subject.teacher.profilePicture ? (
                                                <img
                                                    src={assetUrl(subject.teacher.profilePicture)}
                                                    alt={subject.teacher.name}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {subject.teacher.name[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">By</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                    {subject.teacher.name}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors">
                                                View
                                            </span>
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
                        className="text-center py-12"
                    >
                        <FiBook className="mx-auto text-gray-400 dark:text-gray-600" size={48} />
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
                            {searchTerm ? 'No subjects found matching your search.' : `No subjects available in ${getFieldLabel(selectedField)} yet.`}
                        </p>
                    </motion.div>
                )}
            </section>

            {/* Subject Modal */}
            <SubjectModal
                subject={selectedSubject}
                isOpen={!!selectedSubject}
                onClose={() => setSelectedSubject(null)}
                onDownload={handleDownload}
                onShare={(subject) => {
                    setSelectedSubject(null);
                    setShareSubject(subject);
                }}
            />

            {/* Share Modal */}
            <ShareModal
                subject={shareSubject}
                isOpen={!!shareSubject}
                onClose={() => setShareSubject(null)}
            />
        </div>
    );
};

export default Subjects;