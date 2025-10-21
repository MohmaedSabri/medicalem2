/** @format */

import * as yup from "yup";

export const doctorCreateSchema = yup.object({
	nameEn: yup.string().trim().required("Name (EN) is required"),
	nameAr: yup.string().trim().required("Name (AR) is required"),
	titleEn: yup.string().trim().required("Title (EN) is required"),
	titleAr: yup.string().trim().required("Title (AR) is required"),
	descriptionEn: yup.string().trim().required("Description (EN) is required"),
	descriptionAr: yup.string().trim().required("Description (AR) is required"),
	image: yup
		.string()
		.url("Image must be a valid URL")
		.trim()
		.required("Image is required"),
	skills: yup.array().of(yup.string().trim()).default([]),
	qualifications: yup.array().of(yup.string().trim()).default([]),
	experience: yup.array().of(yup.string().trim()).default([]),
	locationEn: yup.string().trim().required("Location (EN) is required"),
	locationAr: yup.string().trim().required("Location (AR) is required"),
	contact: yup.string().trim().required("Contact is required"),
	socialMedia: yup.array().of(yup.string().url().trim()).default([]),
	specializationEn: yup
		.string()
		.trim()
		.required("Specialization (EN) is required"),
	specializationAr: yup
		.string()
		.trim()
		.required("Specialization (AR) is required"),
	memberType: yup
		.string()
		.oneOf(["team-member", "partner"], "Member type is required")
		.required("Member type is required"),
});

export type DoctorCreateSchema = yup.InferType<typeof doctorCreateSchema>;
