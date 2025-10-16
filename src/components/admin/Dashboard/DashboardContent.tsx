/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../contexts/LanguageContext";
import DashboardStats from "./DashboardStats";
import RecentItems from "../RecentItems";
import RecentPosts from "../RecentPosts";
import QuickActions from "../QuickActions";
import ManageTestimonials from "../ManageTestimonials";

interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
	inStock: boolean;
	subcategory: string;
}

interface Category {
	_id: string;
	name: string | { en: string; ar: string };
}

interface Post {
	_id: string;
	title: string | { en: string; ar: string };
	authorName: string;
	category: string | { _id: string; name: string | { en: string; ar: string } };
	status: string;
	featured: boolean;
}

interface StatItem {
	label: string;
	value: string;
	color: string;
	icon: React.ComponentType<{ className?: string }>;
	loading: boolean;
}

interface DashboardContentProps {
	activeTab: string;
	user: { name?: string } | null;
	dashboardStats: StatItem[];
	products: Product[];
	productsLoading: boolean;
	categories: Category[];
	categoriesLoading: boolean;
	subcategories: any[];
	subcategoriesLoading: boolean;
	posts: Post[];
	postsLoading: boolean;
	getSubcategoryName: (subcategoryValue: string | { _id: string; name: string; description: string }) => string;
	getProductCountForCategory: (category: Category) => number;
	getLocalizedText: (value: unknown) => string;
	onTabChange: (tab: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
	activeTab,
	user,
	dashboardStats,
	products,
	productsLoading,
	categories,
	categoriesLoading,
	subcategories,
	subcategoriesLoading,
	posts,
	postsLoading,
	getSubcategoryName,
	getProductCountForCategory,
	getLocalizedText,
	onTabChange,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const renderContent = () => {
		switch (activeTab) {
			case "add-product":
				return <div>Add Product Form</div>;
			case "products":
				return <div>Manage Products</div>;
			case "categories":
				return <div>Manage Categories</div>;
			case "subcategories":
				return <div>Manage SubCategories</div>;
			case "add-post":
				return <div>Add Post Form</div>;
			case "posts":
				return <div>Manage Posts</div>;
			case "add-doctor":
				return <div>Add Doctor Form</div>;
			case "doctors":
				return <div>Manage Doctors</div>;
			case "add-testimonial":
				return <ManageTestimonials />;
			case "testimonials":
				return <ManageTestimonials />;
			case "dashboard":
			default:
				return (
					<div className='space-y-6'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								{t("welcomeBack")}, {user?.name}!
							</h2>
							<p className='text-gray-600'>{t("overviewDescription")}</p>
						</motion.div>

						<DashboardStats stats={dashboardStats} />

						<RecentItems
							products={products}
							productsLoading={productsLoading}
							categories={categories}
							categoriesLoading={categoriesLoading}
							posts={posts}
							postsLoading={postsLoading}
							getSubcategoryName={getSubcategoryName}
							getProductCountForCategory={getProductCountForCategory}
							getLocalizedText={getLocalizedText}
						/>

						<RecentPosts
							posts={posts}
							postsLoading={postsLoading}
							getLocalizedText={getLocalizedText}
						/>

						<QuickActions onTabChange={onTabChange} />
					</div>
				);
		}
	};

	return (
		<main className='flex-1 p-6 overflow-y-auto'>{renderContent()}</main>
	);
};

export default DashboardContent;
