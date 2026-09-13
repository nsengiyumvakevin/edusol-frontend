import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import MySubjects from './pages/MySubjects';
import CreateSubject from './pages/CreateSubject';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Collaborators from './pages/Collaborators';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Assessments from './pages/Assessments';
import TeacherAssessments from './pages/TeacherAssessments';
import Mission from './pages/Mission';
import Vision from './pages/Vision';
import Training from './pages/Training';
import HelpCenter from './pages/HelpCenter';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner fullScreen />;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

function AppRoutes() {
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/collaborators" element={<Collaborators />} />
                    <Route path="/mission" element={<Mission />} />
                    <Route path="/vision" element={<Vision />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/help-center" element={<HelpCenter />} />

                    <Route 
                        path="/" 
                        element={
                            user ? (
                                user?.role === 'admin' ? (
                                    <Navigate to="/admin" />
                                ) : user?.role === 'teacher' ? (
                                    <Navigate to="/my-subjects" />
                                ) : (
                                    <Navigate to="/subjects" />
                                )
                            ) : (
                                <Navigate to="/home" />
                            )
                        } 
                    />
                    <Route 
                        path="/subjects" 
                        element={
                            <PrivateRoute allowedRoles={['student']}>
                                <Subjects />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/my-subjects" 
                        element={
                            <PrivateRoute allowedRoles={['teacher']}>
                                <MySubjects />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/create-subject" 
                        element={
                            <PrivateRoute allowedRoles={['teacher']}>
                                <CreateSubject />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/chat" 
                        element={
                            <PrivateRoute allowedRoles={['student', 'teacher']}>
                                <Chat />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/assessments" 
                        element={
                            <PrivateRoute allowedRoles={['student']}>
                                <Assessments />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/teacher-assessments" 
                        element={
                            <PrivateRoute allowedRoles={['teacher']}>
                                <TeacherAssessments />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/admin" 
                        element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminPanel />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/settings" 
                        element={
                            <PrivateRoute>
                                <Settings />
                            </PrivateRoute>
                        } 
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <SnackbarProvider>
                            <Toaster position="top-right" />
                            <AppRoutes />
                        </SnackbarProvider>
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;