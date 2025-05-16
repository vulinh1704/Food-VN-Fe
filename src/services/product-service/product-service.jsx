import axiosClient from "../../lib/axios-client";

export const saveProduct = async (product) => {
    return axiosClient.post("/products/save", product);
}

export const getList = async (params) => {
    let { data } = await axiosClient.get("/products/get-list", { params: params, paramsSerializer: params => new URLSearchParams(params).toString() });
    return data;
}

export const getOneById = async (id) => {
    let { data } = await axiosClient.get("/products/get-one/" + id);
    return data;
}

export const remove = async (id) => {
    let { data } = await axiosClient.delete("/products/delete/" + id);
    return data;
}