/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	BookOpen,
} from "lucide-react";
import {
	usePost,
	useLikePost,
	usePostComments,
	useAddComment,
} from "../../../hooks/usePosts";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Post, ContentBlock } from "../../../types";
import toast from "react-hot-toast";
import BlogPostHeader from "./BlogPostHeader";
import BlogPostContent from "./BlogPostContent";
import BlogPostActions from "./BlogPostActions";
import BlogComments from "./BlogComments";

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
								className='inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base'>
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
						className='inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 font-medium mb-4 sm:mb-6 transition-colors text-sm sm:text-base'>
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
						<BlogPostHeader
							post={post}
							getTitle={getTitle}
							getContent={getContent}
							formatDate={formatDate}
							calculateReadingTime={calculateReadingTime}
						/>

						<BlogPostContent content={getContent()} />

						<div className='p-4 sm:p-6 md:p-8'>
							<BlogPostActions
								post={post}
								isLiked={isLiked}
								isLiking={isLiking}
								user={user}
								onLike={handleLike}
								onShare={handleShare}
								formatDate={formatDate}
							/>
						</div>
					</motion.div>

					{/* Comments Section */}
					<BlogComments
						commentsData={commentsData}
						commentsLoading={commentsLoading}
						commentPage={commentPage}
						setCommentPage={setCommentPage}
						newComment={newComment}
						setNewComment={setNewComment}
						handleAddComment={handleAddComment}
						isAddingComment={isAddingComment}
						formatDate={formatDate}
					/>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
