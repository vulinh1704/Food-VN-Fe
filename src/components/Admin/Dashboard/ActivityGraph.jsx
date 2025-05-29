"use client";
import React, { useEffect, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { getChartRevenue } from "../../../services/revenue-service/revenue-service";
import { formatNumberWithDots } from "../../../lib/format-hepper";

export const ActivityGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("month"); // "month" or "year"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const params = {
        type: chartType,
        year: selectedYear,
        month: selectedMonth
      };
      const response = await getChartRevenue(params);
      
      // Transform data into format required by Recharts
      const transformedData = response.labels.map((label, index) => ({
        name: label,
        value: response.data[index]
      }));
      
      setChartData(transformedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [chartType, selectedYear, selectedMonth]);

  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({length: 12}, (_, i) => i + 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow">
          <p className="text-sm text-gray-600">{`${label}`}</p>
          <p className="text-sm font-semibold">{`${formatNumberWithDots(payload[0].value)} VNĐ`}</p>
        </div>
      );
    }
    return null;
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="inline-flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-t-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiDollarSign /> Revenue Chart
          </h3>
          <div className="flex gap-2">
            <select 
              className="px-2 py-1 border rounded text-sm"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              disabled={isLoading}
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
            
            {chartType === "month" && (
              <>
                <select 
                  className="px-2 py-1 border rounded text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  disabled={isLoading}
                >
                  {months.map(month => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </>
            )}
            
            <select 
              className="px-2 py-1 border rounded text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              disabled={isLoading}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="h-64 px-4 pb-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 40,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => `${formatNumberWithDots(value)} VNĐ`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
