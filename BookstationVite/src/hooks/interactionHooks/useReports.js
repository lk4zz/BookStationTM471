import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReport, getBookReportDetails } from "../../api/report";
import { qk } from "../queryKeys";

//create a report
export const useCreateReport = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ bookId, reason, comment }) => createReport(bookId, reason, comment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: qk.reports.byBook(variables.bookId) });
        }
    });
};

//fetch report details for admins
export const useGetBookReportDetails = (bookId) => {
    const {
        data: reportData,
        isLoading: isReportLoading,
        error: reportError,
    } = useQuery({
        queryKey: qk.reports.byBook(bookId),
        queryFn: () => getBookReportDetails(bookId),
        enabled: !!bookId, 
    });

    const reportDetails = reportData?.data || null;

    return { reportDetails, isReportLoading, reportError };
};