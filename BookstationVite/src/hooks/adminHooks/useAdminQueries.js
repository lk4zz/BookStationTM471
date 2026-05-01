import { useQuery } from "@tanstack/react-query";
import { getPendingApplications } from "../../api/admin";
import { getAllUsers } from "../../api/admin";
import { getAllBooks } from "../../api/books";

export const useAllUsers = () => {
  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });

  return {
    ...query,
    usersRaw: query.data?.users || [],
  };
};

export const useAllBooks = () => {
  const query = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
    retry: false,
  });

  return {
    ...query,
    booksRaw: query.data?.data ?? query.data ?? [],
  };
};

export const usePendingApplications = () => {
  const query = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: getPendingApplications,
  });

  return {
    ...query,
    applications: query.data?.data || query.data || [],
  };
};