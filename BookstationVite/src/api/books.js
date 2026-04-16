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

export const getForYouBooks = async () => {
    const res = await privateApi.get("/books/recommendations/for-you");
    return res.data;
};

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

export const launchBook = async (bookId, chapterPrices) => {
    const res = await privateApi.put(`/books/${bookId}/launch`, { chapterPrices });
    return res.data;
};


export const getTrendingBooks = async (limit) => {
    const res = await publicApi.get(`/books/trending`, { params: { limit } });
    return res.data;
};

export const updateBook = async (bookId, { title, description }) => {
    const res = await privateApi.put(`/books/${bookId}`, { title, description });
    return res.data;
};

export const tagBook = async (bookId, genreIds) => {
    const res = await privateApi.post(`/books/${bookId}/genres`, { genreIds });
    return res.data;
};

export const updateBookCover = async (imageFile, bookId) => {
    const formData = new FormData();
    console.log("using the bookId", bookId)
    // key must match upload.single('file') in the express route
    if (imageFile) {
        formData.append("file", imageFile);
    }
    console.log("using the formData", formData)
    console.log("using the image in API", imageFile)
    const res = await privateApi.put(`/books/${bookId}/cover`, formData);
    return res.data;
};