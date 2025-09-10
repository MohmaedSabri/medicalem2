/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, FileText, User, Calendar, Tag, Eye, Heart } from "lucide-react";
import { Post, ContentBlock } from "../../../types";
import { useLanguage } from "../../../contexts/LanguageContext";
import PostCardImage from "./PostCardImage";
import PostCardContent from "./PostCardContent";
import PostCardActions from "./PostCardActions";
import PostCardTags from "./PostCardTags";

interface PostCardProps {
	post: Post;
	variant?: "default" | "featured" | "compact" | "management";
	showActions?: boolean;
	onEdit?: (post: Post) => void;
	onDelete?: (postId: string, postTitle: string) => void;
	getCategoryName: (category: string | { _id: string; name: string | { en: string; ar: string }; description: string | { en: string; ar: string } }) => string;
	formatDate: (dateString: string) => string;
	index?: number;
}

const PostCard: React.FC<PostCardProps> = ({
	post,
	variant = "default",
	showActions = false,
	onEdit,
	onDelete,
	getCategoryName,
	formatDate,
	index = 0
}) => {
	const { currentLanguage } = useLanguage();
	
	// Get localized title
	const getTitle = (): string => {
		const postWithLocalized = post as Post & { localized?: { title?: string; content?: ContentBlock[] } };
		if (postWithLocalized.localized?.title) return postWithLocalized.localized.title;
		const value = postWithLocalized.title;
		if (typeof value === 'string') return value;
		if (value && typeof value === 'object') {
			return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || '';
		}
		return '';
	};

	// Get content preview
	const getContentPreview = (): string => {
		const postWithLocalized = post as Post & { localized?: { title?: string; content?: ContentBlock[] } };
		let content: ContentBlock[] = [];
		
		if (postWithLocalized.localized?.content) {
			content = postWithLocalized.localized.content;
		} else if (Array.isArray(postWithLocalized.content)) {
			content = postWithLocalized.content;
		} else if (postWithLocalized.content && typeof postWithLocalized.content === 'object') {
			content = postWithLocalized.content[currentLanguage as 'en' | 'ar'] || postWithLocalized.content.en || postWithLocalized.content.ar || [];
		}
		
		const firstParagraph = content.find(block => block.type === 'paragraph');
		if (firstParagraph && firstParagraph.type === 'paragraph') {
			return firstParagraph.text;
		}
		return '';
	};

	const titleText = getTitle();
	const contentText = getContentPreview();

	// Animation variants
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { 
			opacity: 1, 
			y: 0,
			transition: { 
				duration: 0.5, 
				delay: index * 0.1,
				ease: "easeOut" as const
			}
		}
	};

	// Get status badge color
	const getStatusBadgeColor = (status: string) => {
		switch (status) {
			case "published":
				return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
			case "draft":
				return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200";
			case "archived":
				return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
			default:
				return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
		}
	};

	// Render different card variants
	if (variant === "compact") {
		return (
			<Link to={`/blog/${post._id}`} className="block">
				<motion.div
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1 cursor-pointer"
				>
					<PostCardImage
						post={post}
						titleText={titleText}
						getCategoryName={getCategoryName}
						variant={variant}
					/>
					<PostCardContent
						titleText={titleText}
						contentText={contentText}
						post={post}
						formatDate={formatDate}
						variant={variant}
					/>
				</motion.div>
			</Link>
		);
	}

	if (variant === "management") {
		return (
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[600px] flex flex-col"
			>
				<div className="relative">
					{/* Featured Badge */}
					{post.featured && (
						<div className="absolute top-4 right-4 z-10">
							<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
								<Star className="w-3 h-3 fill-current" />
								<span>Featured</span>
							</div>
						</div>
					)}

					{/* Post Image */}
					<div className="h-64 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
						{post.postImage ? (
							<img
								src={post.postImage}
								alt={titleText}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<FileText className="w-20 h-20 text-teal-300" />
							</div>
						)}
						{/* Status Badge Overlay */}
						<div className="absolute top-4 left-4">
							<span
								className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getStatusBadgeColor(
									post.status
								)}`}
							>
								{post.status.charAt(0).toUpperCase() + post.status.slice(1)}
							</span>
						</div>
					</div>

					{/* Post Content */}
					<div className="p-8 flex-1 flex flex-col">
						{/* Title and Meta */}
						<div className="mb-6">
							<h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
								{titleText}
							</h3>
							
							<div className="flex items-center flex-wrap gap-6 text-sm text-gray-600 mb-4">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
										<User className="w-4 h-4 text-teal-600" />
									</div>
									<span className="font-medium text-base">{post.authorName}</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
										<Calendar className="w-4 h-4 text-blue-600" />
									</div>
									<span className="text-base">{formatDate(post.createdAt)}</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
										<Tag className="w-4 h-4 text-purple-600" />
									</div>
									<span className="font-medium text-base">{getCategoryName(post.category)}</span>
								</div>
							</div>
						</div>

						{/* Content Preview */}
						<p className="text-gray-700 line-clamp-4 mb-6 leading-relaxed text-base">
							{contentText}
						</p>

						{/* Tags */}
						<PostCardTags tags={post.tags || []} variant={variant} />

						{/* Stats and Actions */}
						<div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
							<div className="flex items-center space-x-6 text-sm text-gray-500">
								<div className="flex items-center space-x-2">
									<div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
										<Eye className="w-4 h-4 text-gray-600" />
									</div>
									<span className="text-base">{post.views || 0}</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
										<Heart className="w-4 h-4 text-gray-600" />
									</div>
									<span className="text-base">{post.likes || 0}</span>
								</div>
							</div>

							<PostCardActions
								post={post}
								titleText={titleText}
								onEdit={showActions ? onEdit : undefined}
								onDelete={showActions ? onDelete : undefined}
							/>
						</div>
					</div>
				</div>
			</motion.div>
		);
	}

	// Default and featured variants
	return (
		<Link to={`/blog/${post._id}`} className="block">
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer ${
					variant === "featured" ? "shadow-lg" : ""
				} hover:-translate-y-1`}
			>
				<PostCardImage
					post={post}
					titleText={titleText}
					getCategoryName={getCategoryName}
					variant={variant}
				/>
				<PostCardContent
					titleText={titleText}
					contentText={contentText}
					post={post}
					formatDate={formatDate}
					variant={variant}
				/>
			</motion.div>
		</Link>
	);
};

export default PostCard;
