import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, FileText, User, PlusCircle, 
  CheckCircle, Clock, AlertCircle, Search, Filter,
  LogOut, Mail, Building2, Calendar
} from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // Real Auth
import { complaintAPI } from "../services/api"; // Real API
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import ComplaintCard from "../components/complaints/ComplaintCard";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // State
    const [activeTab, setActiveTab] = useState("overview");
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Fetch Real Data
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data } = await complaintAPI.getAll();
                
                // Filter for current user (assuming backend returns all, or use a specific /my-complaints endpoint)
                // In a production app, the backend should handle this filtering for security.
                // Here we match based on user ID or Email stored in the complaint.
                const userComplaints = data.filter(c => 
                    c.studentId === user.id || 
                    c.user_id === user.id || 
                    c.email === user.email
                );
                
                setMyComplaints(userComplaints);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // 2. Calculate Stats
    const stats = useMemo(() => {
        return {
            total: myComplaints.length,
            resolved: myComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
            pending: myComplaints.filter(c => c.status === 'Submitted' || c.status === 'In Progress').length
        };
    }, [myComplaints]);

    // 3. Filter Logic
    const filteredList = useMemo(() => {
        return myComplaints.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [myComplaints, searchQuery, statusFilter]);

    // Tabs Configuration
    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "complaints", label: "My Complaints", icon: FileText },
        { id: "profile", label: "Profile", icon: User },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 relative">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 p-6 md:p-8 w-full">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Student Dashboard
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Welcome back, {user.name}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/submit-complaint')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <PlusCircle size={18} />
                            Submit Complaint
                        </button>
                    </div>

                    {/* Tab Navigation (Mobile Only - visible on small screens) */}
                    <div className="md:hidden mb-6 flex overflow-x-auto gap-2 pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                                    activeTab === tab.id 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-white text-gray-600 border border-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* CONTENT AREA */}
                    
                    {/* 1. OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Submitted</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <FileText size={24} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Pending Issues</p>
                                        <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</h3>
                                    </div>
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                        <Clock size={24} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Resolved</p>
                                        <h3 className="text-3xl font-bold text-emerald-600 mt-1">{stats.resolved}</h3>
                                    </div>
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <CheckCircle size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500">Loading records...</div>
                                ) : myComplaints.length === 0 ? (
                                    <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="text-gray-400" />
                                        </div>
                                        <h3 className="text-gray-900 font-medium">No complaints yet</h3>
                                        <p className="text-gray-500 text-sm mt-1">Submit your first complaint to track it here.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {myComplaints.slice(0, 3).map(complaint => (
                                            <ComplaintCard 
                                                key={complaint.id} 
                                                complaint={complaint} 
                                                onView={(id) => navigate(`/complaint/${id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. ALL COMPLAINTS TAB */}
                    {activeTab === 'complaints' && (
                        <div className="space-y-6">
                            {/* Search & Filter */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by title..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-500" />
                                    <select 
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-gray-50 border-none rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>

                            {/* List */}
                            <div className="grid gap-4">
                                {filteredList.length > 0 ? (
                                    filteredList.map(complaint => (
                                        <ComplaintCard 
                                            key={complaint.id} 
                                            complaint={complaint} 
                                            onView={(id) => navigate(`/complaint/${id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No complaints found matching your criteria.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
                            <div className="bg-gray-50 p-8 border-b border-gray-200 flex items-center gap-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                                        <div className="flex items-center gap-2 text-gray-800">
                                            <Mail size={16} className="text-gray-400" />
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                                        <div className="flex items-center gap-2 text-gray-800">
                                            <Building2 size={16} className="text-gray-400" />
                                            {user.department || 'General Student'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Since</label>
                                        <div className="flex items-center gap-2 text-gray-800">
                                            <Calendar size={16} className="text-gray-400" />
                                            {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account ID</label>
                                        <div className="flex items-center gap-2 text-gray-800 font-mono text-sm">
                                            #{user.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;