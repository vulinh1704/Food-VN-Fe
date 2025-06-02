import axiosClient from "../../lib/axios-client";


export const getAllUserNotification = async (params) => {
    let res = await axiosClient.get("/notifications/user", { params });
    return res.data;
}

export const getAllAdminNotification = async (params) => {
    let res = await axiosClient.get("/notifications/admin", { params });
    return res.data;
}

export const markNotificationAsRead = async (notificationId) => {
    let res = await axiosClient.put(`/notifications/${notificationId}/read`);
    return res.data;
}