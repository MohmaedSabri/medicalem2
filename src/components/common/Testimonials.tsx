/** @format */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useTestimonials } from "../../hooks/useTestimonials";

interface Testimonial {
	id: number;
	name: string;
	nameAr: string;
	position: string;
	positionAr: string;
	company: string;
	companyAr: string;
	content: string;
	contentAr: string;
	rating: number;
	image: string;
}

const testimonials: Testimonial[] = [
	{
		id: 1,
		name: "Dr. Sarah Ahmed",
		nameAr: "د. سارة أحمد",
		position: "Chief Medical Officer",
		positionAr: "مدير طبي رئيسي",
		company: "Dubai Medical Center",
		companyAr: "مركز دبي الطبي",
		content:
			"Dorar Medical has been our trusted partner for over 5 years. Their equipment is top-notch and their support is exceptional. They've helped us transform our facility with cutting-edge technology.",
		contentAr:
			"درر الطبية شريكنا الموثوق لأكثر من 5 سنوات. معداتهم من الدرجة الأولى ودعمهم استثنائي. ساعدونا في تحويل منشأتنا بأحدث التقنيات.",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 2,
		name: "Eng. Mohammed Al-Rashid",
		nameAr: "م. محمد الراشد",
		position: "Hospital Administrator",
		positionAr: "مدير المستشفى",
		company: "Abu Dhabi General Hospital",
		companyAr: "مستشفى أبوظبي العام",
		content:
			"The quality and reliability of Dorar's medical equipment is unmatched. Their team's expertise and 24/7 support have been crucial for our operations. Highly recommended!",
		contentAr:
			"جودة وموثوقية معدات درر الطبية لا مثيل لها. خبرة فريقهم ودعمهم على مدار الساعة كان حاسماً لعملياتنا. أنصح بهم بشدة!",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 3,
		name: "Dr. Fatima Hassan",
		nameAr: "د. فاطمة حسن",
		position: "Emergency Department Head",
		positionAr: "رئيس قسم الطوارئ",
		company: "Sharjah Medical Complex",
		companyAr: "المجمع الطبي بالشارقة",
		content:
			"Working with Dorar Medical has been a game-changer for our emergency department. Their advanced equipment and quick response times have saved countless lives.",
		contentAr:
			"العمل مع درر الطبية كان نقطة تحول لقسم الطوارئ لدينا. معداتهم المتطورة وأوقات استجابتهم السريعة أنقذت أرواحاً لا حصر لها.",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 4,
		name: "Prof. Ahmed Al-Zahra",
		nameAr: "أ.د. أحمد الزهراء",
		position: "Cardiology Director",
		positionAr: "مدير قسم أمراض القلب",
		company: "Rashid Hospital",
		companyAr: "مستشفى راشد",
		content:
			"Dorar's cardiac equipment is state-of-the-art. The precision and reliability have significantly improved our diagnostic capabilities and patient outcomes.",
		contentAr:
			"معدات درر للقلب متطورة جداً. الدقة والموثوقية حسنت بشكل كبير قدراتنا التشخيصية ونتائج المرضى.",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 5,
		name: "Dr. Layla Al-Mansouri",
		nameAr: "د. ليلى المنصوري",
		position: "Pediatric Specialist",
		positionAr: "أخصائية طب الأطفال",
		company: "Al Jalila Children's Hospital",
		companyAr: "مستشفى الجليلة للأطفال",
		content:
			"The pediatric equipment from Dorar is designed with children's safety in mind. Their team understands the unique needs of pediatric care and delivers accordingly.",
		contentAr:
			"معدات الأطفال من درر مصممة مع مراعاة سلامة الأطفال. فريقهم يفهم الاحتياجات الفريدة لرعاية الأطفال ويقدم وفقاً لذلك.",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
	},
	{
		id: 6,
		name: "Eng. Khalid Al-Suwaidi",
		nameAr: "م. خالد السويدي",
		position: "Biomedical Engineer",
		positionAr: "مهندس طبي حيوي",
		company: "Cleveland Clinic Abu Dhabi",
		companyAr: "مستشفى كليفلاند كلينك أبوظبي",
		content:
			"From a technical perspective, Dorar's equipment maintenance and support services are outstanding. They ensure minimal downtime and maximum efficiency.",
		contentAr:
			"من الناحية التقنية، خدمات صيانة ودعم معدات درر متميزة. يضمنون أقل وقت توقف وأقصى كفاءة.",
		rating: 5,
		image:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
	},
];

const Testimonials: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying] = useState(true);
	const isRTL = i18n.language === "ar";
	const { data, isLoading } = useTestimonials();

	const apiTestimonials = useMemo(() => {
		if (!data || !Array.isArray(data)) return null;
		return data.map((d) => ({
			id: 0,
			name: d.name,
			nameAr: d.name,
			position: d.job || "",
			positionAr: d.job || "",
			company: d.clinicName || "",
			companyAr: d.clinicName || "",
			content: d.message,
			contentAr: d.message,
			rating: typeof d.rating === "number" ? d.rating : 5,
			image: d.image || "https://via.placeholder.com/150",
		}));
	}, [data]);

	const list = apiTestimonials && apiTestimonials.length > 0 ? apiTestimonials : testimonials;

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === list.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, list.length]);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === list.length - 1 ? 0 : prevIndex + 1
		);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? list.length - 1 : prevIndex - 1
		);
	};

	const goToTestimonial = (index: number) => {
		setCurrentIndex(index);
	};

	const currentTestimonial = list[currentIndex];

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	const testimonialVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 300 : -300,
			opacity: 0,
			scale: 0.8,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
			scale: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? 300 : -300,
			opacity: 0,
			scale: 0.8,
		}),
	};

