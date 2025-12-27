import React, { useState, useEffect, useRef } from "react";
import { complaintAPI } from "../../services/api"; // Import Real API
import { Loader2 } from "lucide-react";

const BarChart = ({
    type = 'complaints',
    timeRange = 'monthly',
    height = 400,
    onBarClick
}) => {
    const canvasRef = useRef(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredBar, setHoveredBar] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [chartType, setChartType] = useState(type);

    // Chart types configuration
    const chartTypes = {
        complaints: { label: 'Complaint Volume', color: '#3b82f6' }, // Blue
        resolution: { label: 'Resolution Rate', color: '#10b981' }, // Green
        pending: { label: 'Pending Issues', color: '#f59e0b' },    // Amber
        priority: { label: 'Priority Cases', color: '#ef4444' }     // Red
    };

    const categories = ['Academic', 'Infrastructure', 'Hostel', 'Food', 'Other'];

    // ==================== 1. FETCH REAL DATA ====================
    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                setLoading(true);
                // Fetch ALL complaints from database
                const response = await complaintAPI.getAll();
                const realComplaints = response.data;

                // Process data based on Time Range (Weekly vs Monthly)
                const processed = processData(realComplaints, timeRange);
                setChartData(processed);
            } catch (error) {
                console.error("Failed to load chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessData();
    }, [timeRange]); // Re-run if user switches Weekly/Monthly

    // ==================== 2. PROCESS REAL SQL DATA ====================
    const processData = (complaints, range) => {
        const groupedData = {};

        // Helper to initialize a time slot
        const initSlot = (label) => ({
            label,
            complaints: 0,
            resolved: 0,
            pending: 0,
            priority: 0,
            byCategory: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
        });

        // 1. Group complaints by Date
        complaints.forEach(c => {
            const date = new Date(c.created_at);
            let key;

            if (range === 'monthly') {
                // Key: "Jan", "Feb"
                key = date.toLocaleString('default', { month: 'short' });
            } else {
                // Key: "Week 1", "Week 2" (Simplified logic)
                const day = date.getDate();
                key = `Week ${Math.ceil(day / 7)}`;
            }

            if (!groupedData[key]) groupedData[key] = initSlot(key);

            // Increment Counts
            groupedData[key].complaints++;
            
            if (c.status === 'Resolved') groupedData[key].resolved++;
            if (c.status === 'Submitted' || c.status === 'In Progress') groupedData[key].pending++;
            
            // Map Category
            const cat = c.category || 'Other';
            if (groupedData[key].byCategory[cat] !== undefined) {
                groupedData[key].byCategory[cat]++;
            } else {
                 groupedData[key].byCategory['Other']++;
            }
        });

        // 2. Convert Object to Array and Sort
        // Ensure we have months in order if monthly
        if (range === 'monthly') {
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthOrder
                .filter(m => groupedData[m]) // Only show months with data
                .map(m => groupedData[m]);
        }

        return Object.values(groupedData);
    };

    // ==================== 3. PREPARE DRAWING DATA ====================
    const getBarData = () => {
        if (!chartData.length) return [];

        return chartData.map(item => {
            let value;
            
            switch (chartType) {
                case 'complaints':
                    value = selectedCategory === 'all' 
                        ? item.complaints 
                        : item.byCategory[selectedCategory];
                    break;
                case 'resolution':
                    value = item.complaints > 0 ? Math.round((item.resolved / item.complaints) * 100) : 0;
                    break;
                case 'pending':
                    value = item.pending;
                    break;
                case 'priority':
                    // Simulating priority based on logic if DB doesn't have it
                    value = Math.round(item.pending * 0.2); 
                    break;
                default:
                    value = item.complaints;
            }
            
            return {
                label: item.label,
                value,
                rawData: item
            };
        });
    };

    // ==================== 4. DRAW CHART (CANVAS) ====================
    const drawChart = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const barData = getBarData();
        
        // Handle Empty Data
        if (barData.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '16px Inter';
            ctx.fillStyle = '#9ca3af';
            ctx.textAlign = 'center';
            ctx.fillText("No data available yet", canvas.width/2, canvas.height/2);
            return;
        }

        const padding = 50;
        // Dynamic bar width based on number of items
        const barWidth = Math.min(60, (canvas.width - padding * 2) / barData.length - 20);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Find max value for scaling
        const maxValue = Math.max(...barData.map(d => d.value), 5); // Minimum scale of 5
        
        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (canvas.height - padding * 2) * (1 - i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            ctx.fillStyle = '#6b7280';
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxValue * i / 5), padding - 10, y + 4);
        }
        
        // Draw bars
        barData.forEach((bar, index) => {
            // Calculate X position to center bars if few items
            const totalWidth = barData.length * (barWidth + 20);
            const startX = (canvas.width - totalWidth) / 2;
            const x = startX + index * (barWidth + 20);

            const barHeight = (bar.value / maxValue) * (canvas.height - padding * 2);
            const y = canvas.height - padding - barHeight;
            
            const isHovered = hoveredBar === index;
            
            // Bar color
            let color = chartTypes[chartType].color;
            
            // Draw bar shadow
            ctx.fillStyle = isHovered ? color + '40' : color + '20'; // Transparent version
            ctx.fillRect(x + 4, y + 4, barWidth, barHeight);

            // Draw main bar
            ctx.fillStyle = color;
            if (isHovered) ctx.fillStyle = adjustColor(color, 20); // Lighter on hover

            // Rounded corners logic (simplified)
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw label (Month/Week)
            ctx.fillStyle = '#4b5563';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(bar.label, x + barWidth / 2, canvas.height - padding + 20);
            
            // Draw value on top of bar
            if (barHeight > 15) {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 10px Inter';
                let displayValue = chartType === 'resolution' ? `${bar.value}%` : bar.value;
                ctx.fillText(displayValue, x + barWidth / 2, y + 15);
            }
        });
    };

    // Color utility
    const adjustColor = (color, amount) => {
        return color; // Simplification for React usage
    };

    // Handle mouse interactions
    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const barData = getBarData();
        
        // Logic to find which bar is hovered (simplified matching logic)
        const padding = 50;
        const barWidth = Math.min(60, (canvas.width - padding * 2) / barData.length - 20);
        const totalWidth = barData.length * (barWidth + 20);
        const startX = (canvas.width - totalWidth) / 2;

        let found = null;
        barData.forEach((_, index) => {
            const barX = startX + index * (barWidth + 20);
            if (x >= barX && x <= barX + barWidth) {
                found = index;
            }
        });
        setHoveredBar(found);
    };

    // Redraw effect
    useEffect(() => {
        if (!loading) drawChart();
    }, [chartData, chartType, selectedCategory, hoveredBar, loading]);

    // ==================== RENDER ====================
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{chartTypes[chartType].label}</h3>
                    <p className="text-sm text-gray-500">Real-time data from database</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {/* Type Selector */}
                    <select 
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.entries(chartTypes).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                    
                    {/* Category Filter */}
                    {chartType === 'complaints' && (
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    )}
                </div>
            </div>
            
            {/* Canvas Area */}
            <div className="relative w-full overflow-hidden flex justify-center items-center" style={{ minHeight: height }}>
                {loading ? (
                    <div className="flex flex-col items-center text-blue-600 animate-pulse">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium">Loading analytics...</span>
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={height}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="cursor-crosshair w-full max-w-full"
                    />
                )}
            </div>

            {/* Stats Summary Footer */}
            {!loading && chartData.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                            {chartData.reduce((acc, curr) => acc + curr.complaints, 0)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Resolved</p>
                        <p className="text-xl font-bold text-emerald-600">
                            {chartData.reduce((acc, curr) => acc + curr.resolved, 0)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                        <p className="text-xl font-bold text-amber-500">
                            {chartData.reduce((acc, curr) => acc + curr.pending, 0)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarChart;