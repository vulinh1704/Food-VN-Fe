import React, { useEffect, useState } from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { getRevenueByAdmin } from "../../../services/revenue-service/revenue-service";
import { formatNumberWithDots } from "../../../lib/format-hepper";

export const StatCards = () => {
  const [revenueStats, setRevenueStats] = useState({
    day: 0,
    dayPercent: 0,
    month: 0, 
    monthPercent: 0,
    year: 0,
    yearPercent: 0
  });

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        const data = await getRevenueByAdmin();
        setRevenueStats(data);
      } catch (error) {
        console.error("Error fetching revenue stats:", error);
      }
    };
    fetchRevenueStats();
  }, []);

  return (
    <>
      <Card
        title="Daily Revenue"
        value={formatNumberWithDots(revenueStats.day) + " VNĐ"}
        pillText={Math.abs(revenueStats.dayPercent).toFixed(2) + "%"}
        trend={revenueStats.dayPercent >= 0 ? "up" : "down"}
        period="Today vs Yesterday"
      />
      <Card
        title="Monthly Revenue"
        value={formatNumberWithDots(revenueStats.month) + " VNĐ"} 
        pillText={Math.abs(revenueStats.monthPercent).toFixed(2) + "%"}
        trend={revenueStats.monthPercent >= 0 ? "up" : "down"}
        period="This Month vs Last Month"
      />
      <Card
        title="Yearly Revenue"
        value={formatNumberWithDots(revenueStats.year) + " VNĐ"}
        pillText={Math.abs(revenueStats.yearPercent).toFixed(2) + "%"}
        trend={revenueStats.yearPercent >= 0 ? "up" : "down"}
        period="This Year vs Last Year"
      />
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}) => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
        </span>
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};
