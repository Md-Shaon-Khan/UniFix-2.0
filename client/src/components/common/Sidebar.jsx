import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Real Auth Hook
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  BarChart2, 
  Shield, 
  User, 
  Settings, 
  LogOut,
  X 
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Define menus for different roles
    const menus = {
        student: [
            { path: "/student-dashboard", label: "Dashboard", icon: LayoutDashboard },
            { path: "/submit-complaint", label: "New Complaint", icon: PlusCircle },
            { path: "/my-complaints", label: "My History", icon: FileText },
            { path: "/profile", label: "My Profile", icon: User },
        ],
        authority: [
            { path: "/authority-dashboard", label: "Overview", icon: LayoutDashboard },
            { path: "/manage-complaints", label: "Complaints", icon: FileText },
            { path: "/analytics", label: "Analytics", icon: BarChart2 },
            { path: "/reports", label: "Reports", icon: Shield },
        ],
        admin: [
            { path: "/authority-dashboard", label: "Dashboard", icon: LayoutDashboard },
            { path: "/users", label: "User Management", icon: User },
            { path: "/settings", label: "System Settings", icon: Settings },
        ]
    };

    // Select menu based on role (default to student if unknown)
    const currentMenu = menus[user?.role] || menus.student;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)]
            `}>
                {/* Mobile Header (Close Button) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
                    <span className="font-bold text-lg text-gray-900">Menu</span>
                    <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">
                        Main Menu
                    </div>
                    
                    {currentMenu.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
                                ${isActive 
                                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="border-t border-gray-100 my-4 pt-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                            Account
                        </div>
                        <NavLink
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            <Settings size={18} />
                            Settings
                        </NavLink>
                    </div>
                </nav>

                {/* Footer / User Profile */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.name || "Guest User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate capitalize">
                                {user?.role || "Student"} Account
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;