import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, Filter, Search, AlertTriangle, Clock, 
  CheckCircle, Users, TrendingUp, Download, Shield,
  FileText, Activity, Target, DownloadCloud,
  ChevronRight, RefreshCw, BarChart, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { complaintAPI } from "../services/api"; // Real API
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import ComplaintTable from "../components/authority/ComplaintTable";
import EscalationBadge from "../components/authority/EscalationBadge";

const AuthorityDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState("week");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Fetch Real Data
    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            const { data } = await complaintAPI.getAll();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // 2. Filter Logic (Memoized)
    const filteredComplaints = useMemo(() => {
        let data = [...complaints];

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(c => 
                c.title?.toLowerCase().includes(lowerQuery) || 
                c.description?.toLowerCase().includes(lowerQuery) ||
                c.id.toString().includes(lowerQuery)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            data = data.filter(c => c.status === statusFilter);
        }

        // Time Filter (Simple implementation)
        const now = new Date();
        if (timeFilter === 'today') {
            data = data.filter(c => new Date(c.created_at).toDateString() === now.toDateString());
        } else if (timeFilter === 'week') {
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            data = data.filter(c => new Date(c.created_at) > lastWeek);
        } else if (timeFilter === 'month') {
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
            data = data.filter(c => new Date(c.created_at) > lastMonth);
        }

        return data;
    }, [complaints, searchQuery, statusFilter, timeFilter]);

    // 3. Stats Calculation
    const stats = useMemo(() => {
        const total = filteredComplaints.length;
        const resolved = filteredComplaints.filter(c => c.status === 'Resolved').length;
        const pending = filteredComplaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;
        const escalated = filteredComplaints.filter(c => c.status === 'Escalated').length;
        
        // SLA Breach Calculation (Logic: > 3 days unresolved)
        const breaches = filteredComplaints.filter(c => {
            const diffTime = Math.abs(new Date() - new Date(c.created_at));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays > 3 && c.status !== 'Resolved';
        });

        return { total, resolved, pending, escalated, breaches };
    }, [filteredComplaints]);

    // 4. Handlers
    const handleViewComplaint = (c) => {
        navigate(`/complaint/${c.id}`); // Correct route
    };

    const handleAction = async (id, action) => {
        // Placeholder for future action logic (e.g. escalate API call)
        console.log(`Action ${action} on complaint ${id}`);
        // Refresh data after action
        await fetchComplaints();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 relative">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 p-6 md:p-8 w-full overflow-hidden">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Authority Dashboard</h1>
                            <p className="text-gray-500 text-sm">Monitor performance and manage student complaints</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <select 
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Time</option>
                                <option value="month">Last 30 Days</option>
                                <option value="week">Last 7 Days</option>
                                <option value="today">Today</option>
                            </select>
                            <button 
                                onClick={fetchComplaints}
                                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw size={18} className={isLoading ? "animate-spin text-blue-600" : "text-gray-600"} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard 
                            label="Total Complaints" 
                            value={stats.total} 
                            icon={<FileText className="text-blue-600" size={20} />} 
                            color="bg-blue-50"
                        />
                        <StatCard 
                            label="Resolved" 
                            value={stats.resolved} 
                            icon={<CheckCircle className="text-emerald-600" size={20} />} 
                            color="bg-emerald-50"
                        />
                        <StatCard 
                            label="Pending" 
                            value={stats.pending} 
                            icon={<Clock className="text-amber-600" size={20} />} 
                            color="bg-amber-50"
                        />
                        <StatCard 
                            label="SLA Breaches" 
                            value={stats.breaches.length} 
                            icon={<AlertTriangle className="text-red-600" size={20} />} 
                            color="bg-red-50"
                        />
                    </div>

                    {/* Tabs / Content Switcher */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 px-6 py-4 flex gap-6 overflow-x-auto">
                            {['overview', 'escalations', 'reports'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 text-sm font-medium capitalize transition-colors border-b-2 ${
                                        activeTab === tab 
                                        ? 'border-blue-600 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <>
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-bold text-gray-800">Recent Complaints</h3>
                                    </div>
                                    <ComplaintTable 
                                        complaints={filteredComplaints} 
                                        onViewClick={handleViewComplaint}
                                    />
                                </>
                            )}

                            {activeTab === 'escalations' && (
                                <div className="text-center py-12">
                                    <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-gray-800">Escalation Management</h3>
                                    <p className="text-gray-500">
                                        {stats.breaches.length > 0 
                                            ? `${stats.breaches.length} complaints require immediate attention.` 
                                            : "No critical escalations pending."}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'reports' && (
                                <div className="text-center py-12">
                                    <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-gray-800">System Reports</h3>
                                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Download Monthly Report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Simple Stat Card Component
const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
    </div>
);

export default AuthorityDashboard;