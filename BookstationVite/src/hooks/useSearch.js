import { useState, useEffect } from "react";
import { getSearch } from "../api/search";
import { useQuery } from "@tanstack/react-query";

const DEBOUNCE_MS = 500;

export const useSearch = (query) => {
    const trimmed = query?.trim() || "";
    const [debouncedQuery, setDebouncedQuery] = useState(trimmed);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [trimmed]);

    const {
        data: searchData,
        isLoading: isSearchLoading,
        error: searchError,
    } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () => getSearch(debouncedQuery),
        enabled: debouncedQuery.length > 0,
    });

    const isDebouncing = trimmed !== debouncedQuery && trimmed.length > 0;
    const searchResults = searchData?.data ?? [];

    return { searchResults, isSearchLoading: isSearchLoading || isDebouncing, searchError };
};
