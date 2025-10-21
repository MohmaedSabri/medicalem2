/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { useDoctors } from "../../hooks/useDoctors";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

interface TeamMember {
	id: string;
	name: { en: string; ar: string };
	position: { en: string; ar: string };
	image: string;
}

const OurTeam: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage, isRTL } = useLanguage();

	// Get all doctors from API to ensure we get all team members
	const {
		data: doctorsData,
		refetch,
		isLoading,
		error,
	} = useDoctors({ lang: currentLanguage });

	// Force refetch on component mount to get latest data
	React.useEffect(() => {
		refetch();
	}, [refetch]);

	// Debug logging
	React.useEffect(() => {
		console.log("OurTeam Debug:", {
			doctorsData,
			isLoading,
			error,
			currentLanguage,
			doctorsDataLength: Array.isArray(doctorsData) ? doctorsData.length : 0,
		});
	}, [doctorsData, isLoading, error, currentLanguage]);

	type LocalizedValue = string | { en?: string; ar?: string };
	// Helper function to get localized text
	const getLocalizedText = (
		value: LocalizedValue | undefined | null
	): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
		}
		return "";
	};

	// Fallback team members if API fails
	const fallbackTeamMembers: TeamMember[] = [
		{
			id: "1",
			name: { en: "Eng. Mohamed Medhat", ar: "م. محمد مدحت" },
			position: {
				en: "CEO - Co Founder",
				ar: "الرئيس التنفيذي - الشريك المؤسس",
			},
			image: "https://i.postimg.cc/QNbcpqNq/ceo.jpg",
		},
		{
			id: "2",
			name: { en: "Dr. Phumdon H. Norman", ar: "د. فومدون اتش. نورمان" },
			position: { en: "Neurologist", ar: "أخصائي الأعصاب" },
			image:
				"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
		},
		{
			id: "3",
			name: { en: "Nicolas D. Case", ar: "نيكولاس دي. كيس" },
			position: { en: "Pediatric Nurse", ar: "ممرض أطفال" },
			image:
				"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
		},
	];

	type DoctorLite = {
		_id: string;
		name: LocalizedValue;
		title: LocalizedValue;
		image: string;
		rating?: number;
		location?: LocalizedValue;
		memberType: "team-member" | "partner";
	};
	const doctors = (doctorsData ?? []) as DoctorLite[];

	// Filter doctors by memberType === "team-member" and use API data if available, otherwise use fallback
	const teamMemberDoctors = doctors.filter(
		(doctor) => doctor.memberType === "team-member"
	);

	const teamMembers: Array<TeamMember | DoctorLite> =
		teamMemberDoctors.length > 0 ? teamMemberDoctors : fallbackTeamMembers;

	// Debug logging for team members
	React.useEffect(() => {
		console.log("Team Members Debug:", {
			doctors,
			teamMemberDoctors,
			teamMembers,
			fallbackTeamMembers,
			usingFallback: teamMemberDoctors.length === 0,
		});
	}, [doctors, teamMemberDoctors, teamMembers]);

	// Show loading state
	if (isLoading) {
		return (
			<section className='py-16 lg:py-24 bg-gray-50 relative overflow-hidden'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto'></div>
						<p className='mt-4 text-gray-600'>{t("loading")}</p>
					</div>
				</div>
			</section>
		);
	}

	// Show error state
	if (error) {
		console.error("OurTeam API Error:", error);
	}

	return (
		<section className='py-16 lg:py-24 bg-gray-50 relative overflow-hidden'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				{/* Debug Info */}
				<div className='mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg'>
					<h3 className='font-bold text-yellow-800 mb-2'>Debug Info:</h3>
					<p className='text-sm text-yellow-700'>
						Team Members Count: {teamMembers.length} | API Data Length:{" "}
						{Array.isArray(doctorsData) ? doctorsData.length : 0} | Team Member
						Doctors: {teamMemberDoctors.length} | Using Fallback:{" "}
						{teamMemberDoctors.length === 0 ? "Yes" : "No"}
					</p>
				</div>

				{/* Header */}
				<div className='text-center mb-16'>
					<div className='mb-6'>
						<div
							className={`inline-flex items-center ${
								isRTL ? "space-x-reverse space-x-2" : "space-x-2"
							} bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4`}>
							<span>{t("ourTeam")}</span>
						</div>
					</div>

					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500 mb-6 text-center'>
						{t("meetOurExpertTeam")}
					</h2>

					<p
						className={`text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed ${
							isRTL ? "text-right" : "text-left"
						}`}>
						{t("teamDescription")}
					</p>
				</div>

				{/* Team Cards - Simplified */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
					{teamMembers.map((member: TeamMember | DoctorLite) => {
						const isDoctor = "_id" in member; // DoctorLite has _id
						const memberId = isDoctor ? member._id : member.id;
						const memberName = getLocalizedText(member.name);
						const memberPosition = isDoctor
							? getLocalizedText(member.title)
							: getLocalizedText(member.position);
						const memberImage = member.image;
						const memberLocation = isDoctor
							? getLocalizedText(member.location)
							: null;

						return (
							<div
								key={memberId}
								className='group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/30 hover:border-primary-300 transition-all duration-500 overflow-hidden border border-gray-100 relative'>
								<Link
									to={isDoctor ? `/partners/${memberId}` : "#"}
									className='block'>
									{/* Profile Image */}
									<div className='relative h-64 bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden'>
										<img
											src={memberImage}
											alt={memberName}
											className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
										/>
									</div>

									{/* Content */}
									<div className='p-6 text-center'>
										<h3
											className={`text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors duration-300 ${
												isRTL ? "text-right" : "text-left"
											}`}>
											{memberName}
										</h3>
										<p
											className={`text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors duration-300 ${
												isRTL ? "text-right" : "text-left"
											}`}>
											{memberPosition}
										</p>

										{/* Location for Doctors */}
										{isDoctor && memberLocation && (
											<div
												className={`flex items-center mt-2 text-gray-500 text-xs ${
													isRTL ? "space-x-reverse space-x-1" : "space-x-1"
												}`}>
												<MapPin
													className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`}
												/>
												<span>{memberLocation}</span>
											</div>
										)}

										{/* Button for Doctors */}
										{isDoctor && (
											<div
												className={`group relative mt-4 inline-flex bg-primary-500 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 transform items-center justify-center shadow-md hover:shadow-lg hover:shadow-primary-500/40 ${
													isRTL ? "space-x-reverse space-x-2" : "space-x-2"
												}`}>
												<div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg'></div>
												<div className='relative z-10 flex items-center'>
													<User
														className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
															isRTL ? "ml-2" : "mr-2"
														}`}
													/>
													<span className='transition-all duration-300 group-hover:font-bold'>
														{t("viewProfile")}
													</span>
												</div>
											</div>
										)}
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default OurTeam;
