import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiUser, FiMail, FiType } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
    const { user, uploadProfilePicture, updateProfile } = useAuth();
    const { showSnackbar } = useSnackbar();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [prevUser, setPrevUser] = useState(user);

    if (user !== prevUser) {
        setPrevUser(user);
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
    }

    const stats = [
        { label: 'Account Role', value: user?.role?.toUpperCase() || 'USER', icon: '👤' },
        { label: 'Member Since', value: 'March 2026', icon: '📅' },
        { label: 'Profile Completion', value: user?.profilePicture ? '100%' : '75%', icon: '✅' }
    ];

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showSnackbar(t('Image size must be less than 5MB'), 'error');
                return;
            }
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoUpload = async () => {
        if (!profilePhoto) return;
        setLoading(true);

        const result = await uploadProfilePicture(profilePhoto);

        setLoading(false);
        if (result.success) {
            setProfilePhoto(null);
            setPreviewUrl(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        setLoading(false);
        if (result.success) {
            showSnackbar(t('Profile updated successfully!'), 'success');
            setIsEditing(false);
        } else {
            showSnackbar(result.error || t('Failed to update profile'), 'error');
        }
    };

    if (!user) {
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
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-2">{t('My Profile')}</h1>
                    <p className="text-blue-100">{t('Manage your account information and preferences')}</p>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Profile Photo Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center"
                        >
                            <div className="relative inline-block mb-6">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                                    />
                                ) : user.profilePicture ? (
                                    <img
                                        src={`http://localhost:5000${user.profilePicture}`}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-blue-600">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
                                    <FiCamera size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {profilePhoto && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handlePhotoUpload}
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {loading ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProfilePhoto(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="mt-8 space-y-4">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-gray-700 p-4 rounded-lg"
                                    >
                                        <div className="text-2xl mb-1">{stat.icon}</div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Profile Information Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Account Information
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FiUser className="inline mr-2" size={16} />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FiMail className="inline mr-2" size={16} />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed opacity-50"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FiType className="inline mr-2" size={16} />
                                            Account Role
                                        </label>
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed opacity-50"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Role cannot be changed
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Full Name</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formData.name}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Email Address</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formData.email}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 dark:text-gray-300">Account Role</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Profile;
