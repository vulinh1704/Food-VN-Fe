import React from 'react';
import ReactDOM from 'react-dom';

export const CancelOrderModal = ({ isOpen, onClose, onConfirm, cancelReason, setCancelReason }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black/30" style={{ zIndex: 99999 }}></div>
            <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
                <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                    <h2 className="text-xl font-semibold mb-4">Cancel Order Reason</h2>
                    <textarea
                        className="w-full h-32 p-2 border rounded-lg mb-4 resize-none focus:border-[#fecb02] outline-none"
                        placeholder="Enter reason for cancelling order..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            onClick={onConfirm}
                        >
                            Confirm Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}; 