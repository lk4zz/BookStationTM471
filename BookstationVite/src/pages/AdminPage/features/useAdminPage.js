import { useState, useMemo } from "react";
import { userMatchesSearch, bookMatchesSearch } from "./fuzzyNameSearch";
import { useAllUsers, useAllBooks } from "../../../hooks/adminHooks/useAdminQueries";
import { useBanUser, useDeleteBook, useChangeUserRole } from "../../../hooks/adminHooks/useAdminMutations";

export const ADMIN_MAX_VISIBLE_ROWS = 2000;

export const useAdminPage = () => {
  //  raw data AND the query states
  const { usersRaw, isLoading: isUsersLoading, error: usersError } = useAllUsers();
  const { booksRaw, isLoading: isBooksLoading, error: booksError } = useAllBooks();
  
  //  mutation hooks
  const banUserMutation = useBanUser();
  const deleteBookMutation = useDeleteBook();
  const changeUserRoleMutation = useChangeUserRole();


  // STATES
  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  // FUZZY SEARCH OF USERS
  const filteredUsers = useMemo(() => {
    const list = usersRaw.filter((u) => userMatchesSearch(u, userSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [usersRaw, userSearch]);

  // FUZZY SEARCH OF BOOKS
  const filteredBooks = useMemo(() => {
    const list = booksRaw.filter((b) => bookMatchesSearch(b, bookSearch));
    if (list.length <= ADMIN_MAX_VISIBLE_ROWS) return list;
    return list.slice(0, ADMIN_MAX_VISIBLE_ROWS);
  }, [booksRaw, bookSearch]);

  const userListTruncated = useMemo(() => {
    return usersRaw.filter((u) => userMatchesSearch(u, userSearch)).length > ADMIN_MAX_VISIBLE_ROWS;
  }, [usersRaw, userSearch]);

  const bookListTruncated = useMemo(() => {
    return booksRaw.filter((b) => bookMatchesSearch(b, bookSearch)).length > ADMIN_MAX_VISIBLE_ROWS;
  }, [booksRaw, bookSearch]);

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

    isUsersLoading,
    usersError,

    isBooksLoading,
    booksError: booksError?.response?.status === 404 ? null : booksError,

    banUser: banUserMutation.mutate,
    isBanning: banUserMutation.isPending,
    banError: banUserMutation.error,

    changeUserRole: changeUserRoleMutation.mutate,
    isChangingUserRole: changeUserRoleMutation.isPending,
    changeUserRoleError: changeUserRoleMutation.error,

    deleteBook: deleteBookMutation.mutate,
    isDeletingBook: deleteBookMutation.isPending,
    deleteBookError: deleteBookMutation.error,

    activeTab,
    setActiveTab,

    catalogBookCount: booksRaw.length,
    regularUserCount: usersRaw.length,
  };
};