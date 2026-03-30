import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getUserById, updateUserProfile } from "../api/users";

export const USER_QUERY_KEY = (userId) => ["user", String(userId)];

export const useUser = (userId) => {
    const { data, isLoading, error } = useQuery({
        queryKey: USER_QUERY_KEY(userId),
        queryFn: () => getUserById(userId),  //fetches user by id
        enabled: !!userId,
    });

    const user = data?.data ?? data ?? null;

    return { user, isLoading, error };
};


export const useCurrentUserId = () => {
    const stored = localStorage.getItem("userId");
    const currentUserId = stored ? Number(stored) : null;
    return { currentUserId, isAuthenticated: !!currentUserId }; //fetches current user from local storage
};


export const useEditProfile = (user, onSuccess) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ name: "", bio: "" }); //name and bio
    const [imageFile, setImageFile] = useState(null);  //image
    const [imagePreview, setImagePreview] = useState(null);  //image preview (abl ma yaaml upload to db)

    // populate form whenever the user data arrives or changes
    useEffect(() => {
        if (user) {
            setFormData({ name: user.name ?? "", bio: user.bio ?? "" });
            setImagePreview(null);
            setImageFile(null);
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: ({ name, bio, imageFile }) =>
            updateUserProfile(name, bio, imageFile),

        onSuccess: async () => {
            //refresh quieries before exiting edit mode
            await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY(user.id) });
            onSuccess?.(); //on success indicator (when everything succesully uploaded)
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        //this one removes(revokes) the fake url to not waste memory and cause errors
        if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        //this creates a fake url so the image can be shown before upload
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ name: formData.name, bio: formData.bio, imageFile });
    };

    return {
        formData,
        imageFile,
        imagePreview,
        isLoading: mutation.isPending,
        error: mutation.error ?? null,
        handleChange,
        handleImageChange,
        handleSubmit,
    };
};