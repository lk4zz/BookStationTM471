import { privateApi } from "./axios";

export const createReport = async (bookId, reason, comment) => {
  const res = await privateApi.post(`/reports/${bookId}/report`, { reason, comment });
  return res.data;
};

export const getBookReportDetails = async (bookId) => {
  const res = await privateApi.get(`/reports/${bookId}/report`);
  return res.data;
};