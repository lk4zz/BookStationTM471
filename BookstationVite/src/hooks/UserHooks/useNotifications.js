import { getNotifications, markNotificationAsRead } from "../../api/notifications";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../queryKeys";

//fetch notification for current user
export const useNotifications = () => {
    const {
        data: notificationsData,
        isLoading: isNotificationsLoading,
        error: notificationsError,
    } = useQuery({
        queryKey: qk.notifications.all(),
        queryFn: getNotifications,
    });

    const notifications = notificationsData?.data ?? notificationsData ?? [];

    return { notifications, isNotificationsLoading, notificationsError };

}

//mark notification as read (deletes them from UI but keeps them in db)
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qk.notifications.all() })
        },
    })
}