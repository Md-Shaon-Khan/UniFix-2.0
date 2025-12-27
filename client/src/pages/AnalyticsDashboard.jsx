import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart3, TrendingUp, PieChart, Download, 
  RefreshCw, CheckCircle, AlertTriangle, Clock, 
  Activity, ArrowUpRight, ArrowDownRight, Users
} from "lucide-react";
import { complaintAPI } from "../services/api"; // Real API
import BarChart from "../components/analytics/BarChart";
import Heatmap from "../components/analytics/Heatmap";

const AnalyticsDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("all");

    // 1. Fetch Real Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await complaintAPI.getAll();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Calculate Real Stats (Memoized)
    const stats = useMemo(() => {
        const total = complaints.length;
        if (total === 0) return { total: 0, resolved: 0, pending: 0, rate: 0 };

        const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
        const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'In Progress').length;
        const rate = Math.round((resolved / total) * 100);

        // Find Top Category
        const catCounts = {};
        complaints.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
        const topCat = Object.keys(catCounts).reduce((a, b) => catCounts[a] > catCounts[b] ? a : b, "None");

        return { total, resolved, pending, rate, topCat };
    }, [complaints]);

    // 3. Helper Component for Stat Cards
    const StatCard = ({ label, value, icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={14} className="mr-1" /> Live
                </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8 lg:ml-64">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-500">Real-time insights and performance metrics</p>
                </div>
                
                <div className="flex gap-3">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Time</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                    </select>
                    <button 
                        onClick={fetchData}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label="Total Complaints" 
                    value={stats.total} 
                    icon={<Activity className="text-blue-600" size={24} />} 
                    color="bg-blue-50"
                />
                <StatCard 
                    label="Resolved Cases" 
                    value={stats.resolved} 
                    icon={<CheckCircle className="text-emerald-600" size={24} />} 
                    color="bg-emerald-50"
                    subtext={`${stats.rate}% Resolution Rate`}
                />
                <StatCard 
                    label="Pending Issues" 
                    value={stats.pending} 
                    icon={<AlertTriangle className="text-amber-600" size={24} />} 
                    color="bg-amber-50"
                />
                <StatCard 
                    label="Top Category" 
                    value={stats.topCat} 
                    icon={<TrendingUp className="text-purple-600" size={24} />} 
                    color="bg-purple-50"
                />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Main Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-blue-600" />
                            Complaint Trends
                        </h3>
                    </div>
                    {/* Using our Real Dynamic BarChart */}
                    <BarChart type="complaints" height={300} />
                </div>

                {/* Heatmap */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity size={20} className="text-orange-600" />
                            Activity Heatmap
                        </h3>
                    </div>
                    {/* Using our Real Dynamic Heatmap */}
                    <Heatmap />
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <PieChart className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold">System Insights</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-gray-400 text-sm font-medium mb-2">Efficiency</h4>
                        <p className="text-lg">
                            Resolution rate is <span className="text-emerald-400 font-bold">{stats.rate}%</span>. 
                            {stats.rate > 80 ? " Excellent performance!" : " Needs improvement."}
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-gray-400 text-sm font-medium mb-2">Workload</h4>
                        <p className="text-lg">
                            <span className="text-blue-400 font-bold">{stats.pending}</span> active cases currently requiring attention from authorities.
                        </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <h4 className="text-gray-400 text-sm font-medium mb-2">Hotspot</h4>
                        <p className="text-lg">
                            <span className="text-purple-400 font-bold">{stats.topCat}</span> has the highest volume of reports this period.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;