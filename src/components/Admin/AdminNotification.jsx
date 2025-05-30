import React, { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../../hooks/useWebSocket';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getInvoiceByAdmin } from '../../services/invoice-service/invoice-service';
import './AdminNotification.css';

// Hằng số cho thời gian hiển thị và số lượng tối đa
const DISPLAY_DURATION = 120000; // 2 phút cho NEW_ORDER
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

    const removeToast = (id) => {
        activeToasts.current.delete(id);
    };

    const findOrderAndNavigate = async (orderId) => {
        try {
            let currentPage = 0;
            let found = false;
            
            // Tìm kiếm order qua các trang cho đến khi tìm thấy
            while (!found) {
                const params = {
                    page: currentPage,
                    size: 5,
                    sortBy: "createdAt",
                    sortDirection: "desc"
                };
                
                const response = await getInvoiceByAdmin(params);
                const { content, totalPages } = response;
                
                // Kiểm tra xem order có trong trang hiện tại không
                const orderExists = content.some(order => order.id === orderId);
                
                if (orderExists) {
                    found = true;
                    // Điều hướng đến trang invoices với page đã tìm thấy
                    navigate('/admin/invoices', { 
                        state: { 
                            targetPage: currentPage + 1,
                            targetOrderId: orderId 
                        } 
                    });
                    break;
                }
                
                currentPage++;
                // Nếu đã duyệt hết tất cả các trang mà không tìm thấy
                if (currentPage >= totalPages) {
                    console.log('Order not found');
                    // Vẫn điều hướng đến trang invoices
                    navigate('/admin/invoices');
                    break;
                }
            }
        } catch (error) {
            console.error('Error finding order:', error);
            // Trong trường hợp lỗi vẫn điều hướng đến trang invoices
            navigate('/admin/invoices');
        }
    };

    useWebSocket((notification) => {
        console.log('Notification received in AdminNotification:', notification);
        
        const message = notification.message || notification.content;
        const description = notification.description || notification.detail;
        const type = notification.type || 'NEW_ORDER';
        const orderId = notification.orders?.id;
        
        if (activeToasts.current.size >= MAX_TOASTS) {
            const oldestToast = Array.from(activeToasts.current)[0];
            toast.dismiss(oldestToast);
            activeToasts.current.delete(oldestToast);
        }

        const style = toastStyles[type] || toastStyles.NEW_ORDER;

        const toastId = toast(
            <div 
                className="flex w-full min-h-[48px] relative pr-2 cursor-pointer"
                onClick={() => {
                    if (orderId) {
                        findOrderAndNavigate(orderId);
                        // Đóng toast khi click
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
                    {description && (
                        <p className={`text-sm mt-1 ${style.contentClass}`}>
                            {description}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp || Date.now()).toLocaleString()}
                    </p>
                </div>
                {style.showCloseButton && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click lan tỏa
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
                onClose: () => removeToast(toastId),
                closeButton: false,
                icon: false
            }
        );

        activeToasts.current.add(toastId);
    });

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
                minWidth: '500px',
                '--toastify-toast-width': '500px'
            }}
        />
    );
};

export default AdminNotification; 