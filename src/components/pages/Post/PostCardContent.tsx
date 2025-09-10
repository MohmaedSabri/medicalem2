/** @format */

import React from "react";
import { Eye, Heart, Calendar, User, ArrowRight } from "lucide-react";

interface PostCardContentProps {
	titleText: string;
	contentText: string;
	post: {
		authorName: string;
		createdAt: string;
		views: number;
		likes: number;
	};
	formatDate: (dateString: string) => string;
	variant?: "default" | "featured" | "compact" | "management";
}

const PostCardContent: React.FC<PostCardContentProps> = ({
	titleText,
	contentText,
	post,
	formatDate,
	variant = "default",
}) => {
	if (variant === "compact") {
		return (
			<div className="p-4">
				<h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
					{titleText}
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
		);
	}

	if (variant === "management") {
		return (
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
					</div>
				</div>

				{/* Content Preview */}
				<p className="text-gray-700 line-clamp-4 mb-6 leading-relaxed text-base">
					{contentText}
				</p>

				{/* Stats */}
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
				</div>
			</div>
		);
	}

	// Default and featured variants
	return (
		<div className="p-6 flex flex-col h-full">
			<h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
				{titleText}
			</h3>
			<p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
				{contentText}
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
				
				{/* Read More Indicator */}
				<div className="pt-2 border-t border-gray-100">
					<div className="inline-flex items-center space-x-2 text-teal-600 font-medium group-hover:translate-x-1 transition-transform">
						<span>Read More</span>
						<ArrowRight className="w-4 h-4" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostCardContent;
