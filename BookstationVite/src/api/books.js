import { publicApi, privateApi } from "./axios";

export const getAllBooks = async () => {

    const res = await publicApi.get("/books");

    return res.data;
}

export const getBookById = async (id) => {

    console.log("Fetching book with id:", id);
    const res = await publicApi.get(`/books/${id}`);

    return  res.data;
}

export default { getAllBooks, getBookById };