import React, { useEffect, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../../hooks/useWebSocket';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getInvoiceByAdmin } from '../../services/invoice-service/invoice-service';
import { markNotificationAsRead } from '../../services/notification-service/notification-service';
import './AdminNotification.css';

// Hằng số cho thời gian hiển thị và số lượng tối đa
const DISPLAY_DURATION = 60000; // 2 phút cho NEW_ORDER
const CANCEL_DURATION = 10000;   // 10 giây cho CANCEL_BY_USER
const MAX_TOASTS = 5;

// Custom styles cho toast
const toastStyles = {
    NEW_ORDER: {
        icon: <IoFastFoodOutline size={24} className="text-green-500" />,
        className: "bg-green-50 border-l-4 border-green-500",
        titleClass: "text-green-700",
        contentClass: "text-green-600",
        duration: DISPLAY_DURATION,
        showCloseButton: true,
        progressBarColor: "rgb(134 239 172)" // green-300
    },
    CANCEL_BY_USER: {
        icon: <MdOutlineCancel size={24} className="text-red-500" />,
        className: "bg-red-50 border-l-4 border-red-500",
        titleClass: "text-red-700",
        contentClass: "text-red-600",
        duration: CANCEL_DURATION,
        showCloseButton: false,
        progressBarColor: "rgb(252 165 165)" // red-300
    }
};

const AdminNotification = () => {
    const activeToasts = useRef(new Set());
    const navigate = useNavigate();
    const processedNotifications = useRef(new Set());
    const isRemovingToast = useRef(false);

    const removeToast = useCallback((id) => {
        console.log('removeToast called with id:', id);
        if (isRemovingToast.current || !activeToasts.current.has(id)) {
            console.log('removeToast skipped - isRemoving:', isRemovingToast.current, 'hasToast:', activeToasts.current.has(id));
            return;
        }

        try {
            isRemovingToast.current = true;
            console.log('removing toast from activeToasts:', id);
            activeToasts.current.delete(id);
            console.log('calling toast.dismiss with id:', id);
            toast.dismiss(id);
        } finally {
            isRemovingToast.current = false;
        }
    }, []);

    const findOrderAndNavigate = useCallback(async (orderId) => {
        try {
            navigate('/admin/invoices', { 
                state: { 
                    targetOrderId: orderId 
                } 
            });
        } catch (error) {
            console.error('Error navigating to order:', error);
            navigate('/admin/invoices');
        }
    }, [navigate]);

    const handleMarkAsRead = useCallback(async (notificationId) => {
        if (!notificationId || processedNotifications.current.has(notificationId)) {
            return;
        }

        try {
            processedNotifications.current.add(notificationId);
            await markNotificationAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            processedNotifications.current.delete(notificationId);
        }
    }, []);

    const handleNotification = useCallback((notification) => {
        console.log('Notification received:', notification);
        
        const message = notification.message;
        const type = notification.type || 'NEW_ORDER';
        const orderId = notification.orders?.id;
        const notificationId = notification.id;
        
        while (activeToasts.current.size >= MAX_TOASTS) {
            const oldestToast = Array.from(activeToasts.current)[0];
            if (oldestToast) {
                console.log('Removing oldest toast:', oldestToast);
                removeToast(oldestToast);
            }
        }

        const style = toastStyles[type] || toastStyles.NEW_ORDER;

        const toastId = toast(
            <div 
                className="flex w-full min-h-[48px] relative pr-2 cursor-pointer"
                onClick={async (e) => {
                    console.log('Toast clicked:', toastId);
                    e.stopPropagation();
                    if (orderId) {
                        if (notificationId) {
                            await handleMarkAsRead(notificationId);
                        }
                        findOrderAndNavigate(orderId);
                        console.log('Removing toast after navigation:', toastId);
                        toast.dismiss(toastId);
                        activeToasts.current.delete(toastId);
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
                    {notification.orders?.status === 0 && notification.orders?.cancellationReason && (
                        <p className={`text-sm mt-1 ${style.contentClass}`}>
                            Reason: {notification.orders.cancellationReason}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>
                </div>
                {style.showCloseButton && (
                    <button 
                        onClick={(e) => {
                            console.log('Close button clicked for toast:', toastId);
                            e.stopPropagation();
                            e.preventDefault();
                            if (notificationId) {
                                handleMarkAsRead(notificationId);
                            }
                            console.log('Removing toast from close button:', toastId);
                            toast.dismiss(toastId);
                            activeToasts.current.delete(toastId);
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
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                className: `${style.className} shadow-lg rounded-lg p-4 custom-toast`,
                progressClassName: `progress-bar-custom`,
                progressStyle: { background: style.progressBarColor },
                bodyClassName: "p-0 m-0",
                onClose: () => {
                    console.log('onClose called for toast:', toastId);
                    if (!isRemovingToast.current) {
                        if (notificationId) {
                            handleMarkAsRead(notificationId);
                        }
                        console.log('Removing toast from onClose:', toastId);
                        activeToasts.current.delete(toastId);
                    }
                },
                closeButton: false,
                icon: false
            }
        );
        
        console.log('Adding new toast to activeToasts:', toastId);
        activeToasts.current.add(toastId);
    }, [removeToast, handleMarkAsRead, findOrderAndNavigate]);

    useWebSocket(handleNotification);

    useEffect(() => {
        return () => {
            isRemovingToast.current = true;
            Array.from(activeToasts.current).forEach(id => {
                toast.dismiss(id);
            });
            activeToasts.current.clear();
            processedNotifications.current.clear();
            isRemovingToast.current = false;
        };
    }, []);

    return (
        <ToastContainer
            position="bottom-right"
            autoClose={DISPLAY_DURATION}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="light"
            limit={MAX_TOASTS}
            style={{
                minWidth: '500px',
                '--toastify-toast-width': '500px'
            }}
        />
    );
};

export default AdminNotification; 