import { useEffect, useState } from "react";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { formatNumberWithDots, parseToVietnamTime } from "../../../lib/format-hepper";
import { NotificationType } from "../../Supporter/Notification";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { getInvoiceByAdmin, getInvoicesByUser, updateStatusInvoice } from "../../../services/invoice-service/invoice-service";
import { motion, AnimatePresence } from 'framer-motion';
import { PROFILE_MENU, useProfileMenu } from "../../../providers/users/ProfileMenuProvider";
import Select from "react-select";
import { updateStatusOrder } from "../../../services/order-service/order-service";
import { DateRangePicker } from "../../Supporter/DateRangePicker";

const statusMap = {
    0: { label: "CANCELLED", color: "#dc2626" },
    2: { label: "WAITING", color: "#ca8a04" },
    3: { label: "CONFIRMED", color: "#2563eb" },
    4: { label: "SUCCESS", color: "#16a34a" },
};

const statusOptions = [
    { value: "all", label: "All Status", color: "#6b7280" },
    { value: 0, label: statusMap[0].label, color: statusMap[0].color },
    { value: 2, label: statusMap[2].label, color: statusMap[2].color },
    { value: 3, label: statusMap[3].label, color: statusMap[3].color },
    { value: 4, label: statusMap[4].label, color: statusMap[4].color },
];

const sortOptions = [
    { value: "desc", label: "Newest" },
    { value: "asc", label: "Oldest" },
];

export function StatusDropdown({ status, onChange }) {
    if (status !== 2) {
        return (
            <div style={{ color: statusMap[status].color }}>
                {statusMap[status].label}
            </div>
        );
    }
    const options = [
        {
            value: 2,
            label: statusMap[2].label,
            color: statusMap[2].color,
        },
        {
            value: 0,
            label: statusMap[0].label,
            color: statusMap[0].color,
        }
    ];

    const selectedOption = options.find((opt) => opt.value === status);

    return (
        <div className="w-[200px]">
            <Select
                value={selectedOption}
                onChange={(selected) => onChange?.(selected.value)}
                options={options}
                getOptionLabel={(e) => (
                    <div style={{ color: e.color }}>
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
                    }),
                }}
                classNamePrefix="react-select"
            />
        </div>
    );
}

export const OldOrder = () => {
    const [invoices, setInvoices] = useState([]);
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const { setOption } = useProfileMenu();
    const [expandedRows, setExpandedRows] = useState([]);
    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [paramsDefault, setParamsDefault] = useState({
        page: 0,
        size: 3,
        sortBy: "createdAt",
        sortDirection: "desc",
        startDate: null,
        endDate: null,
        status: null
    });
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const getAll = async (params) => {
        try {
            const data = await getInvoicesByUser(params);
            const { content, totalPages } = data;
            setInvoices(content);
            setTotalPage(totalPages > 0 ? totalPages : 1);
            setParamsDefault(params);
        } catch (error) {
            showNotification("Failed to fetch orders", NotificationType.ERROR);
        }
    }

    const nextPage = async () => {
        const next = page + 1;
        setPage(next);
        const params = {
            ...paramsDefault,
            page: paramsDefault.page + 1
        }
        await getAll(params);
    }

    const prevPage = async () => {
        const prev = page - 1;
        setPage(prev);
        const params = {
            ...paramsDefault,
            page: paramsDefault.page - 1
        }
        await getAll(params);
    }

    const sort = (value) => {
        let params = { ...paramsDefault };
        params.sortDirection = value;
        getAll(params);
    }

    const searchByFromDate = (date) => {
        if (!date) return;
        const params = {
            ...paramsDefault,
            startDate: new Date(date).toISOString(),
            page: 0
        };
        setPage(1);
        getAll(params);
    }

    const searchByToDate = (date) => {
        if (!date) return;
        const params = {
            ...paramsDefault,
            endDate: new Date(date).toISOString(),
            page: 0
        };
        setPage(1);
        getAll(params);
    }

    const cancelOrder = async (id) => {
        try {
            await updateStatusOrder({ id, status: 0 });
            showNotification("Order cancelled successfully", NotificationType.SUCCESS);
            await getAll(paramsDefault);
        } catch (error) {
            showNotification("Failed to cancel order", NotificationType.ERROR);
        }
    }

    useEffect(() => {
        const params = {
            ...paramsDefault
        }
        getAll(params);
    }, []);

    useEffect(() => {
        setOption(PROFILE_MENU.INVOICES);
    }, []);

    return (
        <>
            <main className="flex-1 p-10 bg-white">
                <NotificationPortal />
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <DateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={(date) => {
                                setFromDate(date);
                                searchByFromDate(date);
                            }}
                            onToDateChange={(date) => {
                                setToDate(date);
                                searchByToDate(date);
                            }}
                        />
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <Select
                                className="w-60"
                                options={sortOptions}
                                defaultValue={sortOptions[0]}
                                onChange={(selected) => sort(selected.value)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: 6,
                                        borderColor: "#ccc",
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                                    }),
                                }}
                            />
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Status</label>
                            <Select
                                className="w-60"
                                options={statusOptions}
                                defaultValue={statusOptions[0]}
                                onChange={(selected) => {
                                    const value = selected.value === "all" ? null : parseInt(selected.value);
                                    const params = {
                                        ...paramsDefault,
                                        status: value,
                                        page: 0
                                    };
                                    setPage(1);
                                    getAll(params);
                                }}
                                getOptionLabel={(e) => (
                                    <div style={{ color: e.color }}>
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
                                    }),
                                    singleValue: (base, state) => ({
                                        ...base,
                                        color: state.data.color,
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow mt-10">
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
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <p className="text-lg font-medium">No orders found</p>
                                            <p className="text-sm">You haven't placed any orders yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map(item => {
                                    const isOpen = expandedRows.includes(item.id);
                                    const address = JSON.parse(item.address);
                                    const orderDetails = item.orderDetails || [];
                                    return (
                                        <>
                                            <tr
                                                key={item.id}
                                                className="border-b hover:bg-gray-50 cursor-pointer"
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
                                                        onChange={() => {
                                                            cancelOrder(item.id);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-blue-500 underline" onClick={() => toggleRow(item.id)}>
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
                                                                                            <div className="text-xs text-gray-500">Coupons: {JSON.parse(detail?.coupons).map((e, i) => (<><span className=''>{e.name} - {formatNumberWithDots(e.discount)}{e.type == "percent" ? "%" : "VNĐ"}</span>{i < JSON.parse(detail?.coupons)?.length - 1 ? ", " : ""}</>))}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right text-sm font-semibold text-gray-700">
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
                                })
                            )}
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
            </main>
        </>
    );
};