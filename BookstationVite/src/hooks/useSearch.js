import { useState, useEffect } from "react";
import { getSearch } from "../api/search";
import { useQuery } from "@tanstack/react-query";
import { qk } from "./queryKeys";

const DEBOUNCE_MS = 500;

//semantic search using embedded data
export const useSearch = (query) => {
    const trimmed = query?.trim() || "";
    //state
    const [debouncedQuery, setDebouncedQuery] = useState(trimmed);

    //debounce (load while searching give results after debounce time)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [trimmed]);

    const {
        data: searchData,
        isLoading: isSearchLoading,
        error: searchError,
    } = useQuery({
        queryKey: qk.search.query(debouncedQuery),
        queryFn: () => getSearch(debouncedQuery),
        enabled: debouncedQuery.length > 0,
    });

    const isDebouncing = trimmed !== debouncedQuery && trimmed.length > 0;
    const searchResults = searchData?.data ?? [];

    return { searchResults, isSearchLoading: isSearchLoading || isDebouncing, searchError };
};
