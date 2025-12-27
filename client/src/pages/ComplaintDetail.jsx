import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Clock, MessageSquare, ThumbsUp, Share2, 
  MapPin, User, Calendar, CheckCircle, AlertCircle
} from "lucide-react";
import { complaintAPI } from "../services/api"; // Real API
import TimelineView from "../components/complaints/TimelineView";

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasVoted, setHasVoted] = useState(false); // Local optimistic state

    // 1. Fetch Real Complaint Data
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Assuming your backend has GET /complaints/:id
                // If not, we can fetch all and find (not efficient but works for small scale)
                const response = await complaintAPI.getAll(); 
                const found = response.data.find(c => c.id.toString() === id);
                
                if (found) {
                    setComplaint(found);
                } else {
                    setError("Complaint not found");
                }
            } catch (err) {
                console.error("Failed to load details", err);
                setError("Failed to load complaint details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // 2. Handle Vote
    const handleVote = async () => {
        if (hasVoted) return; // Prevent spam
        try {
            await complaintAPI.vote(id);
            setHasVoted(true);
            setComplaint(prev => ({ ...prev, votes: prev.votes + 1 }));
        } catch (err) {
            console.error("Vote failed", err);
            alert("Failed to vote. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error || "Complaint not found"}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Banner */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                    >
                        {/* Status Badge */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider 
                                ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                            `}>
                                {complaint.status}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                {complaint.category}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {complaint.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{complaint.isAnonymous ? "Anonymous Student" : "Student"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{complaint.location || "Campus"}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                            <p className="whitespace-pre-line leading-relaxed">
                                {complaint.description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <TimelineView complaint={complaint} />
                </div>

                {/* Right Column: Actions & Stats */}
                <div className="space-y-6">
                    {/* Voting Box */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 text-center"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Is this important?</h3>
                        <p className="text-sm text-gray-500 mb-6">Upvote to increase priority for authorities.</p>
                        
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="text-5xl font-bold text-blue-600">{complaint.votes}</div>
                            <div className="text-left text-sm text-gray-500 leading-tight">
                                Students<br/>voted for this
                            </div>
                        </div>

                        <button 
                            onClick={handleVote}
                            disabled={hasVoted}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                hasVoted 
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                            }`}
                        >
                            {hasVoted ? <CheckCircle size={20} /> : <ThumbsUp size={20} />}
                            {hasVoted ? "Voted" : "Upvote Issue"}
                        </button>
                    </motion.div>

                    {/* Share Box */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Share Update</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                                <Share2 size={16} /> Copy Link
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
                                <MessageSquare size={16} /> Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetail;