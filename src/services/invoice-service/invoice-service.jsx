import axiosClient from "../../lib/axios-client";

export const getInvoiceByAdmin = async (params) => {
    let { data } = await axiosClient.get("/admin/invoices/get-all", { params });
    return data;
}

export const getInvoicesByUser = async (params) => {
    let { data } = await axiosClient.get("/orders/invoices/get-list", { params });
    return data;
}

export const updateStatusInvoice = async (params) => {
    return axiosClient.put("/admin/invoices/update-status", params);
}

