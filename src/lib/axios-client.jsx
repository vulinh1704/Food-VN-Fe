import axios from "axios";

const noAuthApis = [
  "/login",
  "/signup", 
  "/categories",
];

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000
});

axiosClient.interceptors.request.use(
  (config) => {
    if (!noAuthApis.some(api => config.url.includes(api))) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
