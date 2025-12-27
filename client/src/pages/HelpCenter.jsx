import React, { useState } from "react";
import { 
  Search, ChevronDown, ChevronUp, Mail, 
  MessageCircle, Phone, FileText, HelpCircle 
} from "lucide-react";

const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            id: 1,
            question: "How do I submit an anonymous complaint?",
            answer: "When filling out the complaint form, simply toggle the 'Post Anonymously' switch. Your name and ID will be hidden from the public dashboard and only visible to high-level administrators for verification purposes."
        },
        {
            id: 2,
            question: "How long does it take to resolve an issue?",
            answer: "It depends on the priority. High priority issues (e.g., electricity, water) are usually addressed within 24 hours. General maintenance requests may take up to 3-5 working days."
        },
        {
            id: 3,
            question: "Can I edit my complaint after submission?",
            answer: "No, to preserve the integrity of the voting system, you cannot edit a complaint once submitted. However, you can add 'Follow-up' comments to provide more details."
        },
        {
            id: 4,
            question: "What happens if my complaint is rejected?",
            answer: "If a complaint is rejected, the authority will provide a reason (e.g., duplicate issue, lack of information). You can view this reason in the complaint details page."
        }
    ];

    const filteredFaqs = faqs.filter(f => 
        f.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 lg:ml-64">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer text-center group">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">User Guide</h3>
                        <p className="text-sm text-gray-500">Learn how to use the UniFix platform effectively.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors cursor-pointer text-center group">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500">Chat with support administration (Available 9am-5pm).</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 transition-colors cursor-pointer text-center group">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Emergency</h3>
                        <p className="text-sm text-gray-500">Urgent campus security or medical assistance.</p>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-600" />
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredFaqs.map((faq) => (
                            <div key={faq.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex justify-between items-center text-left"
                                >
                                    <span className="font-medium text-gray-800">{faq.question}</span>
                                    {openFaq === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {openFaq === faq.id && (
                                    <div className="mt-3 text-gray-600 text-sm leading-relaxed pl-2 border-l-2 border-blue-500">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Still need help?</p>
                    <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        <Mail size={18} />
                        Contact Support Team
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;