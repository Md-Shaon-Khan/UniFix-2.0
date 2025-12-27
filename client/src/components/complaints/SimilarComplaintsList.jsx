import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, TrendingUp, AlertTriangle, ThumbsUp, 
  MessageSquare, ChevronRight, X, CheckCircle, ExternalLink
} from "lucide-react";
import { complaintAPI } from "../../services/api"; // Real API

const SimilarComplaintsList = ({ currentCategory, currentTitle }) => {
    const [similarComplaints, setSimilarComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(null);

    // 1. Fetch & Filter Logic
    useEffect(() => {
        if (!currentCategory) return;

        const fetchSimilar = async () => {
            try {
                setLoading(true);
                // Fetch ALL complaints (In a real app, you'd have a specific search API)
                const response = await complaintAPI.getAll();
                const allComplaints = response.data;

                // LOGIC: Filter by same Category OR similar words in title
                const filtered = allComplaints.filter(c => {
                    // Match Category
                    const categoryMatch = c.category === currentCategory;
                    
                    // Simple Title Match (contains words)
                    const titleWords = currentTitle?.toLowerCase().split(" ").filter(w => w.length > 3) || [];
                    const titleMatch = titleWords.some(word => c.title.toLowerCase().includes(word));

                    return categoryMatch || titleMatch;
                });

                // Sort by Votes (Highest first) and take top 3
                const topSimilar = filtered.sort((a, b) => b.votes - a.votes).slice(0, 3);
                
                setSimilarComplaints(topSimilar);
            } catch (error) {
                console.error("Failed to find similar complaints", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSimilar, 500); // Debounce
        return () => clearTimeout(timer);
    }, [currentCategory, currentTitle]);

    if (!currentCategory || loading) return null;
    if (similarComplaints.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Similar Issues Found</h3>
                    <p className="text-sm text-gray-600">
                        {similarComplaints.length} existing complaints match your category or title.
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {similarComplaints.map((complaint) => (
                    <motion.div 
                        key={complaint.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden"
                    >
                        <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setShowDetails(showDetails === complaint.id ? null : complaint.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(complaint.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                                    <ThumbsUp size={14} />
                                    <span className="text-xs font-bold">{complaint.votes}</span>
                                </div>
                            </div>

                            {/* Details Expand */}
                            <AnimatePresence>
                                {showDetails === complaint.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600"
                                    >
                                        <p className="mb-3">{complaint.description}</p>
                                        <button className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                                            View Full Discussion <ExternalLink size={12} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Suggestion */}
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                    Voting on an existing issue is faster than submitting a new one!
                </span>
            </div>
        </div>
    );
};

export default SimilarComplaintsList;