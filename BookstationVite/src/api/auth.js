import { publicApi } from "./axios"; 

export const login = async (credentials) => {
  const res = await publicApi.post("/auth/login", credentials);

  if (res.data?.token && res.data?.user) {
    localStorage.setItem("token", res.data.token); //set token upon log in to local storage
  }

  return res.data;
};

export const signup = async (userData) => {
  const res = await publicApi.post("/auth/signup", userData);
  
  if (res.data.token && res.data.user) {
    localStorage.setItem("token", res.data.token);//set token upon sign up to local storage
  }
  
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};