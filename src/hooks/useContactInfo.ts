/** @format */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getContactInfo,
	updateContactInfo,
	updateContactInfoFull,
	createContactInfo,
	addPartner,
	updatePartner,
	deletePartner,
	ContactInfo,
	ContactInfoUpdateData,
	PartnerData,
	PartnerUpdateData,
} from '../services/contactInfoApi';
import { queryKeys } from '../config/queryKeys';

export const useContactInfo = () => {
	return useQuery({
		queryKey: [queryKeys.CONTACT_INFO],
		queryFn: getContactInfo,
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useUpdateContactInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ContactInfoUpdateData) => updateContactInfo(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};

export const useUpdateContactInfoFull = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ContactInfoUpdateData) => updateContactInfoFull(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};

export const useCreateContactInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ContactInfoUpdateData) => createContactInfo(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};

export const useAddPartner = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: PartnerData) => addPartner(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};

export const useUpdatePartner = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partnerId, data }: { partnerId: string; data: PartnerUpdateData }) =>
			updatePartner(partnerId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};

export const useDeletePartner = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (partnerId: string) => deletePartner(partnerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACT_INFO] });
		},
	});
};
