import React, { useEffect, useRef, useState } from 'react';
import { api, assetUrl, socketUrl } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiUpload, FiCheckCircle, FiFileText, FiAward, FiX, FiSend } from 'react-icons/fi';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getFieldLabel, getFieldIcon } from '../data/fieldOptions';
import { useLanguage } from '../context/LanguageContext';

const Assessments = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [readMap, setReadMap] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('readAssessments') || '{}');
        } catch {
            return {};
        }
    });
    const [submissionContent, setSubmissionContent] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchAssessments();
    }, []);

    useEffect(() => {
        if (!user) return;
        socketRef.current = io(socketUrl, { transports: ['websocket'] });
        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-connected', { userId: user.id || user._id, role: user.role, name: user.name });
        });
        socketRef.current.on('new-assessment', (data) => {
            toast.success(`${data.teacherName} posted a new assessment: ${data.title}`);
            fetchAssessments();
        });
        socketRef.current.on('assessment-marked', (data) => {
            toast.success(`Your assessment "${data.title}" was marked: ${data.marks}/100`);
            fetchAssessments();
        });
        return () => socketRef.current?.disconnect();
    }, [user]);

    const fetchAssessments = async () => {
        try {
            const response = await api.get('/assessments');
            setAssessments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (assessmentId) => {
        if (!submissionContent.trim()) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content', submissionContent);
            if (submissionFile) formData.append('submissionFile', submissionFile);
            await api.post(`/assessments/${assessmentId}/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const assessment = assessments.find(a => a._id === assessmentId);
            socketRef.current?.emit('assessment-submitted', {
                teacherId: assessment?.teacher?._id,
                assessmentId,
                title: assessment?.title || 'Assessment',
                studentName: user.name
            });
            toast.success('Worked assessment submitted to your teacher!');
            setSubmissionContent('');
            setSubmissionFile(null);
            setSelectedAssessment(null);
            fetchAssessments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600 dark:text-gray-300">{t('Loading assessments...')}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('Assessments')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{t('Submit your worked assessment to the teacher and see your marks and feedback.')}</p>
                </div>

                {assessments.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <FiBookOpen className="mx-auto text-gray-400 dark:text-gray-600" size={48} />
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{t('No assessments posted yet.')}</p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {assessments.map((assessment) => {
                        const existingSubmission = assessment.submissions?.find(
                            (submission) => submission.student?.toString() === user?.id || submission.student?.toString() === user?._id
                        );
                        const marked = existingSubmission?.marks !== null && existingSubmission?.marks !== undefined;
                        return (
                            <motion.div key={assessment._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getFieldIcon(assessment.fieldCategory)}</span>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{assessment.title}</h2>
                                        </div>
                                        <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-200">{getFieldLabel(assessment.fieldCategory)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{assessment.description}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-4">{assessment.instructions}</p>

                                    {existingSubmission && (
                                        <div className={`rounded-xl p-3 mb-4 ${marked ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {marked ? (
                                                        <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                            <FiAward size={16} /> Marks: {existingSubmission.marks}/100
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                            <FiCheckCircle size={16} /> Submitted — pending review
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(existingSubmission.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {marked && existingSubmission.feedback && (
                                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold">Teacher feedback:</span> {existingSubmission.feedback}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {assessment.guideFileUrl && (
                                        <>
                                            {user?.role === 'student' && !readMap[assessment._id] ? (
                                                <button onClick={async () => {
                                                    try {
                                                        await api.post(`/assessments/${assessment._id}/read`);
                                                        const next = { ...readMap, [assessment._id]: true };
                                                        setReadMap(next);
                                                        localStorage.setItem('readAssessments', JSON.stringify(next));
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }} className="text-sm text-yellow-600 dark:text-yellow-300 underline">I have read this assessment</button>
                                            ) : (
                                                <a href={assetUrl(assessment.guideFileUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4"><FiFileText /> View marking guide</a>
                                            )}
                                        </>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>By {assessment.teacher?.name}</span>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <button onClick={() => setSelectedAssessment(assessment)} className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                            <FiUpload size={16} />
                                            {existingSubmission ? 'Update submission' : 'Submit worked assessment'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedAssessment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Submit work for {selectedAssessment.title}</h3>
                                <button onClick={() => setSelectedAssessment(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><FiX size={24} /></button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{selectedAssessment.instructions}</p>
                            <textarea value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)} rows="8" className="mt-4 w-full rounded-xl border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Type your worked assessment here..." />
                            <input type="file" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} className="mt-4 w-full text-sm" />
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setSelectedAssessment(null)} className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-600 dark:text-white">Cancel</button>
                                <button onClick={() => handleSubmit(selectedAssessment._id)} disabled={submitting || !submissionContent.trim()} className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white disabled:opacity-50 flex items-center gap-2">
                                    <FiSend size={16} /> {submitting ? 'Submitting...' : 'Submit to teacher'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Assessments;
