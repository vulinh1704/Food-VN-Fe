import axiosClient from "../../lib/axios-client"

export const register = async (user) => {
    return axiosClient.post("/register", user);
}

export const login = async (user) => {
    let { data } = await axiosClient.post("/login", user);
    return data;
}

export const getInfo = async () => {
    let { data } = await axiosClient.get("/users/get-info");
    return data;
}

export const updateInfo = async (values) => {
    let { data } = await axiosClient.put("/users/update-info", values);
    return data;
}