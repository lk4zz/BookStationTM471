import { publicApi, privateApi } from "./axios";

export const getChaptersFromBook = async (id) => {

    console.log("Fetching chapters from book with id:", id);
    const res = await privateApi.get(`/chapters/book/${id}`);

    return  res.data;
}


export const getChaptersById = async (chapterId) => {
    console.log("fetching chapter", chapterId)
    const res = await privateApi.get(`/chapters/${chapterId}`)
    return res.data;
}

export default { getChaptersFromBook };