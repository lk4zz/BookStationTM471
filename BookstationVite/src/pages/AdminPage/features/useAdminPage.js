import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, banUser, deleteBook } from "../../../api/admin";
import { getAllBooks } from "../../../api/books";
import { jwtDecode } from "jwt-decode";
import { userMatchesSearch, bookMatchesSearch } from "./fuzzyNameSearch";

/** Avoid rendering huge DOM lists from a single fuzzy filter pass. */
export const ADMIN_MAX_VISIBLE_ROWS = 2000;

export const useAdminPage = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const token = localStorage.getItem("token");
  const currentAdminId = token ? jwtDecode(token).userId : null;

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });

  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooks,
    retry: false,
  });

  const usersRaw = usersQuery.data?.users || [];
  const booksRaw = booksQuery.data?.data ?? booksQuery.data ?? [];

  const filteredUsers = useMemo(() => {
    const list = usersRaw.filter((u) => userMatchesSearch(u, userSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [usersRaw, userSearch]);

  const filteredBooks = useMemo(() => {
    const list = booksRaw.filter((b) => bookMatchesSearch(b, bookSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [booksRaw, bookSearch]);

  const userListTruncated =
    usersRaw.filter((u) => userMatchesSearch(u, userSearch)).length >
    ADMIN_MAX_VISIBLE_ROWS;
  const bookListTruncated =
    booksRaw.filter((b) => bookMatchesSearch(b, bookSearch)).length >
    ADMIN_MAX_VISIBLE_ROWS;

  const banUserMutation = useMutation({
    mutationFn: async (userId) => {
      if (userId === currentAdminId) {
        throw new Error("You cannot ban yourself.");
      }
      return banUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    usersData: usersRaw,
    filteredUsers,
    userSearch,
    setUserSearch,
    userListTruncated,

    booksData: booksRaw,
    filteredBooks,
    bookSearch,
    setBookSearch,
    bookListTruncated,

    isUsersLoading: usersQuery.isLoading,
    usersError: usersQuery.error,

    isBooksLoading: booksQuery.isLoading,
    booksError:
      booksQuery.error?.response?.status === 404 ? null : booksQuery.error,

    banUser: banUserMutation.mutate,
    isBanning: banUserMutation.isPending,
    banError: banUserMutation.error,

    deleteBook: deleteBookMutation.mutate,
    isDeletingBook: deleteBookMutation.isPending,
    deleteBookError: deleteBookMutation.error,

    activeTab,
    setActiveTab,

    catalogBookCount: booksRaw.length,
    regularUserCount: usersRaw.length,
  };
};
