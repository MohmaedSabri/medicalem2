/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Tag, FileText, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

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

interface RecentItemsProps {
	products: Product[];
	productsLoading: boolean;
	categories: Category[];
	categoriesLoading: boolean;
	posts: Post[];
	postsLoading: boolean;
	getSubcategoryName: (subcategoryValue: string | { _id: string; name: string; description: string }) => string;
	getProductCountForCategory: (category: Category) => number;
	getLocalizedText: (value: unknown) => string;
}

const RecentItems: React.FC<RecentItemsProps> = ({
	products,
	productsLoading,
	categories,
	categoriesLoading,
	posts,
	postsLoading,
	getSubcategoryName,
	getProductCountForCategory,
	getLocalizedText,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Recent Products */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='bg-white rounded-xl shadow-sm p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					{t("recentProducts")}
				</h3>
				{productsLoading ? (
					<div className='space-y-3'>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className={`flex items-center ${
									isRTL
										? "flex-row-reverse space-x-reverse space-x-3"
										: "space-x-3"
								}`}>
								<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
								<div
									className={`flex-1 ${
										isRTL ? "text-right" : "text-left"
									}`}>
									<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
									<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
								</div>
							</div>
						))}
					</div>
				) : products.length > 0 ? (
					<div className='space-y-3'>
						{products.slice(0, 3).map((product) => (
							<div
								key={product.id}
								className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
									isRTL
										? "flex-row-reverse space-x-reverse space-x-3"
										: "space-x-3"
								}`}>
								<img
									src={product.image}
									alt={product.name}
									className='w-10 h-10 rounded-lg object-cover'
								/>
								<div
									className={`flex-1 ${
										isRTL ? "text-right" : "text-left"
									}`}>
									<p className='font-medium text-gray-900'>
										{product.name}
									</p>
									<p className='text-sm text-gray-500'>
										{t("currencySymbol")}{" "}
										{product.price.toLocaleString()}
									</p>
									<p className='text-xs text-gray-400'>
										{getSubcategoryName(product.subcategory)}
									</p>
								</div>
								<div
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										product.inStock
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}>
									{product.inStock ? t("inStock") : t("outOfStock")}
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-500 text-center py-8'>
						{t("noProductsYet")}
					</p>
				)}
			</motion.div>

			{/* Recent Categories */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className='bg-white rounded-xl shadow-sm p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					{t("recentCategories")}
				</h3>
				{categoriesLoading ? (
					<div className='space-y-3'>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className={`flex items-center ${
									isRTL
										? "flex-row-reverse space-x-reverse space-x-3"
										: "space-x-3"
								}`}>
								<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
								<div
									className={`flex-1 ${
										isRTL ? "text-right" : "text-left"
									}`}>
									<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
									<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
								</div>
							</div>
						))}
					</div>
				) : categories.length > 0 ? (
					<div className='space-y-3'>
						{categories.slice(0, 3).map((category) => {
							const productCount = getProductCountForCategory(category);

							return (
								<div
									key={category._id}
									className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
										isRTL
											? "flex-row-reverse space-x-reverse space-x-3"
											: "space-x-3"
									}`}>
									<div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
										<Tag className='h-5 w-5 text-teal-600' />
									</div>
									<div
										className={`flex-1 ${
											isRTL ? "text-right" : "text-left"
										}`}>
										<p className='font-medium text-gray-900'>
											{getLocalizedText(category.name)}
										</p>
										<p className='text-sm text-gray-500'>
											{productCount} {t("products")}
										</p>
									</div>
									<div className='px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
										{productCount > 0 ? t("active") : t("empty")}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className='text-gray-500 text-center py-8'>
						{t("noCategoriesYet")}
					</p>
				)}
			</motion.div>
		</div>
	);
};

export default RecentItems;
