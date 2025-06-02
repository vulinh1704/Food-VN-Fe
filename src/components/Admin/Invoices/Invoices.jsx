import { useEffect, useState } from "react";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { SIDE_BAR_SELECTED } from "../Partial/Sidebar/RouteSelect";
import { IoMdSearch } from "react-icons/io";
import { deleteCategory, getAllCategories } from "../../../services/category-service/category-service";
import { formatNumberWithDots, parseToVietnamTime } from "../../../lib/format-hepper";
import { NotificationType } from "../../Supporter/Notification";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { getInvoiceByAdmin, updateStatusInvoice } from "../../../services/invoice-service/invoice-service";
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from "react-icons/fa6";
import Select from "react-select";
import * as XLSX from 'xlsx';
import { FaExclamationCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useNotification } from '../../../providers/NotificationProvider';

const statusMap = {
    0: { label: "CANCELLED", color: "#dc2626" }, // red-600
    2: { label: "WAITING", color: "#ca8a04" },   // yellow-600
    3: { label: "CONFIRMED", color: "#2563eb" }, // blue-600
    4: { label: "SUCCESS", color: "#16a34a" },   // green-600
};

const allowedTransitions = {
    2: [3, 0],
    3: [4, 0],
};

function CancellationModal({ isOpen, onClose, onConfirm }) {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("Please enter cancellation reason!");
            return;
        }
        onConfirm(reason);
        setReason("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-semibold mb-4">Cancellation Reason</h2>
                <textarea
                    className="w-full h-32 p-2 border rounded-lg mb-4 resize-none focus:border-[#fecb02] outline-none"
                    placeholder="Enter cancellation reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export function StatusDropdown({ status, cancellationReason, onChange }) {
    const [showCancellationModal, setShowCancellationModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const handleStatusChange = (newStatus) => {
        if (newStatus === 0) {
            setShowCancellationModal(true);
            setPendingStatus(newStatus);
        } else {
            onChange?.(newStatus);
        }
    };

    const handleCancellationConfirm = (reason) => {
        onChange?.(pendingStatus, reason);
        setPendingStatus(null);
    };

    const isAllowed = (s) =>
        s === status || allowedTransitions[status]?.includes(s);

    const options = Object.entries(statusMap).map(([key, { label, color }]) => ({
        value: parseInt(key),
        label,
        color,
        isDisabled: !isAllowed(parseInt(key)),
    }));

    const selectedOption = options.find((opt) => opt.value === status);

    return (
        <div className="w-[200px] relative group">
            <Select
                value={selectedOption}
                onChange={(selected) => handleStatusChange(selected.value)}
                options={options}
                isOptionDisabled={(option) => option.isDisabled}
                getOptionLabel={(e) => (
                    <div style={{ color: e.color, opacity: e.isDisabled ? 0.5 : 1 }}>
                        {e.label}
                    </div>
                )}
                styles={{
                    control: (base) => ({
                        ...base,
                        borderRadius: 6,
                        borderColor: "#ccc",
                    }),
                    option: (base, state) => ({
                        ...base,
                        color: state.data.color,
                        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                        opacity: state.data.isDisabled ? 0.5 : 1,
                        cursor: state.data.isDisabled ? "not-allowed" : "default",
                    }),
                }}
                classNamePrefix="react-select"
            />
            {status === 0 && cancellationReason && (
                <div className="absolute -right-6 top-2">
                    <div className="relative group">
                        <FaExclamationCircle className="text-red-600 text-lg cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap min-w-[200px] text-center">
                            {cancellationReason}
                        </div>
                    </div>
                </div>
            )}
            <CancellationModal
                isOpen={showCancellationModal}
                onClose={() => {
                    setShowCancellationModal(false);
                    setPendingStatus(null);
                }}
                onConfirm={handleCancellationConfirm}
            />
        </div>
    );
}

export const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const { setActive } = useSideBar();
    const { showNotification } = useNotification();
    const [expandedRows, setExpandedRows] = useState([]);
    const location = useLocation();
    const [highlightedOrderId, setHighlightedOrderId] = useState(null);
    const [isSearchingOrder, setIsSearchingOrder] = useState(false);
    
    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };
    
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [paramsDefault, setParamsDefault] = useState({
        size: 5,
        sortBy: "createdAt",
        sortDirection: "desc",
        startDate: null,
        endDate: null,
        status: null
    });

    useEffect(() => {
        // Xử lý navigation state
        if (location.state?.targetPage) {
            setPage(location.state.targetPage);
            const params = {
                ...paramsDefault,
                page: location.state.targetPage - 1
            };
            getAll(params);
        }
        
        if (location.state?.targetOrderId) {
            setHighlightedOrderId(location.state.targetOrderId);
            setExpandedRows([location.state.targetOrderId]);
            
            // Xóa state sau khi đã xử lý
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const handleOpenInvoiceDetail = (event) => {
            const { orderId } = event.detail;
            findOrderPage(orderId);
        };

        window.addEventListener('openInvoiceDetail', handleOpenInvoiceDetail);
        
        return () => {
            window.removeEventListener('openInvoiceDetail', handleOpenInvoiceDetail);
        };
    }, []);

    const getAll = async (params) => {
        try {
            const data = await getInvoiceByAdmin(params);
            const { content, totalPages } = data;
            params.page = page - 1;
            setInvoices(content.map(invoice => ({
                ...invoice,
                cancellationReason: invoice.cancellationReason || "No reason provided"
            })));
            setTotalPage(totalPages > 0 ? totalPages : 1);
            setParamsDefault(params);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    }

    const nextPage = () => {
        const next = page + 1;
        setPage(next);
        const params = {
            page: next,
            ...paramsDefault,
        }
        getAll(params);
    }

    const prevPage = () => {
        const prev = page - 1;
        setPage(prev);
        const params = {
            page: prev,
            ...paramsDefault
        }
        getAll(params);
    }

    const sort = (value) => {
        let params = { ...paramsDefault };
        if (value == 'name') {
            params.sortBy = value;
            params.sortDirection = "asc";
        } else {
            params.sortDirection = value;
        }
        getAll(params);
    }

    const updateOrderStatus = async (id, newStatus, cancellationReason = null) => {
        const params = {
            id,
            status: newStatus,
            cancellationReason
        }
        await updateStatusInvoice(params);
        const searchParams = {
            ...paramsDefault
        }
        getAll(searchParams);
    }

    const searchByFromDate = (value) => {
        let params = { ...paramsDefault };
        params.startDate = value;
        params.page = 0;
        setPage(1);
        getAll(params);
    }

    const searchByToDate = (value) => {
        let params = { ...paramsDefault };
        params.endDate = value;
        params.page = 0;
        setPage(1);
        getAll(params);
    }

    const filterByStatus = (value) => {
        let params = { ...paramsDefault };
        params.status = value === "all" ? null : parseInt(value);
        params.page = 0;
        setPage(1);
        getAll(params);
    }

    const handlePageSizeChange = (value) => {
        let params = { ...paramsDefault };
        params.size = parseInt(value);
        params.page = 0;
        setPage(1);
        getAll(params);
    }

    const exportToExcel = () => {
        // Chuẩn bị dữ liệu cho Excel
        const excelData = invoices.map(item => {
            const address = JSON.parse(item.address);
            return {
                'ID': item.id,
                'User': item.user.username,
                'Email': item.user.email,
                'Phone': address.phone,
                'Date': parseToVietnamTime(item.date),
                'Customer Name': address.fullName,
                'Address': `${address.addressDetail}, ${address.address}`,
                'Total': `${formatNumberWithDots(item.total)} VNĐ`,
                'Status': statusMap[item.status].label
            };
        });

        // Tạo workbook và worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Invoices");

        // Tạo file Excel và download
        const fileName = `invoices_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const findOrderPage = async (orderId) => {
        setIsSearchingOrder(true);
        try {
            // Lưu lại params hiện tại
            const currentParams = { ...paramsDefault };
            
            // Tìm kiếm với page size lớn hơn để giảm số lần gọi API
            const searchParams = {
                ...currentParams,
                size: 50,
                page: 0
            };
            
            let foundPage = 0;
            let found = false;
            
            while (!found) {
                searchParams.page = foundPage;
                const data = await getInvoiceByAdmin(searchParams);
                
                if (!data.content || data.content.length === 0) {
                    break;
                }
                
                const orderIndex = data.content.findIndex(order => order.id === orderId);
                if (orderIndex !== -1) {
                    found = true;
                    // Tính toán trang thực với page size gốc
                    const actualPage = Math.floor((foundPage * 50 + orderIndex) / currentParams.size) + 1;
                    
                    // Set lại page size và page number
                    const finalParams = {
                        ...currentParams,
                        page: actualPage - 1
                    };
                    
                    setPage(actualPage);
                    await getAll(finalParams);
                    
                    // Highlight và mở rộng sau khi đã load đúng trang
                    setHighlightedOrderId(orderId);
                    setExpandedRows(prev => prev.includes(orderId) ? prev : [...prev, orderId]);
                    
                    // Scroll đến đơn hàng
                    setTimeout(() => {
                        const element = document.getElementById(`order-${orderId}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                    
                    break;
                }
                
                foundPage++;
            }
            
            if (!found) {
                showNotification("Không tìm thấy đơn hàng", NotificationType.ERROR);
            }
        } catch (error) {
            console.error("Error finding order:", error);
            showNotification("Có lỗi xảy ra khi tìm đơn hàng", NotificationType.ERROR);
        } finally {
            setIsSearchingOrder(false);
        }
    };

    useEffect(() => {
        const params = {
            ...paramsDefault
        }
        getAll(params);
    }, []);

    useEffect(() => {
        setActive(SIDE_BAR_SELECTED.INVOICES);
    }, []);

    return (
        <>
            <div class="p-6 bg-gray-100 min-h-screen space-y-6">
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="flex flex-col">
                            <h4 className="font-medium mb-2">Date</h4>
                            <div className="flex items-center gap-2">
                                <input
                                    type="datetime-local"
                                    placeholder="FROM"
                                    className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02]"
                                    onChange={e => searchByFromDate(e.target.value)}
                                    value={paramsDefault.startDate || ""}
                                />
                                <span>-</span>
                                <input
                                    type="datetime-local"
                                    placeholder="TO"
                                    className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02]"
                                    onChange={e => searchByToDate(e.target.value)}
                                    value={paramsDefault.endDate || ""}
                                />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Status</label>
                            <select
                                class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]"
                                onChange={(e) => filterByStatus(e.target.value)}
                                value={paramsDefault.status === null ? "all" : paramsDefault.status}
                            >
                                <option value="all">All</option>
                                <option value="0">Cancelled</option>
                                <option value="2">Waiting</option>
                                <option value="3">Confirmed</option>
                                <option value="4">Success</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <select
                                class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]"
                                onChange={(e) => sort(e.target.value)}
                                value={paramsDefault.sortDirection}
                            >
                                <option value="desc">Newest</option>
                                <option value="asc">Oldest</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Records per page</label>
                            <select
                                class="w-32 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]"
                                onChange={(e) => handlePageSizeChange(e.target.value)}
                                value={paramsDefault.size}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <button
                                onClick={exportToExcel}
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Export Excel
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="text-xs text-gray-600 uppercase bg-gray-100">
                            <tr>
                                <th class="px-6 py-3">Id</th>
                                <th class="px-6 py-3">User</th>
                                <th class="px-6 py-3">Date</th>
                                <th class="px-6 py-3">Address</th>
                                <th class="px-6 py-3">Total</th>
                                <th class="px-6 py-3">Status</th>
                                <th class="px-6 py-3">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(item => {
                                const isOpen = expandedRows.includes(item.id);
                                const address = JSON.parse(item.address);
                                const orderDetails = item.orderDetails || [];
                                return (
                                    <>
                                        <tr
                                            key={item.id}
                                            className={`border-b hover:bg-gray-50 cursor-pointer ${
                                                highlightedOrderId === item.id ? 'bg-yellow-50' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                            <td className="px-6 py-4 text-gray-900">
                                                <div className="font-medium"><a href="">{item.user.username}</a></div>
                                                <div>{item.user.email}</div>
                                                <div>{item.user.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {parseToVietnamTime(item.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{address.fullName}</p>
                                                <p className="text-gray-500">{address.phone}</p>
                                                <p className="text-gray-500">{address.addressDetail}, {address.address}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p>{formatNumberWithDots(item.total)} VNĐ</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusDropdown
                                                    status={item.status}
                                                    cancellationReason={item.cancellationReason}
                                                    onChange={(newStatus, reason) => {
                                                        updateOrderStatus(item.id, newStatus, reason);
                                                    }}
                                                />
                                            </td>
                                            <td 
                                                className="px-6 py-4 text-blue-500 underline cursor-pointer" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRow(item.id);
                                                }}
                                            >
                                                Detail
                                            </td>
                                        </tr>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <tr>
                                                    <td colSpan={7} className="bg-gray-50 px-6 py-4">
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            {/* Replace with actual order details */}
                                                            <div className="p-4 bg-white rounded shadow text-sm text-gray-700">
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <div className="font-semibold flex justify-between items-center">
                                                                            <div className="font-semibold">
                                                                                List Foods
                                                                            </div>
                                                                            <div className="text-sm text-gray-600">
                                                                                {parseToVietnamTime(item.date)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {orderDetails.map((detail) => (
                                                                        <div key={detail.id} className="flex justify-between items-center border-t pt-3">
                                                                            <div className='flex gap-4'>
                                                                                <div><img src={JSON.parse(detail.product.images)[0]} alt="" className='w-[50px] h-[50px] object-cover rounded' /></div>
                                                                                <div>
                                                                                    <div className="font-medium">{detail.product.name}</div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        Quantity: {detail.quantity}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm text-gray-500">
                                                                                        {
                                                                                            detail?.coupons && JSON.parse(detail?.coupons)?.length > 0 && <div className="text-xs text-gray-500">Coupons: {JSON.parse(detail?.coupons).map((e, i) => (<><span className=''>{e.name} - {formatNumberWithDots(e.discount)}{e.type == "percent" ? "%" : "VNĐ"}</span>{i < JSON.parse(detail?.coupons)?.length - 1 ? ", " : ""}</>))}</div>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right text-sm font-semibold text-gray-700">
                                                                                {detail?.coupons && JSON.parse(detail?.coupons)?.length > 0 && (
                                                                                    <span className="line-through text-gray-400 mr-2">
                                                                                        {(detail.product.price * detail.quantity).toLocaleString()}₫
                                                                                    </span>
                                                                                )}
                                                                                {(detail.price * detail.quantity).toLocaleString()}₫
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>

                    <div class="flex justify-between items-center mt-4 px-4 text-gray-600">
                        {
                            page && page > 1 ?
                                <button class="flex items-center gap-1 text-sm hover:underline" onClick={prevPage}>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>
                                :
                                <button
                                    class="flex items-center gap-1 text-sm hover:underline opacity-50 cursor-not-allowed pointer-events-none"
                                    disabled
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>
                        }
                        <span>Page {page} / {totalPage}</span>
                        {
                            page && page < totalPage ?
                                <button class="flex items-center gap-1 text-sm hover:underline" onClick={nextPage}>
                                    Next
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                :
                                <button
                                    class="flex items-center gap-1 text-sm hover:underline opacity-50 cursor-not-allowed pointer-events-none"
                                    disabled
                                >
                                    Next
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                        }

                    </div>
                </div>
            </div>
        </>
    );
};