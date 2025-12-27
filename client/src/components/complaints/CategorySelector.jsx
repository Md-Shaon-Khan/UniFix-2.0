import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, Search, X, 
  Wifi, Home, BookOpen, PenTool, Shield, Briefcase
} from "lucide-react";

const CategorySelector = ({ 
    category, 
    setCategory,
    isRequired = true,
    onCategorySelect = () => {}
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Enhanced categories (Static list, but comprehensive)
    const categories = [
        {
            id: "technology",
            name: "Technology",
            icon: <Wifi />,
            color: "bg-purple-100 text-purple-700",
            description: "Wi-Fi, Internet, Lab PCs, Software issues"
        },
        {
            id: "hostel",
            name: "Hostel",
            icon: <Home />,
            color: "bg-green-100 text-green-700",
            description: "Room maintenance, Cleaning, Water supply"
        },
        {
            id: "academic",
            name: "Academic",
            icon: <BookOpen />,
            color: "bg-blue-100 text-blue-700",
            description: "Faculty, Exams, Library, Course materials"
        },
        {
            id: "facilities",
            name: "Facilities",
            icon: <PenTool />,
            color: "bg-amber-100 text-amber-700",
            description: "Classroom furniture, AC/Fans, Electricity"
        },
        {
            id: "safety",
            name: "Safety & Security",
            icon: <Shield />,
            color: "bg-red-100 text-red-700",
            description: "Harassment, Theft, Emergency, Guards"
        },
        {
            id: "administrative",
            name: "Administrative",
            icon: <Briefcase />,
            color: "bg-gray-100 text-gray-700",
            description: "Fees, ID Cards, Documents, Permissions"
        }
    ];

    const selectedCategory = categories.find(cat => cat.id === category);

    // Filter logic
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (catId) => {
        setCategory(catId);
        setIsOpen(false);
        onCategorySelect(catId);
    };

    return (
        <div className="space-y-2 relative">
            <label className="block text-sm font-semibold text-gray-700">
                Category
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Main Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full p-3 border rounded-xl text-left transition-all flex items-center justify-between
                    ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}
                    ${category ? 'bg-white' : 'bg-gray-50'}
                `}
            >
                {selectedCategory ? (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedCategory.color}`}>
                            {React.cloneElement(selectedCategory.icon, { size: 18 })}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{selectedCategory.name}</div>
                            <div className="text-xs text-gray-500">{selectedCategory.description}</div>
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-500">Select a category...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        {/* Search Bar */}
                        <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-0"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelect(cat.id)}
                                        className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 ${
                                            category === cat.id ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${cat.color}`}>
                                            {React.cloneElement(cat.icon, { size: 18 })}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{cat.name}</div>
                                            <div className="text-xs text-gray-500">{cat.description}</div>
                                        </div>
                                        {category === cat.id && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No categories found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CategorySelector;