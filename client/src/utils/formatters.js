/**
 * Formats a date string into a readable format (e.g., "Oct 12, 2024")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Formats a date string into a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

/**
 * Truncates text to a specific length and adds "..."
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts status codes (under_review) to readable labels (Under Review)
 */
export const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.split('_').map(word => capitalize(word)).join(' ');
};

export default { formatDate, formatRelativeTime, truncateText, capitalize, formatStatus };