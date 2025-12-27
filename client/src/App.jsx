import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // Recommended for global alerts
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/WebSocketContext";

// Ensure global styles are loaded
import "./styles/globals.css";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          
          {/* Global Toast Container - Renders alerts on top of everything */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Main App Container */}
          <div className="app-container min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            <AppRoutes />
          </div>
          
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;