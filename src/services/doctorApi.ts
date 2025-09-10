import axiosClient from '../config/axiosClient';
import { endpoints } from '../config/endpoints';
import { Doctor, CreateDoctorData, UpdateDoctorData, DoctorFilters, } from '../types';

export const doctorApi = {
  // Get all doctors with optional filters
  getDoctors: async (filters: DoctorFilters = {}): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.location) params.append('location', filters.location);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.lang) params.append('lang', filters.lang);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${endpoints.DOCTORS}?${queryString}` : endpoints.DOCTORS;
    
    const response = await axiosClient.get<Doctor[]>(url);
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id: string, language?: string): Promise<Doctor> => {
    const params = new URLSearchParams();
    if (language) params.append('lang', language);
    
    const queryString = params.toString();
    const url = queryString ? `${endpoints.DOCTORS_BY_ID.replace(':id', id)}?${queryString}` : endpoints.DOCTORS_BY_ID.replace(':id', id);
    
    const response = await axiosClient.get<Doctor>(url);
    return response.data;
  },

  // Search doctors by text query
  searchDoctors: async (query: string, language?: string): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (language) params.append('lang', language);
    
    const response = await axiosClient.get<Doctor[]>(`${endpoints.DOCTORS_SEARCH}?${params.toString()}`);
    return response.data;
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization: string, language?: string): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    if (language) params.append('lang', language);
    
    const queryString = params.toString();
    const url = queryString 
      ? `${endpoints.DOCTORS_BY_SPECIALIZATION.replace(':specialization', specialization)}?${queryString}`
      : endpoints.DOCTORS_BY_SPECIALIZATION.replace(':specialization', specialization);
    
    const response = await axiosClient.get<Doctor[]>(url);
    return response.data;
  },

  // Create new doctor (requires authentication)
  createDoctor: async (doctorData: CreateDoctorData): Promise<Doctor> => {
    const response = await axiosClient.post<Doctor>(endpoints.DOCTORS, doctorData);
    return response.data;
  },

  // Update doctor (requires authentication)
  updateDoctor: async (id: string, doctorData: UpdateDoctorData): Promise<Doctor> => {
    const response = await axiosClient.patch<Doctor>(endpoints.DOCTORS_BY_ID.replace(':id', id), doctorData);
    return response.data;
  },

  // Update doctor rating (requires authentication)
  updateDoctorRating: async (id: string, rating: number, reviewCount?: number, increment: boolean = true): Promise<Doctor> => {
    const data = {
      rating,
      reviewCount,
      increment
    };
    
    const response = await axiosClient.patch<Doctor>(endpoints.DOCTORS_RATING.replace(':id', id), data);
    return response.data;
  },

  // Delete doctor (requires authentication)
  deleteDoctor: async (id: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete<{ message: string }>(endpoints.DOCTORS_BY_ID.replace(':id', id));
    return response.data;
  },

  // Get top-rated doctors
  getTopRatedDoctors: async (limit: number = 3, language?: string): Promise<Doctor[]> => {
    const filters: DoctorFilters = {
      rating: 4.5,
      limit,
      lang: language
    };
    
    return doctorApi.getDoctors(filters);
  }
};

export default doctorApi;
