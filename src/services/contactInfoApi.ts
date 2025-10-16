/** @format */

import axiosClient from '../config/axiosClient';
import { endpoints } from '../config/endpoints';

export interface Partner {
	_id?: string;
	src: string;
	alt: string;
	title: string;
	href: string;
}

export interface HeroImage {
    _id?: string;
    src: string;
    alt: string;
}

export interface ContactInfo {
	_id?: string;
	email: string;
	phone: string;
	address: string;
	map: string;
	whatsapp: string;
	instagram: string;
	facebook: string;
	twitter: string;
	linkedin: string;
	threads: string;
	ceophoto: string;
	ceosmallphoto: string;
	partners: Partner[];
    heroimages?: HeroImage[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ContactInfoUpdateData {
	email?: string;
	phone?: string;
	address?: string;
	map?: string;
	whatsapp?: string;
	instagram?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	threads?: string;
	ceophoto?: string;
	ceosmallphoto?: string;
}

export interface PartnerData {
	src: string;
	alt: string;
	title: string;
	href: string;
}

export interface PartnerUpdateData {
	src?: string;
	alt?: string;
	title?: string;
	href?: string;
}

// Get contact information
export const getContactInfo = async (): Promise<ContactInfo> => {
	const response = await axiosClient.get(endpoints.CONTACT_INFO);
	return response.data;
};

// Update contact information (PATCH - partial update)
export const updateContactInfo = async (data: ContactInfoUpdateData): Promise<ContactInfo> => {
	const response = await axiosClient.patch(endpoints.CONTACT_INFO, data);
	return response.data.data;
};

// Update contact information (PUT - full update)
export const updateContactInfoFull = async (data: ContactInfoUpdateData): Promise<ContactInfo> => {
	const response = await axiosClient.put(endpoints.CONTACT_INFO, data);
	return response.data.data;
};

// Create contact information (only if none exists)
export const createContactInfo = async (data: ContactInfoUpdateData): Promise<ContactInfo> => {
	const response = await axiosClient.post(endpoints.CONTACT_INFO, data);
	return response.data.data;
};

// Add partner
export const addPartner = async (data: PartnerData): Promise<ContactInfo> => {
	const response = await axiosClient.post(endpoints.CONTACT_INFO_PARTNERS, data);
	return response.data.data;
};

// Update partner
export const updatePartner = async (partnerId: string, data: PartnerUpdateData): Promise<ContactInfo> => {
	const response = await axiosClient.put(
		endpoints.CONTACT_INFO_PARTNER_BY_ID.replace(':id', partnerId),
		data
	);
	return response.data.data;
};

// Delete partner
export const deletePartner = async (partnerId: string): Promise<ContactInfo> => {
	const response = await axiosClient.delete(
		endpoints.CONTACT_INFO_PARTNER_BY_ID.replace(':id', partnerId)
	);
	return response.data.data;
};

// Add hero image
export const addHeroImage = async (data: Omit<HeroImage, '_id'>): Promise<ContactInfo> => {
    const response = await axiosClient.post(endpoints.CONTACT_INFO_HERO_IMAGES, data);
    return response.data.data;
};

// Update hero image
export const updateHeroImage = async (heroImageId: string, data: Partial<HeroImage>): Promise<ContactInfo> => {
    const response = await axiosClient.put(
        endpoints.CONTACT_INFO_HERO_IMAGE_BY_ID.replace(':id', heroImageId),
        data
    );
    return response.data.data;
};

// Delete hero image
export const deleteHeroImage = async (heroImageId: string): Promise<ContactInfo> => {
    const response = await axiosClient.delete(
        endpoints.CONTACT_INFO_HERO_IMAGE_BY_ID.replace(':id', heroImageId)
    );
    return response.data.data;
};
