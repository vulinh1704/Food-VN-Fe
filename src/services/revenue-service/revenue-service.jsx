import axiosClient from "../../lib/axios-client";

export const getRevenueByAdmin = async (params) => {
    let { data } = await axiosClient.get("/admin/revenue/stats", { params });
    return data;
}

export const getChartRevenue = async (params) => {
    let { data } = await axiosClient.get("/admin/revenue/chart", { params });
    return data;
}

