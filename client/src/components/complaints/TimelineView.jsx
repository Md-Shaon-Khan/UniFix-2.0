import React from "react";
import { 
  FileText, CheckCircle, Clock, User, MessageSquare, 
  ArrowDown, Calendar
} from "lucide-react";

const TimelineView = ({ complaint }) => {
    
    // Generate Timeline Events based on Real Complaint Data
    const getEvents = () => {
        if (!complaint) return [];

        const events = [
            // 1. Submission Event (Always exists)
            {
                id: 1,
                title: "Complaint Submitted",
                date: complaint.created_at,
                description: "Complaint logged in the system.",
                icon: <FileText size={18} />,
                color: "bg-blue-100 text-blue-600",
                isCompleted: true
            }
        ];

        // 2. In Progress Event (If status is not Submitted)
        if (complaint.status !== 'Submitted') {
            events.push({
                id: 2,
                title: "Under Review",
                date: complaint.updated_at, // Approximation
                description: "Authority has acknowledged the issue.",
                icon: <User size={18} />,
                color: "bg-yellow-100 text-yellow-600",
                isCompleted: true
            });
        }

        // 3. Resolution Event (If resolved)
        if (complaint.status === 'Resolved' || complaint.status === 'Closed') {
            events.push({
                id: 3,
                title: "Complaint Resolved",
                date: complaint.updated_at,
                description: "Issue has been fixed and closed.",
                icon: <CheckCircle size={18} />,
                color: "bg-green-100 text-green-600",
                isCompleted: true
            });
        } else {
            // Future Step (Pending)
            events.push({
                id: 3,
                title: "Resolution Pending",
                date: null,
                description: "Waiting for final resolution.",
                icon: <Clock size={18} />,
                color: "bg-gray-100 text-gray-400",
                isCompleted: false
            });
        }

        return events;
    };

    const events = getEvents();

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Status Timeline
            </h3>

            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                {events.map((event, index) => (
                    <div key={event.id} className="relative pl-6">
                        {/* Dot on Line */}
                        <div 
                            className={`absolute -left-[25px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${event.color}`}
                        >
                            {event.icon}
                        </div>

                        {/* Content */}
                        <div className={`transition-opacity duration-500 ${event.isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                            <h4 className="font-semibold text-gray-900 text-sm">
                                {event.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {event.date ? new Date(event.date).toLocaleString() : "Pending..."}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineView;