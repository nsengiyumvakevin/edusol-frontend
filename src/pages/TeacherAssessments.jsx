import React, { useEffect, useRef, useState } from 'react';
import { api, assetUrl, socketUrl } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiFileText, FiCheckCircle, FiAward, FiX, FiSend, FiUsers, FiTool, FiLayers } from 'react-icons/fi';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fieldGroups, getFieldLabel, getFieldIcon } from '../data/fieldOptions';

const TeacherAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [fieldCategory, setFieldCategory] = useState('general');
    const [guideText, setGuideText] = useState('');
    const [guideFile, setGuideFile] = useState(null);
    const [assessmentFile, setAssessmentFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [mark, setMark] = useState('');
    const [feedback, setFeedback] = useState('');
    const { user } = useAuth();
    const { t } = useLanguage();
    const socketRef = useRef(null);

    useEffect(() => {
        fetchAssessments();
    }, []);

    useEffect(() => {
        if (!user) return;
        socketRef.current = io(socketUrl, { transports: ['websocket'] });
        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-connected', {
                userId: user.id || user._id,
                role: user.role,
                name: user.name,
                fieldInterest: user.fieldInterest
            });
        });
        socketRef.current.on('new-submission', (data) => {
            toast.success(`${data.studentName} submitted "${data.title}"`);
            fetchAssessments();
        });
        return () => socketRef.current?.disconnect();
    }, [user]);

    const fetchAssessments = async () => {
        try {
            const response = await api.get('/assessments/my-assessments');
            setAssessments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateMarkingGuide = () => {
        const guide = [
            `Marking Guide: ${title || 'Untitled Assessment'}`,
            '',
            'Instructions for marking:',
            '1. Award marks based on the completeness and accuracy of each answer.',
            '2. Use partial credit for partially correct responses.',
            '3. Deduct marks for irrelevant or off-topic content.',
            '4. Add individual feedback to help students improve.',
            '',
            'Suggested breakdown (out of 100):',
            '- Understanding of the topic: 30 marks',
            '- Completeness of the work: 30 marks',
            '- Accuracy and correctness: 25 marks',
            '- Presentation and clarity: 15 marks',
            '',
            'Generated automatically by EduSol.'
        ].join('\n');
        setGuideText(guide);
        toast.success('Draft marking guide generated. You can edit it before saving.');
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('instructions', instructions);
            formData.append('fieldCategory', fieldCategory);
            if (guideText) formData.append('markingGuide', guideText);
            if (guideFile) formData.append('guideFile', guideFile);
            if (assessmentFile) formData.append('assessmentFile', assessmentFile);
            if (!assessmentFile) {
                toast.error('Please upload the assessment PDF');
                return;
            }
            const response = await api.post('/assessments', formData);
            const createdAssessment = response.data;
            if (response?.status === 201) {
                setAssessments((currentAssessments) => [createdAssessment, ...currentAssessments]);
                socketRef.current?.emit('send-assessment', {
                    teacherId: user.id || user._id,
                    teacherName: user.name,
                    assessmentId: createdAssessment._id,
                    title: createdAssessment.title,
                    fieldCategory: createdAssessment.fieldCategory
                });
            }
            setShowModal(false);
            setTitle('');
            setDescription('');
            setInstructions('');
            setFieldCategory('general');
            setGuideText('');
            setGuideFile(null);
            setAssessmentFile(null);
            toast.success('Assessment created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create assessment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMark = async (assessmentId, submissionId, studentId) => {
        if (mark === '') {
            toast.error('Please enter marks');
            return;
        }
        try {
            await api.put(`/assessments/${assessmentId}/submissions/${submissionId}/mark`, {
                marks: Number(mark),
                feedback
            });
            const assessment = assessments.find(a => a._id === assessmentId);
            socketRef.current?.emit('assessment-marked', {
                studentId,
                assessmentId,
                title: assessment?.title || 'Assessment',
                marks: Number(mark),
                teacherName: user.name
            });
            toast.success('Marks saved and published to the student');
            setSelectedAssessment(null);
            setMark('');
            setFeedback('');
            fetchAssessments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save marks');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600 dark:text-gray-300">{t('Loading teacher assessments...')}</div>;
    }

    return (
        <div className="min-h-screen top-30 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('Assessment Studio')}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{t('Create assessments, review submissions, and publish marking guides.')}</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-3 text-white font-semibold transition-all duration-200 transform hover:scale-105">
                        <FiPlus /> Create assessment
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {assessments.map((assessment) => {
                        const unmarked = assessment.submissions?.filter(s => s.marks === null || s.marks === undefined)?.length || 0;
                        return (
                            <motion.div key={assessment._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getFieldIcon(assessment.fieldCategory)}</span>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{assessment.title}</h2>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-200">{getFieldLabel(assessment.fieldCategory)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{assessment.description}</p>
                                    {assessment.assessmentFileUrl && (
                                        <a
                                            href={assetUrl(assessment.assessmentFileUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"
                                        >
                                            <FiFileText /> View assessment PDF
                                        </a>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FiUsers size={16} />
                                            {assessment.submissions?.length || 0} submission(s)
                                        </span>
                                        {unmarked > 0 && (
                                            <span className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                                <FiAward size={16} />
                                                {unmarked} awaiting marks
                                            </span>
                                        )}
                                        {assessment.markingGuide && (
                                            <span className="flex items-center gap-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-blue-700 dark:text-blue-200">
                                                <FiFileText size={12} /> Marking guide attached
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {assessment.submissions?.length ? assessment.submissions.map((submission) => (
                                            <div key={submission._id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <FiUsers size={14} className="text-blue-600 dark:text-blue-400" />
                                                        {submission.student?.name || 'Student submission'}
                                                    </span>
                                                    {submission.marks !== null && submission.marks !== undefined ? (
                                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                                                            <FiCheckCircle size={14} /> {submission.marks}/100
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-600 text-sm">Awaiting marks</span>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{submission.content}</p>
                                                {submission.fileUrl && <a href={assetUrl(submission.fileUrl)} target="_blank" rel="noreferrer" download className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600"><FiFileText /> View/download answered file</a>}
                                                <button
                                                    onClick={() => setSelectedAssessment({ assessmentId: assessment._id, submissionId: submission._id, student: submission.student })}
                                                    className="mt-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white font-semibold"
                                                >
                                                    Mark submission
                                                </button>
                                            </div>
                                        )) : <p className="text-sm text-gray-500 dark:text-gray-400">No submissions yet.</p>}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Create modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="my-6 flex max-h-[calc(100vh-3rem)] w-full max-w-md flex-col rounded-2xl bg-white p-4 shadow-2xl dark:bg-gray-800 sm:max-w-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Assessment Studio</p>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create assessment</h3>
                                </div>
                                <button onClick={() => setShowModal(false)} className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700"><FiX size={18} /></button>
                            </div>

                            <form onSubmit={handleCreate} className="min-h-0 space-y-3 overflow-y-auto pr-1">
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">Assessment title</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none" placeholder="Assessment title" required />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">Short description</label>
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none" placeholder="Short description" rows="2" required />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">Instructions for students</label>
                                        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows="3" className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none" placeholder="Instructions for students" required />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
                                    <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                                        <FiLayers size={14} className="text-blue-600" /> Field / Sector
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFieldCategory('general')}
                                        className={`mb-2 flex w-full items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors ${
                                            fieldCategory === 'general'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                                : 'border-gray-200 text-gray-700 hover:border-blue-400 dark:border-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <span>🌍</span>
                                        <span className="font-semibold">All students</span>
                                    </button>
                                    <div className="grid grid-cols-1 gap-2">
                                        {fieldGroups.map((group) => (
                                            <div key={group.id}>
                                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{group.icon} {group.label}</p>
                                                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                                    {group.fields.map((field) => (
                                                        <button
                                                            type="button"
                                                            key={field.value}
                                                            onClick={() => setFieldCategory(field.value)}
                                                            className={`flex items-center gap-2 rounded-lg border p-1.5 text-left text-xs transition-colors ${
                                                                fieldCategory === field.value
                                                                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                                                    : 'border-gray-200 text-gray-700 hover:border-blue-400 dark:border-gray-600 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            <span>{field.icon}</span>
                                                            <span className="font-semibold">{field.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                                                <FiFileText size={14} className="text-indigo-600" /> Assessment PDF
                                            </label>
                                        </div>
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-white p-3 text-center dark:border-indigo-700 dark:bg-slate-800">
                                            <FiFileText size={22} className="mb-2 text-indigo-600" />
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                                {assessmentFile ? assessmentFile.name : 'Upload assessment PDF'}
                                            </span>
                                            <span className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">PDF up to 20MB</span>
                                            <input type="file" accept="application/pdf" required onChange={(e) => setAssessmentFile(e.target.files?.[0] || null)} className="hidden" />
                                        </label>
                                        {assessmentFile && <p className="mt-2 text-[10px] font-medium text-green-600 dark:text-green-400">✓ {assessmentFile.name} selected</p>}
                                    </div>

                                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <FiFileText size={14} className="text-indigo-600" /> Marking guide
                                            </label>
                                            <button
                                                type="button"
                                                onClick={generateMarkingGuide}
                                                className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <FiTool size={12} /> Generate
                                            </button>
                                        </div>
                                        <textarea
                                            value={guideText}
                                            onChange={(e) => setGuideText(e.target.value)}
                                            rows="3"
                                            placeholder="Paste or generate your marking guide here..."
                                            className="w-full rounded-lg border border-indigo-200 bg-white p-2 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[10px] text-gray-600 dark:text-gray-300">
                                            <FiFileText size={12} />
                                            Upload guide PDF
                                            <input type="file" accept="application/pdf" onChange={(e) => setGuideFile(e.target.files?.[0] || null)} className="hidden" />
                                            {guideFile && <span className="font-semibold text-green-600 dark:text-green-400">✓ {guideFile.name}</span>}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                                    <button type="button" onClick={() => setShowModal(false)} className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Cancel</button>
                                    <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60">
                                        <FiSend size={14} /> {submitting ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mark modal */}
            <AnimatePresence>
                {selectedAssessment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-xl rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Mark submission</h3>
                                <button onClick={() => setSelectedAssessment(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><FiX size={24} /></button>
                            </div>
                            <input value={mark} onChange={(e) => setMark(e.target.value)} type="number" min="0" max="100" className="mt-2 w-full rounded-xl border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Marks out of 100" />
                            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows="5" className="mt-4 w-full rounded-xl border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="Feedback for the student" />
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setSelectedAssessment(null)} className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-600 dark:text-white">Cancel</button>
                                <button onClick={() => handleMark(selectedAssessment.assessmentId, selectedAssessment.submissionId, selectedAssessment.student)} className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-white font-semibold flex items-center gap-2">
                                    <FiCheckCircle size={16} /> Publish marks
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherAssessments;
