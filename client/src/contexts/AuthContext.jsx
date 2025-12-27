import React, { createContext, useState, useEffect } from "react";
import api, { authAPI } from "../services/api"; // Import real API

export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. INITIAL LOAD: Check if user is logged in
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("unifix_token");
      
      if (token) {
        // Set token for all future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        try {
          // Verify token with backend and get fresh user data
          const { data } = await authAPI.getMe();
          setUser(data);
        } catch (error) {
          console.error("Session expired:", error);
          localStorage.removeItem("unifix_token");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. LOGIN FUNCTION
  const login = async (email, password, role) => {
    try {
      const { data } = await authAPI.login(email, password, role);
      
      // Save data
      localStorage.setItem("unifix_token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // 3. REGISTER FUNCTION
  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      
      // Auto-login after register
      localStorage.setItem("unifix_token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  // 4. LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("unifix_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};