import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, Shield, Clock, BarChart3, 
  FileText, Users, CheckCircle, ArrowRight 
} from "lucide-react";

const HomePage = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/login?role=${role}`);
    };

    const features = [
        { 
            icon: <FileText className="w-6 h-6 text-blue-600" />, 
            title: "Centralized Reporting", 
            desc: "A single portal for all campus-related grievances and maintenance requests." 
        },
        { 
            icon: <Shield className="w-6 h-6 text-emerald-600" />, 
            title: "Secure & Anonymous", 
            desc: "Option to submit sensitive complaints without revealing identity." 
        },
        { 
            icon: <Clock className="w-6 h-6 text-amber-600" />, 
            title: "Real-time Tracking", 
            desc: "Track the status of your complaint from submission to resolution." 
        },
        { 
            icon: <BarChart3 className="w-6 h-6 text-purple-600" />, 
            title: "Data-Driven Insights", 
            desc: "Comprehensive analytics for authorities to identify recurring issues." 
        },
        { 
            icon: <Users className="w-6 h-6 text-indigo-600" />, 
            title: "Role-Based Access", 
            desc: "Dedicated dashboards for Students, Authorities, and Administrators." 
        },
        { 
            icon: <CheckCircle className="w-6 h-6 text-cyan-600" />, 
            title: "SLA Monitoring", 
            desc: "Automated tracking of resolution deadlines and escalation protocols." 
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-800 p-1.5 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">UniFix</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">About</button>
                            <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">Contact</button>
                            <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">Help</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-white pt-16 pb-24 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            University Complaint <br />
                            <span className="text-blue-700">Management System</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Streamlining communication between students and administration for a better campus experience.
                        </p>
                    </motion.div>

                    {/* Role Selection */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <motion.button
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRoleSelect('student')}
                            className="group p-8 bg-white border-2 border-blue-100 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all text-left"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                                    <Users className="w-8 h-8 text-blue-600 group-hover:text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Student Portal</h3>
                            <p className="text-gray-500 text-sm">Submit complaints, track status, and view campus updates.</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRoleSelect('authority')}
                            className="group p-8 bg-white border-2 border-emerald-100 rounded-2xl hover:border-emerald-600 hover:shadow-lg transition-all text-left"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 transition-colors">
                                    <Shield className="w-8 h-8 text-emerald-600 group-hover:text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Authority Login</h3>
                            <p className="text-gray-500 text-sm">Manage reports, assign tasks, and monitor resolution.</p>
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Key System Features</h2>
                        <p className="text-gray-600 mt-2">Designed for efficiency and transparency</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} UniFix Complaint Management System. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600">Terms of Use</a>
                        <a href="#" className="hover:text-gray-600">Administrative Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;