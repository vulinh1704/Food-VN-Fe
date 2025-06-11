import axios from "axios";
import axiosClient from "../../lib/axios-client"
import { use } from "react";

export const register = async (user) => {
    let { data } = await axiosClient.post("/register", user);
    return data;
}

export const login = async (user) => {
    let res = await axiosClient.post("/login", user);
    console.log(res)
    return res.data;
}

export const getInfo = async () => {
    let { data } = await axiosClient.get("/users/get-info");
    return data;
}

export const updateInfo = async (values) => {
    let { data } = await axiosClient.put("/users/update-info", values);
    return data;
}

export const changePassword = async (values) => {
    let response = await axiosClient.put("/users/change-password", values);
    console.log(response);
    return response;
}

export const getAddressVN = async (_params = { depth: 1 }) => {
    let { data } = await axios.get('https://provinces.open-api.vn/api', _params);
    return data;
}


export const addAddress = async (_params) => {
    let { data } = await axiosClient.post('/addresses/save', _params);
    return data;
}

export const getAllAddress = async (_params) => {
    let { data } = await axiosClient.get('/addresses/get-all');
    return data;
}

export const getOneAddress = async (id) => {
    let { data } = await axiosClient.get('/addresses/get-one/' + id);
    return data;
}

export const deleteAddress = async (id) => {
    return axiosClient.delete("/addresses/delete/" + id);
}