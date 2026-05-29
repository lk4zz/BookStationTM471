import { privateApi } from "./axios";

export const submitAuthorApplication = async (penName, writingIntent, agreedToPolicy, documentFile) => {
    //create a new formdata stucture
    const formData = new FormData();

    //append all the fields to the formdata
    formData.append("penName", penName);
    formData.append("writingIntent", writingIntent);
    formData.append("agreedToPolicy", agreedToPolicy);

    // key must match uploadDocs.single('document') in the express route
    //append the attached document if existed
    if (documentFile) {
        formData.append("document", documentFile);
    }

    const res = await privateApi.post("/applications/apply", formData);
    return res.data;
};

// check application satus to decide what to show in UI (relying on notifs mostly)
export const getMyApplicationStatus = async () => {
    const res = await privateApi.get("/applications/status");
    return res.data;
};