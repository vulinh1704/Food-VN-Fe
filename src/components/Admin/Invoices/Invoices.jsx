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

export function StatusDropdown({ status, onChange }) {
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
        <div className="w-[200px]">
            <Select
                value={selectedOption}
                onChange={(selected) => onChange?.(selected.value)}
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
        </div>
    );
}

export const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const { setActive } = useSideBar();
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [expandedRows, setExpandedRows] = useState([]);
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
        sortDirection: "desc"
    });

    const getAll = async (params) => {
        const data = await getInvoiceByAdmin(params);
        const { content, totalPages } = data;
        params.page = page - 1;
        setInvoices(content);
        setTotalPage(totalPages > 0 ? totalPages : 1);
        setParamsDefault(params);
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

    const updateOrderStatus = async (id, newStatus) => {
        const params = {
            id,
            status: newStatus
        }
        await updateStatusInvoice(params);
        const searchParams = {
            ...paramsDefault
        }
        getAll(searchParams);
    }

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
            <NotificationPortal />
            <div class="p-6 bg-gray-100 min-h-screen space-y-6">
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="flex flex-col">
                            <h4 className="font-medium mb-2">Date</h4>
                            <div className="flex items-center gap-2">
                                <input type="datetime-local" placeholder="FROM" className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={e => searchByFromDate(e.target.value)} />
                                <span>-</span>
                                <input type="datetime-local" placeholder="TO" className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={e => searchByToDate(e.target.value)} />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Status</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { sort(e.target.value) }}>
                                <option value="desc">Newest</option>
                                <option value="asc">Oldest</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { sort(e.target.value) }}>
                                <option value="desc">Newest</option>
                                <option value="asc">Oldest</option>
                                <option value="name">Name A-Z</option>
                            </select>
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
                                                    onChange={(newStatus) => {
                                                        updateOrderStatus(item.id, newStatus);
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