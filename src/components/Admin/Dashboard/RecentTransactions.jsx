import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import { getInvoiceByAdmin } from "../../../services/invoice-service/invoice-service";
import { formatNumberWithDots, parseToVietnamTime } from "../../../lib/format-hepper";
import { Link } from "react-router-dom";

const statusMap = {
  0: { label: "CANCELLED", color: "#dc2626" },
  2: { label: "WAITING", color: "#ca8a04" },
  3: { label: "CONFIRMED", color: "#2563eb" },
  4: { label: "SUCCESS", color: "#16a34a" },
};

export const RecentTransactions = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const params = {
        page: 0,
        size: 10,
        sortBy: "createdAt",
        sortDirection: "desc"
      };
      const data = await getInvoiceByAdmin(params);
      setInvoices(data.content);
    };
    fetchInvoices();
  }, []);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiDollarSign /> Recent Transactions
        </h3>
        <Link to="/admin/invoices" className="text-sm text-violet-500 hover:underline">
          See all
        </Link>
      </div>
      <table className="w-full table-auto">
        <TableHead />

        <tbody>
          {invoices.map((invoice, index) => (
            <TableRow
              key={invoice.id}
              cusId={`#${invoice.id}`}
              status={invoice.status}
              date={parseToVietnamTime(invoice.date)}
              price={`${formatNumberWithDots(invoice.total)} VNĐ`}
              order={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Customer ID</th>
        <th className="text-start p-1.5">Status</th>
        <th className="text-start p-1.5">Date</th>
        <th className="text-start p-1.5">Price</th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  cusId,
  status,
  date,
  price,
  order,
}) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a
          href="#"
          className="text-violet-600 underline flex items-center gap-1"
        >
          {cusId} <FiArrowUpRight />
        </a>
      </td>
      <td className="p-1.5">
        <span style={{ color: statusMap[status]?.color }}>
          {statusMap[status]?.label || "UNKNOWN"}
        </span>
      </td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{price}</td>
    </tr>
  );
};
