/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Plus, Tag, Package, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickActionsProps {
	onTabChange: (tab: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onTabChange }) => {
	const { t } = useTranslation();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
			className='bg-white rounded-xl shadow-sm p-6'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>
				{t("quickActions")}
			</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<button
					onClick={() => onTabChange("add-product")}
					className='p-4 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 text-center group'>
					<Plus className='h-8 w-8 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
					<p className='font-medium text-teal-700'>{t("addProduct")}</p>
					<p className='text-sm text-teal-600'>
						{t("createNewProduct")}
					</p>
				</button>

				<button
					onClick={() => onTabChange("categories")}
					className='p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group'>
					<Tag className='h-8 w-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
					<p className='font-medium text-blue-700'>
						{t("manageCategories")}
					</p>
					<p className='text-sm text-blue-600'>
						{t("organizeCategories")}
					</p>
				</button>

				<button
					onClick={() => onTabChange("products")}
					className='p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center group'>
					<Package className='h-8 w-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
					<p className='font-medium text-purple-700'>
						{t("manageProducts")}
					</p>
					<p className='text-sm text-purple-600'>
						{t("editInventory")}
					</p>
				</button>

				<button
					onClick={() => onTabChange("add-post")}
					className='p-4 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-center group'>
					<FileText className='h-8 w-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
					<p className='font-medium text-indigo-700'>{t("addPost")}</p>
					<p className='text-sm text-indigo-600'>
						{t("createNewPost")}
					</p>
				</button>

				<button
					onClick={() => onTabChange("posts")}
					className='p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center group'>
					<FileText className='h-8 w-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
					<p className='font-medium text-green-700'>
						{t("managePosts")}
					</p>
					<p className='text-sm text-green-600'>{t("editPosts")}</p>
				</button>
			</div>
		</motion.div>
	);
};

export default QuickActions;
