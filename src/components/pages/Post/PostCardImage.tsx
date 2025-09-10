/** @format */

import React from "react";
import { FileText, Tag, Star } from "lucide-react";
import { Post } from "../../../types";

interface PostCardImageProps {
	post: Post;
	titleText: string;
	getCategoryName: (category: string | { _id: string; name: string | { en: string; ar: string }; description: string | { en: string; ar: string } }) => string;
	variant?: "default" | "featured" | "compact" | "management";
}

const PostCardImage: React.FC<PostCardImageProps> = ({
	post,
	titleText,
	getCategoryName,
	variant = "default",
}) => {
	const getImageHeight = () => {
		switch (variant) {
			case "compact":
				return "h-32";
			case "management":
				return "h-64";
			default:
				return "h-48";
		}
	};

	const getCategoryBadgeSize = () => {
		switch (variant) {
			case "compact":
				return "px-2 py-1 text-xs";
			case "management":
				return "px-3 py-1.5 text-sm";
			default:
				return "px-3 py-1.5 text-sm";
		}
	};

	const getFeaturedBadgeSize = () => {
		switch (variant) {
			case "compact":
				return "px-2 py-1 text-xs";
			case "management":
				return "px-3 py-1 text-xs";
			default:
				return "px-3 py-1.5 text-sm";
		}
	};

	return (
		<div className={`relative overflow-hidden ${getImageHeight()}`}>
			{post.postImage ? (
				<img
					src={post.postImage}
					alt={titleText}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
			) : (
				<div className="w-full h-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
					<FileText className={`${variant === "compact" ? "w-8 h-8" : variant === "management" ? "w-20 h-20" : "w-12 h-12"} text-teal-300`} />
				</div>
			)}
			<div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20"></div>
			
			{/* Category Badge */}
			<div className="absolute top-2 left-2 sm:top-3 sm:left-3">
				<span className={`inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 ${getCategoryBadgeSize()} font-medium rounded-lg border border-white/20 shadow-lg`}>
					<Tag className="w-3 h-3 text-teal-600" />
					<span>{getCategoryName(post.category)}</span>
				</span>
			</div>
			
			{/* Featured Badge */}
			{post.featured && (
				<div className="absolute top-2 right-2 sm:top-3 sm:right-3">
					<span className={`inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white ${getFeaturedBadgeSize()} font-medium shadow-lg rounded-lg`}>
						<Star className="w-3 h-3 fill-current" />
						<span>Featured</span>
					</span>
				</div>
			)}
		</div>
	);
};

export default PostCardImage;
