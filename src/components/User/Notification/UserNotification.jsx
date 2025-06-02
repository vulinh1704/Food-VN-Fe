import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useNavigate, useLocation } from 'react-router-dom';
import { markNotificationAsRead } from '../../../services/notification-service/notification-service';
import UserNotificationPanel from './UserNotificationPanel';

// Constants for display duration and maximum notifications
const DISPLAY_DURATION = 120000; // 2 minutes
const MAX_NOTIFICATIONS = 5;

const UserNotification = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const processedNotifications = useRef(new Set());
    const navigate = useNavigate();
    const location = useLocation();
    const timeoutRefs = useRef({});

    const removeNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (timeoutRefs.current[notificationId]) {
            clearTimeout(timeoutRefs.current[notificationId]);
            delete timeoutRefs.current[notificationId];
        }
    }, []);

    const navigateToOrder = useCallback(async (orderId) => {
        try {
            if (location.pathname === '/info/invoices') {
                const openDetailEvent = new CustomEvent('openInvoiceDetail', {
                    detail: { orderId }
                });
                window.dispatchEvent(openDetailEvent);
            } else {
                navigate('/info/invoices', { 
                    state: { 
                        targetOrderId: orderId,
                        shouldExpand: true 
                    } 
                });
            }
        } catch (error) {
            console.error('Error navigating to order:', error);
            navigate('/info/invoices');
        }
    }, [navigate, location.pathname]);

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

    const handleNotificationClick = useCallback(async (notification) => {
        const orderId = notification.orders?.id;
        if (orderId) {
            if (notification.id) {
                await handleMarkAsRead(notification.id);
            }
            removeNotification(notification.id);
            navigateToOrder(orderId);
        }
    }, [handleMarkAsRead, removeNotification, navigateToOrder]);

    const handleNotificationClose = useCallback(async (notification) => {
        if (notification.id) {
            await handleMarkAsRead(notification.id);
        }
        removeNotification(notification.id);
    }, [handleMarkAsRead, removeNotification]);

    const handleNotification = useCallback((notification) => {
        console.log('Notification received in UserNotification:', notification);
        
        if (!userId) return; // Chỉ xử lý khi có userId (đã đăng nhập)
        
        const type = notification.type;
        
        if (!type || !['CONFIRMED', 'CANCEL_BY_ADMIN'].includes(type)) return;

        // Add new notification to the top of the list
        setNotifications(prev => {
            const newNotifications = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            return newNotifications;
        });

        // Auto remove notification after duration
        const timeoutId = setTimeout(() => {
            handleNotificationClose(notification);
        }, DISPLAY_DURATION);

        timeoutRefs.current[notification.id] = timeoutId;
    }, [handleNotificationClose]);

    useWebSocket(handleNotification, `/topic/notifications/${userId}`);

    useEffect(() => {
        return () => {
            // Cleanup timeouts
            Object.values(timeoutRefs.current).forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
            timeoutRefs.current = {};
            processedNotifications.current.clear();
        };
    }, []);

    return (
        <UserNotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onNotificationClose={handleNotificationClose}
        />
    );
};

export default UserNotification; 