/** @format */

import React from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer";
import Ceo from "../components/common/Ceo";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
	const { t } = useTranslation();
	
	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<section className='relative bg-primary-600 text-white py-20 '>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 mt-12'>
					<h1 className='text-4xl sm:text-5xl font-bold mb-6'>{t('aboutUs')}</h1>
					<p className='max-w-3xl text-primary-100 text-lg'>
						{t('aboutUsDescription')}
					</p>
				</div>
			</section>

			{/* CEO section from Home */}
			<Ceo />

			{/* Feature/value section from Home */}
			

			<section className='py-16 '>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='p-6 rounded-2xl border border-primary-100 bg-primary-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>{t('ourMission')}</h3>
						<p className='text-slate-600'>
							{t('missionDescription')}
						</p>
					</div>
					<div className='p-6 rounded-2xl border border-primary-100 bg-primary-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>{t('ourVision')}</h3>
						<p className='text-slate-600'>
							{t('visionDescription')}
						</p>
					</div>
					<div className='p-6 rounded-2xl border border-primary-100 bg-primary-50'>
						<h3 className='text-[#0f172a] font-semibold text-xl mb-2'>{t('ourValues')}</h3>
						<p className='text-slate-600'>
							{t('valuesDescription')}
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default About;
