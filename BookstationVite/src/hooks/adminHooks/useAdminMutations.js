import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserBan, deleteBook, reviewApplication, changeUserRole } from "../../api/admin";
import { flagBookAndNotify, unflagBook, sendFeedbackAgain } from "../../api/admin";
import { jwtDecode } from "jwt-decode";
import { qk } from "../queryKeys";


//ban user mutation through API
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const token = localStorage.getItem("token");
      const currentAdminId = token ? jwtDecode(token).userId : null;

      if (Number(userId) === Number(currentAdminId)) {
        throw new Error("You cannot ban yourself.");
      }
      return toggleUserBan(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.users() });
    },
  });
};

//Delete any book without restrictions for admins
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.books() });
      queryClient.invalidateQueries({ queryKey: qk.books.all() });
    },
  });
};

//approve or reject author applications
export const useReviewApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.applications() });
      queryClient.invalidateQueries({ queryKey: qk.admin.users() });
    },
  });
};


//change any user role
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }) => {
    return changeUserRole({ userId, roleId }) },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: qk.admin.users() });
    },
  });

}

//falg a book and notify
export const useFlagBookAndNotify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flagBookAndNotify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.books() });
      queryClient.invalidateQueries({ queryKey: qk.books.all() });
      queryClient.invalidateQueries({ queryKey: qk.admin.reviewQueue() });
    },
  });
};

//unflag the book (no need for reason)
export const useUnflagBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unflagBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.books() });
      queryClient.invalidateQueries({ queryKey: qk.books.all() });
      queryClient.invalidateQueries({ queryKey: qk.admin.reviewQueue() });
    },
  });
};

//send feedback again when reviewing books
export const useSendFeedbackAgain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFeedbackAgain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.admin.reviewQueue() });
    },
  });
};