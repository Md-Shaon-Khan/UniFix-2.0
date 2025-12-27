import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Real Auth Hook
import { 
  User, Mail, Lock, Shield, GraduationCap, 
  ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Use the real register function
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '' // Optional but useful
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Real Register API
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department
      });

      // 2. Redirect based on role
      if (user.role === 'authority') {
        navigate('/authority-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create account. Email might be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Visuals */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 text-white mb-8">
              <GraduationCap className="w-8 h-8" />
              <span className="text-2xl font-bold">UniFix</span>
            </Link>
            <h2 className="text-4xl font-bold mb-4">Join our Community</h2>
            <p className="text-blue-100 text-lg">
              Create an account to submit complaints, track progress, and improve our university environment.
            </p>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <span>© 2025 UniFix</span>
              <span>•</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8 lg:hidden">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          </div>
          
          <h2 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
          <p className="hidden lg:block text-gray-500 mb-8">It only takes a minute to set up your account.</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  formData.role === 'student' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'authority' }))}
                className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  formData.role === 'authority' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Authority
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Department (Optional) */}
            {formData.role === 'authority' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : formData.role === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;