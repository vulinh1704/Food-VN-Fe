import axiosClient from "../../lib/axios-client";

export const saveProduct = async (product) => {
    return axiosClient.post("/products/save", product);
}

export const getList = async (params) => {
    let { data } = await axiosClient.get("/products/get-list", { params });
    return data;
}

