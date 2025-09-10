/** @format */

import React from "react";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../contexts/LanguageContext";

interface DashboardHeaderProps {
	title: string;
	sidebarOpen: boolean;
	onSidebarToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	title,
	sidebarOpen,
	onSidebarToggle,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	return (
		<header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0'>
			<div className='flex items-center justify-between'>
				<button
					onClick={onSidebarToggle}
					className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
					<Menu className='h-6 w-6' />
				</button>

				<div
					className={`flex items-center ${
						isRTL
							? "flex-row-reverse space-x-reverse space-x-4"
							: "space-x-4"
					}`}>
					<h1 className='text-xl font-semibold text-gray-900'>
						{title}
					</h1>
				</div>
			</div>
		</header>
	);
};

export default DashboardHeader;
