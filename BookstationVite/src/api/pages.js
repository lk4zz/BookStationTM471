import { publicApi, privateApi } from "./axios";

export const getPagesByChapter = async (chapterId) => {
    console.log(`fetching pages from chapterId`, chapterId)
    const res = await privateApi.get(`/pages/${chapterId}`)
    return res.data;
}

export default getPagesByChapter;


