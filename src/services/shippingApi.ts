/** @format */

import axiosClient from "../config/axiosClient";
import { endpoints } from "../config/endpoints";
import {
  ShippingOption,
  CreateShippingOptionRequest,
  UpdateShippingOptionRequest,
  BulkCreateShippingOptionsRequest,
  ShippingApiResponse,
  ShippingBulkResponse,
} from "../types/shipping";

export const shippingApi = {
  // Get all shipping options (public endpoint)
  getAllShippingOptions: async (): Promise<ShippingOption[]> => {
    const response = await axiosClient.get<ShippingOption[]>(endpoints.SHIPPING);
    return response.data;
  },

  // Get shipping option by ID (public endpoint)
  getShippingOptionById: async (id: string): Promise<ShippingOption> => {
    const response = await axiosClient.get<ShippingOption>(
      endpoints.SHIPPING_BY_ID.replace(":id", id)
    );
    return response.data;
  },

  // Create shipping option (requires authentication)
  createShippingOption: async (
    data: CreateShippingOptionRequest
  ): Promise<ShippingApiResponse> => {
    const response = await axiosClient.post<ShippingApiResponse>(
      endpoints.SHIPPING,
      data
    );
    return response.data;
  },

  // Update shipping option (requires authentication)
  updateShippingOption: async (
    id: string,
    data: UpdateShippingOptionRequest
  ): Promise<ShippingApiResponse> => {
    const response = await axiosClient.put<ShippingApiResponse>(
      endpoints.SHIPPING_BY_ID.replace(":id", id),
      data
    );
    return response.data;
  },

  // Delete shipping option (requires authentication)
  deleteShippingOption: async (id: string): Promise<ShippingApiResponse> => {
    const response = await axiosClient.delete<ShippingApiResponse>(
      endpoints.SHIPPING_BY_ID.replace(":id", id)
    );
    return response.data;
  },

  // Bulk create shipping options (requires authentication)
  bulkCreateShippingOptions: async (
    data: BulkCreateShippingOptionsRequest
  ): Promise<ShippingBulkResponse> => {
    const response = await axiosClient.post<ShippingBulkResponse>(
      endpoints.SHIPPING_BULK,
      data
    );
    return response.data;
  },
};
