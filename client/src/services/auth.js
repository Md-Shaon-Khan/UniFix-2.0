import { authAPI } from "./api"; // Import real API calls

const USER_KEY = "unifix_user";
const TOKEN_KEY = "unifix_token";
let _subscribers = [];

// 1. Get Current User (from LocalStorage)
export const getCurrentUser = () => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
};

// 2. Check Auth Status
export const isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; // Returns true if token exists
};

// 3. Real Login (Connects to Backend)
export const login = async (email, password, role) => {
    try {
        // Call the real API
        const response = await authAPI.login(email, password, role);
        const { user, token } = response.data;

        // Save real data to storage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        notify(user); // Tell subscribers (if any)
        return user;
    } catch (error) {
        console.error("Auth Service Login Error:", error);
        throw error;
    }
};

// 4. Real Logout
export const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    notify(null);
};

// 5. Subscription (Kept for compatibility)
export const subscribe = (cb) => {
    _subscribers.push(cb);
    cb(getCurrentUser());
    return () => {
        _subscribers = _subscribers.filter((f) => f !== cb);
    };
};

function notify(user) {
    _subscribers.forEach((cb) => {
        try {
            cb(user);
        } catch (e) {
            // ignore errors
        }
    });
}

export default {
    getCurrentUser,
    isAuthenticated,
    login,
    logout,
    subscribe
};