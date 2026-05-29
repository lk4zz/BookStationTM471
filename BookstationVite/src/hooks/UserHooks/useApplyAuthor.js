import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { submitAuthorApplication, getMyApplicationStatus } from "../../api/authorApply";
import { qk } from "../queryKeys";

//check application status
export const useApplicationStatus = () => {
    return useQuery({
        queryKey: qk.application.status(),
        queryFn: getMyApplicationStatus,
    });
};

//apply mutation to apply for author role
export const useApplyAuthor = (onSuccess) => {
    //store formdata in a state
    const [formData, setFormData] = useState({
        penName: "",
        writingIntent: "",
        agreedToPolicy: false,
        claimsExpertise: false, // UI toggle for file input
    });
    //store document file
    const [documentFile, setDocumentFile] = useState(null);

    const mutation = useMutation({
        //apply (send the formdata using mutation)
        mutationFn: () => submitAuthorApplication(
            formData.penName,
            formData.writingIntent,
            formData.agreedToPolicy,
            documentFile
        ),
        onSuccess: (data) => {
            // Reset form on success
            setFormData({ penName: "", writingIntent: "", agreedToPolicy: false, claimsExpertise: false });
            setDocumentFile(null);
            onSuccess?.(data);
        },
    });

    //handle state change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    //handle document upload
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDocumentFile(file);
    };

    //submit (do the final mutation)
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return {
        formData,
        documentFile,
        isLoading: mutation.isPending,
        error: mutation.error ?? null,
        isSuccess: mutation.isSuccess,
        handleChange,
        handleFileChange,
        handleSubmit,
    };
};