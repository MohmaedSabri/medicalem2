/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Edit,
	Trash2,
	Star,
	Calendar,
	User,
	Tag,
	FileText,
	MessageCircle,
	Eye,
} from "lucide-react";
import { useDeletePost } from "../../../hooks/usePosts";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import DeletionModal from "../../ui/DeletionModal";
import { Post } from "../../../types";

interface PostListItemProps {
	post: Post;
	onEdit: (post: Post) => void;
	onViewComments: (postId: string) => void;
	showComments: string | null;
}

const PostListItem: React.FC<PostListItemProps> = ({
	post,
	onEdit,
	onViewComments,
	showComments,
}) => {
	const { mutate: deletePost } = useDeletePost();
	const { currentLanguage, isRTL } = useLanguage();
	const { t } = useTranslation();

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleDelete = () => {
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		deletePost(post._id, {
			onSuccess: () => {
				toast.success("Post deleted successfully");
				setShowDeleteModal(false);
			},
			onError: () => {
				toast.error("Failed to delete post");
			},
		});
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Get localized title
	const getLocalizedTitle = (title: any) => {
		if (typeof title === "string") return title;
		if (typeof title === "object" && title !== null) {
			return title[currentLanguage] || title.en || title.ar || "Untitled";
		}
		return "Untitled";
	};

	// Get localized content preview
	const getContentPreview = (content: any) => {
		if (Array.isArray(content)) {
			const firstParagraph = content.find(
				(block) => block.type === "paragraph"
			);
			if (firstParagraph && "text" in firstParagraph) {
				return firstParagraph.text.substring(0, 100) + "...";
			}
		} else if (typeof content === "object" && content !== null) {
			const localizedContent = content[currentLanguage] || content.en || content.ar;
			if (Array.isArray(localizedContent)) {
				const firstParagraph = localizedContent.find(
					(block) => block.type === "paragraph"
				);
				if (firstParagraph && "text" in firstParagraph) {
					return firstParagraph.text.substring(0, 100) + "...";
				}
			}
		}
		return "No content preview available";
	};

	const isCommentsVisible = showComments === post._id;

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
			>
				<div className='flex items-start justify-between mb-4'>
					<div className='flex-1'>
						<div className='flex items-center gap-2 mb-2'>
							<h3 className='text-lg font-semibold text-gray-800'>
								{getLocalizedTitle(post.title)}
							</h3>
							{post.featured && (
								<Star className='w-4 h-4 text-yellow-500 fill-current' />
							)}
						</div>
						<p className='text-gray-600 text-sm mb-2'>
							{getContentPreview(post.content)}
						</p>
						<div className='flex items-center gap-4 text-sm text-gray-500'>
							<div className='flex items-center gap-1'>
								<User className='w-4 h-4' />
								{post.authorName}
							</div>
							<div className='flex items-center gap-1'>
								<Calendar className='w-4 h-4' />
								{formatDate(post.createdAt)}
							</div>
							<div className='flex items-center gap-1'>
								<Tag className='w-4 h-4' />
								<span className='capitalize'>{post.status}</span>
							</div>
							{post.category && (
								<div className='flex items-center gap-1'>
									<FileText className='w-4 h-4' />
									{(() => {
										if (typeof post.category === "string") return post.category;
										if (post.category.name) {
											const name = post.category.name;
											if (typeof name === "string") return name;
											if (typeof name === "object" && name !== null) {
												return name[currentLanguage as 'en' | 'ar'] || name.en || name.ar || 'Uncategorized';
											}
										}
										return 'Uncategorized';
									})()}
								</div>
							)}
						</div>
						{post.tags && post.tags.length > 0 && (
							<div className='flex flex-wrap gap-1 mt-2'>
								{post.tags.map((tag, index) => (
									<span
										key={index}
										className='px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs'
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>

					<div className='flex items-center gap-2 ml-4'>
						<button
							onClick={() => onViewComments(post._id)}
							className={`p-2 rounded-lg transition-colors ${
								isCommentsVisible
									? "bg-blue-100 text-blue-600"
									: "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
							}`}
							title='View comments'
						>
							<MessageCircle className='w-4 h-4' />
						</button>
						<button
							onClick={() => onEdit(post)}
							className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
							title='Edit post'
						>
							<Edit className='w-4 h-4' />
						</button>
						<button
							onClick={handleDelete}
							className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
							title='Delete post'
						>
							<Trash2 className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Post Image Preview */}
				{post.postImage && (
					<div className='mb-4'>
						<img
							src={post.postImage}
							alt={getLocalizedTitle(post.title)}
							className='w-full h-48 object-cover rounded-lg'
						/>
					</div>
				)}

				{/* Comments Section */}
				{isCommentsVisible && (
					<div className='mt-4 pt-4 border-t border-gray-200'>
						<PostCommentsSection postId={post._id} />
					</div>
				)}
			</motion.div>

			{/* Delete Modal */}
			{showDeleteModal && (
				<DeletionModal
					isOpen={showDeleteModal}
					onClose={cancelDelete}
					onConfirm={confirmDelete}
					itemName='post'
					itemDescription={getLocalizedTitle(post.title)}
					isDeleting={false}
					type='post'
				/>
			)}
		</>
	);
};

// Import PostCommentsSection here to avoid circular dependency
import PostCommentsSection from "./PostCommentsSection";

export default PostListItem;
