/** @format */

import React from "react";
import { Heart, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Post } from "../../../types";

interface BlogPostActionsProps {
	post: Post;
	isLiked: boolean;
	isLiking: boolean;
	user: any;
	onLike: () => void;
	onShare: () => void;
	formatDate: (dateString: string) => string;
}

const BlogPostActions: React.FC<BlogPostActionsProps> = ({
	post,
	isLiked,
	isLiking,
	user,
	onLike,
	onShare,
	formatDate,
}) => {
	const { t } = useTranslation();

	return (
		<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 sm:pt-8 border-t border-gray-200'>
			<div className='flex flex-col xs:flex-row items-stretch xs:items-center gap-3 xs:gap-4'>
				<button
					onClick={onLike}
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
					onClick={onShare}
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
	);
};

export default BlogPostActions;
