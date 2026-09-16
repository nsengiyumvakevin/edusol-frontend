/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (firstName, lastName, email, password, role, nationality, fieldInterest) => {
        try {
            const response = await api.post('/auth/register', {
                firstName,
                lastName,
                email,
                password,
                role,
                nationality,
                fieldInterest
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    const uploadProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        try {
            const response = await api.post('/users/profile-picture', formData);
            
            const updatedUser = { ...user, profilePicture: response.data.profilePicture };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast.success('Profile picture updated!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload profile picture');
            return { success: false };
        }
    };

    const updateProfile = async (updates) => {
        try {
            const userId = user?.id || user?._id;
            if (!userId) {
                toast.error('User ID not found. Please log in again.');
                return { success: false, error: 'User ID not found. Please log in again.' };
            }

            const response = await api.put(`/users/${userId}`, updates);

            const updated = response.data.user || {};
            const normalizedUser = {
                id: updated._id || updated.id || userId,
                firstName: updated.firstName ?? user?.firstName ?? '',
                lastName: updated.lastName ?? user?.lastName ?? '',
                name: updated.name ?? user?.name,
                email: updated.email ?? user?.email,
                role: updated.role ?? user?.role,
                profilePicture: updated.profilePicture ?? user?.profilePicture ?? '',
                nationality: updated.nationality ?? user?.nationality ?? '',
                fieldInterest: updated.fieldInterest ?? user?.fieldInterest ?? '',
                settings: updated.settings ?? user?.settings ?? {}
            };

            localStorage.setItem('user', JSON.stringify(normalizedUser));
            setUser(normalizedUser);
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading: false,
        login,
        register,
        logout,
        uploadProfilePicture,
        updateProfile,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};