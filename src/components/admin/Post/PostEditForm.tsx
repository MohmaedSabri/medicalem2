/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { useUpdatePost } from "../../../hooks/usePosts";
import { useCategories } from "../../../contexts/CategoriesContext";
import toast from "react-hot-toast";
import {
	Post,
	UpdatePostData,
	ContentBlock,
} from "../../../types";
import PostBasicInfo from "./PostBasicInfo";
import ContentBlockEditor from "../ContentBlockEditor";

interface PostEditFormProps {
	post: Post;
	onClose: () => void;
	onSave: () => void;
}

const PostEditForm: React.FC<PostEditFormProps> = ({ post, onClose, onSave }) => {
	const { mutate: updatePost } = useUpdatePost();
	const { categories } = useCategories();
	// const { currentLanguage, isRTL } = useLanguage();
	// const { t } = useTranslation();

	const [editForm, setEditForm] = useState<UpdatePostData>({});
	const [editTitleEn, setEditTitleEn] = useState("");
	const [editTitleAr, setEditTitleAr] = useState("");
	const [editAuthorName, setEditAuthorName] = useState("");
	const [editAuthorEmail, setEditAuthorEmail] = useState("");
	const [editContentBlocksEn, setEditContentBlocksEn] = useState<ContentBlock[]>([]);
	const [editContentBlocksAr, setEditContentBlocksAr] = useState<ContentBlock[]>([]);

	useEffect(() => {
		// Initialize form with post data
		setEditTitleEn(typeof post.title === 'string' ? post.title : post.title?.en || "");
		setEditTitleAr(typeof post.title === 'string' ? post.title : post.title?.ar || "");
		setEditAuthorName(post.authorName || "");
		setEditAuthorEmail(post.authorEmail || "");

		// Parse content blocks
		let contentBlocksEn: ContentBlock[] = [];
		let contentBlocksAr: ContentBlock[] = [];

		const content = post.content;
		if (Array.isArray(content)) {
			// Simple array format
			contentBlocksEn = content;
			contentBlocksAr = content;
		} else if (typeof content === "object" && content !== null) {
			// Localized content format
			const contentObj = content as Record<string, ContentBlock[]>;
			contentBlocksEn = contentObj.en || [];
			contentBlocksAr = contentObj.ar || [];
		}

		setEditContentBlocksEn(contentBlocksEn);
		setEditContentBlocksAr(contentBlocksAr);
		setEditForm({
			status: post.status,
			featured: post.featured,
			category: typeof post.category === "string" ? post.category : post.category._id,
			tags: post.tags,
			postImage: post.postImage || "",
		});
	}, [post]);


	// Handle save edit
	const handleSaveEdit = () => {
		// Validate required fields
		if (!editTitleEn.trim() || !editTitleAr.trim()) {
			toast.error("Both English and Arabic titles are required");
			return;
		}

		// Validate author fields
		if (!editAuthorName.trim() || !editAuthorEmail.trim()) {
			toast.error("Author name and email are required");
			return;
		}

		// Validate rich content blocks
		if (editContentBlocksEn.length === 0 || editContentBlocksAr.length === 0) {
			toast.error("Both English and Arabic content blocks are required");
			return;
		}

		const updateData: UpdatePostData = {
			...editForm,
			title: { en: editTitleEn.trim(), ar: editTitleAr.trim() },
			authorName: editAuthorName.trim(),
			authorEmail: editAuthorEmail.trim(),
			content: {
				en: editContentBlocksEn,
				ar: editContentBlocksAr,
			},
		};

		updatePost(
			{ id: post._id, postData: updateData },
			{
				onSuccess: () => {
					toast.success("Post updated successfully");
					onSave();
				},
				onError: () => {
					toast.error("Failed to update post");
				},
			}
		);
	};


	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
		>
			<div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
				<div className='p-6 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-semibold text-gray-800'>Edit Post</h2>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='w-6 h-6' />
						</button>
					</div>
				</div>

				<div className='p-6 space-y-6'>
					<PostBasicInfo
						editTitleEn={editTitleEn}
						setEditTitleEn={setEditTitleEn}
						editTitleAr={editTitleAr}
						setEditTitleAr={setEditTitleAr}
						editAuthorName={editAuthorName}
						setEditAuthorName={setEditAuthorName}
						editAuthorEmail={editAuthorEmail}
						setEditAuthorEmail={setEditAuthorEmail}
						editForm={editForm}
						setEditForm={setEditForm}
						categories={categories}
					/>

					{/* Content Blocks */}
					<div>
						<h3 className='text-lg font-medium text-gray-800 mb-4'>
							English Content
						</h3>
						<ContentBlockEditor
							blocks={editContentBlocksEn}
							setBlocks={setEditContentBlocksEn}
						/>
					</div>

					<div>
						<h3 className='text-lg font-medium text-gray-800 mb-4'>
							Arabic Content
						</h3>
						<ContentBlockEditor
							blocks={editContentBlocksAr}
							setBlocks={setEditContentBlocksAr}
						/>
					</div>
				</div>

				<div className='p-6 border-t border-gray-200 flex justify-end gap-3'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={handleSaveEdit}
						className='flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
					>
						<Save className='w-4 h-4' />
						Save Changes
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default PostEditForm;
