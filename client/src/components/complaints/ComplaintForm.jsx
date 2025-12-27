import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, AlertCircle, MapPin, Send, Loader2, 
  Shield, Check, ArrowRight, ArrowLeft
} from "lucide-react";
import { complaintAPI } from "../../services/api"; // Real API

const ComplaintForm = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        subCategory: "",
        description: "",
        priority: "medium",
        isAnonymous: false,
        location: "", // Simplified to string for now
        tags: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");

    // Categories
    const categories = [
        { id: "Academic", name: "Academic", icon: "📚", subCategories: ["Faculty", "Exams", "Library"] },
        { id: "Infrastructure", name: "Infrastructure", icon: "🏢", subCategories: ["Classroom", "Furniture", "Electricity"] },
        { id: "Hostel", name: "Hostel", icon: "🏠", subCategories: ["Room", "Mess", "Cleaning"] },
        { id: "Food", name: "Food & Canteen", icon: "🍔", subCategories: ["Hygiene", "Quality", "Price"] },
        { id: "Safety", name: "Safety", icon: "🛡️", subCategories: ["Harassment", "Theft", "Emergency"] },
        { id: "Other", name: "Other", icon: "📋", subCategories: ["General", "Admin", "Transport"] }
    ];

    const priorities = [
        { value: "low", label: "Low", color: "bg-gray-100" },
        { value: "medium", label: "Medium", color: "bg-blue-100" },
        { value: "high", label: "High", color: "bg-orange-100" },
        { value: "critical", label: "Critical", color: "bg-red-100" }
    ];

    // Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Send to Real Backend
            await complaintAPI.create(formData);
            
            // Redirect on success
            navigate('/student-dashboard');
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to submit complaint. Please try again.");
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.title || !formData.category)) {
            setError("Please fill in all required fields");
            return;
        }
        setError("");
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const selectedCategory = categories.find(c => c.id === formData.category);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Basic Info</span>
                    <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Details</span>
                    <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>Review</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">What's the issue?</h2>
                            
                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="e.g., Broken AC in Library"
                                    maxLength={100}
                                />
                            </div>

                            {/* Category Grid */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, category: cat.id, subCategory: ''})}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                formData.category === cat.id 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-2xl block mb-1">{cat.icon}</span>
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sub-Category (Conditional) */}
                            {selectedCategory && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategory.subCategories.map(sub => (
                                            <button
                                                key={sub}
                                                type="button"
                                                onClick={() => setFormData({...formData, subCategory: sub})}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                    formData.subCategory === sub
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Details & Location</h2>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-xl h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe the issue in detail..."
                                />
                            </div>

                            {/* Location */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Room 304, Block B"
                                    />
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {priorities.map(p => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setFormData({...formData, priority: p.value})}
                                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                                                formData.priority === p.value
                                                ? `ring-2 ring-offset-1 ring-blue-500 ${p.color}`
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Anonymous Toggle */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">Post Anonymously</p>
                                        <p className="text-xs text-gray-500">Hide your identity from others</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleInputChange}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 flex items-center gap-2"
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Review <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REVIEW */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Complaint</h2>

                            <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-8">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Title</span>
                                    <span className="font-medium text-gray-900">{formData.title}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Category</span>
                                    <span className="font-medium text-gray-900">{formData.category} {formData.subCategory ? `(${formData.subCategory})` : ''}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Priority</span>
                                    <span className="uppercase font-bold text-blue-600">{formData.priority}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Description</span>
                                    <p className="text-gray-800 text-sm bg-white p-3 rounded-lg border border-gray-200">
                                        {formData.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                                >
                                    Edit Details
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};

export default ComplaintForm;