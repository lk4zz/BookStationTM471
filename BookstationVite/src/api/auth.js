import { publicApi, privateApi } from "./axios";

export const signup = async (formData) => {
    const res = await publicApi.post("/auth/signup", formData);
    return res.data;
};

export const login = async (formData) => {
    console.log(formData);
    const res = await publicApi.post("/auth/login", formData);
    return res.data;
};

export default { signup, login };