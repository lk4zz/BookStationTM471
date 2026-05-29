import { useMutation } from "@tanstack/react-query"
import { follow, unfollow, followStatus as fetchFollowStatus } from "../../api/users"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { qk } from "../queryKeys"

// these two follow and unfolow can be combined into one
// by changing the service and allowing it to toggle 

//follow an author mutation
export const useFollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (authorId) => follow(authorId),
        onSuccess: (_data, authorId) => {
            const id = Number(authorId)
            if (Number.isFinite(id)) {
                queryClient.invalidateQueries({ queryKey: qk.follow.status(id) })
            }
            queryClient.invalidateQueries({ queryKey: qk.books.followedAuthors() })
        },
        onError: (error) => {
            console.error("Failed to follow:", error);
        },
    })
}

//unfollow an author
export const useUnfollow = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (authorId) => unfollow(authorId),
        onSuccess: (_data, authorId) => {
            const id = Number(authorId)
            if (Number.isFinite(id)) {
                queryClient.invalidateQueries({ queryKey: qk.follow.status(id) })
            }
            queryClient.invalidateQueries({ queryKey: qk.books.followedAuthors() })
        },
        onError: (error) => {
            console.error("Failed to unfollow:", error);
        },
    })
}

//check follow status
export const useFollowStatus = (authorId) => {
    const numericId = Number(authorId)
    const {
        data: followStatusPayload,
        isLoading: isFollowStatusLoading,
        error: followStatusError,
    } = useQuery({
        queryKey: qk.follow.status(numericId),
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

