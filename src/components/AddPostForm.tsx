/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Save, Image as ImageIcon } from "lucide-react";
import { useCreatePost } from "../hooks/usePosts";
import { useCategories } from "../contexts/CategoriesContext";
import { CreatePostData, ContentBlock, ContentParagraph, ContentImage } from "../types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

interface AddPostFormProps {
	onClose: () => void;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onClose }) => {
	const { mutate: createPost, isPending } = useCreatePost();
	const { categories } = useCategories();
	const { t } = useTranslation();
	const { isRTL, currentLanguage } = useLanguage();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'object' && value !== null) {
			const valueObj = value as Record<string, string>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || '';
		}
		return '';
	};

	// Helper functions for managing content blocks
	const addContentBlock = (blocks: ContentBlock[], type: 'paragraph' | 'image', newBlock: Partial<ContentParagraph> | Partial<ContentImage>): ContentBlock[] => {
		if (type === 'paragraph') {
			const paragraphBlock = newBlock as Partial<ContentParagraph>;
			return [...blocks, {
				type: 'paragraph',
				text: paragraphBlock.text || '',
				title: paragraphBlock.title || ''
			} as ContentParagraph];
		} else if (type === 'image') {
			const imageBlock = newBlock as Partial<ContentImage>;
			return [...blocks, {
				type: 'image',
				imageUrl: imageBlock.imageUrl || '',
				imageAlt: imageBlock.imageAlt || '',
				imageCaption: imageBlock.imageCaption || ''
			} as ContentImage];
		}
		return blocks;
	};

	const updateContentBlock = (blocks: ContentBlock[], index: number, updatedBlock: Partial<ContentParagraph> | Partial<ContentImage>): ContentBlock[] => {
		return blocks.map((block, i) => 
			i === index ? { ...block, ...updatedBlock } as ContentBlock : block
		);
	};

	const removeContentBlock = (blocks: ContentBlock[], index: number): ContentBlock[] => {
		return blocks.filter((_, i) => i !== index);
	};

	const [formData, setFormData] = useState<CreatePostData>({
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

	const [tagInput, setTagInput] = useState("");
	const [titleEn, setTitleEn] = useState("");
	const [titleAr, setTitleAr] = useState("");
	const [contentEn, setContentEn] = useState("");
	const [contentAr, setContentAr] = useState("");
	
	// Rich content editor states
	const [contentBlocksEn, setContentBlocksEn] = useState<ContentBlock[]>([]);
	const [contentBlocksAr, setContentBlocksAr] = useState<ContentBlock[]>([]);
	const [useRichEditor, setUseRichEditor] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData(prev => ({ ...prev, [name]: checked }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleAddTag = () => {
		if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, tagInput.trim()],
			}));
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Convert text content to structured content format
		const convertTextToContentBlocks = (text: string) => {
			if (!text.trim()) return [];
			const paragraphs = text.split('\n\n').filter(p => p.trim());
			return paragraphs.map(paragraph => ({
				type: "paragraph" as const,
				text: paragraph.trim()
			}));
		};

		// Use rich content blocks if available, otherwise convert from text
		let structuredContentEn: ContentBlock[];
		let structuredContentAr: ContentBlock[];
		
		if (useRichEditor && (contentBlocksEn.length > 0 || contentBlocksAr.length > 0)) {
			structuredContentEn = contentBlocksEn;
			structuredContentAr = contentBlocksAr;
		} else {
			structuredContentEn = convertTextToContentBlocks(contentEn);
			structuredContentAr = convertTextToContentBlocks(contentAr);
		}

		const payload: CreatePostData = {
			...formData,
			title: { en: titleEn, ar: titleAr },
			content: { 
				en: structuredContentEn, 
				ar: structuredContentAr 
			},
		};

		createPost(payload, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-2xl font-bold text-gray-900">Add New Post</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Title EN */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Title (EN) *
							</label>
							<input
								type="text"
								value={titleEn}
								onChange={(e) => setTitleEn(e.target.value)}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter post title in English"
							/>
						</div>

						{/* Title AR */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Title (AR) *
							</label>
							<input
								type="text"
								value={titleAr}
								onChange={(e) => setTitleAr(e.target.value)}
								required
								dir="rtl"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="أدخل عنوان المقال بالعربية"
							/>
						</div>

						{/* Author Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Author Name *
							</label>
							<input
								type="text"
								name="authorName"
								value={formData.authorName}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter author name"
							/>
						</div>

						{/* Author Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Author Email *
							</label>
							<input
								type="email"
								name="authorEmail"
								value={formData.authorEmail}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter author email"
							/>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Category *
							</label>
							<select
								name="category"
								value={formData.category}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select a category</option>
								{categories.map((category) => (
									<option key={category._id} value={category._id}>
										{getLocalizedText(category.name)}
									</option>
								))}
							</select>
						</div>

						{/* Status */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Status
							</label>
							<select
								name="status"
								value={formData.status}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
								<option value="archived">Archived</option>
							</select>
						</div>

						{/* Featured */}
						<div className="flex items-center space-x-3">
							<input
								type="checkbox"
								name="featured"
								checked={formData.featured}
								onChange={handleInputChange}
								className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label className="text-sm font-medium text-gray-700">
								Featured Post
							</label>
						</div>

						{/* Post Image */}
						<div className="lg:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Post Image URL *
							</label>
							<div className="flex space-x-2">
								<input
									type="url"
									name="postImage"
									value={formData.postImage}
									onChange={handleInputChange}
									required
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter image URL"
								/>
								<button
									type="button"
									className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
								>
									<ImageIcon className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Tags */}
						<div className="lg:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tags
							</label>
							<div className="flex space-x-2 mb-3">
								<input
									type="text"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter tag and press Enter"
								/>
								<button
									type="button"
									onClick={handleAddTag}
									className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<Plus className="w-5 h-5" />
								</button>
							</div>
							{formData.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{formData.tags.map((tag, index) => (
										<span
											key={index}
											className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
										>
											{tag}
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="ml-2 text-blue-600 hover:text-blue-800"
											>
												<X className="w-3 h-3" />
											</button>
										</span>
									))}
								</div>
							)}
						</div>

						{/* Content Editor Toggle */}
						<div className="lg:col-span-2">
							<div className="flex items-center justify-between mb-4">
								<label className="block text-sm font-medium text-gray-700">
									Content Editor
								</label>
								<div className="flex items-center space-x-4">
									<button
										type="button"
										onClick={() => setUseRichEditor(false)}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
											!useRichEditor 
												? 'bg-blue-600 text-white' 
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
									>
										Simple Text
									</button>
									<button
										type="button"
										onClick={() => setUseRichEditor(true)}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
											useRichEditor 
												? 'bg-blue-600 text-white' 
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
										}`}
									>
										Rich Editor
									</button>
								</div>
							</div>
						</div>

						{/* Content EN/AR */}
						{!useRichEditor ? (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Content (EN) *
									</label>
									<textarea
										value={contentEn}
										onChange={(e) => setContentEn(e.target.value)}
										required
										rows={8}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
										placeholder="Write your post content in English...

Use double line breaks to create separate paragraphs."
									/>
									<p className="text-sm text-gray-500 mt-2">
										Current: {contentEn.length} characters
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Content (AR) *
									</label>
									<textarea
										value={contentAr}
										onChange={(e) => setContentAr(e.target.value)}
										required
										dir="rtl"
										rows={8}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
										placeholder="اكتب محتوى المقال بالعربية...

استخدم فاصلين أسطر لإنشاء فقرات منفصلة."
									/>
									<p className="text-sm text-gray-500 mt-2">
										الحالي: {contentAr.length} حرف
									</p>
								</div>
							</>
						) : (
							<>
								{/* Rich Content Editor for English */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Content (EN) *
									</label>
									<div className="border border-gray-300 rounded-lg p-4 space-y-4">
										{contentBlocksEn.map((block, index) => (
											<div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-gray-600">
														{block.type === 'paragraph' ? 'Paragraph' : 'Image'} {index + 1}
													</span>
													<div className="flex items-center space-x-2">
														<button
															type="button"
															onClick={() => setContentBlocksEn(removeContentBlock(contentBlocksEn, index))}
															className="text-red-600 hover:text-red-800"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												</div>
												{block.type === 'paragraph' ? (
													<div className="space-y-2">
														<input
															type="text"
															value={block.title || ''}
															onChange={(e) => setContentBlocksEn(updateContentBlock(contentBlocksEn, index, { title: e.target.value }))}
															placeholder="Paragraph title (optional)"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<textarea
															value={block.text || ''}
															onChange={(e) => setContentBlocksEn(updateContentBlock(contentBlocksEn, index, { text: e.target.value }))}
															placeholder="Paragraph text"
															rows={3}
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
													</div>
												) : (
													<div className="space-y-2">
														<input
															type="url"
															value={block.imageUrl || ''}
															onChange={(e) => setContentBlocksEn(updateContentBlock(contentBlocksEn, index, { imageUrl: e.target.value }))}
															placeholder="Image URL"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<input
															type="text"
															value={block.imageAlt || ''}
															onChange={(e) => setContentBlocksEn(updateContentBlock(contentBlocksEn, index, { imageAlt: e.target.value }))}
															placeholder="Image alt text"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<input
															type="text"
															value={block.imageCaption || ''}
															onChange={(e) => setContentBlocksEn(updateContentBlock(contentBlocksEn, index, { imageCaption: e.target.value }))}
															placeholder="Image caption"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
													</div>
												)}
											</div>
										))}
										<div className="flex space-x-2">
											<button
												type="button"
												onClick={() => setContentBlocksEn(addContentBlock(contentBlocksEn, 'paragraph', {}))}
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
											>
												+ Add Paragraph
											</button>
											<button
												type="button"
												onClick={() => setContentBlocksEn(addContentBlock(contentBlocksEn, 'image', {}))}
												className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
											>
												+ Add Image
											</button>
										</div>
									</div>
								</div>

								{/* Rich Content Editor for Arabic */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Content (AR) *
									</label>
									<div className="border border-gray-300 rounded-lg p-4 space-y-4">
										{contentBlocksAr.map((block, index) => (
											<div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-gray-600">
														{block.type === 'paragraph' ? 'فقرة' : 'صورة'} {index + 1}
													</span>
													<div className="flex items-center space-x-2">
														<button
															type="button"
															onClick={() => setContentBlocksAr(removeContentBlock(contentBlocksAr, index))}
															className="text-red-600 hover:text-red-800"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												</div>
												{block.type === 'paragraph' ? (
													<div className="space-y-2">
														<input
															type="text"
															value={block.title || ''}
															onChange={(e) => setContentBlocksAr(updateContentBlock(contentBlocksAr, index, { title: e.target.value }))}
															placeholder="عنوان الفقرة (اختياري)"
															dir="rtl"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<textarea
															value={block.text || ''}
															onChange={(e) => setContentBlocksAr(updateContentBlock(contentBlocksAr, index, { text: e.target.value }))}
															placeholder="نص الفقرة"
															dir="rtl"
															rows={3}
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
													</div>
												) : (
													<div className="space-y-2">
														<input
															type="url"
															value={block.imageUrl || ''}
															onChange={(e) => setContentBlocksAr(updateContentBlock(contentBlocksAr, index, { imageUrl: e.target.value }))}
															placeholder="رابط الصورة"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<input
															type="text"
															value={block.imageAlt || ''}
															onChange={(e) => setContentBlocksAr(updateContentBlock(contentBlocksAr, index, { imageAlt: e.target.value }))}
															placeholder="النص البديل للصورة"
															dir="rtl"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
														<input
															type="text"
															value={block.imageCaption || ''}
															onChange={(e) => setContentBlocksAr(updateContentBlock(contentBlocksAr, index, { imageCaption: e.target.value }))}
															placeholder="تعليق الصورة"
															dir="rtl"
															className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
														/>
													</div>
												)}
											</div>
										))}
										<div className="flex space-x-2">
											<button
												type="button"
												onClick={() => setContentBlocksAr(addContentBlock(contentBlocksAr, 'paragraph', {}))}
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
											>
												+ إضافة فقرة
											</button>
											<button
												type="button"
												onClick={() => setContentBlocksAr(addContentBlock(contentBlocksAr, 'image', {}))}
												className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
											>
												+ إضافة صورة
											</button>
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					{/* Submit Button */}
					<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={
								isPending || 
								!titleEn.trim() || 
								!titleAr.trim() ||
								(useRichEditor ? (contentBlocksEn.length === 0 || contentBlocksAr.length === 0) : (contentEn.length < 10 || contentAr.length < 10))
							}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
						>
							<Save className="w-5 h-5" />
							<span>{isPending ? "Creating..." : "Create Post"}</span>
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default AddPostForm;

