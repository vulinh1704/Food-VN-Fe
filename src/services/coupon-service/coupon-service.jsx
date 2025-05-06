import axiosClient from "../../lib/axios-client"

export const addCoupon = async (coupon) => {
    return axiosClient.post("/coupons/save", coupon);
}

export const getAllCoupons = async (params) => {
    let res = await axiosClient.get("/coupons/get-list", { params });
    return res.data;
}

export const getAll = async () => {
    let res = await axiosClient.get("/coupons/get-all");
    return res.data;
}

export const getOneCoupon = async (id) => {
    let res = await axiosClient.get("/coupons/get-one/" + id);
    return res.data;
}

export const deleteCategory = async (id) => {
    let res = await axiosClient.delete("/categories/delete/" + id);
    return res.data;
}