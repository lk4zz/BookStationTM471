import { useQuery } from "@tanstack/react-query";
import { getPendingApplications } from "../../api/admin";
import { getAllUsers } from "../../api/admin";
import { getAdminBooks, getUserRadar } from "../../api/admin";
import { getReviewQueue } from "../../api/admin";
import { qk } from "../queryKeys";

//fetch all the users
export const useAllUsers = () => {
  const query = useQuery({
    queryKey: qk.admin.users(),
    queryFn: getAllUsers,
  });

  return {
    ...query,
    usersRaw: query.data?.users || [],
  };
};


//fetch all the books except for drafts
export const useAllBooks = () => {
  const query = useQuery({
    queryKey: qk.admin.books(),
    queryFn: getAdminBooks,
    retry: false,
  });

  return {
    ...query,
    booksRaw: query.data?.data ?? query.data ?? [],
  };
};

//fetch pending author applications
export const usePendingApplications = () => {
  const query = useQuery({
    queryKey: qk.admin.applications(),
    queryFn: getPendingApplications,
  });

  return {
    ...query,
    applications: query.data?.data || query.data || [],
  };
};

//fetch flagged books review queue
export const useReviewQueue = () => {
  const query = useQuery({
    queryKey: qk.admin.reviewQueue(),
    queryFn: getReviewQueue,
  });

  return {
    ...query,
    reviewQueue: query.data?.data || query.data || [],
  };
};

//fetch the user radar
export const useUserRadar = (appliedId, enabled) => {
  const query = useQuery({
    queryKey: qk.user.radar(appliedId),
    queryFn: () => getUserRadar(Number(appliedId)),
    enabled,
    refetchInterval: 3000,
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    // Safely extract the radar data directly from the hook
    books: query.data?.books ?? [],
    isPersonalized: query.data?.isPersonalized ?? false,
  };
};