/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingApi } from "../services/shippingApi";
import { queryKeys } from "../config/queryKeys";
import {
  CreateShippingOptionRequest,
  UpdateShippingOptionRequest,
  BulkCreateShippingOptionsRequest,
} from "../types/shipping";
import { showToast } from "../utils/toast";

export const useShippingOptions = () => {
  return useQuery({
    queryKey: queryKeys.SHIPPING,
    queryFn: shippingApi.getAllShippingOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useShippingOption = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.SHIPPING, id],
    queryFn: () => shippingApi.getShippingOptionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateShippingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shippingApi.createShippingOption,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.SHIPPING });
      showToast('success', 'shipping-created', 'Shipping option created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create shipping option';
      showToast('error', 'shipping-create-error', message);
    },
  });
};

export const useUpdateShippingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShippingOptionRequest }) =>
      shippingApi.updateShippingOption(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.SHIPPING });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.SHIPPING, variables.id] });
      showToast('success', 'shipping-updated', 'Shipping option updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update shipping option';
      showToast('error', 'shipping-update-error', message);
    },
  });
};

export const useDeleteShippingOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shippingApi.deleteShippingOption,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.SHIPPING });
      queryClient.removeQueries({ queryKey: [...queryKeys.SHIPPING, id] });
      showToast('success', 'shipping-deleted', 'Shipping option deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete shipping option';
      showToast('error', 'shipping-delete-error', message);
    },
  });
};

export const useBulkCreateShippingOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shippingApi.bulkCreateShippingOptions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.SHIPPING });
      showToast('success', 'shipping-bulk-created', `${data.data.length} shipping options created successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create shipping options';
      showToast('error', 'shipping-bulk-error', message);
    },
  });
};
