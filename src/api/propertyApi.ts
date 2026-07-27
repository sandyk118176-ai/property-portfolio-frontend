import apiClient from "./client";
import type { Property } from "../types";

export const getAllProperties = async (): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>("/properties");
    return response.data;
};

export const getPropertyById = async (id: number): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>(`/properties/${id}`);
    return response.data;
};

export const createProperty = async (
    property: Omit<Property, "id">
): Promise<Property> => {
    const response = await apiClient.post<Property>("/properties", property);
    return response.data;
};

export const updateProperty = async (
    id: number, 
    property: Omit<Property, "id">
): Promise<Property> => {
    const response = await apiClient.put<Property>(`/properties/${id}`, property);
    return response.data;
};

export const deleteProperty = async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
};





