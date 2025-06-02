import React from 'react';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './CustomNotificationPanel.css';

const NotificationItem = ({ notification, onClose, onClick }) => {
    const isNewOrder = notification.type === 'NEW_ORDER';
    
    return (
        <div 
            className={`notification-item ${isNewOrder ? 'new-order' : 'cancel-order'}`}
            onClick={onClick}
        >
            <div className="notification-icon">
                {isNewOrder ? (
                    <IoFastFoodOutline size={24} className="text-green-500" />
                ) : (
                    <MdOutlineCancel size={24} className="text-red-500" />
                )}
            </div>
            <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                {notification.orders?.status === 0 && notification.orders?.cancellationReason && (
                    <p className="notification-reason">
                        Lý do: {notification.orders.cancellationReason}
                    </p>
                )}
                <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
            {isNewOrder && (
                <button 
                    className="notification-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <IoClose size={18} />
                </button>
            )}
        </div>
    );
};

const CustomNotificationPanel = ({ notifications, onNotificationClick, onNotificationClose }) => {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Thông báo ({notifications.length})</h3>
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

export default CustomNotificationPanel; 