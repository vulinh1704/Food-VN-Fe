import axiosClient from "../../lib/axios-client"

export const getCard = async () => {
    let { data } = await axiosClient.get("/orders/get-card");
    return data;
}

export const addOrderDetail = async (_params) => {
    let { data } = await axiosClient.post("/order-details/save", _params);
    return data;
}

export const getAllByOrderId = async (id) => {
    let { data } = await axiosClient.get("/order-details/orders/" + id + "/get-all");
    return data;
}

export const removeOrderDetailByOrderIdAndProductId = async (order_id, product_id) => {
    let { data } = await axiosClient.delete("/order-details/orders/" + order_id + "/products/" + product_id + "/delete");
    return data;
}