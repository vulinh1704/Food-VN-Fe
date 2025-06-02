import axiosClient from "../../lib/axios-client";

export const saveEvaluation = async (data) => {
  try {
    const response = await axiosClient.post(`/evaluations/save`, data);
    return response.data;
  } catch (error) {
    console.error("Error saving evaluation:", error);
    throw error;
  }
};

export const getProductEvaluations = async (productId) => {
  try {
    const response = await axiosClient.get(`/evaluations/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting product evaluations:", error);
    throw error;
  }
};

export const getLatestEvaluations = async (params) => {
  try {
    const response = await axiosClient.get(`/evaluations/latest`, { params });
    return response.data;
  } catch (error) {
    console.error("Error getting latest evaluations:", error);
    throw error;
  }
}; 

export const isEvaluated = async (productId) => {
  try {
    const response = await axiosClient.get(`/has-ordered/product/` + productId);
    return response.data;
  } catch (error) {
    console.error("Error isEvaluated:", error);
    throw error;
  }
}
