/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, X, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useCreatePost } from "../../../hooks/usePosts";
import { useCategories } from "../../../contexts/CategoriesContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../../../hooks/useClickOutside";
import toast from "react-hot-toast";
import {
	CreatePostData,
	ContentBlock,
	ContentParagraph,
	ContentImage,
} from "../../../types";

interface PostCreateFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

const PostCreateForm: React.FC<PostCreateFormProps> = ({ onClose, onSuccess }) => {
	const { mutate: createPost } = useCreatePost();
	const { categories } = useCategories();
	const { currentLanguage, isRTL } = useLanguage();
	const { t } = useTranslation();

	const [addFormData, setAddFormData] = useState<CreatePostData>({
		title: { en: "", ar: "" },
		content: { en: [], ar: [] },
		authorName: "",
		authorEmail: "",
		postImage: "",
		category: "",
		tags: [],
		status: "draft",
		featured: false,
	});
	const [addTitleEn, setAddTitleEn] = useState("");
	const [addTitleAr, setAddTitleAr] = useState("");
	const [addAuthorName, setAddAuthorName] = useState("");
	const [addAuthorEmail, setAddAuthorEmail] = useState("");
	const [addContentBlocksEn, setAddContentBlocksEn] = useState<ContentBlock[]>([]);
	const [addContentBlocksAr, setAddContentBlocksAr] = useState<ContentBlock[]>([]);

	// Click outside ref for add form modal
	const addFormRef = useClickOutside<HTMLDivElement>(onClose);

	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (value && typeof value === "object") {
			const obj = value as Record<string, string>;
			return obj[currentLanguage] || obj.en || obj.ar || "";
		}
		return "";
	};

	const canPreviewImage = (url: string): boolean => {
		if (!url) return false;
		const trimmed = url.trim();
		return (
			/^https?:\/\//i.test(trimmed) ||
			/^data:image\//i.test(trimmed) ||
			/^blob:/i.test(trimmed)
		);
	};

	// Helper function to convert text to multiple paragraph blocks
	const convertTextToContentBlocks = (text: string): ContentBlock[] => {
		if (!text.trim()) return [];

		const paragraphs = text.split("\n\n").filter((p) => p.trim());
		return paragraphs.map((paragraph) => ({
			type: "paragraph" as const,
			text: paragraph.trim(),
		}));
	};

	// Helper functions for managing content blocks
	const addContentBlock = (
		blocks: ContentBlock[],
		type: "paragraph" | "image",
		newBlock: Partial<ContentParagraph> | Partial<ContentImage>
	): ContentBlock[] => {
		if (type === "paragraph") {
			const paragraphBlock = newBlock as Partial<ContentParagraph>;
			return [
				...blocks,
				{
					type: "paragraph",
					text: paragraphBlock.text || "",
					title: paragraphBlock.title || "",
				} as ContentParagraph,
			];
		} else if (type === "image") {
			const imageBlock = newBlock as Partial<ContentImage>;
			return [
				...blocks,
				{
					type: "image",
					imageUrl: imageBlock.imageUrl || "",
					imageAlt: imageBlock.imageAlt || "",
					imageCaption: imageBlock.imageCaption || "",
				} as ContentImage,
			];
		}
		return blocks;
	};

	const updateContentBlock = (
		blocks: ContentBlock[],
		index: number,
		updatedBlock: Partial<ContentParagraph> | Partial<ContentImage>
	): ContentBlock[] => {
		return blocks.map((block, i) =>
			i === index ? ({ ...block, ...updatedBlock } as ContentBlock) : block
		);
	};

	const removeContentBlock = (
		blocks: ContentBlock[],
		index: number
	): ContentBlock[] => {
		return blocks.filter((_, i) => i !== index);
	};

	// Handle create post
	const handleCreatePost = () => {
		// Validate required fields
		if (!addTitleEn.trim() || !addTitleAr.trim()) {
			toast.error("Both English and Arabic titles are required");
			return;
		}

		// Validate author fields
		if (!addAuthorName.trim() || !addAuthorEmail.trim()) {
			toast.error("Author name and email are required");
			return;
		}

		// Validate rich content blocks
		if (addContentBlocksEn.length === 0 || addContentBlocksAr.length === 0) {
			toast.error("Both English and Arabic content blocks are required");
			return;
		}

		const createData: CreatePostData = {
			...addFormData,
			title: { en: addTitleEn.trim(), ar: addTitleAr.trim() },
			authorName: addAuthorName.trim(),
			authorEmail: addAuthorEmail.trim(),
			content: {
				en: addContentBlocksEn,
				ar: addContentBlocksAr,
			},
		};

		createPost(createData, {
			onSuccess: () => {
				toast.success("Post created successfully");
				onSuccess();
			},
			onError: () => {
				toast.error("Failed to create post");
			},
		});
	};

	const renderContentBlocks = (
		blocks: ContentBlock[],
		setBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>,
		language: string
	) => {
		return (
			<div className='space-y-4'>
				{blocks.map((block, index) => (
					<div key={index} className='border border-gray-200 rounded-lg p-4'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm font-medium text-gray-600'>
								{block.type === "paragraph" ? "Paragraph" : "Image"} Block
							</span>
							<button
								onClick={() => setBlocks(removeContentBlock(blocks, index))}
								className='text-red-500 hover:text-red-700 p-1'
							>
								<Trash2 className='w-4 h-4' />
							</button>
						</div>

						{block.type === "paragraph" ? (
							<div className='space-y-2'>
								<input
									type='text'
									placeholder='Block title (optional)'
									value={(block as ContentParagraph).title || ""}
									onChange={(e) =>
										setBlocks(
											updateContentBlock(blocks, index, {
												title: e.target.value,
											} as Partial<ContentParagraph>)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
								<textarea
									placeholder='Enter paragraph text...'
									value={(block as ContentParagraph).text || ""}
									onChange={(e) =>
										setBlocks(
											updateContentBlock(blocks, index, {
												text: e.target.value,
											} as Partial<ContentParagraph>)
										)
									}
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
							</div>
						) : (
							<div className='space-y-2'>
								<input
									type='url'
									placeholder='Image URL'
									value={(block as ContentImage).imageUrl || ""}
									onChange={(e) =>
										setBlocks(
											updateContentBlock(blocks, index, {
												imageUrl: e.target.value,
											} as Partial<ContentImage>)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
								{(block as ContentImage).imageUrl && canPreviewImage((block as ContentImage).imageUrl as string) && (
									<div className='relative mt-2 w-28 h-28 rounded border overflow-hidden'>
										<img src={(block as ContentImage).imageUrl as string} alt={(block as ContentImage).imageAlt || 'preview'} className='w-full h-full object-cover' />
										<button
											type='button'
											onClick={() => setBlocks(updateContentBlock(blocks, index, { imageUrl: "" } as Partial<ContentImage>))}
											className='absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
											title='Clear image'
										>
											&times;
										</button>
									</div>
								)}
								<input
									type='text'
									placeholder='Image alt text'
									value={(block as ContentImage).imageAlt || ""}
									onChange={(e) =>
										setBlocks(
											updateContentBlock(blocks, index, {
												imageAlt: e.target.value,
											} as Partial<ContentImage>)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
								<input
									type='text'
									placeholder='Image caption (optional)'
									value={(block as ContentImage).imageCaption || ""}
									onChange={(e) =>
										setBlocks(
											updateContentBlock(blocks, index, {
												imageCaption: e.target.value,
											} as Partial<ContentImage>)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
							</div>
						)}
					</div>
				))}

				<div className='flex gap-2'>
					<button
						onClick={() =>
							setBlocks(
								addContentBlock(blocks, "paragraph", { text: "", title: "" })
							)
						}
						className='flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors'
					>
						<Plus className='w-4 h-4' />
						Add Paragraph
					</button>
					<button
						onClick={() =>
							setBlocks(
								addContentBlock(blocks, "image", {
									imageUrl: "",
									imageAlt: "",
									imageCaption: "",
								})
							)
						}
						className='flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors'
					>
						<ImageIcon className='w-4 h-4' />
						Add Image
					</button>
				</div>
			</div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
		>
			<div
				ref={addFormRef}
				className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
			>
				<div className='p-6 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-semibold text-gray-800'>Create New Post</h2>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='w-6 h-6' />
						</button>
					</div>
				</div>

				<div className='p-6 space-y-6'>
					{/* Basic Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								English Title *
							</label>
							<input
								type='text'
								value={addTitleEn}
								onChange={(e) => setAddTitleEn(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								placeholder='Enter English title'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Arabic Title *
							</label>
							<input
								type='text'
								value={addTitleAr}
								onChange={(e) => setAddTitleAr(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								placeholder='Enter Arabic title'
								dir='rtl'
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Author Name *
							</label>
							<input
								type='text'
								value={addAuthorName}
								onChange={(e) => setAddAuthorName(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								placeholder='Enter author name'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Author Email *
							</label>
							<input
								type='email'
								value={addAuthorEmail}
								onChange={(e) => setAddAuthorEmail(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								placeholder='Enter author email'
							/>
						</div>
					</div>

					{/* Post Image */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Post Image URL
						</label>
						<input
							type='url'
							value={addFormData.postImage || ""}
							onChange={(e) =>
								setAddFormData({ ...addFormData, postImage: e.target.value })
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder='Enter image URL'
						/>
						{addFormData.postImage && canPreviewImage(addFormData.postImage) && (
							<div className='relative mt-2 w-32 h-32 rounded border overflow-hidden'>
								<img src={addFormData.postImage} alt='preview' className='w-full h-full object-cover' />
								<button
									type='button'
									onClick={() => setAddFormData({ ...addFormData, postImage: "" })}
									className='absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
									title='Clear image'
								>
									&times;
								</button>
							</div>
						)}
					</div>

					{/* Category */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Category
						</label>
						<select
							value={addFormData.category || ""}
							onChange={(e) =>
								setAddFormData({ ...addFormData, category: e.target.value })
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
						>
							<option value=''>Select a category</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{getLocalizedText(category.name)}
								</option>
							))}
						</select>
					</div>

					{/* Status and Featured */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Status
							</label>
							<select
								value={addFormData.status || "draft"}
								onChange={(e) =>
									setAddFormData({ ...addFormData, status: e.target.value as any })
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							>
								<option value='draft'>Draft</option>
								<option value='published'>Published</option>
								<option value='archived'>Archived</option>
							</select>
						</div>
						<div className='flex items-center'>
							<label className='flex items-center'>
								<input
									type='checkbox'
									checked={addFormData.featured || false}
									onChange={(e) =>
										setAddFormData({ ...addFormData, featured: e.target.checked })
									}
									className='mr-2'
								/>
								<span className='text-sm font-medium text-gray-700'>
									Featured Post
								</span>
							</label>
						</div>
					</div>

					{/* Tags */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Tags (comma-separated)
						</label>
						<input
							type='text'
							value={addFormData.tags?.join(", ") || ""}
							onChange={(e) =>
								setAddFormData({
									...addFormData,
									tags: e.target.value.split(",").map((tag) => tag.trim()),
								})
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder='Enter tags separated by commas'
						/>
					</div>

					{/* Content Blocks */}
					<div>
						<h3 className='text-lg font-medium text-gray-800 mb-4'>
							English Content
						</h3>
						{renderContentBlocks(
							addContentBlocksEn,
							setAddContentBlocksEn,
							"en"
						)}
					</div>

					<div>
						<h3 className='text-lg font-medium text-gray-800 mb-4'>
							Arabic Content
						</h3>
						{renderContentBlocks(
							addContentBlocksAr,
							setAddContentBlocksAr,
							"ar"
						)}
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
						onClick={handleCreatePost}
						className='flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
					>
						<Save className='w-4 h-4' />
						Create Post
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default PostCreateForm;
