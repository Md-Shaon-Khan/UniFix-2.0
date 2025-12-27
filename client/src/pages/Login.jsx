import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield, User, GraduationCap, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // Real Auth Hook

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // Get login function from context

    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role") || "student";
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [activeTab, setActiveTab] = useState(roleParam);
    const [formValidations, setFormValidations] = useState({
        emailValid: false,
        passwordValid: false
    });

    // Switch tab when role changes in URL
    useEffect(() => {
        setActiveTab(roleParam);
    }, [roleParam]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Real-time validation
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setFormValidations(prev => ({ ...prev, emailValid: emailRegex.test(value) }));
        }
        if (name === 'password') {
            setFormValidations(prev => ({ ...prev, passwordValid: value.length >= 6 }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        
        if (!formData.email || !formData.password) {
            setLoginError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            // REAL API CALL
            const user = await login(formData.email, formData.password, activeTab);
            
            // Redirect based on role
            if (user.role === 'authority' || user.role === 'admin') {
                navigate('/authority-dashboard');
            } else {
                navigate('/student-dashboard');
            }

        } catch (error) {
            console.error("Login failed:", error);
            setLoginError(error.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRoleSwitch = (newRole) => {
        setActiveTab(newRole);
        setLoginError("");
        navigate(`/login?role=${newRole}`, { replace: true });
    };

    // Role-specific features for UI
    const roleFeatures = {
        student: {
            icon: <User className="w-6 h-6" />,
            title: "Student Portal",
            description: "Track complaints, vote on issues, and get timely resolutions",
            features: [
                "Submit complaints anonymously",
                "Real-time status tracking",
                "Vote on important campus issues",
                "Direct messaging with authorities"
            ]
        },
        authority: {
            icon: <Shield className="w-6 h-6" />,
            title: "Authority Dashboard",
            description: "Manage complaints, monitor SLAs, and ensure campus welfare",
            features: [
                "AI-powered complaint categorization",
                "SLA monitoring & escalation",
                "Advanced analytics dashboard",
                "Team collaboration tools"
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
                {/* Left Panel - Brand & Information */}
                <motion.div 
                    className="lg:w-2/5"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-gradient-to-br from-blue-700 to-emerald-600 rounded-3xl p-8 h-full text-white shadow-2xl">
                        <div className="mb-8">
                                <Link to="/" className="inline-flex items-center gap-3 text-white hover:text-blue-100 transition-colors">
                                <GraduationCap className="w-8 h-8" />
                                <span className="text-2xl font-bold">UniFix</span>
                            </Link>
                            <p className="text-blue-100 mt-2">University Complaint Management System</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    {roleFeatures[activeTab].icon}
                                </div>
                                <h2 className="text-2xl font-bold">{roleFeatures[activeTab].title}</h2>
                            </div>
                            <p className="text-blue-100 mb-6">{roleFeatures[activeTab].description}</p>
                            
                            <ul className="space-y-3">
                                {roleFeatures[activeTab].features.map((feature, index) => (
                                    <motion.li 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 text-blue-100"
                                    >
                                        <CheckCircle className="w-5 h-5 text-emerald-300" />
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm text-blue-200">Support</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">99%</div>
                                <div className="text-sm text-blue-200">Satisfaction</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">Fast</div>
                                <div className="text-sm text-blue-200">Resolution</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel - Login Form */}
                <motion.div 
                    className="lg:w-3/5"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white rounded-3xl p-8 shadow-2xl">
                        {/* Role Selection Tabs */}
                        <div className="flex mb-8">
                            <button
                                onClick={() => handleRoleSwitch("student")}
                                className={`flex-1 py-4 px-6 rounded-tl-2xl rounded-bl-2xl text-center font-semibold transition-all duration-300 ${
                                    activeTab === "student" 
                                    ? "bg-blue-600 text-white shadow-lg" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <User className="w-5 h-5" />
                                    Student Login
                                </div>
                            </button>
                            <button
                                onClick={() => handleRoleSwitch("authority")}
                                className={`flex-1 py-4 px-6 rounded-tr-2xl rounded-br-2xl text-center font-semibold transition-all duration-300 ${
                                    activeTab === "authority" 
                                    ? "bg-emerald-600 text-white shadow-lg" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Authority Login
                                </div>
                            </button>
                        </div>

                        {/* Form Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600">
                                Sign in to access your {activeTab === "student" ? "student portal" : "authority dashboard"}
                            </p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {loginError && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-700">{loginError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="user@university.edu"
                                        className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            formData.email ? 
                                            (formValidations.emailValid 
                                                ? "border-green-500 focus:ring-green-500/30" 
                                                : "border-red-500 focus:ring-red-500/30") 
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30"
                                        }`}
                                        disabled={isLoading}
                                    />
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    {formData.email && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            {formValidations.emailValid ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className={`w-full p-4 pl-12 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            formData.password ? 
                                            (formValidations.passwordValid 
                                                ? "border-green-500 focus:ring-green-500/30" 
                                                : "border-red-500 focus:ring-red-500/30") 
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30"
                                        }`}
                                        disabled={isLoading}
                                    />
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                                    isLoading 
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : activeTab === "student"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Sign In as {activeTab === "student" ? "Student" : "Authority"}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                First time here?{" "}
                                <Link 
                                    to="/signup" 
                                    className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;