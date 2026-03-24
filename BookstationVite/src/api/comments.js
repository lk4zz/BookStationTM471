import { publicApi, privateApi } from "./axios";

export const getCommentsByBook = async (id) => {
    console.log("Fetching comments from book with id:", id);
    const res = await publicApi.get(`/comments/${id}`);
    return res.data;
}

export const PostComment = async (id, comment) => {
    console.log("Adding comment to book with id:", id);
    await privateApi.post(`/comments/${id}`, { comment });
}

export default { getCommentsByBook };