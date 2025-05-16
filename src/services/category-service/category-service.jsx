import axiosClient from "../../lib/axios-client"

export const addCategory = async (category) => {
    return axiosClient.post("/categories/save", category);
}

export const getAllCategories = async (params) => {
    let res = await axiosClient.get("/categories/get-list", { params });
    return res.data;
}

export const getAllData = async (params) => {
    let res = await axiosClient.get("/categories/get-all", { params });
    return res.data;
}

export const getOneCategory = async (id) => {
    let res = await axiosClient.get("/categories/get-one/"+ id);
    return res.data;
}

export const deleteCategory = async(id) => {
    let res = await axiosClient.delete("/categories/delete/"+ id);
    return res.data;
}