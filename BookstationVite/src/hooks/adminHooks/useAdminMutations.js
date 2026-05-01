import { useMutation, useQueryClient } from "@tanstack/react-query";
import { banUser, deleteBook, reviewApplication, changeUserRole } from "../../api/admin";
import { jwtDecode } from "jwt-decode";

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const token = localStorage.getItem("token");
      const currentAdminId = token ? jwtDecode(token).userId : null;

      if (userId === currentAdminId) {
        throw new Error("You cannot ban yourself.");
      }
      return banUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useReviewApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }) => {
    return changeUserRole({ userId, roleId }) },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

}