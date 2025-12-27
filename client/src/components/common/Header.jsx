import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Real Auth Hook
import NotificationBell from "./NotificationBell";
import { 
  GraduationCap, 
  Settings, 
  HelpCircle, 
  LogOut, 
  User, 
  ChevronDown, 
  Menu
} from "lucide-react";

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth(); // Get Real User
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    
                    {/* Left Side: Logo & Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle (Visible only on small screens) */}
                        <button 
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-xl font-bold text-gray-900 leading-none">UniFix</h1>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Complaint System
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Side: Actions & Profile */}
                    <div className="flex items-center gap-2 md:gap-4">
                        
                        {/* Date Display (Hidden on mobile) */}
                        <div className="hidden md:block text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </div>

                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {/* Notification Bell */}
                        <NotificationBell />

                        {/* Quick Actions (Desktop) */}
                        <div className="hidden md:flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Settings">
                                <Settings size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="Help Center">
                                <HelpCircle size={20} />
                            </button>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                                    {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900 leading-none">
                                        {user?.name?.split(' ')[0] || 'Guest'}
                                    </p>
                                    <p className="text-[10px] font-medium text-gray-500 capitalize leading-none mt-1">
                                        {user?.role || 'Visitor'}
                                    </p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                    
                                    <div className="py-1">
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                                            <User size={16} />
                                            My Profile
                                        </Link>
                                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                    </div>
                                    
                                    <div className="border-t border-gray-100 my-1"></div>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;