import React, { useState, useEffect } from "react";
import { complaintAPI } from "../../services/api"; // Import Real API
import { Loader2 } from "lucide-react";

const Heatmap = ({ 
    timeRange = 'month',
    showLegend = true,
    onCellClick 
}) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState('total');
    const [hoveredCell, setHoveredCell] = useState(null);

    // Metrics configuration
    const metrics = {
        total: { label: 'Total Complaints', colorScale: 'Blues' },
        pending: { label: 'Pending Issues', colorScale: 'Oranges' },
        resolved: { label: 'Resolution Count', colorScale: 'Greens' },
        escalation: { label: 'Closed/Escalated', colorScale: 'Reds' }
    };

    // Constants for Grid
    const categories = ['Academic', 'Infrastructure', 'Hostel', 'Food', 'Other'];
    const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // ==================== 1. FETCH REAL DATA ====================
    useEffect(() => {
        const fetchRealData = async () => {
            try {
                setLoading(true);
                const response = await complaintAPI.getAll();
                const processed = processData(response.data);
                setChartData(processed);
            } catch (error) {
                console.error("Failed to load heatmap data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, [timeRange]);

    // ==================== 2. PROCESS DATA ====================
    const processData = (complaints) => {
        // 1. Initialize empty grid
        const grid = [];
        categories.forEach(cat => {
            daysList.forEach(day => {
                grid.push({
                    department: cat, // Using Category as "Department" for visual grouping
                    day: day,
                    total: 0,
                    pending: 0,
                    resolved: 0,
                    escalation: 0
                });
            });
        });

        // 2. Fill grid with real data
        complaints.forEach(c => {
            const date = new Date(c.created_at);
            const dayName = daysList[date.getDay()]; // 0=Sun, 1=Mon...
            const category = c.category || 'Other';

            // Find matching cell
            const cell = grid.find(g => g.department === category && g.day === dayName);
            
            if (cell) {
                cell.total++;
                
                if (c.status === 'Resolved') {
                    cell.resolved++;
                } else if (c.status === 'Submitted' || c.status === 'In Progress') {
                    cell.pending++;
                } else if (c.status === 'Closed') {
                    cell.escalation++;
                }
            }
        });

        return grid;
    };

    // ==================== 3. VISUALIZATION LOGIC ====================
    
    // Calculate color intensity based on max values in the dataset
    const getColorIntensity = (value, metric) => {
        // Find max value dynamically for scaling
        const maxValue = Math.max(...chartData.map(d => d[metric]), 5); // Min cap of 5
        
        const intensity = Math.min(value / maxValue, 1);
        
        switch (metrics[metric].colorScale) {
            case 'Blues':
                return `rgba(59, 130, 246, ${value === 0 ? 0.05 : 0.2 + intensity * 0.8})`;
            case 'Oranges':
                return `rgba(245, 158, 11, ${value === 0 ? 0.05 : 0.2 + intensity * 0.8})`;
            case 'Greens':
                return `rgba(16, 185, 129, ${value === 0 ? 0.05 : 0.2 + intensity * 0.8})`;
            case 'Reds':
                return `rgba(239, 68, 68, ${value === 0 ? 0.05 : 0.2 + intensity * 0.8})`;
            default:
                return `rgba(156, 163, 175, ${0.1})`;
        }
    };

    // Get cell value helper
    const getCellValue = (dept, day) => {
        const cell = chartData.find(d => d.department === dept && d.day === day);
        return cell ? cell[selectedMetric] : 0;
    };

    // Handle cell click
    const handleCellClick = (dept, day) => {
        if (onCellClick) {
            const cellData = chartData.find(d => d.department === dept && d.day === day);
            onCellClick(cellData);
        }
    };

    // Calculate row stats (per category)
    const departmentStats = categories.map(dept => {
        const deptData = chartData.filter(d => d.department === dept);
        const total = deptData.reduce((sum, d) => sum + d.total, 0);
        const pending = deptData.reduce((sum, d) => sum + d.pending, 0);
        const resolved = deptData.reduce((sum, d) => sum + d.resolved, 0);
        
        return {
            department: dept,
            total,
            pending,
            resolved,
            resolvedRate: total > 0 ? Math.round((resolved / total) * 100) : 0
        };
    });

    // ==================== 4. RENDER ====================
    if (loading) {
        return (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-500 font-medium">Loading heatmap data...</span>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Weekly Activity Heatmap</h3>
                    <p className="text-sm text-gray-500">
                        Visualizing complaint distribution by Category & Day
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Metric:</label>
                        <select 
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(metrics).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1">
                        {/* Top-left corner */}
                        <div className="p-2 text-xs font-semibold text-gray-400 flex items-end justify-end">
                            Category
                        </div>
                        
                        {/* Day headers */}
                        {daysList.map(day => (
                            <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500 bg-gray-50 rounded-t-lg">
                                {day}
                            </div>
                        ))}
                        
                        {/* Rows */}
                        {categories.map(dept => {
                            const stats = departmentStats.find(d => d.department === dept);
                            
                            return (
                                <React.Fragment key={dept}>
                                    {/* Row Header (Category Name) */}
                                    <div className="p-2 flex flex-col justify-center text-right pr-4 border-r border-gray-100">
                                        <span className="text-sm font-bold text-gray-700">{dept}</span>
                                        <div className="flex justify-end gap-1 mt-1">
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">{stats.total}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Cells */}
                                    {daysList.map(day => {
                                        const value = getCellValue(dept, day);
                                        const isHovered = hoveredCell?.department === dept && hoveredCell?.day === day;
                                        
                                        return (
                                            <div
                                                key={`${dept}-${day}`}
                                                className="relative h-12 rounded-md transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-400"
                                                style={{
                                                    backgroundColor: getColorIntensity(value, selectedMetric),
                                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                                    zIndex: isHovered ? 10 : 1
                                                }}
                                                onMouseEnter={() => setHoveredCell({ department: dept, day })}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                onClick={() => handleCellClick(dept, day)}
                                            >
                                                {/* Cell Value */}
                                                <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${value > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    {value > 0 ? value : '-'}
                                                </div>

                                                {/* Tooltip */}
                                                {isHovered && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-50 pointer-events-none">
                                                        <div className="font-bold mb-1 border-b border-gray-700 pb-1">{dept} • {day}</div>
                                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                            <span>Total:</span> <span className="text-right font-mono">{chartData.find(d => d.department === dept && d.day === day)?.total}</span>
                                                            <span className="text-amber-400">Pending:</span> <span className="text-right font-mono text-amber-400">{chartData.find(d => d.department === dept && d.day === day)?.pending}</span>
                                                            <span className="text-emerald-400">Resolved:</span> <span className="text-right font-mono text-emerald-400">{chartData.find(d => d.department === dept && d.day === day)?.resolved}</span>
                                                        </div>
                                                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="mt-6 flex items-center justify-end gap-3 text-xs text-gray-500">
                    <span>Low Intensity</span>
                    <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
                            <div 
                                key={i} 
                                className="w-6 h-6 rounded"
                                style={{ 
                                    backgroundColor: metrics[selectedMetric].colorScale === 'Blues' ? `rgba(59, 130, 246, ${opacity})` :
                                                    metrics[selectedMetric].colorScale === 'Greens' ? `rgba(16, 185, 129, ${opacity})` :
                                                    metrics[selectedMetric].colorScale === 'Oranges' ? `rgba(245, 158, 11, ${opacity})` :
                                                    `rgba(239, 68, 68, ${opacity})`
                                }}
                            />
                        ))}
                    </div>
                    <span>High Intensity</span>
                </div>
            )}
        </div>
    );
};

export default Heatmap;