import { privateApi } from "./axios";

export const getUserById = async (userId) => {
    const res = await privateApi.get(`/users/${userId}`);
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