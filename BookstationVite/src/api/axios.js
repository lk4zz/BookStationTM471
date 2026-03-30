import axios from "axios";

const buildApiError = (error) => {
  const backendData = error.response?.data;
  const message =
    backendData?.message ||
    backendData?.error ||
    backendData?.details ||
    error.message ||
    "An unexpected network error occurred.";

  const apiError = new Error(message);
  apiError.status = error.response?.status ?? null;
  apiError.data = backendData ?? null;

  return apiError;
};

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
    return Promise.reject(buildApiError(error));
  }
);

publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(buildApiError(error));
  }
);