import { publicApi, privateApi } from "./axios";

export const getAllBooks = async () => {

    const res = await publicApi.get("/books");

    return res.data;
}

export const getBookById = async (id, includeAuth = false) => {
    console.log("Fetching book with id:", id);
    const apiClient = includeAuth ? privateApi : publicApi;
    const res = await apiClient.get(`/books/${id}`);

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

export const createBook = async ({ title, description = "" }) => {
    const res = await privateApi.post("/books", { title, description });
    return res.data;
};

export const deleteBook = async (bookId) => {
    const res = await privateApi.delete(`/books/${bookId}`);
    return res.data;
};

export const updateBookStatus = async (bookId, requestedStatus) => {
    const res = await privateApi.put(`/books/${bookId}/status`, { requestedStatus });
    return res.data;
};