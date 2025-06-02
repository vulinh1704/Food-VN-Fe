import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNavigate, useLocation } from 'react-router-dom';
import { markNotificationAsRead } from '../../services/notification-service/notification-service';
import CustomNotificationPanel from './CustomNotificationPanel';

// Constants for display duration and maximum notifications
const DISPLAY_DURATION = 60000; // 2 minutes for NEW_ORDER
const CANCEL_DURATION = 10000;   // 10 seconds for CANCEL_BY_USER
const MAX_NOTIFICATIONS = 5;

const AdminNotification = () => {
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

        // Dispatch event to update notifications in top bar
        const reloadNotificationsEvent = new CustomEvent('reloadNotifications');
        window.dispatchEvent(reloadNotificationsEvent);
    }, []);

    const findOrderAndNavigate = useCallback(async (orderId) => {
        try {
            if (location.pathname === '/admin/invoices') {
                // If on invoices page, dispatch event to open order detail
                const openDetailEvent = new CustomEvent('openInvoiceDetail', {
                    detail: { orderId }
                });
                window.dispatchEvent(openDetailEvent);
            } else {
                // If not on invoices page, navigate to it with orderId
                navigate('/admin/invoices', { 
                    state: { 
                        targetOrderId: orderId 
                    } 
                });
            }
        } catch (error) {
            console.error('Error navigating to order:', error);
            navigate('/admin/invoices');
        }
    }, [navigate, location.pathname]);

    const handleMarkAsRead = useCallback(async (notificationId) => {
        if (!notificationId || processedNotifications.current.has(notificationId)) {
            return;
        }

        try {
            processedNotifications.current.add(notificationId);
            await markNotificationAsRead(notificationId);
            
            // Dispatch event to update notifications in top bar
            const reloadNotificationsEvent = new CustomEvent('reloadNotifications');
            window.dispatchEvent(reloadNotificationsEvent);
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
            findOrderAndNavigate(orderId);
        }
    }, [handleMarkAsRead, removeNotification, findOrderAndNavigate]);

    const handleNotificationClose = useCallback(async (notification) => {
        if (notification.id) {
            await handleMarkAsRead(notification.id);
        }
        removeNotification(notification.id);
    }, [handleMarkAsRead, removeNotification]);

    const handleNotification = useCallback((notification) => {
        console.log('Received notification:', notification);
        
        if (!notification.message) {
            console.warn('Invalid notification format:', notification);
            return;
        }

        // Add new notification to the top of the list
        setNotifications(prev => {
            const newNotifications = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
            return newNotifications;
        });

        // Auto remove notification after duration
        const duration = notification.type === 'CANCEL_BY_USER' ? CANCEL_DURATION : DISPLAY_DURATION;
        const timeoutId = setTimeout(() => {
            handleNotificationClose(notification);
        }, duration);

        timeoutRefs.current[notification.id] = timeoutId;
    }, [handleNotificationClose]);

    useWebSocket(handleNotification);

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
        <CustomNotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onNotificationClose={handleNotificationClose}
        />
    );
};

export default AdminNotification; 