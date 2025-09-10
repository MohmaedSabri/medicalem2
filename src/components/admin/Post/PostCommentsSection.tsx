/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, MessageCircle, User, Calendar } from "lucide-react";
import { usePostComments, useDeleteComment } from "../../../hooks/usePosts";
import toast from "react-hot-toast";
import DeletionModal from "../../ui/DeletionModal";

interface PostCommentsSectionProps {
	postId: string;
}

const PostCommentsSection: React.FC<PostCommentsSectionProps> = ({ postId }) => {
	const [commentPage, setCommentPage] = useState(1);
	const { data: commentsData, isLoading: commentsLoading } = usePostComments(
		postId,
		commentPage,
		10
	);
	const { mutate: deleteComment } = useDeleteComment();
	// const { currentLanguage, isRTL } = useLanguage();
	// const { t } = useTranslation();

	const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState<{
		id: string;
		content: string;
	} | null>(null);

	const handleDeleteComment = (commentId: string, commentContent: string) => {
		setCommentToDelete({ id: commentId, content: commentContent });
		setShowDeleteCommentModal(true);
	};

	const confirmDeleteComment = () => {
		if (!commentToDelete) return;

		deleteComment(
			{ postId, commentId: commentToDelete.id },
			{
				onSuccess: () => {
					toast.success("Comment deleted successfully");
					setShowDeleteCommentModal(false);
					setCommentToDelete(null);
				},
				onError: () => {
					toast.error("Failed to delete comment");
				},
			}
		);
	};

	const cancelDeleteComment = () => {
		setShowDeleteCommentModal(false);
		setCommentToDelete(null);
	};

	if (commentsLoading) {
		return (
			<div className='bg-gray-50 p-4 rounded-lg mt-4'>
				<div className='animate-pulse'>
					<div className='h-4 bg-gray-300 rounded w-1/4 mb-4'></div>
					<div className='space-y-3'>
						{[...Array(3)].map((_, i) => (
							<div key={i} className='h-20 bg-gray-300 rounded'></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
					<MessageCircle className='w-5 h-5' />
					Comments ({commentsData?.totalComments || 0})
				</h3>
			</div>

					{commentsData?.comments && commentsData.comments.length > 0 ? (
						<div className='space-y-4'>
							{commentsData.comments.map((comment: { _id: string; authorName: string; content: string; createdAt: string }) => (
						<motion.div
							key={comment._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'
						>
							<div className='flex items-start justify-between'>
								<div className='flex-1'>
									<div className='flex items-center gap-2 mb-2'>
										<User className='w-4 h-4 text-gray-500' />
										<span className='font-medium text-gray-800'>
											{comment.authorName}
										</span>
										<span className='text-gray-400'>•</span>
										<div className='flex items-center gap-1 text-sm text-gray-500'>
											<Calendar className='w-3 h-3' />
											{new Date(comment.createdAt).toLocaleDateString()}
										</div>
									</div>
									<p className='text-gray-700 leading-relaxed'>{comment.content}</p>
								</div>
								<button
									onClick={() => handleDeleteComment(comment._id, comment.content)}
									className='ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
									title='Delete comment'
								>
									<Trash2 className='w-4 h-4' />
								</button>
							</div>
						</motion.div>
					))}

					{commentsData.totalPages > 1 && (
						<div className='flex justify-center gap-2 mt-6'>
							<button
								onClick={() => setCommentPage(prev => Math.max(1, prev - 1))}
								disabled={commentPage === 1}
								className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
							>
								Previous
							</button>
							<span className='px-4 py-2 text-gray-600'>
								Page {commentPage} of {commentsData.totalPages}
							</span>
							<button
								onClick={() => setCommentPage(prev => Math.min(commentsData.totalPages, prev + 1))}
								disabled={commentPage === commentsData.totalPages}
								className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
							>
								Next
							</button>
						</div>
					)}
				</div>
			) : (
				<div className='text-center py-8 text-gray-500'>
					<MessageCircle className='w-12 h-12 mx-auto mb-4 text-gray-300' />
					<p>No comments yet</p>
				</div>
			)}

			{/* Delete Comment Modal */}
			{showDeleteCommentModal && commentToDelete && (
				<DeletionModal
					isOpen={showDeleteCommentModal}
					onClose={cancelDeleteComment}
					onConfirm={confirmDeleteComment}
					title='Delete Comment'
					description={`Are you sure you want to delete this comment?`}
					itemName='comment'
					itemDescription={commentToDelete.content}
					isDeleting={false}
					type='comment'
				/>
			)}
		</div>
	);
};

export default PostCommentsSection;
