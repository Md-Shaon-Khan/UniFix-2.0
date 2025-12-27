import { useState, useCallback } from 'react';
import { complaintAPI } from '../services/api';
import { toast } from 'react-hot-toast'; // Optional: Use if you have a toaster installed

const useComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch All Complaints
    const fetchComplaints = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            // You can pass query params here if your backend supports filtering
            const response = await complaintAPI.getAll();
            setComplaints(response.data);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to load complaints. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Fetch Single Complaint Details
    const fetchComplaintById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await complaintAPI.getById(id);
            setCurrentComplaint(response.data);
            return response.data;
        } catch (err) {
            console.error(`Error fetching complaint ${id}:`, err);
            setError("Failed to load complaint details.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Create New Complaint
    const createComplaint = async (complaintData) => {
        setLoading(true);
        try {
            const response = await complaintAPI.create(complaintData);
            // Optimistic update: Add to list immediately
            setComplaints(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            console.error("Error creating complaint:", err);
            throw err; // Let the form component handle the error display
        } finally {
            setLoading(false);
        }
    };

    // 4. Vote on Complaint
    const voteComplaint = async (id) => {
        try {
            // Optimistic UI Update: Update vote count immediately before API confirms
            setComplaints(prev => prev.map(c => 
                c.id === id ? { ...c, votes: c.votes + 1 } : c
            ));

            await complaintAPI.vote(id);
        } catch (err) {
            console.error("Error voting:", err);
            // Revert on failure
            setComplaints(prev => prev.map(c => 
                c.id === id ? { ...c, votes: c.votes - 1 } : c
            ));
            alert("Failed to register vote");
        }
    };

    return {
        complaints,
        currentComplaint,
        loading,
        error,
        fetchComplaints,
        fetchComplaintById,
        createComplaint,
        voteComplaint
    };
};

export default useComplaints;