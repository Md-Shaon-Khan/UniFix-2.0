/**
 * Validation Utilities
 */

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
  // Min 6 chars, at least one letter and one number is good practice
  return password && password.length >= 6;
};

export const isValidPhone = (phone) => {
  // Allows formats like: 01711..., +880..., 123-456
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone));
};

export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && String(value).trim().length > 0;
};

/**
 * Validates the entire Complaint Form
 */
export const validateComplaintForm = (data) => {
  const errors = {};

  if (!isRequired(data.title)) errors.title = "Title is required";
  else if (data.title.length < 5) errors.title = "Title must be at least 5 characters";

  if (!isRequired(data.category)) errors.category = "Category is required";
  
  if (!isRequired(data.description)) errors.description = "Description is required";
  else if (data.description.length < 20) errors.description = "Please provide more detail (min 20 chars)";

  if (!isRequired(data.location)) errors.location = "Location is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default { isValidEmail, isValidPassword, isRequired, validateComplaintForm };