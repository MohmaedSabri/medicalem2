/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
	Eye, 
	Heart, 
	Calendar, 
	User, 
	Tag, 
	ArrowLeft, 
	Share2, 
	BookOpen,
	Clock,
	MessageCircle,
	FileText,
	Star
} from "lucide-react";
import { usePost, useLikePost } from "../hooks/usePosts";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const BlogDetail: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(false);

	const { data: post, isLoading, error } = usePost(id!);
	const { mutate: likePost, isPending: isLiking } = useLikePost();
	const { categories } = useCategories();

	// Handle like
	const handleLike = () => {
		if (!user) {
			// Redirect to login if not authenticated
			navigate('/login');
			return;
		}

		if (id) {
			likePost(id);
			setIsLiked(true);
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Get category name
	const getCategoryName = (category: string | { _id: string; name: string; description: string }) => {
		if (typeof category === "string") {
			const cat = categories.find(c => c._id === category);
			return cat ? cat.name : category;
		}
		return category.name;
	};

	// Calculate reading time
	const calculateReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const words = content.trim().split(/\s+/).length;
		return Math.ceil(words / wordsPerMinute);
	};

	// Share post
	const handleShare = async () => {
		if (navigator.share && post) {
			try {
				await navigator.share({
					title: post.title,
					text: post.content.substring(0, 100) + "...",
					url: window.location.href,
				});
			} catch (error) {
				console.log('Error sharing:', error);
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			// You could add a toast notification here
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white pt-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto">
						{/* Loading skeleton */}
						<div className="bg-white rounded-xl shadow-lg p-8 animate-pulse border border-gray-100">
							<div className="h-8 bg-gray-200 rounded mb-4"></div>
							<div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
							<div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
							<div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-6"></div>
							<div className="space-y-3">
								<div className="h-4 bg-gray-200 rounded"></div>
								<div className="h-4 bg-gray-200 rounded w-5/6"></div>
								<div className="h-4 bg-gray-200 rounded w-4/6"></div>
								<div className="h-4 bg-gray-200 rounded w-3/6"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen bg-white pt-32">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto text-center">
						<div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
								<BookOpen className="w-8 h-8 text-red-600" />
							</div>
							<h1 className="text-2xl font-bold text-gray-900 mb-4">{t('postNotFound')}</h1>
							<p className="text-gray-600 mb-6">
								{t('postNotFoundDescription')}
							</p>
							<Link
								to="/blog"
								className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>{t('backToBlog')}</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Back Button */}
			<div className="pt-32 pb-8">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<motion.button
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => navigate('/blog')}
						className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-medium mb-6 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>{t('backToBlog')}</span>
					</motion.button>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
					>
						{/* Hero Image */}
						<div className="relative">
							<img
								src={post.postImage}
								alt={post.title}
								className="w-full h-96 object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20"></div>
							
							{/* Category Badge */}
							<div className="absolute top-4 left-4">
								<span className="inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 text-sm font-medium rounded-lg border border-white/20 shadow-lg">
									<FileText className="w-4 h-4 text-teal-600" />
									<span>{getCategoryName(post.category)}</span>
								</span>
							</div>
							
							{/* Featured Badge */}
							{post.featured && (
								<div className="absolute top-4 right-4">
									<span className="inline-flex items-center space-x-1 bg-yellow-500 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg">
										<Star className="w-4 h-4" />
										<span>{t('featured')}</span>
									</span>
								</div>
							)}
						</div>

						{/* Content */}
						<div className="p-8">
							{/* About the Author - top */}
							<div className="mb-8 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
								<h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
									<User className="w-6 h-6 text-teal-600" />
									<span>{t('aboutTheAuthor')}</span>
								</h3>
								<div className="flex items-center space-x-4">
									<div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
										<User className="w-7 h-7 text-teal-600" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-gray-900">{post.authorName}</h4>
										<p className="text-gray-600">{post.authorEmail}</p>
									</div>
								</div>
							</div>
							{/* Header */}
							<header className="mb-8">
								<h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
									{post.title}
								</h1>
								{/* Meta Information */}
								<div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
									<div className="flex items-center space-x-2">
										<User className="w-5 h-5 text-teal-600" />
										<span>{post.authorName}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Calendar className="w-5 h-5 text-teal-600" />
										<span>{formatDate(post.createdAt)}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Clock className="w-5 h-5 text-teal-600" />
										<span>{calculateReadingTime(post.content)} {t('minRead')}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Eye className="w-5 h-5 text-teal-600" />
										<span>{post.views} {t('views')}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Heart className="w-5 h-5 text-teal-600" />
										<span>{post.likes} {t('likes')}</span>
									</div>
								</div>
								{/* Tags */}
								{post.tags && post.tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{post.tags.map((tag, index) => (
											<span
												key={index}
												className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full border border-teal-200"
											>
												#{tag}
											</span>
										))}
									</div>
								)}
							</header>
							{/* Article Content */}
							<article className="prose prose-lg max-w-none mb-8">
								<div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
									{post.content}
								</div>
							</article>
							{/* Action Buttons */}
							<div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
								<div className="flex items-center space-x-4">
									<button
										onClick={handleLike}
										disabled={isLiking || isLiked}
										className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
											isLiked
												? "bg-red-100 text-red-600 border border-red-200"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
										}`}
									>
										<Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
										<span>{isLiked ? t('liked') : t('like')}</span>
									</button>
										
									<button
										onClick={handleShare}
										className="flex items-center space-x-2 px-6 py-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors border border-teal-200"
									>
										<Share2 className="w-5 h-5" />
										<span>{t('share')}</span>
									</button>
								</div>
								<div className="text-sm text-gray-500">
									{t('lastUpdated')}: {formatDate(post.updatedAt)}
								</div>
							</div>
						</div>
					</motion.div>

					{/* Author Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100 hidden"
					>
						{/* hidden since moved to top */}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
