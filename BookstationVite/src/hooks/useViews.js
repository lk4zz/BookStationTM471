import { getViews } from "../api/views";
import { useQuery } from "@tanstack/react-query";

export const useViews = (numericId) => {

    const { data: viewsData } = useQuery({
        queryKey: ["views", numericId],
        queryFn: () => getViews(numericId),
        enabled: Number.isFinite(numericId),
    });

    const totalViews = viewsData?.data || 0;

    return { totalViews }

}