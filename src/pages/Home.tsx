/** @format */

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Ceo from "../components/Ceo";
import Products from "../components/Products";
import OurTeam from "../components/OurTeam";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import SectionDivider from "../components/SectionDivider";
import SectionBridge from "../components/SectionBridge";
import FloatingSocialSidebar from "../components/FloatingSocialSidebar";
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
			const contactSection = document.getElementById('contact');
			
			if (contactSection) {
				const contactTop = contactSection.offsetTop;
				
				// Show sidebar when scrolling down, hide when reaching Contact section or at top
				if (scrollY > 100 && scrollY < contactTop - 200) {
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

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<>
			<FloatingSocialSidebar isVisible={showSocialSidebar} />
			
			<div className='min-h-screen bg-white max-w-full overflow-x-hidden'>
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
						<p className='text-sm text-gray-500'>
							{t('connectingHealthcare')}
						</p>
					</div>
				</SectionBridge>
				<Footer />
			</div>
		</>
	);
};

export default Home;
