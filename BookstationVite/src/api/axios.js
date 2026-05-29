import axios from "axios";
import toast from "react-hot-toast";

const BANNED_MESSAGE =
  "Your account was banned for violating our terms and services.";

// Normalizes Axios errors into a consistent Error object with status and data fields.
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
  if (backendData?.banned) {
    apiError.banned = true;
  }

  return apiError;
};

// Handles 401/403 responses by clearing the token and redirecting to login
// Skips redirect for guests (no prior token) to let React Router handle unauthenticated routes
const handleAuthErrors = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (!status) return;

  const isBanned = status === 403 && data?.banned;
  const isTokenExpired = status === 401 || (status === 403 && !data?.banned);

  //if user is banned or their token is expired
  if (isBanned || isTokenExpired) {
    const hadToken = !!localStorage.getItem("token");

    //remove their token from local storage
    localStorage.removeItem("token");

    //redirect to log in
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const onLoginPage = path === "/login" || path.endsWith("/login");

    //if user is redirected to log in after getting banned display banned message
    if (!onLoginPage && (hadToken || isBanned)) {
      if (isBanned) {
        toast.error(data?.message || BANNED_MESSAGE);
      } else {
        toast.error("Session expired. Please log in again.");
      }

      window.location.href = "/login";
    }
  }
};

export const publicApi = axios.create({
  baseURL: "http://localhost:3000",
});

export const privateApi = axios.create({
  baseURL: "http://localhost:3000",
});

// Attaches the Bearer token to every request if one exists in storage.
const attachTokenIfPresent = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

publicApi.interceptors.request.use(attachTokenIfPresent, (error) =>
  Promise.reject(error)
);

privateApi.interceptors.request.use(attachTokenIfPresent, (error) =>
  Promise.reject(error)
);

// privateApi enforces auth on every failed response — redirects on expired or banned sessions.
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    handleAuthErrors(error);
    return Promise.reject(buildApiError(error));
  }
);

// publicApi now also handles auth errors (removing tokens and redirecting) just like privateApi.
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    handleAuthErrors(error);
    return Promise.reject(buildApiError(error));
  }
);