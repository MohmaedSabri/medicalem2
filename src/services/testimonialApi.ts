import axiosClient from '../config/axiosClient';
import { endpoints } from '../config/endpoints';
import { Testimonial, CreateTestimonialData, UpdateTestimonialData } from '../types';

export const testimonialApi = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosClient.get<Testimonial[]>(endpoints.TESTIMONIALS);
    return response.data;
  },

  getTestimonialById: async (id: string): Promise<Testimonial> => {
    const url = endpoints.TESTIMONIALS_BY_ID.replace(':id', id);
    const response = await axiosClient.get<Testimonial>(url);
    return response.data;
  },

  createTestimonial: async (data: CreateTestimonialData): Promise<Testimonial> => {
    const response = await axiosClient.post<Testimonial>(endpoints.TESTIMONIALS, data);
    return response.data;
  },

  updateTestimonial: async (id: string, data: UpdateTestimonialData): Promise<Testimonial> => {
    const url = endpoints.TESTIMONIALS_BY_ID.replace(':id', id);
    const response = await axiosClient.put<Testimonial>(url, data);
    return response.data;
  },

  deleteTestimonial: async (id: string): Promise<{ message: string; data?: Testimonial }> => {
    const url = endpoints.TESTIMONIALS_BY_ID.replace(':id', id);
    const response = await axiosClient.delete<{ message: string; data?: Testimonial }>(url);
    return response.data;
  },
};

export default testimonialApi;




