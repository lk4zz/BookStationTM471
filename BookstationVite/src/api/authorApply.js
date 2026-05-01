import { privateApi } from "./axios";

export const submitAuthorApplication = async (penName, writingIntent, agreedToPolicy, documentFile) => {
    const formData = new FormData();

    formData.append("penName", penName);
    formData.append("writingIntent", writingIntent);
    formData.append("agreedToPolicy", agreedToPolicy);

    // key must match uploadDocs.single('document') in the express route
    if (documentFile) {
        formData.append("document", documentFile);
    }

    const res = await privateApi.post("/applications/apply", formData);
    return res.data;
};

export const getMyApplicationStatus = async () => {
    const res = await privateApi.get("/applications/status");
    return res.data;
};