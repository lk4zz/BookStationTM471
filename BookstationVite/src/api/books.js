import api from "./axios"; 

export const getAllBooks = async () => {

    const res = await api.get("/books");

    return res.data;
}

export const getBookById = async (id) => {

    console.log("Fetching book with id:", id);
    const res = await api.get(`/books/${id}`);

    return  res.data;
}

export default { getAllBooks, getBookById };