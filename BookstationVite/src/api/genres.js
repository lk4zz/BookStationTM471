import { publicApi, privateApi } from "./axios";

export const getAllGenres = async () => {
    const res = await publicApi.get('/genres')
    console.log(res.data)
    return res.data;
}