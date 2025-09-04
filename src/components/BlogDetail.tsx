/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	Eye,
	Heart,
	Calendar,
	User,
	ArrowLeft,
	Share2,
	BookOpen,
	Clock,
	MessageCircle,
	FileText,
	Star,
} from "lucide-react";
import {
	usePost,
	useLikePost,
	usePostComments,
	useAddComment,
} from "../hooks/usePosts";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { Post, ContentBlock } from "../types";
import toast from "react-hot-toast";

const BlogDetail: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(false);

	// Check if post is already liked (for non-authenticated users)
	React.useEffect(() => {
		if (!user && id) {
			const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
			setIsLiked(likedPosts.includes(id));
		}
	}, [user, id]);

	const { data: post, isLoading, error } = usePost(id!, currentLanguage);
	const { mutate: likePost, isPending: isLiking } = useLikePost();
	const { categories } = useCategories();

	// Comment functionality
	const [commentPage, setCommentPage] = useState(1);
	const [newComment, setNewComment] = useState({
		authorName: "",
		authorEmail: "",
		content: "",
	});
	const { data: commentsData, isLoading: commentsLoading } = usePostComments(
		id!,
		commentPage,
		10
	);
	const { mutate: addComment, isPending: isAddingComment } = useAddComment();

	// Handle like
	const handleLike = () => {
		if (id) {
			// Check if user is authenticated
			if (user) {
				// Use API for authenticated users
				likePost(id);
				setIsLiked(true);
			} else {
				// For non-authenticated users, use local storage
				const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
				if (!likedPosts.includes(id)) {
					likedPosts.push(id);
					localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
					setIsLiked(true);
					
					// Show success message
					toast.success('Post liked! 💖');
				} else {
					toast('You have already liked this post!', {
						icon: '💖',
						style: {
							background: '#f0f9ff',
							color: '#0369a1',
						},
					});
				}
			}
		}
	};

	// Handle comment submission
	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!newComment.authorName.trim() ||
			!newComment.authorEmail.trim() ||
			!newComment.content.trim()
		) {
			return;
		}

		if (id) {
			addComment({
				postId: id,
				commentData: {
					authorName: newComment.authorName.trim(),
					authorEmail: newComment.authorEmail.trim(),
					content: newComment.content.trim(),
				},
			});
			setNewComment({ authorName: "", authorEmail: "", content: "" });
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

	// Get category name with localization support
	const getCategoryName = (
		category:
			| string
			| {
					_id: string;
					name: string | { en: string; ar: string };
					description: string | { en: string; ar: string };
			  }
	) => {
		if (typeof category === "string") {
			const cat = categories.find((c) => c._id === category);
			if (!cat) return category;

			// Handle localized category names
			if (typeof cat.name === "string") return cat.name;
			if (cat.name && typeof cat.name === "object") {
				return (
					cat.name[currentLanguage as "en" | "ar"] ||
					cat.name.en ||
					cat.name.ar ||
					""
				);
			}
			return category;
		}

		// Handle localized category names from API
		if (typeof category.name === "string") return category.name;
		if (category.name && typeof category.name === "object") {
			return (
				category.name[currentLanguage as "en" | "ar"] ||
				category.name.en ||
				category.name.ar ||
				""
			);
		}
		return "";
	};

	// Calculate reading time
	const calculateReadingTime = (content: ContentBlock[]) => {
		const wordsPerMinute = 200;
		let totalWords = 0;

		content.forEach((block) => {
			if (block.type === "paragraph") {
				const words = block.text.trim().split(/\s+/).length;
				totalWords += words;
				if (block.title) {
					const titleWords = block.title.trim().split(/\s+/).length;
					totalWords += titleWords;
				}
			}
		});

		return Math.ceil(totalWords / wordsPerMinute);
	};

	// Localized field helpers
	const getTitle = (): string => {
		if (!post) return "";
		const postWithLocalized = post as Post & {
			localized?: { title?: string; content?: ContentBlock[] };
		};
		if (postWithLocalized.localized?.title)
			return postWithLocalized.localized.title;
		const value = postWithLocalized.title;
		if (typeof value === "string") return value;
		if (value && typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
		}
		return "";
	};
	const getContent = (): ContentBlock[] => {
		if (!post) return [];
		const postWithLocalized = post as Post & {
			localized?: { title?: string; content?: ContentBlock[] };
		};
		if (postWithLocalized.localized?.content)
			return postWithLocalized.localized.content;
		const value = postWithLocalized.content;
		if (Array.isArray(value)) return value;
		if (value && typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || []
			);
		}
		return [];
	};

	// Share post
	const handleShare = async () => {
		if (navigator.share && post) {
			try {
				const content = getContent();
				const firstParagraph = content.find(
					(block) => block.type === "paragraph"
				);
				const excerpt =
					firstParagraph && firstParagraph.type === "paragraph"
						? firstParagraph.text.substring(0, 100) + "..."
						: "";

				await navigator.share({
					title: getTitle(),
					text: excerpt,
					url: window.location.href,
				});
			} catch {
				// Error sharing
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			toast.success('Link copied to clipboard!');
		}
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-4xl mx-auto'>
						{/* Loading skeleton */}
						<div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-pulse border border-gray-100'>
							<div className='h-6 sm:h-8 bg-gray-200 rounded mb-3 sm:mb-4'></div>
							<div className='h-3 sm:h-4 bg-gray-200 rounded mb-2 w-3/4'></div>
							<div className='h-3 sm:h-4 bg-gray-200 rounded mb-4 sm:mb-6 w-1/2'></div>
							<div className='h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-4 sm:mb-6'></div>
							<div className='space-y-2 sm:space-y-3'>
								<div className='h-3 sm:h-4 bg-gray-200 rounded'></div>
								<div className='h-3 sm:h-4 bg-gray-200 rounded w-5/6'></div>
								<div className='h-3 sm:h-4 bg-gray-200 rounded w-4/6'></div>
								<div className='h-3 sm:h-4 bg-gray-200 rounded w-3/6'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className='min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='max-w-4xl mx-auto text-center'>
						<div className='bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100'>
							<div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-3 sm:mb-4'>
								<BookOpen className='w-6 h-6 sm:w-8 sm:h-8 text-red-600' />
							</div>
							<h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4'>
								{t("postNotFound")}
							</h1>
							<p className='text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base'>
								{t("postNotFoundDescription")}
							</p>
							<Link
								to='/blog'
								className='inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base'>
								<ArrowLeft className='w-4 h-4' />
								<span>{t("backToBlog")}</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-white'>
			{/* Back Button */}
			<div className='pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 md:pb-8'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.button
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => navigate("/blog")}
						className='inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-medium mb-4 sm:mb-6 transition-colors text-sm sm:text-base'>
						<ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
						<span>{t("backToBlog")}</span>
					</motion.button>
				</div>
			</div>

			{/* Main Content */}
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16'>
				<div className='max-w-4xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
						{/* Hero Image */}
						<div className='relative'>
							<img
								src={post.postImage}
								alt={getTitle()}
								className='w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover'
							/>
							<div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20'></div>

							{/* Category Badge */}
							<div className='absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4'>
								<span className='inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg border border-white/20 shadow-lg'>
									<FileText className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
									<span className='hidden xs:inline'>{getCategoryName(post.category)}</span>
									<span className='xs:hidden'>{getCategoryName(post.category).substring(0, 8)}...</span>
								</span>
							</div>

							{/* Featured Badge */}
							{post.featured && (
								<div className='absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4'>
									<span className='inline-flex items-center space-x-1 bg-yellow-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg shadow-lg'>
										<Star className='w-3 h-3 sm:w-4 sm:h-4' />
										<span className='hidden xs:inline'>{t("featured")}</span>
										<span className='xs:hidden'>★</span>
									</span>
								</div>
							)}
						</div>

						{/* Content */}
						<div className='p-4 sm:p-6 md:p-8'>
							{/* About the Author - top */}
							<div className='mb-6 sm:mb-8 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm'>
								<h3 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2'>
									<User className='w-5 h-5 sm:w-6 sm:h-6 text-teal-600' />
									<span>{t("aboutTheAuthor")}</span>
								</h3>
								<div className='flex items-center space-x-3 sm:space-x-4'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
										<User className='w-6 h-6 sm:w-7 sm:h-7 text-teal-600' />
									</div>
									<div className='min-w-0 flex-1'>
										<h4 className='text-base sm:text-lg font-semibold text-gray-900 truncate'>
											{post.authorName}
										</h4>
										<p className='text-sm sm:text-base text-gray-600 truncate'>{post.authorEmail}</p>
									</div>
								</div>
							</div>
							{/* Header */}
							<header className='mb-6 sm:mb-8'>
								<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight'>
									{getTitle()}
								</h1>
								{/* Meta Information */}
								<div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base'>
									<div className='flex items-center space-x-1 sm:space-x-2'>
										<User className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0' />
										<span className='truncate max-w-[120px] sm:max-w-none'>{post.authorName}</span>
									</div>
									<div className='flex items-center space-x-1 sm:space-x-2'>
										<Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0' />
										<span className='hidden xs:inline'>{formatDate(post.createdAt)}</span>
										<span className='xs:hidden'>{new Date(post.createdAt).toLocaleDateString()}</span>
									</div>
									<div className='flex items-center space-x-1 sm:space-x-2'>
										<Clock className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0' />
										<span>
											{calculateReadingTime(getContent())} {t("minRead")}
										</span>
									</div>
									<div className='flex items-center space-x-1 sm:space-x-2'>
										<Eye className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0' />
										<span>
											{post.views} {t("views")}
										</span>
									</div>
									<div className='flex items-center space-x-1 sm:space-x-2'>
										<Heart className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0' />
										<span>
											{post.likes} {t("likes")}
										</span>
									</div>
								</div>
								{/* Tags */}
								{post.tags && post.tags.length > 0 && (
									<div className='flex flex-wrap gap-2'>
										{post.tags.map((tag, index) => (
											<span
												key={index}
												className='px-2 sm:px-3 py-1 bg-teal-100 text-teal-700 text-xs sm:text-sm rounded-full border border-teal-200'>
												#{tag}
											</span>
										))}
									</div>
								)}
							</header>
							{/* Article Content */}
							<article className='prose prose-sm sm:prose-base md:prose-lg max-w-none mb-6 sm:mb-8'>
								<div className='text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg'>
									{getContent().map((block, index) => (
										<div key={index} className='mb-4 sm:mb-6'>
											{block.type === "paragraph" ? (
												<div>
													{block.title && (
														<h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight'>
															{block.title}
														</h3>
													)}
													<p className='leading-relaxed sm:leading-loose'>{block.text}</p>
												</div>
											) : block.type === "image" ? (
												<div className='my-4 sm:my-6 md:my-8'>
													<img
														src={block.imageUrl}
														alt={block.imageAlt || "Post image"}
														className='w-full h-auto rounded-md sm:rounded-lg shadow-lg'
														loading='lazy'
														onError={(e) => {
															e.currentTarget.style.display = "none";
															const fallback = e.currentTarget
																.nextElementSibling as HTMLElement;
															if (fallback) {
																fallback.style.display = "block";
															}
														}}
														onLoad={() => {}}
													/>
													<div
														className='w-full h-32 sm:h-40 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md sm:rounded-lg shadow-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200'
														style={{ display: "none" }}>
														<div className='text-center p-2 sm:p-4'>
															<FileText className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 text-gray-400' />
															<p className='text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2'>
																Image unavailable
															</p>
															<p className='text-xs text-gray-400 break-all max-w-[200px] sm:max-w-xs'>
																{block.imageUrl}
															</p>
														</div>
													</div>
													{block.imageCaption && (
														<p className='text-xs sm:text-sm text-gray-600 italic mt-2 text-center px-2'>
															{block.imageCaption}
														</p>
													)}
												</div>
											) : null}
										</div>
									))}
								</div>
							</article>
							{/* Action Buttons */}
							<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 sm:pt-8 border-t border-gray-200'>
								<div className='flex flex-col xs:flex-row items-stretch xs:items-center gap-3 xs:gap-4'>
									<button
										onClick={handleLike}
										disabled={isLiking || (!!user && isLiked)}
										className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
											isLiked
												? "bg-red-100 text-red-600 border border-red-200"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
										} ${!user && isLiked ? "cursor-default" : "cursor-pointer"}`}>
										<Heart
											className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
										/>
										<span>
											{isLiked 
												? (user ? t("liked") : "Liked!") 
												: t("like")
											}
										</span>
									</button>

									<button
										onClick={handleShare}
										className='flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors border border-teal-200 text-sm sm:text-base'>
										<Share2 className='w-4 h-4 sm:w-5 sm:h-5' />
										<span>{t("share")}</span>
									</button>
								</div>
								<div className='text-xs sm:text-sm text-gray-500 text-center sm:text-right'>
									{t("lastUpdated")}: <span className='hidden xs:inline'>{formatDate(post.updatedAt)}</span>
									<span className='xs:hidden'>{new Date(post.updatedAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Comments Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100'>
						<h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2'>
							<MessageCircle className='w-5 h-5 sm:w-6 sm:h-6 text-teal-600' />
							<span>
								{t("comments")} ({commentsData?.totalComments || 0})
							</span>
						</h3>

						{/* Add Comment Form */}
						<form
							onSubmit={handleAddComment}
							className='mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl'>
							<h4 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4'>
								{t("addComment")}
							</h4>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4'>
								<input
									type='text'
									placeholder={t("yourName")}
									value={newComment.authorName}
									onChange={(e) =>
										setNewComment((prev) => ({
											...prev,
											authorName: e.target.value,
										}))
									}
									className='px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base'
									required
								/>
								<input
									type='email'
									placeholder={t("yourEmail")}
									value={newComment.authorEmail}
									onChange={(e) =>
										setNewComment((prev) => ({
											...prev,
											authorEmail: e.target.value,
										}))
									}
									className='px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base'
									required
								/>
							</div>
							<textarea
								placeholder={t("writeComment")}
								value={newComment.content}
								onChange={(e) =>
									setNewComment((prev) => ({
										...prev,
										content: e.target.value,
									}))
								}
								rows={3}
								className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-3 sm:mb-4 text-sm sm:text-base resize-none'
								required
							/>
							<button
								type='submit'
								disabled={isAddingComment}
								className='w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base'>
								{isAddingComment ? t("adding") : t("addComment")}
							</button>
						</form>

						{/* Comments List */}
						{commentsLoading ? (
							<div className='space-y-3 sm:space-y-4'>
								{Array.from({ length: 3 }).map((_, index) => (
									<div
										key={index}
										className='p-3 sm:p-4 bg-gray-50 rounded-lg animate-pulse'>
										<div className='h-3 sm:h-4 bg-gray-200 rounded mb-2 w-1/3 sm:w-1/4'></div>
										<div className='h-2 sm:h-3 bg-gray-200 rounded mb-2 w-1/4 sm:w-1/6'></div>
										<div className='h-2 sm:h-3 bg-gray-200 rounded w-2/3 sm:w-3/4'></div>
									</div>
								))}
							</div>
						) : commentsData?.comments && commentsData.comments.length > 0 ? (
							<div className='space-y-4 sm:space-y-6'>
								{commentsData.comments.map((comment) => (
									<div
										key={comment._id}
										className='p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100'>
										<div className='mb-2 sm:mb-3'>
											<h5 className='font-semibold text-gray-900 text-sm sm:text-base'>
												{comment.authorName}
											</h5>
											<p className='text-xs sm:text-sm text-gray-500'>
												{formatDate(comment.createdAt)}
											</p>
										</div>
										<p className='text-gray-700 leading-relaxed text-sm sm:text-base'>
											{comment.content}
										</p>
									</div>
								))}

								{/* Pagination for comments */}
								{commentsData.totalPages > 1 && (
									<div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:space-x-2 pt-4'>
										<button
											onClick={() =>
												setCommentPage((prev) => Math.max(1, prev - 1))
											}
											disabled={commentPage === 1}
											className='w-full sm:w-auto px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'>
											{t("previous")}
										</button>
										<span className='px-3 sm:px-4 py-2 text-gray-600 text-sm sm:text-base'>
											{commentPage} / {commentsData.totalPages}
										</span>
										<button
											onClick={() =>
												setCommentPage((prev) =>
													Math.min(commentsData.totalPages, prev + 1)
												)
											}
											disabled={commentPage === commentsData.totalPages}
											className='w-full sm:w-auto px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'>
											{t("next")}
										</button>
									</div>
								)}
							</div>
						) : (
							<div className='text-center py-6 sm:py-8'>
								<MessageCircle className='w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4' />
								<p className='text-gray-600 text-sm sm:text-base'>{t("noCommentsYet")}</p>
								<p className='text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2'>
									{t("beFirstToComment")}
								</p>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
