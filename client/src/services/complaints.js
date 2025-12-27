import api from './api';

// 1. List All Complaints (With Safety Check)
export const listComplaints = async () => {
  try {
    const res = await api.get('/complaints');
    // robustly handle different response structures (array vs object)
    if (Array.isArray(res.data)) return res.data;
    return res.data.complaints || []; 
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

// 2. Get Single Complaint Details
export const getComplaint = async (id) => {
  try {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching complaint #${id}:`, error);
    throw error;
  }
};

// 3. Create New Complaint
export const createComplaint = async (payload) => {
  try {
    const res = await api.post('/complaints', payload);
    return res.data;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
};

// 4. Vote on Complaint
export const voteComplaint = async (id) => {
  try {
    const res = await api.post(`/complaints/${id}/vote`);
    return res.data;
  } catch (error) {
    console.error(`Error voting on complaint #${id}:`, error);
    throw error;
  }
};

// 5. Update Status (For Authorities)
export const updateStatus = async (id, status) => {
  try {
    const res = await api.put(`/complaints/${id}/status`, { status });
    return res.data;
  } catch (error) {
    console.error(`Error updating status for #${id}:`, error);
    throw error;
  }
};

const complaintsService = {
  listComplaints,
  getComplaint,
  createComplaint,
  voteComplaint,
  updateStatus
};

export default complaintsService;