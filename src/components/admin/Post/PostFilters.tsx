/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus } from "lucide-react";
import { useCategories } from "../../../contexts/CategoriesContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

interface PostFiltersProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	categoryFilter: string;
	setCategoryFilter: (category: string) => void;
	featuredFilter: string;
	setFeaturedFilter: (featured: string) => void;
	onAddPost: () => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
	searchQuery,
	setSearchQuery,
	statusFilter,
	setStatusFilter,
	categoryFilter,
	setCategoryFilter,
	featuredFilter,
	setFeaturedFilter,
	onAddPost,
}) => {
	const { categories } = useCategories();
	const { currentLanguage, isRTL } = useLanguage();
	const { t } = useTranslation();

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
			<div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
				{/* Search and Filters */}
				<div className='flex flex-col sm:flex-row gap-4 flex-1'>
					{/* Search */}
					<div className='relative flex-1 min-w-64'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
						<input
							type='text'
							placeholder='Search posts...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
						/>
					</div>

					{/* Status Filter */}
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-32'
					>
						<option value='all'>All Status</option>
						<option value='draft'>Draft</option>
						<option value='published'>Published</option>
						<option value='archived'>Archived</option>
					</select>

					{/* Category Filter */}
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-40'
					>
						<option value='all'>All Categories</option>
						{categories.map((category) => (
							<option key={category._id} value={category._id}>
								{typeof category.name === 'string' 
									? category.name 
									: (category.name?.[currentLanguage as 'en' | 'ar'] || category.name?.en || category.name?.ar || 'Uncategorized')}
							</option>
						))}
					</select>

					{/* Featured Filter */}
					<select
						value={featuredFilter}
						onChange={(e) => setFeaturedFilter(e.target.value)}
						className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-32'
					>
						<option value='all'>All Posts</option>
						<option value='featured'>Featured Only</option>
						<option value='not-featured'>Not Featured</option>
					</select>
				</div>

				{/* Add Post Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={onAddPost}
					className='flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap'
				>
					<Plus className='w-4 h-4' />
					Add New Post
				</motion.button>
			</div>

			{/* Active Filters Display */}
			{(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || featuredFilter !== 'all') && (
				<div className='mt-4 pt-4 border-t border-gray-200'>
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<Filter className='w-4 h-4' />
						<span>Active filters:</span>
						<div className='flex flex-wrap gap-2'>
							{searchQuery && (
								<span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
									Search: "{searchQuery}"
								</span>
							)}
							{statusFilter !== 'all' && (
								<span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs'>
									Status: {statusFilter}
								</span>
							)}
							{categoryFilter !== 'all' && (
								<span className='px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs'>
									Category: {(() => {
										const category = categories.find(c => c._id === categoryFilter);
										if (!category) return 'Unknown';
										if (typeof category.name === 'string') return category.name;
										return category.name?.[currentLanguage as 'en' | 'ar'] || category.name?.en || category.name?.ar || 'Unknown';
									})()}
								</span>
							)}
							{featuredFilter !== 'all' && (
								<span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs'>
									Featured: {featuredFilter === 'featured' ? 'Yes' : 'No'}
								</span>
							)}
						</div>
						<button
							onClick={() => {
								setSearchQuery('');
								setStatusFilter('all');
								setCategoryFilter('all');
								setFeaturedFilter('all');
							}}
							className='text-red-500 hover:text-red-700 text-xs underline'
						>
							Clear all
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PostFilters;
