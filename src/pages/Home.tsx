/** @format */

import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Ceo from "../components/Ceo";
import Products from "../components/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import SectionDivider from "../components/SectionDivider";
import SectionBridge from "../components/SectionBridge";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className='min-h-screen bg-white'>
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
			{/* Enhanced Diagonal Divider - Products to WhyChooseUs */}
			<WhyChooseUs />
			{/* Complementary Diagonal Divider - WhyChooseUs to Contact */}
			<SectionDivider variant='wave' color='url(#gradientWave)' height={120} />

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
					<div className='flex items-center justify-center space-x-3 mb-3'>
						<div className='w-2 h-2 bg-teal-500 rounded-full' />
						<div className='w-2 h-2 bg-blue-500 rounded-full' />
						<div className='w-2 h-2 bg-purple-500 rounded-full' />
					</div>
					<p className='text-sm text-gray-500'>
						{t('connectingHealthcare')}
					</p>
				</div>
			</SectionBridge>
			<Footer />
		</div>
	);
};

export default Home;
