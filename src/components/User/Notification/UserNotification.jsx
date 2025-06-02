import React, { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { markNotificationAsRead } from '../../../services/notification-service/notification-service';
import './UserNotification.css';

// Hằng số cho thời gian hiển thị và số lượng tối đa
const DISPLAY_DURATION = 120000; // 2 phút
const MAX_TOASTS = 5;

// Custom styles cho toast
const toastStyles = {
    CONFIRMED: {
        icon: <FaCheckCircle size={24} className="text-green-500" />,
        className: "bg-green-50 border-l-4 border-green-500",
        titleClass: "text-green-700",
        contentClass: "text-green-600",
        duration: DISPLAY_DURATION,
        showCloseButton: true,
        progressBarColor: "rgb(134 239 172)" // green-300
    },
    CANCEL_BY_ADMIN: {
        icon: <MdOutlineCancel size={24} className="text-red-500" />,
        className: "bg-red-50 border-l-4 border-red-500",
        titleClass: "text-red-700",
        contentClass: "text-red-600",
        duration: DISPLAY_DURATION,
        showCloseButton: true,
        progressBarColor: "rgb(252 165 165)" // red-300
    }
};

const UserNotification = ({ userId }) => {
    const activeToasts = useRef(new Set());
    const navigate = useNavigate();

    const removeToast = (id) => {
        activeToasts.current.delete(id);
    };

    const navigateToOrder = async (orderId) => {
        try {
            navigate('/user/orders', { 
                state: { 
                    targetOrderId: orderId 
                } 
            });
        } catch (error) {
            console.error('Error navigating to order:', error);
            navigate('/user/orders');
        }
    };

    useWebSocket((notification) => {
        console.log('Notification received in UserNotification:', notification);
        
        if (!userId) return; // Chỉ xử lý khi có userId (đã đăng nhập)
        
        const message = notification.message;
        const type = notification.type;
        const orderId = notification.orders?.id;
        const notificationId = notification.id;
        
        if (!type || !['CONFIRMED', 'CANCEL_BY_ADMIN'].includes(type)) return;

        if (activeToasts.current.size >= MAX_TOASTS) {
            const oldestToast = Array.from(activeToasts.current)[0];
            toast.dismiss(oldestToast);
            activeToasts.current.delete(oldestToast);
        }

        const style = toastStyles[type];

        const toastId = toast(
            <div 
                className="flex w-full min-h-[48px] relative pr-2 cursor-pointer"
                onClick={async () => {
                    if (orderId) {
                        if (notificationId) {
                            try {
                                await markNotificationAsRead(notificationId);
                            } catch (error) {
                                console.error('Error marking notification as read:', error);
                            }
                        }
                        navigateToOrder(orderId);
                        toast.dismiss(toastId);
                    }
                }}
            >
                <div className="flex-shrink-0 mr-3 self-center">
                    {style.icon}
                </div>
                <div className="flex-grow py-1">
                    <p className={`font-medium ${style.titleClass}`}>
                        {message}
                    </p>
                    {type === 'CANCEL_BY_ADMIN' && notification.orders?.cancellationReason && (
                        <p className={`text-sm mt-1 ${style.contentClass}`}>
                            Lý do: {notification.orders.cancellationReason}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                </div>
                {style.showCloseButton && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (notificationId) {
                                try {
                                    markNotificationAsRead(notificationId);
                                } catch (error) {
                                    console.error('Error marking notification as read:', error);
                                }
                            }
                            toast.dismiss(toastId);
                        }}
                        className="absolute top-0 right-0 p-1.5 hover:bg-gray-200 transition-colors rounded-full"
                    >
                        <IoClose size={18} className="text-gray-500" />
                    </button>
                )}
            </div>,
            {
                position: "bottom-right",
                autoClose: style.duration,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                className: `${style.className} shadow-lg rounded-lg p-4 custom-toast`,
                progressClassName: `progress-bar-custom`,
                progressStyle: { background: style.progressBarColor },
                bodyClassName: "p-0 m-0",
                onClose: () => {
                    if (notificationId) {
                        try {
                            markNotificationAsRead(notificationId);
                        } catch (error) {
                            console.error('Error marking notification as read:', error);
                        }
                    }
                    removeToast(toastId);
                },
                closeButton: false,
                icon: false
            }
        );

        activeToasts.current.add(toastId);
    }, `/topic/notifications/${userId}`);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={DISPLAY_DURATION}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="light"
            limit={MAX_TOASTS}
            style={{
                minWidth: '400px',
                '--toastify-toast-width': '400px'
            }}
        />
    );
};

export default UserNotification; 