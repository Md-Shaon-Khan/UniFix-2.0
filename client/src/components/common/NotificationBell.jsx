import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api"; // Real API instance
import { Bell, Check, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // 1. Fetch Real Notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Assuming GET /notifications returns array of { id, message, isRead, createdAt, link }
            const response = await api.get('/notifications');
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
            // Fallback for demo if API isn't ready yet
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        fetchNotifications();
        
        // Optional: Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 2. Mark as Read Handler
    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            
            // Optimistic Update
            const updated = notifications.map(n => 
                n.id === id ? { ...n, isRead: true } : n
            );
            setNotifications(updated);
            setUnreadCount(updated.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            const updated = notifications.map(n => ({ ...n, isRead: true }));
            setNotifications(updated);
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all read");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                <p className="text-xs">Loading updates...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">No notifications</p>
                                <p className="text-xs mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Status Dot */}
                                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-gray-400 mt-1 block">
                                                    {new Date(notification.createdAt || Date.now()).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Mark Read Action */}
                                            {!notification.isRead && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity p-1"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-50 bg-gray-50 text-center">
                        <Link 
                            to="/notifications" 
                            className="text-xs text-gray-500 hover:text-blue-600 font-medium block py-1"
                            onClick={() => setIsOpen(false)}
                        >
                            View All History
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;