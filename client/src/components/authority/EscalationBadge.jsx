import React from "react";

const EscalationBadge = ({ level, showIcon = true, size = "medium", onClick }) => {
    
    // Configuration for different priority levels
    const badgeConfig = {
        high: {
            classes: "bg-red-50 text-red-700 border-red-200 border-l-4 border-l-red-600",
            text: "High Priority",
            icon: "🚨"
        },
        medium: {
            classes: "bg-amber-50 text-amber-700 border-amber-200 border-l-4 border-l-amber-500",
            text: "Medium Priority",
            icon: "⚠️"
        },
        low: {
            classes: "bg-emerald-50 text-emerald-700 border-emerald-200 border-l-4 border-l-emerald-500",
            text: "Low Priority",
            icon: "ℹ️"
        },
        critical: {
            classes: "bg-purple-50 text-purple-800 border-purple-200 border-l-4 border-l-purple-600",
            text: "Critical",
            icon: "🚩"
        }
    };

    // Size classes configuration
    const sizeClasses = {
        small: "px-2 py-0.5 text-[10px]",
        medium: "px-2.5 py-1 text-xs",
        large: "px-3 py-1.5 text-sm"
    };

    // Fallback to 'low' if level is invalid
    const config = badgeConfig[level?.toLowerCase()] || badgeConfig.low;
    const sizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 rounded font-semibold border transition-all duration-200
                ${config.classes} 
                ${sizeClass}
                ${onClick ? "cursor-pointer hover:translate-y-[-1px] hover:shadow-sm" : "cursor-default"}
            `}
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick(level);
                }
            }}
            title={`Priority Level: ${config.text}`}
        >
            {showIcon && <span>{config.icon}</span>}
            <span>{config.text}</span>
            
            {/* Pulsing effect for Critical level */}
            {level === "critical" && (
                <span className="ml-1 animate-pulse text-purple-600">⚡</span>
            )}
        </span>
    );
};

export default EscalationBadge;