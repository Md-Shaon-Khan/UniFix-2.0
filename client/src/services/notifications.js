import api from './api';

// 1. List All Notifications
export const listNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    // Handle if backend returns array directly or { notifications: [...] }
    if (Array.isArray(res.data)) return res.data;
    return res.data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    // Return empty array instead of crashing so UI just shows "No notifications"
    return [];
  }
};

// 2. Mark Single Notification as Read
export const markRead = async (id) => {
  try {
    // Using PUT is more standard for updates, but supporting POST just in case
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};

// 3. Mark ALL as Read (Bulk Action)
export const markAllRead = async () => {
  try {
    const res = await api.put('/notifications/read-all');
    return res.data;
  } catch (error) {
    console.error("Error marking all read:", error);
    throw error;
  }
};

// 4. Delete Notification
export const deleteNotification = async (id) => {
  try {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
};

const notificationsService = {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification
};

export default notificationsService;