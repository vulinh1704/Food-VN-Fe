import React, { useState, useEffect } from "react";
import { FiPieChart } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { format } from "date-fns";
import { getProductCategorySalePercent } from "../../../services/revenue-service/revenue-service";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const EMPTY_DATA = [{ categoryName: "No data", totalSold: 1, percent: 100 }];

// Custom Legend với truncate text và tooltip khi hover
const CustomLegend = (props) => {
  const { payload } = props;
  
  return (
    <div className="custom-legend" style={{ maxHeight: '180px', overflowY: 'auto' }}>
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center mb-2 cursor-pointer group relative hover:bg-gray-50 px-2 py-1 rounded"
        >
          <div
            className="w-3 h-3 rounded-sm mr-2 flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <div className="text-sm truncate max-w-[120px] group-hover:text-blue-600" 
               title={entry.value}>
            {entry.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export const UsageRadar = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchData = async (dates) => {
    setLoading(true);
    try {
      const data = await getProductCategorySalePercent({
        startDate: dates.startDate,
        endDate: dates.endDate
      });
      setCategoryData(data?.length > 0 ? data : EMPTY_DATA);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      setCategoryData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    setDateRange(newDateRange);
    fetchData(newDateRange);
  };

  useEffect(() => {
    fetchData(dateRange);
  }, []);

  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiPieChart />Sales by Category
          </h3>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 text-sm"
                max={dateRange.endDate}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 text-sm"
                min={dateRange.startDate}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 px-4 flex items-center">
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center">
            <div className="w-[75%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="totalSold"
                    nameKey="categoryName"
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={categoryData === EMPTY_DATA ? '#E5E7EB' : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => name === "No data" ? ["No data available", ""] : [`${value} sản phẩm`, name]}
                    wrapperClassName="text-sm rounded"
                    labelClassName="text-xs text-stone-500"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {categoryData !== EMPTY_DATA && (
              <div className="w-[25%] border-l pl-4">
                <CustomLegend payload={categoryData.map((item, index) => ({
                  value: item.categoryName,
                  color: COLORS[index % COLORS.length],
                  type: 'square'
                }))} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
