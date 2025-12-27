import api from './api';

// This service fetches raw data and processes it for charts/stats
// This ensures "Analytics" works even without dedicated backend endpoints
export const analyticsService = {
  
  // 1. Get High-Level Summary (Cards)
  getSummary: async () => {
    try {
      const { data } = await api.get('/complaints');
      
      const total = data.length;
      const resolved = data.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
      const pending = data.filter(c => c.status === 'Submitted' || c.status === 'In Progress').length;
      
      // Calculate average resolution time (mock logic or real difference)
      const avgTime = 24; // You can calculate this if you have resolved_at dates

      return { total, resolved, pending, avgTime };
    } catch (error) {
      console.error("Analytics Error:", error);
      return { total: 0, resolved: 0, pending: 0, avgTime: 0 };
    }
  },

  // 2. Get Monthly Trends (Line Chart)
  getTrends: async () => {
    try {
      const { data } = await api.get('/complaints');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize trend array
      const trends = months.map(m => ({ label: m, submitted: 0, resolved: 0 }));

      data.forEach(c => {
        const date = new Date(c.created_at);
        const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
        
        if (monthIndex >= 0 && monthIndex < 12) {
            trends[monthIndex].submitted++;
            if (c.status === 'Resolved' || c.status === 'Closed') {
                trends[monthIndex].resolved++;
            }
        }
      });

      return trends;
    } catch (error) {
      return [];
    }
  },

  // 3. Get Category Distribution (Pie Chart)
  getCategoryStats: async () => {
    try {
      const { data } = await api.get('/complaints');
      const categoryCounts = {};

      data.forEach(c => {
        const cat = c.category || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      return Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
      }));
    } catch (error) {
      return [];
    }
  }
};

export default analyticsService;