/** @format */

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import HeroStats from "./HeroStats";
import HeroButtons from "./HeroButtons";
import HeroImages from "./HeroImages";
import { useContactInfo } from "../../hooks/useContactInfo";
import type { ContactInfo, HeroImage } from "../../services/contactInfoApi";

const Hero: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [counters, setCounters] = useState([0, 0, 0]);
	const [isPageVisible, setIsPageVisible] = useState(false);

	// Fetch hero images from Contact Info API; fallback to defaults if missing
	const { data: contactInfo } = useContactInfo();
	const heroImages = useMemo(() => {
		const info = contactInfo as ContactInfo | undefined;
		const images =
			info?.heroimages?.map((h: HeroImage) => h.src).filter(Boolean) ?? [];
		if (images.length >= 3) return images;
		const fallback = [
			"https://i.postimg.cc/zv42MvHP/20251003-0209-Futuristic-Operating-Room-simple-compose-01k6kjx17dff5txdbwbpnav0jt.png",
			"https://i.postimg.cc/wjzYT434/20251002-2049-Modern-Medical-Clinic-simple-compose-01k6k0j7stee5rtwrntnkxhfwf.png",
			"https://i.postimg.cc/W3CQRXQN/20251002-2046-Modern-Medical-Clinic-Interior-simple-compose-01k6k0cyc5fh1a5pzkwm98r6xr.png",
		];
		return images.length > 0 ? [...images, ...fallback].slice(0, 3) : fallback;
	}, [contactInfo]);
	const [activeIndex, setActiveIndex] = React.useState(0);

	// Check if page is visible and set initial state
	React.useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				setIsPageVisible(true);
			} else {
				setIsPageVisible(false);
			}
		};

		// Set initial visibility state
		setIsPageVisible(document.visibilityState === "visible");

		// Listen for visibility changes
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	React.useEffect(() => {
		const t = setInterval(() => {
			setActiveIndex((i) => (i + 1) % heroImages.length);
		}, 3200); // Faster rotation to prevent stopping
		return () => clearInterval(t);
	}, [heroImages.length]);

	return (
		<>
			{/* Preload critical images */}
			<link rel='preload' as='image' href={heroImages[0]} />
			<link rel='preload' as='image' href={heroImages[1]} />
			<link rel='preload' as='image' href={heroImages[2]} />

			<section id='home' className='relative  overflow-hidden max-w-full '>
				{/* Floating primary card wrapper */}
				<div
					className='relative mx-auto max-w-6xl lg:max-w-7xl
				 rounded-[24px] md:rounded-[28px] lg:rounded-[32px] bg-primary-500 
				 mt-28
				 '>
					{/* New Enhanced Textures Layer */}

					{/* Removed curved bottom to preserve floating card look */}

					<div className=' px-4 sm:px-6 md:px-10 lg:px-12 pb-24 pt-8 sm:pt-4  xl:pt-16 max-w-full overflow-hidden '>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center max-w-full'>
							{/* Content Side - Responsive to RTL */}
							<div
								className={`text-white text-center mt-8 ${
									isRTL ? "md:text-right" : "md:text-left"
								} 
						order-2 md:order-1 md:col-span-1 ${
							isRTL ? "md:pr-4" : "md:pl-4"
						} max-w-full overflow-hidden`}>
								<h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 sm:mb-4'>
									{t("advancedMedicalEquipment")}
									<span className='block bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-3'>
										{t("equipment")}
									</span>
									{t("forHealthcareExcellence")}
								</h1>

								<p
									className={`text-xs sm:text-sm lg:text-base text-primary-100 mb-4 sm:mb-6 max-w-lg mx-auto ${
										isRTL
											? "leading-[3.25] max-w-md sm:max-w-lg break-words lg:mr-0"
											: "leading-relaxed lg:ml-0"
									}`}>
									{t("heroDescription")}
								</p>

								<HeroButtons onPlaceOrder={() => navigate("/contact")} />

								{/* Stats */}
								<HeroStats
									counters={counters}
									setCounters={setCounters}
									isPageVisible={isPageVisible}
								/>
							</div>

							{/* Hero Images Section - Optimized */}
							<div className='order-1 md:order-2 md:col-span-1'>
								<HeroImages
									heroImages={heroImages}
									activeIndex={activeIndex}
									setActiveIndex={setActiveIndex}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
