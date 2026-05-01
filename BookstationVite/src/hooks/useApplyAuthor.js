import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { submitAuthorApplication, getMyApplicationStatus } from "../api/authorApply";


export const useApplicationStatus = () => {
    return useQuery({
        queryKey: ["applicationStatus"],
        queryFn: getMyApplicationStatus,
    });
};


export const useApplyAuthor = (onSuccess) => {
    const [formData, setFormData] = useState({
        penName: "",
        writingIntent: "",
        agreedToPolicy: false,
        claimsExpertise: false, // UI toggle for file input
    });
    const [documentFile, setDocumentFile] = useState(null);

    const mutation = useMutation({
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDocumentFile(file);
    };

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