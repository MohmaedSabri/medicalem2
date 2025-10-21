/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCreateDoctor } from "../../hooks/useDoctors";
import { X, User } from "lucide-react";
import toast from "react-hot-toast";
import { GenericForm } from "./GenericFrom";
import { doctorCreateSchema, DoctorCreateSchema } from "../../schamas/doctor";

interface AddDoctorFormProps {
	onClose: () => void;
}

const AddDoctorForm: React.FC<AddDoctorFormProps> = ({ onClose }) => {
	const { t } = useTranslation();
	const createDoctorMutation = useCreateDoctor();

	// Select options for member type dropdown
	const selectOptions = {
		memberType: [
			{ value: "team-member", label: t("teamMember") },
			{ value: "partner", label: t("partner") },
		],
	};

	const defaultValues: Partial<DoctorCreateSchema> = {
		nameEn: "",
		nameAr: "",
		titleEn: "",
		titleAr: "",
		descriptionEn: "",
		descriptionAr: "",
		image: "",
		skills: [],
		qualifications: [],
		experience: [],
		locationEn: "",
		locationAr: "",
		contact: "",
		socialMedia: [],
		specializationEn: "",
		specializationAr: "",
		memberType: "team-member",
	};

	const handleSubmit = async (data: DoctorCreateSchema) => {
		const payload = {
			name: { en: data.nameEn, ar: data.nameAr },
			title: { en: data.titleEn, ar: data.titleAr },
			description: { en: data.descriptionEn, ar: data.descriptionAr },
			image: data.image,
			skills: (data.skills || []).map((s) => ({ en: s, ar: s })),
			qualifications: (data.qualifications || []).map((q) => ({
				en: q,
				ar: q,
			})),
			experience: (data.experience || []).map((e) => ({ en: e, ar: e })),
			location: { en: data.locationEn, ar: data.locationAr },
			contact: data.contact,
			socialMedia: data.socialMedia || [],
			specialization: { en: data.specializationEn, ar: data.specializationAr },
			memberType: data.memberType,
		};

		// Debug: Log the payload to see what's being sent
		console.log("🚀 Sending doctor data:", payload);
		console.log("🎯 Member Type:", data.memberType);

		try {
			await createDoctorMutation.mutateAsync(
				payload as unknown as import("../../types").CreateDoctorData
			);
			toast.success(t("doctorAddedSuccessfully"));
			onClose();
		} catch (error) {
			console.error("❌ Error creating doctor:", error);
			toast.error(t("failedToAddDoctor"));
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
								{t("addDoctor")}
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
								createDoctorMutation.isPending ? t("saving") : t("addDoctor")
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

export default AddDoctorForm;
