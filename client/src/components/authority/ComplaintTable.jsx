import React, { useState, useMemo } from "react";
import EscalationBadge from "./EscalationBadge";
import { Download, Printer, ArrowUp, ArrowDown, Search } from "lucide-react";

const ComplaintTable = ({ 
    complaints = [], // Default to empty array
    onViewClick, 
    onPriorityChange,
    showPriority = true,
    showActions = true 
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
    const [filter, setFilter] = useState({
        status: 'all',
        priority: 'all',
        department: 'all',
        search: ''
    });

    // Status color mapping
    const statusColors = {
        'Pending': '#f59e0b',    // Amber
        'In Review': '#3b82f6',  // Blue
        'In Progress': '#3b82f6',// Blue (Variant)
        'Resolved': '#10b981',   // Green
        'Rejected': '#ef4444',   // Red
        'Escalated': '#8b5cf6',  // Purple
        'Closed': '#6b7280'      // Gray
    };

    // 1. Sort Function
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // 2. Filter & Sort Logic (Memoized for performance)
    const processedComplaints = useMemo(() => {
        let data = [...complaints];

        // A. Filtering
        if (filter.status !== 'all') {
            data = data.filter(c => c.status === filter.status);
        }
        if (filter.priority !== 'all') {
            data = data.filter(c => c.priority === filter.priority);
        }
        if (filter.department !== 'all') {
            data = data.filter(c => c.department === filter.department);
        }
        if (filter.search) {
            const lowerSearch = filter.search.toLowerCase();
            data = data.filter(c => 
                c.title?.toLowerCase().includes(lowerSearch) ||
                c.description?.toLowerCase().includes(lowerSearch) ||
                c.id.toString().includes(lowerSearch)
            );
        }

        // B. Sorting
        if (sortConfig.key) {
            data.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle Date Sorting
                if (sortConfig.key === 'created_at') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [complaints, filter, sortConfig]);

    // 3. Extract Unique Values for Dropdowns
    const departments = [...new Set(complaints.map(c => c.department).filter(Boolean))];
    const statuses = [...new Set(complaints.map(c => c.status).filter(Boolean))];

    // Helper: Sort Icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <span className="text-gray-300 ml-1">↕</span>;
        return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header & Filters */}
            <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Complaints Overview</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {complaints.length} • 
                            Pending: {complaints.filter(c => c.status === 'Pending' || c.status === 'Submitted').length} • 
                            Resolved: {complaints.filter(c => c.status === 'Resolved').length}
                        </p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search ID, title..." 
                            value={filter.search}
                            onChange={(e) => setFilter({...filter, search: e.target.value})}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-3">
                    <select 
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select 
                        value={filter.department}
                        onChange={(e) => setFilter({...filter, department: e.target.value})}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    {showPriority && (
                        <select 
                            value={filter.priority}
                            onChange={(e) => setFilter({...filter, priority: e.target.value})}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('id')}>
                                <div className="flex items-center">ID {getSortIcon('id')}</div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('department')}>
                                <div className="flex items-center">Dept {getSortIcon('department')}</div>
                            </th>
                            <th className="p-4">Title / Category</th>
                            {showPriority && (
                                <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('priority')}>
                                    <div className="flex items-center">Priority {getSortIcon('priority')}</div>
                                </th>
                            )}
                            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('status')}>
                                <div className="flex items-center">Status {getSortIcon('status')}</div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('created_at')}>
                                <div className="flex items-center">Date {getSortIcon('created_at')}</div>
                            </th>
                            {showActions && <th className="p-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {processedComplaints.length > 0 ? (
                            processedComplaints.map((complaint) => (
                                <tr 
                                    key={complaint.id} 
                                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                    onClick={() => onViewClick && onViewClick(complaint)}
                                >
                                    <td className="p-4 text-sm font-mono text-gray-500">
                                        #{complaint.id}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {complaint.department || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{complaint.title}</div>
                                        <div className="text-xs text-gray-500">{complaint.category}</div>
                                    </td>
                                    {showPriority && (
                                        <td className="p-4">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <EscalationBadge 
                                                    level={complaint.priority || 'low'}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                    )}
                                    <td className="p-4">
                                        <span 
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                            style={{
                                                backgroundColor: `${statusColors[complaint.status] || '#9ca3af'}15`,
                                                color: statusColors[complaint.status] || '#4b5563',
                                                borderColor: `${statusColors[complaint.status] || '#9ca3af'}30`
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: statusColors[complaint.status] || '#4b5563' }}></span>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </td>
                                    {showActions && (
                                        <td className="p-4 text-right">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewClick && onViewClick(complaint);
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={showPriority && showActions ? 7 : 6} className="p-12 text-center">
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Search size={48} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium text-gray-500">No complaints found</p>
                                        <p className="text-sm">Try adjusting your filters or search query.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                <div>
                    Showing {processedComplaints.length} of {complaints.length} results
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-700 transition-colors ml-4">
                        <Printer size={14} /> Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintTable;