import axios from "axios";

export const publicApi = axios.create({
  baseURL: "http://localhost:3000",
});

export const privateApi = axios.create({
  baseURL: "http://localhost:3000",
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const backendData = error.response?.data;
    
    if (backendData) {
      const errorMessage = backendData.message || backendData.error || backendData.details;
      if (errorMessage) {
        return Promise.reject(new Error(errorMessage));
      }
    }
    
    return Promise.reject(new Error(error.message || "An unexpected network error occurred."));
  }
);

publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const backendData = error.response?.data;
    
    if (backendData) {
      const errorMessage = backendData.message || backendData.error || backendData.details;
      if (errorMessage) {
        return Promise.reject(new Error(errorMessage));
      }
    }
    
    return Promise.reject(new Error(error.message || "An unexpected network error occurred."));
  }
);