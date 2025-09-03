/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../contexts/CategoriesContext";

const Categories: React.FC = () => {
	const { categories, loading, error } = useCategories();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCategories = categories.filter((category) => {
		const matchesSearch =
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center py-8'>
				<p className='text-red-600'>
					Error loading categories: {error.message}
				</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
			{/* Hero Section */}
			<div className='bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
					<div className='text-center'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}>
							<Tag className='mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 sm:mb-6' />
							<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4'>
								Product Categories
							</h1>
							<p className='text-base sm:text-lg lg:text-xl text-teal-100 max-w-2xl mx-auto px-4 sm:px-0'>
								Explore our comprehensive range of product categories. Find
								exactly what you're looking for or discover new possibilities.
							</p>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Search and Actions */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8'>
					<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between'>
						<div className='flex-1 relative max-w-md w-full sm:w-auto'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<Search className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
							</div>
							<input
								type='text'
								placeholder='Search categories...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base'
							/>
						</div>
						<button
							onClick={() => navigate("/dashboard?tab=categories")}
							className='inline-flex items-center justify-center space-x-2 bg-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base w-full sm:w-auto'>
							<Plus className='h-4 w-4' />
							<span>Manage Categories</span>
						</button>
					</div>
				</motion.div>
			</div>

			{/* Categories Grid */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
				{filteredCategories.length > 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{filteredCategories.map((category, index) => (
							<motion.div
								key={category._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.1 * index }}
								className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group'
								onClick={() => navigate(`/category/${category._id}`)}>
								<div className='p-6'>
									<div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors'>
										<Tag className='h-6 w-6 text-teal-600' />
									</div>
									<h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors'>
										{category.name}
									</h3>
									<p className='text-gray-600 text-sm leading-relaxed'>
										{category.description || "No description available"}
									</p>
									<div className='mt-4 pt-4 border-t border-gray-100'>
										<div className='flex items-center justify-between text-sm text-gray-500'>
											<span>Created</span>
											<span>
												{new Date(category.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='text-center py-16'>
						<Tag className='mx-auto h-16 w-16 text-gray-400 mb-4' />
						<h3 className='text-xl font-medium text-gray-900 mb-2'>
							No categories found
						</h3>
						<p className='text-gray-500 mb-6'>
							{searchTerm
								? "Try adjusting your search terms."
								: "No categories have been created yet."}
						</p>
						{!searchTerm && (
							<button
								onClick={() => navigate("/dashboard?tab=categories")}
								className='inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
								<Plus className='h-4 w-4' />
								<span>Create First Category</span>
							</button>
						)}
					</motion.div>
				)}
			</div>

			{/* Call to Action */}
			{filteredCategories.length > 0 && (
				<div className='bg-white border-t border-gray-200'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
						<div className='text-center'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								Need to manage your categories?
							</h2>
							<p className='text-gray-600 mb-6'>
								Access the admin dashboard to create, edit, and organize your
								product categories.
							</p>
							<button
								onClick={() => navigate("/dashboard?tab=categories")}
								className='inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
								<Tag className='h-4 w-4' />
								<span>Go to Dashboard</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Categories;
