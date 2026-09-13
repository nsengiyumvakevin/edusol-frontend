import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiBook, FiFileText, FiUploadCloud, FiArrowLeft, FiCheckCircle, FiLayers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fieldGroups } from '../data/fieldOptions';
import { useLanguage } from '../context/LanguageContext';

const CreateSubject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [usePdf, setUsePdf] = useState(false);
    const [fieldCategory, setFieldCategory] = useState('ict-multimedia');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io('http://localhost:5000', {
            transports: ['websocket']
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-connected', {
                userId: user.id || user._id,
                role: user.role,
                name: user.name
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            let response;

            if (usePdf) {
                if (!pdfFile) {
                    toast.error(t('Please select a PDF file to upload'));
                    setLoading(false);
                    return;
                }
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description || 'PDF-based subject uploaded by teacher.');
                formData.append('fieldCategory', fieldCategory);
                formData.append('pdfFile', pdfFile);

                response = await axios.post('http://localhost:5000/api/subjects', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                response = await axios.post('http://localhost:5000/api/subjects', {
                    title,
                    description,
                    fieldCategory
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            if (response?.status === 201) {
                const newSubject = response.data;
                socketRef.current?.emit('send-subject', {
                    teacherId: user.id || user._id,
                    teacherName: user.name,
                    subjectId: newSubject._id,
                    title: newSubject.title
                });
                toast.success(t('Subject created successfully!'));
                navigate('/my-subjects');
            } else {
                throw new Error('Failed to create subject');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t('Failed to create subject'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-800 dark:to-gray-900 text-white py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <button
                        onClick={() => navigate('/my-subjects')}
                        className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4"
                    >
                        <FiArrowLeft /> {t('Back to My Subjects')}
                    </button>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <FiBook size={36} /> {t('Create New Subject')}
                    </h1>
                    <p className="text-blue-100">{t('Upload your subject content and choose the field/sector it belongs to')}</p>
                </motion.div>
            </section>

            <section className="max-w-3xl mx-auto px-4 py-10">
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-8"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-gray-900 dark:text-white text-sm font-bold mb-2">
                            {t('Subject Title')}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('e.g. Introduction to Web Development')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>

                    {/* Field / Sector Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FiLayers className="text-blue-600 dark:text-blue-400" size={20} />
                            <label className="block text-gray-900 dark:text-white text-sm font-bold">
                                {t('Field / Sector')}
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {t('Students will read subjects according to the field you select.')}
                        </p>

                        <div className="space-y-6">
                            {fieldGroups.map((group) => (
                                <div key={group.id}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{group.icon}</span>
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{group.label}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {group.fields.map((field) => (
                                            <button
                                                type="button"
                                                key={field.value}
                                                onClick={() => setFieldCategory(field.value)}
                                                title={field.description}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                                    fieldCategory === field.value
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-105'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <span className="text-3xl">{field.icon}</span>
                                                <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{field.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description / PDF toggle */}
                    <div className="flex items-center justify-between gap-4">
                        <label className="block text-gray-900 dark:text-white text-sm font-bold">
                            {t('Subject Content')}
                        </label>
                        <button
                            type="button"
                            onClick={() => setUsePdf(prev => !prev)}
                            className={`text-sm px-4 py-2 rounded-lg font-semibold transition-colors ${
                                usePdf
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            }`}
                        >
                            {usePdf ? t('Use text description') : t('Upload PDF instead')}
                        </button>
                    </div>

                    {!usePdf ? (
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="6"
                                placeholder={t('Write the subject description/content here...')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${
                                pdfFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}>
                                <FiUploadCloud size={40} className={pdfFile ? 'text-green-600' : 'text-gray-400'} />
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {pdfFile ? pdfFile.name : t('Click to choose a PDF file')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('PDF files up to 20MB')}</p>
                                </div>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setPdfFile(e.target.files[0] || null)}
                                    className="hidden"
                                    required
                                />
                            </label>
                            {pdfFile && (
                                <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <FiCheckCircle /> {pdfFile.name} {t('ready to upload')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {t('Creating...')}
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle size={18} />
                                    {t('Create Subject')}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/my-subjects')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            {t('Cancel')}
                        </button>
                    </div>
                </motion.form>
            </section>
        </div>
    );
};

export default CreateSubject;
