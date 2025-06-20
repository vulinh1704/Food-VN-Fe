import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './UserNotificationPanel.css';

const NotificationItem = ({ notification, onClose, onClick }) => {
    const isConfirmed = notification.type === 'CONFIRMED';
    
    return (
        <div 
            className={`notification-item ${isConfirmed ? 'new-order' : 'cancel-order'}`}
            onClick={onClick}
        >
            <div className="notification-icon">
                {isConfirmed ? (
                    <FaCheckCircle size={24} className="text-green-500" />
                ) : (
                    <MdOutlineCancel size={24} className="text-red-500" />
                )}
            </div>
            <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                {notification.type === 'CANCEL_BY_ADMIN' && notification.orders?.cancellationReason && (
                    <p className="notification-reason">
                        Reason: {notification.orders.cancellationReason}
                    </p>
                )}
                <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
            <button 
                className="notification-close"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <IoClose size={18} />
            </button>
        </div>
    );
};

const UserNotificationPanel = ({ notifications, onNotificationClick, onNotificationClose }) => {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Notifications ({notifications.length})</h3>
            </div>
            <div className="notification-list">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => onNotificationClick(notification)}
                        onClose={() => onNotificationClose(notification)}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserNotificationPanel; 