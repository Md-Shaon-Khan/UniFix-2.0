import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth"; // Get real user auth status

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Depend on Auth

  useEffect(() => {
    // 1. Only connect if user is authenticated
    if (isAuthenticated && user) {
      // 2. Initialize Socket with Auth Token
      const token = localStorage.getItem("unifix_token");
      
      const newSocket = io("http://localhost:5000", {
        auth: { token }, // Critical: Send token to server
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // 3. Event Listeners
      newSocket.on("connect", () => {
        console.log("🟢 WebSocket Connected:", newSocket.id);
        
        // Optional: Join a specific room for this user
        newSocket.emit("join_room", `user_${user.id}`);
      });

      newSocket.on("connect_error", (err) => {
        console.error("🔴 WebSocket Connection Error:", err.message);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("🟠 WebSocket Disconnected:", reason);
      });

      setSocket(newSocket);

      // 4. Cleanup: Disconnect when user logs out or component unmounts
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated, user]); // Re-run connection logic when Auth changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Safe Custom Hook
export const useSocket = () => {
  const context = useContext(SocketContext);
  // It's okay if socket is null (e.g., before login), so no error throwing needed
  return context;
};