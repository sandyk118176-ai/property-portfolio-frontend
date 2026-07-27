import apiClient from "./client";
import type { Unit } from "../types";

export const getAllUnits = async ():  Promise<Unit[]> => {
    const response = await apiClient.get<Unit[]>("/units");
    return response.data;
};

export const getUnitById = async (id: number): Promise<Unit> => {
    const response = await apiClient.get<Unit>(`/units/${id}`);
    return response.data;
};

export const createUnit = async (
    propertyId: number,
    unit: Omit<Unit, "id" | "property">
): Promise<Unit> => {
    const response = await apiClient.post<Unit>(
        `/properties/${propertyId}/units`, 
        unit
    );
    return response.data;
};

export const updateUnit = async (
    id: number,
    unit: Omit<Unit, "id" | "property">
): Promise<Unit> => {
    const response = await apiClient.put<Unit>(`/units/${id}`, unit);
    return response.data;
};

export const deleteUnit = async (id: number): Promise<void> => {
    await apiClient.delete(`/units/${id}`);
};