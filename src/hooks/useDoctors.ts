import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorApi } from '../services/doctorApi';
import { queryKeys } from '../config/queryKeys';
import { Doctor, CreateDoctorData, UpdateDoctorData, DoctorFilters } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const useDoctors = (filters: DoctorFilters = {}) => {
  const { currentLanguage } = useLanguage();
  const language = filters.lang || currentLanguage;

  return useQuery({
    queryKey: queryKeys.doctors.list(filters, language),
    queryFn: () => doctorApi.getDoctors({ ...filters, lang: language }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDoctor = (id: string, language?: string) => {
  const { currentLanguage } = useLanguage();
  const lang = language || currentLanguage;

  return useQuery({
    queryKey: queryKeys.doctors.detail(id, lang),
    queryFn: () => doctorApi.getDoctorById(id, lang),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useSearchDoctors = (query: string, language?: string) => {
  const { currentLanguage } = useLanguage();
  const lang = language || currentLanguage;

  return useQuery({
    queryKey: queryKeys.doctors.search(query, lang),
    queryFn: () => doctorApi.searchDoctors(query, lang),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    cacheTime: 5 * 60 * 1000,
  });
};

export const useDoctorsBySpecialization = (specialization: string, language?: string) => {
  const { currentLanguage } = useLanguage();
  const lang = language || currentLanguage;

  return useQuery({
    queryKey: queryKeys.doctors.bySpecialization(specialization, lang),
    queryFn: () => doctorApi.getDoctorsBySpecialization(specialization, lang),
    enabled: !!specialization,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useTopRatedDoctors = (limit: number = 3, language?: string) => {
  const { currentLanguage } = useLanguage();
  const lang = language || currentLanguage;

  return useQuery({
    queryKey: queryKeys.doctors.topRated(limit, lang),
    queryFn: () => doctorApi.getTopRatedDoctors(limit, lang),
    staleTime: 10 * 60 * 1000, // 10 minutes for top-rated doctors
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorData: CreateDoctorData) => doctorApi.createDoctor(doctorData),
    onSuccess: () => {
      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoctorData }) => 
      doctorApi.updateDoctor(id, data),
    onSuccess: (updatedDoctor) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(
        queryKeys.doctors.detail(updatedDoctor._id),
        updatedDoctor
      );
      // Invalidate doctors list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
};

export const useUpdateDoctorRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      rating, 
      reviewCount, 
      increment = true 
    }: { 
      id: string; 
      rating: number; 
      reviewCount?: number; 
      increment?: boolean 
    }) => doctorApi.updateDoctorRating(id, rating, reviewCount, increment),
    onSuccess: (updatedDoctor) => {
      // Update the specific doctor in cache
      queryClient.setQueryData(
        queryKeys.doctors.detail(updatedDoctor._id),
        updatedDoctor
      );
      // Invalidate doctors list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorApi.deleteDoctor(id),
    onSuccess: (_, deletedId) => {
      // Remove the doctor from cache
      queryClient.removeQueries({ queryKey: queryKeys.doctors.detail(deletedId) });
      // Invalidate doctors list
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
    },
  });
};

export default useDoctors;

