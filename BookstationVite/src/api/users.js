import { privateApi } from "./axios";

export const getUserById = async (userId) => {
    const res = await privateApi.get(`/users/${userId}`);
    return res.data;
};

export const getCurrentUser = async () => {
    const res = await privateApi.get("/users/currentUser");
    return res.data;
};

export const updateUserProfile = async (name, bio, imageFile) => {
    const formData = new FormData();

    // Always append text fields so the backend can clear them if the user blanks them out
    formData.append("name", name ?? "");
    formData.append("bio", bio ?? "");

    // key must match upload.single('file') in the express route
    if (imageFile) {
        formData.append("file", imageFile);
    }

    const res = await privateApi.post("/users", formData);
    return res.data;
};

export const follow = async (userId) => {
    const res = await privateApi.post(`/following/${userId}`);
    return res.data;
}

export const unfollow = async (userId) => {
    const res = await privateApi.delete(`/following/${userId}`);
    return res.data;
}

export const followStatus = async (userId) => {
    const res = await privateApi.get(`/following/${userId}`);
    return res.data;
}