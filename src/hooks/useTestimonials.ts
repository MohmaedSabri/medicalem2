/** @format */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialApi } from '../services/testimonialApi';
import { queryKeys } from '../config/queryKeys';
import { CreateTestimonialData, Testimonial, UpdateTestimonialData } from '../types';
import toast from 'react-hot-toast';

export const useTestimonials = () => {
  return useQuery({
    queryKey: queryKeys.testimonials.lists(),
    queryFn: () => testimonialApi.getTestimonials(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTestimonial = (id: string) => {
  return useQuery({
    queryKey: queryKeys.testimonials.detail(id),
    queryFn: () => testimonialApi.getTestimonialById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTestimonialData) => testimonialApi.createTestimonial(data),
    onSuccess: (created: Testimonial) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
      queryClient.setQueryData(queryKeys.testimonials.detail(created._id), created);
      toast.success('Testimonial created successfully');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create testimonial'),
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialData }) => testimonialApi.updateTestimonial(id, data),
    onSuccess: (updated: Testimonial) => {
      queryClient.setQueryData(queryKeys.testimonials.detail(updated._id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.lists() });
      toast.success('Testimonial updated successfully');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to update testimonial'),
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialApi.deleteTestimonial(id),
    onSuccess: (_, deletedId) => {
      const idStr = String(deletedId);
      queryClient.removeQueries({ queryKey: queryKeys.testimonials.detail(idStr) });
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.lists() });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete testimonial'),
  });
};

export default useTestimonials;


