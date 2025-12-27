import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Check, Clock, Trash2, Filter, 
  CheckCircle, AlertCircle, Info, Loader2 
} from "lucide-react";
import api from "../services/api"; // Real API

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all' or 'unread'

    // 1. Fetch Notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // 2. Actions
    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error("Failed to update notification");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all read");
        }
    };

    const handleDelete = async (id) => {
        try {
            // Assuming DELETE endpoint exists
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification");
        }
    };

    // 3. Filter Logic
    const filteredNotifications = notifications.filter(n => 
        filter === 'all' ? true : !n.isRead
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Helper: Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 lg:ml-64">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-blue-600" />
                            Notifications
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            You have <span className="font-bold text-blue-600">{unreadCount}</span> unread messages
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleMarkAllRead}
                            disabled={unreadCount === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark all read
                        </button>
                        <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Unread
                            </button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-gray-500">Loading updates...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="text-gray-500">You're all caught up!</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`relative p-5 rounded-2xl border transition-all ${
                                        notification.isRead 
                                        ? "bg-white border-gray-100" 
                                        : "bg-blue-50/50 border-blue-100 shadow-sm"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {notification.type === 'alert' ? <AlertCircle size={20} /> : <Info size={20} />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                                                    {notification.message}
                                                </p>
                                                
                                                {/* Action Menu */}
                                                <div className="flex items-center gap-2 ml-4">
                                                    {!notification.isRead && (
                                                        <button 
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(notification.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>{formatDate(notification.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Unread Indicator Dot */}
                                    {!notification.isRead && (
                                        <div className="absolute top-6 left-6 w-2 h-2 bg-blue-600 rounded-full border border-white"></div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;