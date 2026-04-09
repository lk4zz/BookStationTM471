import { privateApi } from "./axios";

export const getChaptersFromBook = async (id) => {
    const res = await privateApi.get(`/chapters/book/${id}`);
    return res.data;
};

export const getChaptersById = async (chapterId) => {
    const res = await privateApi.get(`/chapters/${chapterId}`);
    return res.data;
};

export const createChapter = async (bookId, title) => {
    const res = await privateApi.post(`/chapters/book/${bookId}`, { title });
    return res.data;
};

export const updateChapter = async (chapterId, { title, price }) => {
    const body = {};
    if (title !== undefined) body.title = title;
    if (price !== undefined) body.price = price;
    const res = await privateApi.put(`/chapters/${chapterId}`, body);
    return res.data;
};

export const deleteChapter = async (chapterId) => {
    const res = await privateApi.delete(`/chapters/${chapterId}`);
    return res.data;
};

export const publishChapter = async (chapterId, price) => {
    const res = await privateApi.put(`/chapters/${chapterId}/publish`, { price });
    return res.data;
};

export const unlockChapter = async (chapterId) => {
    const res = await privateApi.post(`/chapters/${chapterId}/unlock`);
    return res.data;
};
