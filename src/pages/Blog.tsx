/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ArrowRight, ArrowLeft, BookOpen, Tag, Heart, Share2, User, Clock } from "lucide-react";
import { usePosts, useFeaturedPosts } from "../hooks/usePosts";
import { Link } from "react-router-dom";
import { useCategories } from "../contexts/CategoriesContext";
import { PostFilters, Post, ContentBlock } from "../types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const Blog: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState<PostFilters>({
		page: 1,
		limit: 9,
		status: undefined, // Show all posts by default
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { categories } = useCategories();
	const { data: postsData, isLoading: postsLoading } = usePosts(filters, currentLanguage);
	const { data: featuredPosts = [], isLoading: featuredLoading } = useFeaturedPosts(3, currentLanguage);

	// Update filters when page changes
	useEffect(() => {
		setFilters(prev => ({ ...prev, page: currentPage }));
	}, [currentPage]);



	// Handle category filter
	const handleCategoryFilter = (categoryId: string) => {
		setFilters(prev => ({ 
			...prev, 
			category: prev.category === categoryId ? undefined : categoryId,
			page: 1 
		}));
		setCurrentPage(1);
	};

	// Handle sort change
	const handleSortChange = (sortBy: PostFilters["sortBy"], sortOrder: PostFilters["sortOrder"]) => {
		setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
		setCurrentPage(1);
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			page: 1,
			limit: 9,
			status: undefined, // Show all posts by default
			sortBy: "createdAt",
			sortOrder: "desc",
		});
		setCurrentPage(1);
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Estimate read time based on content length (200 wpm)
	const getReadTime = (content: ContentBlock[]) => {
		let totalWords = 0;
		
		content.forEach(block => {
			if (block.type === 'paragraph') {
				const words = block.text.trim().split(/\s+/).length;
				totalWords += words;
				if (block.title) {
					const titleWords = block.title.trim().split(/\s+/).length;
					totalWords += titleWords;
				}
			}
		});
		
		const minutes = Math.max(1, Math.ceil(totalWords / 200));
		return `${minutes} min read`;
	};

	// Create an excerpt from structured content
	const getExcerpt = (content: ContentBlock[], maxLength: number = 160) => {
		const firstParagraph = content.find(block => block.type === 'paragraph');
		if (!firstParagraph || firstParagraph.type !== 'paragraph') return '';
		
		const text = firstParagraph.text.trim();
		if (text.length <= maxLength) return text;
		const sliced = text.slice(0, maxLength);
		const lastSpace = sliced.lastIndexOf(" ");
		return `${sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
	};

	// Get category name
	const getCategoryName = (category: string | { _id: string; name: string | { en: string; ar: string }; description: string | { en: string; ar: string } }) => {
		if (typeof category === "string") {
			const cat = categories.find(c => c._id === category);
			if (!cat) return category;
			
			// Handle localized category names
			if (typeof cat.name === 'string') return cat.name;
			if (cat.name && typeof cat.name === 'object') {
				return cat.name[currentLanguage as 'en' | 'ar'] || cat.name.en || cat.name.ar || '';
			}
			return category;
		}
		
		// Handle localized category names from API
		if (typeof category.name === 'string') return category.name;
		if (category.name && typeof category.name === 'object') {
			return category.name[currentLanguage as 'en' | 'ar'] || category.name.en || category.name.ar || '';
		}
		return '';
	};

	// Resolve full category display name (for sidebar list)
	const getCategoryDisplayName = (cat: { _id: string; name: string | { en: string; ar: string } }) => {
		if (!cat) return '';
		if (typeof cat.name === 'string') return cat.name;
		if (cat.name && typeof cat.name === 'object') {
			return cat.name[currentLanguage as 'en' | 'ar'] || cat.name.en || cat.name.ar || '';
		}
		return '';
	};

	// Localization helpers
	const getTitle = (post: Post): string => {
		const postWithLocalized = post as Post & { localized?: { title?: string; content?: string } };
		if (postWithLocalized.localized?.title) return postWithLocalized.localized.title;
		const value = postWithLocalized.title;
		if (typeof value === 'string') return value;
		if (value && typeof value === 'object') {
			return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || '';
		}
		return '';
	};
	const getContent = (post: Post): ContentBlock[] => {
		const postWithLocalized = post as Post & { localized?: { title?: string; content?: ContentBlock[] } };
		if (postWithLocalized.localized?.content) return postWithLocalized.localized.content;
		const value = postWithLocalized.content;
		if (Array.isArray(value)) return value;
		if (value && typeof value === 'object') {
			return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || [];
		}
		return [];
	};

	// Content validation function
	const isValidPostContent = (post: Post) => {
		const title = getTitle(post);
		const content = getContent(post);
		if (!title || !content || content.length === 0) return false;
		
		// Check if title is too short or contains only special characters
		// Support both Arabic and English characters
		const cleanTitle = title.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').trim();
		if (cleanTitle.length < 3) return false;
		
		// Check if content has meaningful text
		const hasValidContent = content.some(block => {
			if (block.type === 'paragraph') {
				const cleanText = block.text.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').trim();
				return cleanText.length >= 10;
			}
			return false;
		});
		if (!hasValidContent) return false;
		
		return true;
	};



	// Filter out invalid posts
	const validPosts = postsData?.posts?.filter(isValidPostContent) || [];
	const validFeaturedPosts = featuredPosts.filter(isValidPostContent);

	// Loading skeleton
	const PostSkeleton = () => (
		<div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
			<div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
			<div className="p-6">
				<div className="h-4 bg-gray-200 rounded mb-2"></div>
				<div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
				<div className="h-3 bg-gray-200 rounded mb-2"></div>
				<div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
				<div className="flex items-center space-x-4">
					<div className="h-3 bg-gray-200 rounded w-20"></div>
					<div className="h-3 bg-gray-200 rounded w-16"></div>
				</div>
			</div>

			{/* Call to Action */}
			<section className="bg-gradient-to-r from-teal-500 to-emerald-500 py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold text-white mb-4">
						Stay Updated with Medical Innovation
					</h2>
					<p className="text-xl text-white/90 mb-8">
						Subscribe to our newsletter for the latest insights on medical equipment and healthcare technology.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
						<input 
							type="email" 
							placeholder="Enter your email"
							className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
						/>
						<button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
							Subscribe
						</button>
					</div>
				</div>
			</section>
		</div>
	);

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative pt-32 pb-16 bg-[#00796a] overflow-hidden">
				{/* Simple Background Pattern */}
				<div className="absolute inset-0 -z-20 opacity-20">
					<div className="absolute top-10 left-10 w-8 h-8 border-2 border-white/20 transform rotate-45"></div>
					<div className="absolute top-20 right-20 w-6 h-6 border-2 border-white/20 transform rotate-45"></div>
					<div className="absolute bottom-20 left-16 w-10 h-10 border-2 border-white/20 transform rotate-45"></div>
					<div className="absolute bottom-10 right-10 w-7 h-7 border-2 border-white/20 transform rotate-45"></div>
				</div>


				<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="mb-6">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
							<BookOpen className="w-10 h-10 text-white" />
						</div>
					</motion.div>
					
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-4xl md:text-6xl font-bold text-white mb-6"
					>
						{t('ourMedical')}
						<span className="block text-yellow-300">{t('blog')}</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-xl text-teal-100 max-w-3xl mx-auto"
					>
						{t('blogDescription')}
					</motion.p>
				</div>
			</section>

			{/* Featured Posts Section */}
			{!featuredLoading && validFeaturedPosts.length > 0 && (
				<section className="py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold text-gray-900 mb-4">{t('featuredArticles')}</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto"></div>
						</div>
						
						<div className="grid md:grid-cols-2 gap-8 mb-16">
							{validFeaturedPosts.map((post) => (
								<article 
									key={post._id}
									className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
								>
									<div className="relative overflow-hidden">
										<img 
											src={post.postImage} 
											alt={getTitle(post)}
											className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
										/>
										<div className="absolute top-4 left-4">
											<span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
												{getCategoryName(post.category)}
											</span>
										</div>
										<div className="absolute top-4 right-4 flex space-x-2">
											<button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
												<Heart className="w-4 h-4 text-gray-600" />
											</button>
											<button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
												<Share2 className="w-4 h-4 text-gray-600" />
											</button>
										</div>
									</div>
									
									<div className="p-6">
										<div className="flex items-center text-sm text-gray-500 mb-3">
											<User className="w-4 h-4 mr-2" />
											<span className="mr-4">{post.authorName}</span>
											<Clock className="w-4 h-4 mr-2" />
											<span className="mr-4">{getReadTime(getContent(post))}</span>
											<span>{formatDate(post.createdAt)}</span>
										</div>
										
										<h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
											{getTitle(post)}
										</h3>
										
										<p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
											{getExcerpt(getContent(post), 180)}
										</p>
										
										<Link 
											to={`/blog/${post._id}`}
											className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200 group"
										>
											{t('readMore')}
											<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
										</Link>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Main Content Section */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Sidebar */}
						<div className="lg:col-span-1">
							{/* Categories */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
									<div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
										<Tag className="w-4 h-4 text-teal-600" />
									</div>
									<span>{t('categories')}</span>
								</h3>
								<div className="space-y-2">
									<button
										onClick={clearFilters}
										className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
											!filters.category
												? "bg-teal-100 text-teal-800 border-2 border-teal-200 shadow-sm"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
										}`}
									>
										{t('allCategories')}
									</button>
									{categories.map((category) => (
										<button
											key={category._id}
											onClick={() => handleCategoryFilter(category._id)}
											className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
												filters.category === category._id
													? "bg-teal-100 text-teal-800 border-2 border-teal-200 shadow-sm"
													: "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
											}`}
										>
											{getCategoryDisplayName(category as { _id: string; name: string | { en: string; ar: string } })}
										</button>
									))}
								</div>
							</motion.div>



							{/* Sort Options */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
									<div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
										<Filter className="w-4 h-4 text-teal-600" />
									</div>
									<span>{t('sortBy')}</span>
								</h3>
								<div className="space-y-2">
									<button
										onClick={() => handleSortChange("createdAt", "desc")}
										className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
											filters.sortBy === "createdAt" && filters.sortOrder === "desc"
												? "bg-teal-100 text-teal-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										{t('newestFirst')}
									</button>
									<button
										onClick={() => handleSortChange("createdAt", "asc")}
										className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
											filters.sortBy === "createdAt" && filters.sortOrder === "asc"
												? "bg-teal-100 text-teal-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										{t('oldestFirst')}
									</button>
									<button
										onClick={() => handleSortChange("views", "desc")}
										className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
											filters.sortBy === "views" && filters.sortOrder === "desc"
												? "bg-teal-100 text-teal-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										{t('mostViewed')}
									</button>
									<button
										onClick={() => handleSortChange("likes", "desc")}
										className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
											filters.sortBy === "likes" && filters.sortOrder === "desc"
												? "bg-teal-100 text-teal-800"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										{t('mostLiked')}
									</button>
								</div>
							</motion.div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-3">
							{/* Filters Summary */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Filter className="w-5 h-5 text-teal-500" />
										<span className="text-gray-700">
											{postsData?.totalPosts || 0} posts found
										</span>
										{filters.category && (
											<span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
												Category: {getCategoryName(filters.category)}
											</span>
										)}
										{filters.status && (
											<span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
												Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
											</span>
										)}
										{filters.search && (
											<span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
												Search: {filters.search}
											</span>
										)}
									</div>
									{(filters.category || filters.status || filters.search) && (
										<button
											onClick={clearFilters}
											className="text-teal-600 hover:text-teal-800 font-medium"
										>
											Clear Filters
										</button>
									)}
								</div>
							</motion.div>

							{/* Posts Grid */}
							{postsLoading ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{Array.from({ length: 6 }).map((_, index) => (
										<PostSkeleton key={index} />
									))}
								</div>
							) : validPosts.length > 0 ? (
								<>
									<div className="text-center mb-12">
										<h2 className="text-4xl font-bold text-gray-900 mb-4">{t('latestArticles')}</h2>
										<div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto"></div>
									</div>
									<div className="grid md:grid-cols-2 gap-8">
										{validPosts.map((post) => (
											<article 
												key={post._id}
												className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
											>
												<div className="relative overflow-hidden">
													<img 
														src={post.postImage} 
														alt={getTitle(post)}
														className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
													/>
													<div className="absolute top-3 left-3">
														<span className="bg-teal-500 text-white px-2 py-1 rounded-md text-xs font-medium">
															{getCategoryName(post.category)}
														</span>
													</div>
												</div>

												<div className="p-6">
													<div className="flex items-center text-xs text-gray-500 mb-2">
														<span className="mr-3">{post.authorName}</span>
														<span className="mr-3">{getReadTime(getContent(post))}</span>
														<span>{formatDate(post.createdAt)}</span>
													</div>
													
													<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
														{getTitle(post)}
													</h3>
													
													<p className="text-gray-600 text-sm mb-4 line-clamp-3">
														{getExcerpt(getContent(post), 140)}
													</p>
													
													<Link 
														to={`/blog/${post._id}`}
														className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors duration-200 group"
													>
														{t('readArticle')}
														<ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
													</Link>
												</div>
											</article>
										))}
									</div>

									{/* Pagination */}
									{postsData && postsData.totalPages > 1 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.6 }}
											className="flex items-center justify-center space-x-2 mt-12">
											<button
												onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
												disabled={currentPage === 1}
												className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
											>
												<ArrowLeft className="w-4 h-4" />
												<span>{t('previous')}</span>
											</button>
											
											{Array.from({ length: postsData.totalPages }, (_, i) => i + 1).map((page) => (
												<button
													key={page}
													onClick={() => setCurrentPage(page)}
													className={`px-4 py-2 rounded-lg transition-colors ${
														currentPage === page
															? "bg-teal-600 text-white"
															: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
													}`}
												>
													{page}
												</button>
											))}
											
											<button
												onClick={() => setCurrentPage(prev => Math.min(postsData.totalPages, prev + 1))}
												disabled={currentPage === postsData.totalPages}
												className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
											>
												<span>{t('next')}</span>
												<ArrowRight className="w-4 h-4" />
											</button>
										</motion.div>
									)}
								</>
							) : (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-center py-16">
									<div className="text-gray-400 mb-4">
										<BookOpen className="w-16 h-16 mx-auto" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noValidPostsFound')}</h3>
									<p className="text-gray-600 mb-4">
										{postsData?.posts && postsData.posts.length > 0 
											? t('noValidPostsDescription')
											: t('tryAdjustingSearch')
										}
									</p>
									{postsData?.posts && postsData.posts.length > 0 && validPosts.length === 0 && (
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
											<p className="text-sm text-yellow-800">
												<strong>{t('note')}:</strong> {postsData.posts.length} {t('postsFilteredOut')}
											</p>
										</div>
									)}
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Blog;
