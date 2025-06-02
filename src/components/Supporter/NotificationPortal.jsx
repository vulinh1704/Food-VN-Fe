import { useState } from "react";
import { Notification } from "./Notification";

export function useNotificationPortal() {
  const [toasts, setToasts] = useState([]);

  const showNotification = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const Portal = () => (
    <div className="absolute top-4 right-4 space-y-3 z-[9999] w-[300px]">
      {toasts.map((toast) => (
        <Notification key={toast.id} type={toast.type} message={toast.message} />
      ))}
    </div>
  );

  return { showNotification, NotificationPortal: Portal };
}
