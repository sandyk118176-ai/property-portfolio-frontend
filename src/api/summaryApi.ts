import apiClient from "./client";
import type { PortfolioSummary } from "../types";

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
    const response = await apiClient.get<PortfolioSummary>("/summary");
    return response.data;
};