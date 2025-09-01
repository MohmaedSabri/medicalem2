/** @format */

import React from "react";
import { motion } from "framer-motion";
import { 
	Eye, 
	Heart, 
	Calendar, 
	User, 
	Tag, 
	FileText, 
	Star, 
	ArrowRight,
	Edit,
	Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "../types";

interface PostCardProps {
	post: Post;
	variant?: "default" | "featured" | "compact" | "management";
	showActions?: boolean;
	onEdit?: (post: Post) => void;
	onDelete?: (postId: string, postTitle: string) => void;
	getCategoryName: (category: string | { _id: string; name: string; description: string }) => string;
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
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
			>
				<div className="relative overflow-hidden h-32">
					{post.postImage ? (
						<img
							src={post.postImage}
							alt={post.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
							<FileText className="w-8 h-8 text-teal-300" />
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20"></div>
					
					{/* Category Badge */}
					<div className="absolute top-2 left-2">
						<span className="inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg font-medium border border-white/20 shadow-lg text-xs">
							<Tag className="w-3 h-3 text-teal-600" />
							<span>{getCategoryName(post.category)}</span>
						</span>
					</div>
				</div>
				
				<div className="p-4">
					<h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
						{post.title}
					</h3>
					<div className="flex items-center justify-between text-xs text-gray-500">
						<div className="flex items-center space-x-1">
							<User className="w-3 h-3 text-teal-600" />
							<span>{post.authorName}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Calendar className="w-3 h-3 text-teal-600" />
							<span>{formatDate(post.createdAt)}</span>
						</div>
					</div>
				</div>
			</motion.div>
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
								alt={post.title}
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
								{post.title}
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
							{post.content}
						</p>

						{/* Tags */}
						{post.tags && post.tags.length > 0 && (
							<div className="flex flex-wrap gap-3 mb-6">
								{post.tags.map((tag, tagIndex) => (
									<span
										key={tagIndex}
										className="px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-sm rounded-full border border-teal-200 font-medium"
									>
										#{tag}
									</span>
								))}
							</div>
						)}

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

							{showActions && onEdit && onDelete && (
								<div className="flex items-center space-x-3">
									<button
										onClick={() => onEdit(post)}
										className="p-3 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-105"
										title="Edit post"
									>
										<Edit className="w-5 h-5" />
									</button>
									<button
										onClick={() => onDelete(post._id, post.title)}
										className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-100"
										title="Delete post"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		);
	}

	// Default and featured variants
	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
				variant === "featured" ? "ring-2 ring-yellow-200 shadow-lg" : ""
			} hover:-translate-y-1`}
		>
			<div className="relative overflow-hidden h-48">
				{post.postImage ? (
					<img
						src={post.postImage}
						alt={post.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
						<FileText className="w-12 h-12 text-teal-300" />
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20"></div>
				
				{/* Category Badge */}
				<div className="absolute top-3 left-3">
					<span className="inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-sm">
						<Tag className="w-3 h-3 text-teal-600" />
						<span>{getCategoryName(post.category)}</span>
					</span>
				</div>
				
				{/* Featured Badge */}
				{post.featured && (
					<div className="absolute top-3 right-3">
						<span className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-lg font-medium shadow-lg text-sm">
							<Star className="w-3 h-3 fill-current" />
							<span>Featured</span>
						</span>
					</div>
				)}
			</div>
			
			<div className="p-6 flex flex-col h-full">
				<h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
					{post.title}
				</h3>
				<p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
					{post.content}
				</p>
				
				{/* Stats */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4 text-sm text-gray-500">
						<div className="flex items-center space-x-2">
							<Eye className="w-4 h-4 text-teal-600" />
							<span>{post.views || 0}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Heart className="w-4 h-4 text-teal-600" />
							<span>{post.likes || 0}</span>
						</div>
					</div>
				</div>
				
				{/* Meta and Read More */}
				<div className="space-y-3">
					{/* Author and Date */}
					<div className="flex items-center space-x-4 text-sm text-gray-500">
						<div className="flex items-center space-x-2">
							<User className="w-4 h-4 text-teal-600" />
							<span className="truncate">{post.authorName}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Calendar className="w-4 h-4 text-teal-600" />
							<span>{formatDate(post.createdAt)}</span>
						</div>
					</div>
					
					{/* Read More Link */}
					<div className="pt-2 border-t border-gray-100">
						<Link
							to={`/blog/${post._id}`}
							className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 font-medium group-hover:translate-x-1 transition-transform"
						>
							<span>Read More</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default PostCard;
