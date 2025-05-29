import React from "react";

export const NotificationType = {
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
};

function Icon({ type }) {
    const icons = {
        success: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        warning: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V7zm-.75 10a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
        ),
        error: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm-1-11h2v5h-2zm0 6h2v2h-2z" />
            </svg>
        ),
    };

    return icons[type];
}

const styleMap = {
    success: "border-green-500 bg-green-50 text-green-700",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
    error: "border-red-500 bg-red-50 text-red-700",
};

export function Notification({ type, message }) {
    return (
        <div
            className={`flex items-center gap-3 border-l-4 px-4 py-3 rounded-md shadow-sm ${styleMap[type]} animate-fade-in-down`}
        >
            <div>
                <Icon type={type} />
            </div>
            <div className="text-sm font-medium leading-tight">{message}</div>
        </div>
    );
}

// Add keyframes for fade in down animation
const style = document.createElement('style');
style.textContent = `
@keyframes fade-in-down {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-down {
    animation: fade-in-down 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
