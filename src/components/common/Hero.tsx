/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import HeroStats from "./HeroStats";
import HeroButtons from "./HeroButtons";
import HeroImages from "./HeroImages";

const Hero: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [counters, setCounters] = useState([0, 0, 0]);

	// Hero tri-image rotating state with continuous smooth orbital motion
	const heroImages = React.useMemo(
		() => [
			"https://i.postimg.cc/5NhhnfVk/hero1.png",
			"https://i.postimg.cc/qvcbn3YV/hero2.png",
			"https://i.postimg.cc/qqfDyxkr/hero3.png",
		],
		[]
	);
	const [activeIndex, setActiveIndex] = React.useState(0);
	React.useEffect(() => {
		const t = setInterval(() => {
			setActiveIndex((i) => (i + 1) % heroImages.length);
		}, 3200); // Faster rotation to prevent stopping
		return () => clearInterval(t);
	}, [heroImages.length]);

	return (
		<>
			{/* Preload critical images */}
			<link rel="preload" as="image" href={heroImages[0]} />
			<link rel="preload" as="image" href={heroImages[1]} />
			<link rel="preload" as="image" href={heroImages[2]} />
			
			<section
				id='home'
				className='relative  overflow-hidden max-w-full '>
			
				{/* Floating green card wrapper */}
				<div className='relative mx-auto max-w-6xl lg:max-w-7xl
				 rounded-[24px] md:rounded-[28px] lg:rounded-[32px] bg-[#00796a] 
				 transform hover:-translate-y-2 transition-all duration-700 ease-out
				 mx-auto
				 mt-28
				 animate-float
				 '>

				{/* New Enhanced Textures Layer */}

				{/* Removed curved bottom to preserve floating card look */}

				<div className=' px-4 sm:px-6 md:px-10 lg:px-12 pb-24 pt-8 sm:pt-4  xl:pt-16 max-w-full overflow-hidden '>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-center max-w-full'>
						{/* Content Side - Responsive to RTL */}
						<div className={`text-white text-center mt-8 ${isRTL ? 'md:text-right lg:text-right' : 'md:text-left lg:text-left'} 
						order-2 md:order-1 lg:order-1 md:col-span-1 lg:col-span-2 ${isRTL ? 'md:pr-4 lg:pr-4' : 'md:pl-4 lg:pl-4'} max-w-full overflow-hidden`}>
							<h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 sm:mb-4'>
								{t('advancedMedicalEquipment')}
								<span className='block text-yellow-300 mb-1 sm:mb-2 md:mb-3'>{t('equipment')}</span>
								{t('forHealthcareExcellence')}
							</h1>

							<p className={`text-xs sm:text-sm lg:text-base text-teal-100 mb-4 sm:mb-6 max-w-lg mx-auto ${isRTL ? 'leading-[3.25] max-w-md sm:max-w-lg break-words lg:mr-0' : 'leading-relaxed lg:ml-0'}`}>
								{t('heroDescription')}
							</p>

							<HeroButtons
								onExploreProducts={() => navigate("/products")}
								onContactUs={() => navigate("/contact")}
							/>

							{/* Stats */}
							<HeroStats
								counters={counters}
								setCounters={setCounters}
							/>
						</div>

						{/* Hero Images Section - Optimized */}
						<HeroImages
							heroImages={heroImages}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						/>
					</div>
				</div>
			</div>
		</section>
		</>
	);
};

export default Hero;
