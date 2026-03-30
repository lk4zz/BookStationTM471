import { privateApi } from "./axios";

export const getPagesByChapter = async (chapterId) => {
    const res = await privateApi.get(`/pages/${chapterId}`);
    return res.data;
};

export const getPagesForAuthor = async (chapterId) => {
    const res = await privateApi.get(`/pages/author/${chapterId}`);
    return res.data;
};

export const upsertPrimaryPage = async (chapterId, text) => {
    const res = await privateApi.put(`/pages/primary/${chapterId}`, { text });
    return res.data;
};

export default getPagesByChapter;
