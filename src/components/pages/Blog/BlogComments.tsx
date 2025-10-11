/** @format */

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Comment {
	_id: string;
	authorName: string;
	content: string;
	createdAt: string;
}

interface CommentsData {
	comments: Comment[];
	totalComments: number;
	totalPages: number;
}

interface BlogCommentsProps {
	commentsData: CommentsData | undefined;
	commentsLoading: boolean;
	commentPage: number;
	setCommentPage: (page: number) => void;
	newComment: {
		authorName: string;
		authorEmail: string;
		content: string;
	};
	setNewComment: (comment: any) => void;
	handleAddComment: (e: React.FormEvent) => void;
	isAddingComment: boolean;
	formatDate: (dateString: string) => string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({
	commentsData,
	commentsLoading,
	commentPage,
	setCommentPage,
	newComment,
	setNewComment,
	handleAddComment,
	isAddingComment,
	formatDate,
}) => {
	const { t } = useTranslation();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.2 }}
			className='mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100'>
			<h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2'>
				<MessageCircle className='w-5 h-5 sm:w-6 sm:h-6 text-primary-600' />
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
							setNewComment((prev: any) => ({
								...prev,
								authorName: e.target.value,
							}))
						}
						className='px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base'
						required
					/>
					<input
						type='email'
						placeholder={t("yourEmail")}
						value={newComment.authorEmail}
						onChange={(e) =>
							setNewComment((prev: any) => ({
								...prev,
								authorEmail: e.target.value,
							}))
						}
						className='px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base'
						required
					/>
				</div>
				<textarea
					placeholder={t("writeComment")}
					value={newComment.content}
					onChange={(e) =>
						setNewComment((prev: any) => ({
							...prev,
							content: e.target.value,
						}))
					}
					rows={3}
					className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3 sm:mb-4 text-sm sm:text-base resize-none'
					required
				/>
				<button
					type='submit'
					disabled={isAddingComment}
					className='w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base'>
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
	);
};

export default BlogComments;
