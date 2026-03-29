import { publicApi } from "./axios"; 

export const login = async (credentials) => {
  const res = await publicApi.post("/auth/login", credentials);
  
  // Save token and userId directly to local storage
  if (res.data.token && res.data.user) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.id); 
  }
  
  return res.data;
};

export const signup = async (userData) => {
  const res = await publicApi.post("/auth/signup", userData);
  
  if (res.data.token && res.data.user) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.id);
  }
  
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};