import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ThumbsUp, Eye, MessageSquare, MapPin, Calendar, 
  ChevronRight, Bookmark, Share2, Users, ExternalLink
} from "lucide-react";

const ComplaintCard = ({ 
    complaint, 
    isDetailed = false,
    onVote,
    onView,
    onFollow
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Safety check for missing data
    if (!complaint) return null;

    // Format SQL Date
    const formatDate = (dateString) => {
        if (!dateString) return "Just now";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // Color Helpers
    const getStatusColor = (status) => {
        const map = {
            'Submitted': 'bg-blue-100 text-blue-700',
            'In Progress': 'bg-yellow-100 text-yellow-700',
            'Resolved': 'bg-green-100 text-green-700',
            'Closed': 'bg-gray-100 text-gray-700',
            'Rejected': 'bg-red-100 text-red-700'
        };
        return map[status] || map['Submitted'];
    };

    const getCategoryColor = (cat) => {
        const map = {
            'Academic': 'bg-purple-100 text-purple-700',
            'Infrastructure': 'bg-orange-100 text-orange-700',
            'Hostel': 'bg-teal-100 text-teal-700',
            'Food': 'bg-pink-100 text-pink-700'
        };
        return map[cat] || 'bg-gray-100 text-gray-700';
    };

    // --- RENDER COMPACT CARD (For Lists) ---
    const renderCompactView = () => (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onView && onView(complaint.id)}
        >
            <div className="p-5">
                {/* Header: Status & Category */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(complaint.category)}`}>
                            {complaint.category || 'General'}
                        </span>
                    </div>
                    {/* Hover Action (Bookmark) */}
                    <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Bookmark size={18} />
                    </button>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {complaint.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {complaint.description}
                </p>

                {/* Footer: Meta Info */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {formatDate(complaint.created_at)}
                        </span>
                        {/* Vote Count */}
                        <div className="flex items-center gap-1 text-gray-700">
                            <ThumbsUp size={14} className={complaint.votes > 50 ? "text-blue-500 fill-blue-500" : ""} />
                            <span>{complaint.votes}</span>
                        </div>
                    </div>

                    <div className="flex items-center text-blue-600 text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        Details <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // --- RENDER DETAILED VIEW (For Single Page) ---
    const renderDetailedView = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                                {complaint.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold bg-white text-blue-800`}>
                                {complaint.status.toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4 leading-tight">{complaint.title}</h1>
                        <div className="flex items-center gap-6 text-blue-100 text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} /> Posted {formatDate(complaint.created_at)}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin size={16} /> Campus Location
                            </span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <div className="prose max-w-none text-gray-700 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                    <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                        {complaint.description}
                    </p>
                </div>

                {/* Interaction Bar */}
                <div className="flex gap-4 border-t border-gray-100 pt-6">
                    <button 
                        onClick={() => onVote && onVote(complaint.id)}
                        className="flex-1 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <ThumbsUp size={20} /> Upvote ({complaint.votes})
                    </button>
                    <button className="flex-1 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                        <MessageSquare size={20} /> Comment
                    </button>
                    <button 
                        onClick={() => onFollow && onFollow(complaint.id)}
                        className="flex-1 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <Users size={20} /> Follow
                    </button>
                </div>
            </div>
        </div>
    );

    return isDetailed ? renderDetailedView() : renderCompactView();
};

export default ComplaintCard;