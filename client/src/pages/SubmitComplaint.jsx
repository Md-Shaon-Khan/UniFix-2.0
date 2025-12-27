import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, MapPin, Send, Loader2, CheckCircle, 
  AlertTriangle, ArrowLeft, ArrowRight, Shield 
} from "lucide-react";
import { complaintAPI } from "../services/api"; // Real API
import CategorySelector from "../components/complaints/CategorySelector";
import SimilarComplaintsList from "../components/complaints/SimilarComplaintsList";

const SubmitComplaint = () => {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        priority: "medium",
        isAnonymous: false,
        location: ""
    });

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");

    // Step Navigation
    const nextStep = () => {
        if (step === 1 && (!formData.title || !formData.category)) {
            setError("Title and Category are required.");
            return;
        }
        if (step === 2 && !formData.description) {
            setError("Description is required.");
            return;
        }
        setError("");
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Real API Call
            await complaintAPI.create(formData);
            
            // Show Success UI
            setSubmitSuccess(true);
            setTimeout(() => {
                navigate('/student-dashboard');
            }, 3000); // Redirect after 3 seconds

        } catch (err) {
            console.error("Submission error:", err);
            setError("Failed to submit complaint. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Render Success Screen
    if (submitSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Your report has been successfully logged. You will be redirected to your dashboard shortly.
                    </p>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                            className="h-full bg-green-500"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">New Complaint</h1>
                        <p className="text-gray-500 text-sm">Step {step} of 3</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8">
                            <AnimatePresence mode="wait">
                                
                                {/* Step 1: Basics */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                placeholder="e.g. Broken projector in Room 302"
                                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <CategorySelector 
                                                category={formData.category}
                                                setCategory={(cat) => setFormData({...formData, category: cat})}
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                                <AlertTriangle size={16} /> {error}
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                Next <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Details */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                placeholder="Describe the issue in detail..."
                                                className="w-full p-4 h-40 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                    placeholder="Building, Floor, Room No."
                                                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer" onClick={() => setFormData(prev => ({...prev, isAnonymous: !prev.isAnonymous}))}>
                                                <div className="flex items-center gap-3">
                                                    <Shield className={`w-6 h-6 ${formData.isAnonymous ? 'text-blue-600' : 'text-gray-400'}`} />
                                                    <div>
                                                        <div className="font-semibold text-gray-800">Post Anonymously</div>
                                                        <div className="text-xs text-gray-500">Hide my identity from other students</div>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isAnonymous ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                                    {formData.isAnonymous && <CheckCircle size={16} className="text-white" />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                Review <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Review */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <h3 className="text-xl font-bold text-gray-800 mb-6">Review & Submit</h3>
                                        
                                        <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-8">
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="text-gray-500">Title</span>
                                                <span className="font-medium text-gray-900">{formData.title}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="text-gray-500">Category</span>
                                                <span className="font-medium text-gray-900 capitalize">{formData.category}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                                <span className="text-gray-500">Location</span>
                                                <span className="font-medium text-gray-900">{formData.location || "N/A"}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block mb-1">Description</span>
                                                <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                                                    {formData.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Right Column - Similar Complaints (Real Check) */}
                    <div>
                        <SimilarComplaintsList 
                            currentTitle={formData.title} 
                            currentCategory={formData.category} 
                        />
                        
                        <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex gap-3 mb-2">
                                <FileText className="text-blue-600" />
                                <h4 className="font-bold text-blue-900">Submission Tips</h4>
                            </div>
                            <ul className="text-sm text-blue-800 space-y-2 list-disc pl-5">
                                <li>Be specific about the location.</li>
                                <li>Provide clear evidence if possible.</li>
                                <li>Check if a similar issue already exists.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SubmitComplaint;