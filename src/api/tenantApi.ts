import apiClient from "./client";
import type { Tenant } from "../types";

export const getAllTenants = async (): Promise<Tenant[]> => {
    const response = await apiClient.get<Tenant[]>("/tenants");
    return response.data;
};

export const getTenantById = async (id: number): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`/tenants/${id}`);
    return response.data;
};

export const createTenant = async (
    unitId: number,
    tenant: Omit<Tenant, "id" | "unit">
): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>(
        `/units/${unitId}/tenants`,
        tenant
    );
    return response.data;
};

export const updateTenant = async (
    id: number,
    tenant: Omit<Tenant, "id" | "unit">
): Promise<Tenant> => {
    const response = await apiClient.put<Tenant>(`/tenants/${id}`, tenant);
    return response.data;
};

export const deleteTenant = async (id: number): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
};

