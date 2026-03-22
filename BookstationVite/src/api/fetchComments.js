import api from "./axios"; 

export const getCommentsByBook = async (id) => {
    console.log("Fetching comments from book with id:", id);
    const res = await api.get(`/comments/${id}`);
    return res.data;
}

export default { getCommentsByBook };