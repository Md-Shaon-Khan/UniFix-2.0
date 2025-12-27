import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Real User Data
import { complaintAPI } from '../services/api'; // Real Stats
import { 
  User, Mail, Building2, MapPin, Calendar, 
  LogOut, Edit2, Shield, Award, FileText, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, logout } = useAuth();
    const [myStats, setMyStats] = useState({ total: 0, resolved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    // 1. Calculate Real Stats based on User's History
    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user) return;
            try {
                // Fetch all complaints and filter by current user
                // (In a larger app, you'd have a specific /users/me/stats endpoint)
                const { data } = await complaintAPI.getAll();
                const myComplaints = data.filter(c => c.user_id === user.id || c.studentId === user.id); // Adjust matching logic based on DB

                const resolved = myComplaints.filter(c => c.status === 'Resolved').length;
                const pending = myComplaints.filter(c => c.status !== 'Resolved').length;

                setMyStats({
                    total: myComplaints.length,
                    resolved,
                    pending
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8 lg:ml-64">
            <div className="max-w-4xl mx-auto">
                
                {/* Profile Header Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
                >
                    {/* Cover Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border border-blue-200">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <span className="capitalize">{user.role}</span>
                                <span>•</span>
                                <span className="text-blue-600">{user.department || 'General'}</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Personal Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Mail size={18} />
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-400 text-xs">Email</div>
                                        {user.email}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Building2 size={18} />
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-400 text-xs">Department</div>
                                        {user.department || 'Not Assigned'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Shield size={18} />
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-400 text-xs">Role</div>
                                        <span className="capitalize bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-400 text-xs">Joined</div>
                                        {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={logout}
                            className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>

                    {/* Right Column: Stats & Badges */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {loading ? "-" : myStats.total}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Complaints</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="text-3xl font-bold text-emerald-600 mb-1">
                                    {loading ? "-" : myStats.resolved}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Resolved</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="text-3xl font-bold text-amber-500 mb-1">
                                    {loading ? "-" : myStats.pending}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pending</div>
                            </div>
                        </div>

                        {/* Recent Activity / Badges Placeholder */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="text-purple-600" size={20} />
                                Impact Score
                            </h3>
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-purple-900 font-medium">Community Contribution</span>
                                    <span className="text-purple-700 font-bold">Top 10%</span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-2.5">
                                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-xs text-purple-600 mt-2">
                                    Your complaints have helped resolve 5 critical campus issues this semester.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Account Settings</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex justify-between items-center group">
                                    Change Password
                                    <span className="text-gray-400 group-hover:text-gray-600">→</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex justify-between items-center group">
                                    Notification Preferences
                                    <span className="text-gray-400 group-hover:text-gray-600">→</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex justify-between items-center group">
                                    Privacy Settings
                                    <span className="text-gray-400 group-hover:text-gray-600">→</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;