/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Plus,
	Package,
	LogOut,
	X,
	Tag,
	FileText,
	Globe,
	User,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../contexts/LanguageContext";

interface DashboardSidebarProps {
	activeTab: string;
	sidebarOpen: boolean;
	onTabChange: (tab: string) => void;
	onSidebarClose: () => void;
	onLogout: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
	activeTab,
	sidebarOpen,
	onTabChange,
	onSidebarClose,
	onLogout,
}) => {
	const { user } = useAuth();
	const { t } = useTranslation();
	const { isRTL, currentLanguage, changeLanguage } = useLanguage();

	const sidebarItems = [
		{ id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
		{ id: "add-product", label: t("addProduct"), icon: Plus },
		{ id: "products", label: t("manageProducts"), icon: Package },
		{ id: "categories", label: t("manageCategories"), icon: Tag },
		{ id: "subcategories", label: t("manageSubCategories"), icon: Tag },
		{ id: "add-post", label: t("addPost"), icon: FileText },
		{ id: "posts", label: t("managePosts"), icon: FileText },
		{ id: "add-doctor", label: t("addDoctor"), icon: User },
		{ id: "doctors", label: t("manageDoctors"), icon: User },
	];

	return (
		<>
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={onSidebarClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 ${
					isRTL ? "right-0" : "left-0"
				} z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
					sidebarOpen
						? "translate-x-0"
						: `${
								isRTL ? "translate-x-full" : "-translate-x-full"
						  } lg:translate-x-0`
				}`}>
				<div className='flex flex-col h-screen'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h1 className='text-xl font-bold text-teal-600'>
							{t("medicalEqPro")}
						</h1>
						<button
							onClick={onSidebarClose}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<X className='h-5 w-5' />
						</button>
					</div>

					{/* User Info */}
					<div className='p-6 border-b border-gray-200'>
						<div
							className={`flex items-center ${
								isRTL
									? "flex-row-reverse space-x-reverse space-x-3"
									: "space-x-3"
							}`}>
							<div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center'>
								<span className='text-white font-semibold text-sm'>
									{user?.name?.charAt(0).toUpperCase()}
								</span>
							</div>
							<div className={`${isRTL ? "text-right" : "text-left"}`}>
								<p className='font-medium text-gray-900'>{user?.name}</p>
								<p className='text-sm text-gray-500'>{user?.email}</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className='flex-1 p-6 space-y-2'>
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => {
										onTabChange(item.id);
										onSidebarClose();
									}}
									className={`w-full flex items-center ${
										isRTL ? "space-x-4" : "space-x-3"
									} px-4 py-3 rounded-lg text-left transition-all duration-200 ${
										activeTab === item.id
											? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
									}`}>
									<Icon
										className={`h-5 w-5 ${
											activeTab === item.id ? "text-teal-600" : "text-gray-500"
										}`}
									/>
									<span className='font-medium'>{item.label}</span>
								</button>
							);
						})}
					</nav>

					{/* Language Switcher */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={() =>
								changeLanguage(currentLanguage === "en" ? "ar" : "en")
							}
							className={`w-full flex items-center ${
								isRTL ? "space-x-4" : "space-x-3"
							} px-4 py-3 rounded-lg text-left text-teal-600 hover:bg-teal-50 transition-all duration-200 hover:shadow-sm`}>
							<Globe className='h-5 w-5' />
							<span className='font-medium'>
								{currentLanguage === "en" ? t("arabic") : t("english")}
							</span>
						</button>
					</div>

					{/* Logout */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={onLogout}
							className={`w-full flex items-center ${
								isRTL ? "space-x-4" : "space-x-3"
							} px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm`}>
							<LogOut className='h-5 w-5' />
							<span className='font-medium'>{t("logout")}</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardSidebar;