// removed unused slideVariants

	if (isLoading && (!apiTestimonials || apiTestimonials.length === 0)) {
		return (
			<section id='testimonials' className='py-16 sm:py-20 lg:py-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<p className='text-center text-slate-600'>{t("loading")}</p>
				</div>
			</section>
		);
	}

	return (
		<section
			id='testimonials'
			className='bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-16 sm:py-20 lg:py-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					className='text-center mb-12 lg:mb-16'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
					<motion.h2
						className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4'
						variants={containerVariants}>
						{t("whatOurClientsSay")}
					</motion.h2>
					<motion.p
						className='text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed'
						variants={containerVariants}>
						{t("testimonialsDescription")}
					</motion.p>
				</motion.div>

				{/* Testimonial Slider */}
				<div className='relative max-w-6xl mx-auto'>
					{/* Main Testimonial Card */}
					<div className='relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100'>
						<AnimatePresence mode='wait' custom={isRTL ? -1 : 1}>
							<motion.div
								key={currentIndex}
								custom={isRTL ? -1 : 1}
								variants={testimonialVariants}
								initial='enter'
								animate='center'
								exit='exit'
								transition={{
									x: { type: "spring", stiffness: 300, damping: 30 },
									opacity: { duration: 0.2 },
									scale: { duration: 0.3 },
								}}
								className='p-8 sm:p-12 lg:p-16'>
								{/* Quote Icon */}
								<div className='flex justify-center mb-8'>
									<motion.div
										className='w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg'
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}>
										<Quote className='w-8 h-8 text-white' />
									</motion.div>
								</div>

								{/* Testimonial Content */}
								<motion.blockquote
									className='text-lg sm:text-xl lg:text-2xl text-slate-700 text-center leading-relaxed mb-8 font-medium'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2, duration: 0.6 }}>
									" 
									{isRTL
										? currentTestimonial.contentAr
										: currentTestimonial.content}
									"
								</motion.blockquote>

								{/* Rating */}
								<div className='flex justify-center mb-8'>
								{[...Array(Math.min(Math.max(currentTestimonial.rating || 0, 0), 5))].map((_, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}>
											<Star className='w-6 h-6 text-yellow-400 fill-current' />
										</motion.div>
									))}
								</div>

								{/* Client Info */}
								<motion.div
									className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6, duration: 0.6 }}>
									{/* Client Image */}
									<motion.div
										className='relative'
										whileHover={{ scale: 1.05 }}
										transition={{ type: "spring", stiffness: 300 }}>
										<div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg'>
											<img
												src={currentTestimonial.image}
												alt={
													isRTL
														? currentTestimonial.nameAr
														: currentTestimonial.name
												}
												className='w-full h-full object-cover'
											/>
										</div>
										{/* Glow effect */}
										<div className='absolute inset-0 rounded-full bg-gradient-to-br from-primary-400/20 to-transparent animate-pulse'></div>
									</motion.div>

									{/* Client Details */}
									<div className='text-center sm:text-left'>
										<motion.h4
											className='text-xl sm:text-2xl font-bold text-slate-800 mb-1'
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.8, duration: 0.6 }}>
											{isRTL
												? currentTestimonial.nameAr
												: currentTestimonial.name}
										</motion.h4>
										<motion.p
											className='text-primary-600 font-semibold text-lg mb-1'
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.9, duration: 0.6 }}>
											{isRTL
												? currentTestimonial.positionAr
												: currentTestimonial.position}
										</motion.p>
										<motion.p
											className='text-slate-500 text-base'
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 1.0, duration: 0.6 }}>
											{isRTL
												? currentTestimonial.companyAr
												: currentTestimonial.company}
										</motion.p>
									</div>
								</motion.div>
							</motion.div>
						</AnimatePresence>

						{/* Navigation Arrows */}
						<button
							onClick={prevTestimonial}
							className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ${
								isRTL ? "right-4" : "left-4"
							}`}
							aria-label='Previous testimonial'>
							<ChevronLeft
								className={`w-6 h-6 text-slate-600 ${
									isRTL ? "rotate-180" : ""
								}`}
							/>
						</button>

						<button
							onClick={nextTestimonial}
							className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ${
								isRTL ? "left-4" : "right-4"
							}`}
							aria-label='Next testimonial'>
							<ChevronRight
								className={`w-6 h-6 text-slate-600 ${
									isRTL ? "rotate-180" : ""
								}`}
							/>
						</button>
					</div>

					{/* Dots Indicator */}
					<div className='flex justify-center mt-8 gap-3'>
						{testimonials.map((_, index) => (
							<motion.button
								key={index}
								onClick={() => goToTestimonial(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentIndex
										? "bg-primary-500 scale-125"
										: "bg-slate-300 hover:bg-slate-400"
								}`}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
