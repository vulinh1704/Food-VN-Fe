import React, { useState, useEffect, useRef } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { getFormattedDate } from "../../../../lib/format-hepper";
import { getAllAdminNotification, markNotificationAsRead } from "../../../../services/notification-service/notification-service";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../../../hooks/useWebSocket";

export const TopBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState("day");
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await getAllAdminNotification({ filter });
      setNotifications(response || []);
      const unread = response.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý WebSocket để cập nhật realtime
  useWebSocket((newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  });

  const findOrderAndNavigate = async (orderId) => {
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
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Nếu có orderId, chuyển hướng đến trang invoice
    if (notification.orders?.id) {
      findOrderAndNavigate(notification.orders.id);
      setShowNotifications(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-xl font-bold block">🚀 Hello, Admin!</span>
          <span className="text-2xs block text-stone-500">
            {getFormattedDate()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IoNotificationsOutline className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 text-xs rounded ${
                          filter === "day" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                        }`}
                        onClick={() => setFilter("day")}
                      >
                        Day
                      </button>
                      <button
                        className={`px-2 py-1 text-xs rounded ${
                          filter === "month" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                        }`}
                        onClick={() => setFilter("month")}
                      >
                        Month
                      </button>
                      <button
                        className={`px-2 py-1 text-xs rounded ${
                          filter === "year" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                        }`}
                        onClick={() => setFilter("year")}
                      >
                        Year
                      </button>
                    </div>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {notification.orders?.status === 0 && notification.orders?.cancellationReason && (
                          <p className="text-xs text-red-500 mt-1">
                            Reason: {notification.orders.cancellationReason}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-[#fecb02] bg-100 hover:text-white text-700 px-3 py-1.5 rounded"
            onClick={() => { logout() }}
          >
            <IoLogOutOutline />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
