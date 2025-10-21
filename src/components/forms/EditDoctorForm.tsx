/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUpdateDoctor } from "../../hooks/useDoctors";
import { Doctor } from "../../types";
import { X, User } from "lucide-react";
import toast from "react-hot-toast";
import { GenericForm } from "./GenericFrom";
import { doctorCreateSchema, DoctorCreateSchema } from "../../schamas/doctor";

interface EditDoctorFormProps {
	doctor: Doctor;
	onClose: () => void;
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({ doctor, onClose }) => {
	const { t } = useTranslation();
	const updateDoctorMutation = useUpdateDoctor();

	// Select options for member type dropdown
	const selectOptions = {
		memberType: [
			{ value: "team-member", label: t("teamMember") },
			{ value: "partner", label: t("partner") },
		],
	};

	const toText = (v: unknown): string => {
		if (typeof v === "string") return v;
		if (v && typeof v === "object") {
			const obj = v as { en?: string; ar?: string };
			return obj.en || obj.ar || "";
		}
		return "";
	};

	const defaultValues: Partial<DoctorCreateSchema> = {
		nameEn: toText((doctor.name as { en?: string }).en) || toText(doctor.name),
		nameAr:
			(typeof doctor.name === "object"
				? (doctor.name as { ar?: string }).ar
				: toText(doctor.name)) || "",
		titleEn:
			toText((doctor.title as { en?: string }).en) || toText(doctor.title),
		titleAr:
			(typeof doctor.title === "object"
				? (doctor.title as { ar?: string }).ar
				: toText(doctor.title)) || "",
		descriptionEn:
			toText((doctor.description as { en?: string }).en) ||
			toText(doctor.description),
		descriptionAr:
			(typeof doctor.description === "object"
				? (doctor.description as { ar?: string }).ar
				: toText(doctor.description)) || "",
		image: doctor.image || "",
		skills: (doctor.skills || []).map((s: unknown) => toText(s)),
		qualifications: (doctor.qualifications || []).map((q: unknown) =>
			toText(q)
		),
		experience: (doctor.experience || []).map((e: unknown) => toText(e)),
		locationEn:
			toText((doctor.location as { en?: string }).en) ||
			toText(doctor.location),
		locationAr:
			(typeof doctor.location === "object"
				? (doctor.location as { ar?: string }).ar
				: toText(doctor.location)) || "",
		contact: doctor.contact || "",
		socialMedia: doctor.socialMedia || [],
		specializationEn:
			toText((doctor.specialization as { en?: string }).en) ||
			toText(doctor.specialization),
		specializationAr:
			(typeof doctor.specialization === "object"
				? (doctor.specialization as { ar?: string }).ar
				: toText(doctor.specialization)) || "",
		memberType: doctor.memberType || "team-member",
	};

	const handleSubmit = async (data: DoctorCreateSchema) => {
		const payload = {
			name: { en: data.nameEn, ar: data.nameAr },
			title: { en: data.titleEn, ar: data.titleAr },
			description: { en: data.descriptionEn, ar: data.descriptionAr },
			image: data.image,
			skills: (data.skills || []).map((s) => ({ en: s || "", ar: s || "" })),
			qualifications: (data.qualifications || []).map((q) => ({
				en: q || "",
				ar: q || "",
			})),
			experience: (data.experience || []).map((e) => ({
				en: e || "",
				ar: e || "",
			})),
			location: { en: data.locationEn, ar: data.locationAr },
			contact: data.contact,
			socialMedia: (data.socialMedia || []).map((s) => s || ""),
			specialization: { en: data.specializationEn, ar: data.specializationAr },
			memberType: data.memberType,
		};
		try {
			await updateDoctorMutation.mutateAsync({ id: doctor._id, data: payload });
			toast.success(t("doctorUpdatedSuccessfully"));
			onClose();
		} catch {
			toast.error(t("failedToUpdateDoctor"));
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-white rounded-2xl shadow-lg overflow-hidden'>
					{/* Header */}
					<div className='bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<h1 className='text-2xl font-bold text-white flex items-center'>
								<User className='w-6 h-6 mr-3' />
								{t("editDoctor")}
							</h1>
							<button
								onClick={onClose}
								className='text-white hover:text-gray-200 transition-colors'>
								<X className='w-6 h-6' />
							</button>
						</div>
					</div>

					{/* Form */}
					<div className='p-6 space-y-8'>
						<h2 className='text-xl font-semibold text-gray-900 flex items-center'>
							<User className='w-5 h-5 mr-2 text-teal-500' />
							{t("basicInformation")}
						</h2>
						<GenericForm<DoctorCreateSchema>
							schema={doctorCreateSchema}
							defaultValues={defaultValues}
							onSubmit={handleSubmit}
							submitButtonText={
								updateDoctorMutation.isPending ? t("saving") : t("updateDoctor")
							}
							className='w-full'
							selectOptions={selectOptions}
						/>
						<div className='flex justify-end space-x-4 pt-2'>
							<button
								type='button'
								onClick={onClose}
								className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
								{t("cancel")}
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EditDoctorForm;
