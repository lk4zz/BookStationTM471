import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getCurrentUser, getUserById, updateUserProfile, getAllUsers, searchUsers } from "../../api/users";
import { qk } from "../queryKeys";

//fetch all users
export const useAllUsers = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: qk.user.list(),
        queryFn: () => getAllUsers(),
    });

    const users = data?.data ?? data ?? [];
    return { users, isLoading, error };
};

//fetch user by id for profile
export const useUser = (userId) => {
    const { data, isLoading, error } = useQuery({
        queryKey: qk.user.detail(userId),
        queryFn: () => getUserById(userId),  //fetches user by id
        enabled: !!userId,
    });

    const user = data?.data ?? data ?? null;

    return { user, isLoading, error };
};

//fetch the current user id can be put in session storage
export const useCurrentUser = () => {
    const hasToken =
        typeof window !== "undefined" && !!localStorage.getItem("token");

    const { data: currentUser, isLoading: isCurrentUserLoading, currentUserError } = useQuery({
        queryKey: qk.user.current(),
        queryFn: () => getCurrentUser(),
        enabled: hasToken,
        staleTime: 0, // Data is instantly considered old, forcing a background refetch
        refetchOnWindowFocus: true,
    });

    return {
        currentUser: currentUser ?? null,
        isAuthenticated: !!currentUser,
        isCurrentUserLoading,
        currentUserError,
    };
};

//search for users (admin search and explore search to find authors by name)
export const useUserSearch = (query, limit = 10) => {
    const trimmed = (query ?? "").trim();
    const { data, isLoading, error } = useQuery({
        queryKey: ["users", "search", trimmed, limit],
        queryFn: () => searchUsers(trimmed, limit),
        enabled: trimmed.length >= 2,
        staleTime: 30_000,
        retry: false,
    });
    return { authors: data?.data ?? data ?? [], isLoading, error };
};

//edit user profile 
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
            await queryClient.refetchQueries({ queryKey: qk.user.detail(user.id) });
            onSuccess?.(); //on success indicator (when everything succesully uploaded)
        },
    });

    //handle state change
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