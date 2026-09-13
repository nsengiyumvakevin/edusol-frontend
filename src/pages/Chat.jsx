import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const { user } = useAuth();
    const { t } = useLanguage();
    const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedUserRef = useRef(null);
    const userRef = useRef(user);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        userRef.current = user;
    }, [user, t]);

    // Initialize socket connection
    useEffect(() => {
        if (!user) return;
        
        socket.current = io('http://localhost:5000', {
            transports: ['websocket']
        });
        
        socket.current.on('connect', () => {
            console.log('Socket connected');
            socket.current.emit('user-connected', {
                userId: user.id || user._id,
                role: user.role,
                name: user.name
            });
        });
        
        socket.current.on('online-users', (users) => {
            setOnlineUsers(Array.isArray(users) ? users : []);
        });
        
        socket.current.on('new-message', (message) => {
            const currentUser = selectedUserRef.current;
            if (currentUser && (message.sender._id === currentUser._id || message.receiver._id === currentUser._id)) {
                setMessages(prev => [...prev, message]);
            }
        });
        
        socket.current.on('message-sent', (message) => {
            const currentUser = selectedUserRef.current;
            if (currentUser && (message.receiver._id === currentUser._id)) {
                setMessages(prev => [...prev, message]);
            }
        });
        
        socket.current.on('user-typing', (data) => {
            const currentUser = selectedUserRef.current;
            if (data.isTyping && currentUser && currentUser.name === data.senderName) {
                setTypingUser(data.senderName);
                setTimeout(() => setTypingUser(null), 2000);
            } else {
                setTypingUser(null);
            }
        });
        
        socket.current.on('message-error', (error) => {
            toast.error(error.error);
        });
        
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [user, t]);

    // Fetch users based on role
    useEffect(() => {
        if (!user) return;

        let active = true;
        async function loadUsers() {
            try {
                setLoading(true);
                let endpoint;
                if (user?.role === 'teacher') {
                    endpoint = 'http://localhost:5000/api/messages/students';
                } else if (user?.role === 'student') {
                    endpoint = 'http://localhost:5000/api/messages/teachers';
                } else {
                    return;
                }

                const response = await axios.get(endpoint);
                let usersData = response.data;
                if (usersData.data) {
                    usersData = usersData.data;
                }

                if (active) {
                    setUsers(usersData);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error(error.response?.data?.message || t('Failed to load users'));
                if (active) {
                    setUsers([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadUsers();
        return () => {
            active = false;
        };
    }, [user, t]);

    // Fetch messages when user is selected
    useEffect(() => {
        if (!selectedUser || !selectedUser._id) return;

        let active = true;
        async function loadMessages() {
            try {
                setMessagesLoading(true);
                const url = `http://localhost:5000/api/messages/conversation/${selectedUser._id}`;
                const response = await axios.get(url);
                let messagesData = response.data;
                if (messagesData.data) {
                    messagesData = messagesData.data;
                }

                if (active) {
                    setMessages(messagesData);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error(error.response?.data?.message || t('Failed to load messages'));
                if (active) {
                    setMessages([]);
                }
            } finally {
                if (active) {
                    setMessagesLoading(false);
                }
            }
        }

        async function markConversationRead(otherUserId) {
            try {
                await axios.put(`http://localhost:5000/api/messages/conversation/${otherUserId}/read`);
                const currentUser = userRef.current;
                socket.current?.emit('conversation-read', {
                    otherUserId,
                    readerName: currentUser.name,
                    readerId: currentUser.id || currentUser._id
                });
            } catch (error) {
                console.error('Error marking conversation as read:', error);
            }
        }

        loadMessages();
        markConversationRead(selectedUser._id);
        return () => {
            active = false;
        };
    }, [selectedUser, t]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            senderId: user.id,
            receiverId: selectedUser._id,
            message: newMessage,
            senderName: user.name,
            senderPicture: user.profilePicture
        };

        console.log('Sending message:', messageData);
        socket.current.emit('send-message', messageData);
        setNewMessage('');
        
        // Clear typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        socket.current.emit('typing', {
            receiverId: selectedUser._id,
            isTyping: false,
            senderName: user.name
        });
    };

    const handleTyping = () => {
        if (!selectedUser) return;
        
        if (!isTyping) {
            setIsTyping(true);
            socket.current.emit('typing', {
                receiverId: selectedUser._id,
                isTyping: true,
                senderName: user.name
            });
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.current.emit('typing', {
                receiverId: selectedUser._id,
                isTyping: false,
                senderName: user.name
            });
        }, 1000);
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(u => u.id === userId);
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">{t('Please login to access chat')}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t('Chat')}</h1>
            <div className="flex h-[640px] bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Users List */}
                <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                            {user.role === 'teacher' ? t('Students') : t('Teachers')}
                            <span className="text-sm text-gray-500 ml-2">
                                ({users.length} {t('total')})
                            </span>
                        </h2>
                    </div>
                    {loading ? (
                        <div className="p-4 text-center">{t('Loading users...')}</div>
                    ) : users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {t('No')} {user.role === 'teacher' ? t('students') : t('teachers')} {t('found')}
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => {
                                    console.log('Selected user:', u);
                                    setSelectedUser(u);
                                }}
                                className={`p-4 cursor-pointer hover:bg-gray-50 transition border-b ${
                                    selectedUser?._id === u._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center flex-1">
                                        {u.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000${u.profilePicture}`}
                                                alt={u.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                                                {u.name[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-semibold">{u.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-2 h-2 rounded-full ${isUserOnline(u._id) ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <span className="text-xs text-gray-500 mt-1">
                                            {isUserOnline(u._id) ? t('Online') : t('Offline')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {selectedUser.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000${selectedUser.profilePicture}`}
                                                alt={selectedUser.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                                                {selectedUser.name[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold">{selectedUser.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{selectedUser.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${isUserOnline(selectedUser._id) ? 'bg-green-500' : 'bg-gray-400'} mr-2`} />
                                        <span className="text-sm text-gray-600">
                                            {isUserOnline(selectedUser._id) ? t('Online') : t('Offline')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-500">{t('Loading messages...')}</div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <p>{t('No messages yet.')}</p>
                                            <p className="text-sm">{t('Start a conversation!')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${
                                                    msg.sender._id === user.id ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${
                                                        msg.sender._id === user.id
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-800 shadow'
                                                    }`}
                                                >
                                                    <p className="text-sm break-words">{msg.message}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        msg.sender._id === user.id ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {typingUser && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 rounded-lg p-2">
                                            <p className="text-sm text-gray-600">{typingUser} {t('is typing...')}</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input - FIXED: Always enabled */}
                            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyUp={handleTyping}
                                        placeholder={`Message ${selectedUser.name}...`}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        // REMOVED: disabled={!isUserOnline(selectedUser._id)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className={`px-6 py-2 rounded-lg transition ${
                                            newMessage.trim()
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Send
                                    </button>
                                </div>
                                {!isUserOnline(selectedUser._id) && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        {selectedUser.name} is offline. They will receive your message when they come online.
                                    </p>
                                )}
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p>Select a {user.role === 'teacher' ? 'student' : 'teacher'} to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;