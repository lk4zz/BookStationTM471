import { publicApi, privateApi } from "./axios";

// --- queries ---

// pulling standard public lists and pagination for discovery feeds
export const getAllBooks = async () => {
    const res = await publicApi.get("/books");
    return res.data;
};

export const getDiscoverBooks = async ({ limit = 24, cursor } = {}) => {
    const res = await publicApi.get(`/books/discover`, { params: { limit, cursor } });
    return res.data;
};

export const getTrendingBooks = async (limit) => {
    const res = await publicApi.get(`/books/trending`, { params: { limit } });
    return res.data;
};

export const getHighEngagementBooks = async (limit) => {
    const res = await publicApi.get(`/books/high-engagement`, { params: { limit } });
    return res.data;
};

export const getCompletedBooks = async ({ limit = 20 } = {}) => {
    const res = await publicApi.get(`/books/completed`, { params: { limit } });
    return res.data;
};

export const getBooksByGenre = async (genreId) => {
    const res = await publicApi.get(`/books/genres/${genreId}`);
    return res.data;
};

// fetching a single book with an optional auth override to grab user-specific state if logged in
export const getBookById = async (id, includeAuth = false) => {
    const apiClient = includeAuth ? privateApi : publicApi;
    const res = await apiClient.get(`/books/${id}`);
    return res.data;
};

// grabbing authenticated feeds and handling personalized recommendations based on taste profiles
export const getBooksByAuthor = async (userId) => {
    const res = await privateApi.get(`/books/author/${userId}`);
    return res.data;
};

export const getForYouBooks = async () => {
    const res = await privateApi.get("/books/recommendations/for-you");
    return res.data;
};

export const getBooksByFollowedAuthors = async () => {
    const res = await privateApi.get("/books/recommendations/followedAuthors");
    return res.data;
};


// --- mutations ---

// standard crud operations for setting up book metadata and handling cover uploads
export const createBook = async ({ title, description = "" }) => {
    const res = await privateApi.post("/books", { title, description });
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
    if (imageFile) {
        formData.append("file", imageFile);
    }
    const res = await privateApi.put(`/books/${bookId}/cover`, formData);
    return res.data;
};

export const deleteBook = async (bookId) => {
    const res = await privateApi.delete(`/books/${bookId}`);
    return res.data;
};

// handling complex state changes for the publishing workflow and review processes
export const updateBookStatus = async (bookId, requestedStatus) => {
    const res = await privateApi.put(`/books/${bookId}/status`, { requestedStatus });
    return res.data;
};

export const launchBook = async (bookId, chapterPrices) => {
    const res = await privateApi.put(`/books/${bookId}/launch`, { chapterPrices });
    return res.data;
};

export const submitForReview = async ({ bookId, submissionNote }) => {
    const res = await privateApi.put(`/books/${bookId}/submit-review`, { submissionNote });
    return res.data;
};