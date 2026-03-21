import api from "./axios"; 

export const getChaptersFromBook = async (id) => {

    console.log("Fetching chapters from book with id:", id);
    const res = await api.get(`/chapters/book/${id}`);

    return  res.data;
}

export default { getChaptersFromBook };