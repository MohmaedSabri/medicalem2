/** @format */

import React, { useEffect, useState } from "react";

import Header from "../components/layout/Header/Header";
import Hero from "../components/common/Hero";
import Ceo from "../components/common/Ceo";
import Products from "../components/pages/Products";
import OurTeam from "../components/common/OurTeam";
import Testimonials from "../components/common/Testimonials";
import WhyChooseUs from "../components/common/WhyChooseUs";
import Contact from "../components/common/Contact";
import Footer from "../components/layout/Footer";
import SectionBridge from "../components/ui/SectionBridge";
import FloatingSocialSidebar from "../components/layout/FloatingSocialSidebar";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
	const { t } = useTranslation();
	const [showSocialSidebar, setShowSocialSidebar] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Get the Contact section element
			const contactSection = document.getElementById("contact");

			if (contactSection) {
				const contactTop = contactSection.offsetTop;

				// Show sidebar when scrolling down, hide when reaching Contact section or at top
				if (scrollY > 700 && scrollY < contactTop + 600) {
					setShowSocialSidebar(true);
				} else {
					setShowSocialSidebar(false);
				}
			} else {
				// Fallback: show sidebar when scrolling down and hide when at top or bottom
				if (scrollY > 100 && scrollY < documentHeight - windowHeight - 100) {
					setShowSocialSidebar(true);
				} else {
					setShowSocialSidebar(false);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<FloatingSocialSidebar isVisible={showSocialSidebar} />

			<div className='min-h-screen px-4 sm:px-6 md:px-10 lg:px-12 bg-white max-w-full overflow-x-hidden'>
				<Header />
				<Hero />
				<Ceo />
				{/* Simple Section Divider */}
				<svg
					viewBox='0 0 1440 60'
					xmlns='http://www.w3.org/2000/svg'
					className='w-full'
					style={{ height: "80px" }}></svg>

				<Products />

				{/* Why Choose Us Section */}
				<WhyChooseUs />

				{/* Our Team Section - Moved after Why Choose Us */}
				<OurTeam />

				{/* Testimonials Section - Added after Team Section */}
				<Testimonials />

				{/* Complementary Diagonal Divider - WhyChooseUs to Contact */}

				<svg width='0' height='0'>
					<defs>
						<linearGradient id='gradientWave' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#134e4a' />
							<stop offset='100%' stopColor='#0f766e' />
						</linearGradient>
					</defs>
				</svg>

				<Contact />
				{/* Simple Bridge */}
				<SectionBridge variant='gradient'>
					<div className='text-center py-6'>
						<p className='text-sm text-gray-500'>{t("connectingHealthcare")}</p>
					</div>
				</SectionBridge>
			</div>
			<Footer />
		</>
	);
};

export default Home;
