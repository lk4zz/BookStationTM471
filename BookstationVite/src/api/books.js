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

export const getBooksByGenre = async(genreId) => {
    console.log(`fetching books with genre ${genreId}`)
    const res = await publicApi.get(`/books/genres/${genreId}`)
    return res.data;
}

export const getBooksByAuthor = async(userId) => {
    const res = await privateApi.get(`/books/author/${userId}`)
    return res.data;
}