import { useMutation } from "@tanstack/react-query"
import { follow, unfollow, followStatus as fetchFollowStatus } from "../api/users"
import { useQueryClient, useQuery } from "@tanstack/react-query"

export const useFollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (authorId) => follow(authorId),
        onSuccess: (_data, authorId) => {
            const id = Number(authorId)
            if (Number.isFinite(id)) {
                queryClient.invalidateQueries({ queryKey: ["followStatus", id] })
            }
            queryClient.invalidateQueries({ queryKey: ["books", "followed-authors"] })
        },
        onError: (error) => {
            console.error("Failed to follow:", error);
        },
    })
}

export const useUnfollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (authorId) => unfollow(authorId),
        onSuccess: (_data, authorId) => {
            const id = Number(authorId)
            if (Number.isFinite(id)) {
                queryClient.invalidateQueries({ queryKey: ["followStatus", id] })
            }
            queryClient.invalidateQueries({ queryKey: ["books", "followed-authors"] })
        },
        onError: (error) => {
            console.error("Failed to unfollow:", error);
        },
    })
}

export const useFollowStatus = (authorId) => {
    const numericId = Number(authorId)
    const {
        data: followStatusPayload,
        isLoading: isFollowStatusLoading,
        error: followStatusError,
    } = useQuery({
        queryKey: ["followStatus", numericId],
        queryFn: () => fetchFollowStatus(numericId),
        enabled: Number.isFinite(numericId),
    })
    const isFollowingFromServer = followStatusPayload?.isFollowing === true

    return {
        followStatusPayload,
        isFollowingFromServer,
        isFollowStatusLoading,
        followStatusError,
    }
}

