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
	Plus,
	X,
	MessageCircle,
} from "lucide-react";
import {
	usePosts,
	useDeletePost,
	useUpdatePost,
	useCreatePost,
	usePostComments,
	useDeleteComment,
} from "../hooks/usePosts";
import { useCategories } from "../contexts/CategoriesContext";
import {
	Post,
	UpdatePostData,
	CreatePostData,
	ContentBlock,
	ContentParagraph,
	ContentImage,
} from "../types";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import { useClickOutside } from "../hooks/useClickOutside";
import DeletionModal from "./DeletionModal";

// Comments Section Component
const CommentsSection: React.FC<{ postId: string }> = ({ postId }) => {
	const [commentPage, setCommentPage] = useState(1);
	const { data: commentsData, isLoading: commentsLoading } = usePostComments(
		postId,
		commentPage,
		10
	);
	const { mutate: deleteComment } = useDeleteComment();

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
				<h4 className='text-lg font-semibold text-gray-800 flex items-center'>
					<MessageCircle className='w-5 h-5 mr-2' />
					Comments ({commentsData?.totalComments || 0})
				</h4>
			</div>

			{commentsData?.comments && commentsData.comments.length > 0 ? (
				<div className='space-y-3'>
					{commentsData.comments.map((comment) => (
						<div
							key={comment._id}
							className='bg-white p-4 rounded-lg border border-gray-100'>
							<div className='flex items-start justify-between'>
								<div className='flex-1'>
									<div className='flex items-center space-x-2 mb-2'>
										<User className='w-4 h-4 text-gray-400' />
										<span className='font-medium text-gray-800'>
											{comment.authorName}
										</span>
										<span className='text-sm text-gray-500'>
											{comment.authorEmail}
										</span>
										<span className='text-xs text-gray-400'>
											{new Date(comment.createdAt).toLocaleDateString()}
										</span>
									</div>
									<p className='text-gray-700 text-sm leading-relaxed'>
										{comment.content}
									</p>
								</div>
								<button
									onClick={() =>
										handleDeleteComment(comment._id, comment.content)
									}
									className='p-1 text-red-600 hover:bg-red-50 rounded transition-colors'
									title='Delete comment'>
									<Trash2 className='w-4 h-4' />
								</button>
							</div>
						</div>
					))}

					{/* Pagination */}
					{commentsData.totalPages > 1 && (
						<div className='flex items-center justify-center space-x-2 mt-4'>
							<button
								onClick={() => setCommentPage((prev) => Math.max(1, prev - 1))}
								disabled={!commentsData.hasPrev}
								className='px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
								Previous
							</button>
							<span className='text-sm text-gray-600'>
								Page {commentPage} of {commentsData.totalPages}
							</span>
							<button
								onClick={() => setCommentPage((prev) => prev + 1)}
								disabled={!commentsData.hasNext}
								className='px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
								Next
							</button>
						</div>
					)}
				</div>
			) : (
				<div className='text-center py-8 text-gray-500'>
					<MessageCircle className='w-12 h-12 mx-auto mb-2 text-gray-300' />
					<p>No comments yet</p>
				</div>
			)}

			{/* Delete Comment Modal */}
			{showDeleteCommentModal && commentToDelete && (
				<DeletionModal
					isOpen={showDeleteCommentModal}
					onClose={cancelDeleteComment}
					onConfirm={confirmDeleteComment}
					title='Confirm Delete Comment'
					description='Are you sure you want to delete this comment? This action cannot be undone.'
					itemName='Comment'
					itemDescription={commentToDelete.content}
					isDeleting={false}
					type='comment'
				/>
			)}
		</div>
	);
};

const ManagePosts: React.FC = () => {
	const { currentLanguage } = useLanguage();
	const { data: postsData, isLoading } = usePosts(
		{ limit: 100 },
		currentLanguage
	);
	const { mutate: deletePost } = useDeletePost();
	const { mutate: updatePost } = useUpdatePost();
	const { mutate: createPost } = useCreatePost();
	const { categories } = useCategories();

	const [editingPost, setEditingPost] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<UpdatePostData>({});
	const [editTitleEn, setEditTitleEn] = useState("");
	const [editTitleAr, setEditTitleAr] = useState("");

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [featuredFilter, setFeaturedFilter] = useState<string>("all");
	const [showAddForm, setShowAddForm] = useState(false);

	// Click outside ref for add form modal
	const addFormRef = useClickOutside<HTMLDivElement>(
		() => setShowAddForm(false),
		showAddForm
	);
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
	const [addContentEn, setAddContentEn] = useState("");
	const [addContentAr, setAddContentAr] = useState("");

	// Comment management state
	const [showComments, setShowComments] = useState<string | null>(null);
	const [tagInput, setTagInput] = useState("");

	// Rich content editor states
	const [addContentBlocksEn, setAddContentBlocksEn] = useState<ContentBlock[]>(
		[]
	);
	const [addContentBlocksAr, setAddContentBlocksAr] = useState<ContentBlock[]>(
		[]
	);
	const [editContentBlocksEn, setEditContentBlocksEn] = useState<
		ContentBlock[]
	>([]);
	const [editContentBlocksAr, setEditContentBlocksAr] = useState<
		ContentBlock[]
	>([]);
	const [useRichEditor, setUseRichEditor] = useState(true);

	const posts = postsData?.posts || [];

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (typeof value === "object" && value !== null) {
			const valueObj = value as Record<string, string>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || "";
		}
		return "";
	};

	// Helper function to get content preview from structured content
	const getContentPreview = (content: unknown): string => {
		if (typeof content === "string") return content;

		// Handle ContentBlock[] directly
		if (Array.isArray(content)) {
			const paragraphs = content.filter(
				(block: ContentBlock) => block.type === "paragraph"
			);
			const images = content.filter(
				(block: ContentBlock) => block.type === "image"
			);
			if (paragraphs.length > 0) {
				// Combine all paragraph texts
				const text = paragraphs.map((block) => block.text || "").join(" ");
				const imageText =
					images.length > 0
						? ` [${images.length} image${images.length > 1 ? "s" : ""}]`
						: "";
				return (
					text.substring(0, 200) + (text.length > 200 ? "..." : "") + imageText
				);
			}
		}

		// Handle localized content object
		if (typeof content === "object" && content !== null) {
			const contentObj = content as Record<string, ContentBlock[]>;
			const localizedContent =
				contentObj[currentLanguage] || contentObj.en || contentObj.ar;
			if (Array.isArray(localizedContent)) {
				const paragraphs = localizedContent.filter(
					(block: ContentBlock) => block.type === "paragraph"
				);
				const images = localizedContent.filter(
					(block: ContentBlock) => block.type === "image"
				);
				if (paragraphs.length > 0) {
					// Combine all paragraph texts
					const text = paragraphs.map((block) => block.text || "").join(" ");
					const imageText =
						images.length > 0
							? ` [${images.length} image${images.length > 1 ? "s" : ""}]`
							: "";
					return (
						text.substring(0, 200) +
						(text.length > 200 ? "..." : "") +
						imageText
					);
				}
			}
		}
		return "";
	};

	// Filter posts based on search and filters
	const filteredPosts = posts.filter((post) => {
		const displayTitle = getLocalizedText(post.title);
		const displayContent = getContentPreview(post.content);

		const matchesSearch =
			searchQuery === "" ||
			displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			displayContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || post.status === statusFilter;
		const matchesCategory =
			categoryFilter === "all" ||
			(typeof post.category === "string"
				? post.category === categoryFilter
				: post.category._id === categoryFilter);
		const matchesFeatured =
			featuredFilter === "all" ||
			(featuredFilter === "featured" ? post.featured : !post.featured);

		return matchesSearch && matchesStatus && matchesCategory && matchesFeatured;
	});

	// Handle delete
	const [showDeletePostModal, setShowDeletePostModal] = useState(false);
	const [postToDelete, setPostToDelete] = useState<{
		id: string;
		title: string;
	} | null>(null);

	const handleDelete = (postId: string, postTitle: string) => {
		setPostToDelete({ id: postId, title: postTitle });
		setShowDeletePostModal(true);
	};

	const confirmDeletePost = () => {
		if (!postToDelete) return;

		deletePost(postToDelete.id, {
			onSuccess: () => {
				setShowDeletePostModal(false);
				setPostToDelete(null);
			},
			onError: () => {
				// Error handled by the mutation
			},
		});
	};

	const cancelDeletePost = () => {
		setShowDeletePostModal(false);
		setPostToDelete(null);
	};



	// Handle edit
	const handleEdit = (post: Post) => {
		setEditingPost(post._id);

		// Handle title
		const title =
			typeof post.title === "string" ? { en: post.title, ar: "" } : post.title;
		setEditTitleEn(title?.en || "");
		setEditTitleAr(title?.ar || "");

		// Handle content - extract all content blocks
		const content = post.content;
		let contentBlocksEn: ContentBlock[] = [];
		let contentBlocksAr: ContentBlock[] = [];

		if (Array.isArray(content)) {
			// Direct ContentBlock[] format
			contentBlocksEn = content;
			contentBlocksAr = content;
		} else if (typeof content === "object" && content !== null) {
			// Localized content format
			const contentObj = content as Record<string, ContentBlock[]>;
			contentBlocksEn = contentObj.en || [];
			contentBlocksAr = contentObj.ar || [];
		}

		// Set rich editor content blocks
		setEditContentBlocksEn(contentBlocksEn);
		setEditContentBlocksAr(contentBlocksAr);
		setEditForm({
			status: post.status,
			featured: post.featured,
			category:
				typeof post.category === "string" ? post.category : post.category._id,
			tags: post.tags,
			postImage: post.postImage || "",
		});
	};

	// Helper function to convert text to multiple paragraph blocks
	const convertTextToContentBlocks = (text: string): ContentBlock[] => {
		if (!text.trim()) return [];

		// Split by double newlines to create separate paragraphs
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

	// Handle save edit
	const handleSaveEdit = (postId: string) => {
		// Validate required fields
		if (!editTitleEn.trim() || !editTitleAr.trim()) {
			toast.error("Both English and Arabic titles are required");
			return;
		}

		// Validate rich content blocks
		if (editContentBlocksEn.length === 0 || editContentBlocksAr.length === 0) {
			toast.error("Both English and Arabic content blocks are required");
			return;
		}

		const payload: UpdatePostData = {
			title: { en: editTitleEn, ar: editTitleAr },
			content: { en: editContentBlocksEn, ar: editContentBlocksAr },
			status: editForm.status,
			featured: editForm.featured,
			category: editForm.category,
			tags: editForm.tags,
			postImage: editForm.postImage,
		};
		
		updatePost(
			{ id: postId, postData: payload },
			{
				onSuccess: () => {
					setEditingPost(null);
					setEditForm({});
					setEditTitleEn("");
					setEditTitleAr("");
					setEditContentBlocksEn([]);
					setEditContentBlocksAr([]);
					toast.success("Post updated successfully!");
				},
				onError: (error: Error) => {
					const errorMessage =
						(error as { response?: { data?: { message?: string } } })?.response
							?.data?.message || "Failed to update post";
					toast.error(errorMessage);
				},
			}
		);
	};

	// Handle cancel edit
	const handleCancelEdit = () => {
		setEditingPost(null);
		setEditForm({});
		setEditTitleEn("");
		setEditTitleAr("");
		setEditContentBlocksEn([]);
		setEditContentBlocksAr([]);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setCategoryFilter("all");
		setFeaturedFilter("all");
	};

	// Handle add post
	const handleAddPost = () => {
		// Validate required fields
		if (!addTitleEn.trim() || !addTitleAr.trim()) {
			toast.error("Both English and Arabic titles are required");
			return;
		}

		if (!addContentEn.trim() || !addContentAr.trim()) {
			toast.error("Both English and Arabic content are required");
			return;
		}

		if (!addFormData.authorName.trim() || !addFormData.authorEmail.trim()) {
			toast.error("Author name and email are required");
			return;
		}

		if (!addFormData.category) {
			toast.error("Category is required");
			return;
		}

		// Use rich content blocks if available, otherwise convert from text
		let structuredContentEn: ContentBlock[];
		let structuredContentAr: ContentBlock[];

		if (
			useRichEditor &&
			(addContentBlocksEn.length > 0 || addContentBlocksAr.length > 0)
		) {
			structuredContentEn = addContentBlocksEn;
			structuredContentAr = addContentBlocksAr;
		} else {
			structuredContentEn = convertTextToContentBlocks(addContentEn);
			structuredContentAr = convertTextToContentBlocks(addContentAr);
		}

		const payload: CreatePostData = {
			title: { en: addTitleEn, ar: addTitleAr },
			content: { en: structuredContentEn, ar: structuredContentAr },
			authorName: addFormData.authorName,
			authorEmail: addFormData.authorEmail,
			postImage: addFormData.postImage,
			category: addFormData.category,
			tags: addFormData.tags,
			status: addFormData.status,
			featured: addFormData.featured,
		};
		createPost(payload, {
			onSuccess: () => {
				setShowAddForm(false);
				setAddFormData({
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
				setTagInput("");
				setAddTitleEn("");
				setAddTitleAr("");
				setAddContentEn("");
				setAddContentAr("");
				setAddContentBlocksEn([]);
				setAddContentBlocksAr([]);
				toast.success("Post created successfully!");
			},
			onError: (error: Error) => {
				const errorMessage =
					(error as { response?: { data?: { message?: string } } })?.response
						?.data?.message || "Failed to create post";
				toast.error(errorMessage);
			},
		});
	};

	// Handle add tag
	const handleAddTag = () => {
		if (tagInput.trim() && !addFormData.tags.includes(tagInput.trim())) {
			setAddFormData((prev) => ({
				...prev,
				tags: [...prev.tags, tagInput.trim()],
			}));
			setTagInput("");
		}
	};

	// Handle remove tag
	const handleRemoveTag = (tagToRemove: string) => {
		setAddFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	// Get category name
	const getCategoryName = (
		category:
			| string
			| {
					_id: string;
					name: string | { en: string; ar: string };
					description: string | { en: string; ar: string };
			  }
	) => {
		if (typeof category === "string") {
			const cat = categories.find((c) => c._id === category);
			if (!cat) return category;
			return getLocalizedText(cat.name);
		}
		return getLocalizedText(category.name);
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
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

	if (isLoading) {
		return (
			<div className='space-y-4'>
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className='bg-white rounded-lg p-6 animate-pulse'>
						<div className='h-4 bg-gray-200 rounded mb-2'></div>
						<div className='h-3 bg-gray-200 rounded mb-4 w-3/4'></div>
						<div className='h-3 bg-gray-200 rounded w-1/2'></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold text-gray-900'>Manage Posts</h2>
				<div className='flex items-center space-x-4'>
					<div className='text-sm text-gray-600'>
						Total: {filteredPosts.length} posts
					</div>
					<button
						onClick={() => setShowAddForm(true)}
						className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2'>
						<FileText className='w-4 h-4' />
						<span>Add Post</span>
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{/* Search */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Search Posts
						</label>
						<input
							type='text'
							placeholder='Search by title, content, or author...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>

					{/* Status Filter */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='all'>All Statuses</option>
							<option value='published'>Published</option>
							<option value='draft'>Draft</option>
							<option value='archived'>Archived</option>
						</select>
					</div>

					{/* Category Filter */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Category
						</label>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='all'>All Categories</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{getLocalizedText(category.name)}
								</option>
							))}
						</select>
					</div>

					{/* Featured Filter */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Featured
						</label>
						<select
							value={featuredFilter}
							onChange={(e) => setFeaturedFilter(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='all'>All Posts</option>
							<option value='featured'>Featured Only</option>
							<option value='not-featured'>Not Featured</option>
						</select>
					</div>
				</div>

				{/* Filter Summary and Clear */}
				<div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200'>
					<div className='flex items-center space-x-4 text-sm text-gray-600'>
						<span>
							Showing {filteredPosts.length} of {posts.length} posts
						</span>
						{(searchQuery ||
							statusFilter !== "all" ||
							categoryFilter !== "all" ||
							featuredFilter !== "all") && (
							<span className='text-blue-600 font-medium'>Filters applied</span>
						)}
					</div>
					<button
						onClick={clearFilters}
						className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors'>
						Clear Filters
					</button>
				</div>
			</div>

			{/* Posts List */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{filteredPosts.map((post) => (
					<React.Fragment key={post._id}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-XL shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
							{editingPost === post._id ? (
								/* Edit Form */
								<div className='p-6 space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Title (EN)
											</label>
											<input
												type='text'
												value={editTitleEn}
												onChange={(e) => setEditTitleEn(e.target.value)}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Title (AR)
											</label>
											<input
												type='text'
												value={editTitleAr}
												onChange={(e) => setEditTitleAr(e.target.value)}
												dir='rtl'
												className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
										{/* Rich Content Editor */}
										<div className='md:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-4'>
												Content Editor
											</label>
										</div>
												{/* Rich Content Editor for English */}
												<div className='md:col-span-2'>
													<label className='block text-sm font-medium text-gray-700 mb-2'>
														Content (EN)
													</label>
													<div className='border border-gray-300 rounded-lg p-4 space-y-4'>
														{editContentBlocksEn.map((block, index) => (
															<div
																key={index}
																className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
																<div className='flex items-center justify-between mb-2'>
																	<span className='text-sm font-medium text-gray-600'>
																		{block.type === "paragraph"
																			? "Paragraph"
																			: "Image"}{" "}
																		{index + 1}
																	</span>
																	<div className='flex items-center space-x-2'>
																		<button
																			type='button'
																			onClick={() =>
																				setEditContentBlocksEn(
																					removeContentBlock(
																						editContentBlocksEn,
																						index
																					)
																				)
																			}
																			className='text-red-600 hover:text-red-800'>
																			<X className='w-4 h-4' />
																		</button>
																	</div>
																</div>
																{block.type === "paragraph" ? (
																	<div className='space-y-2'>
																		<input
																			type='text'
																			value={block.title || ""}
																			onChange={(e) =>
																				setEditContentBlocksEn(
																					updateContentBlock(
																						editContentBlocksEn,
																						index,
																						{ title: e.target.value }
																					)
																				)
																			}
																			placeholder='Paragraph title (optional)'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<textarea
																			value={block.text || ""}
																			onChange={(e) =>
																				setEditContentBlocksEn(
																					updateContentBlock(
																						editContentBlocksEn,
																						index,
																						{ text: e.target.value }
																					)
																				)
																			}
																			placeholder='Paragraph text'
																			rows={3}
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																	</div>
																) : (
																	<div className='space-y-2'>
																		<input
																			type='url'
																			value={block.imageUrl || ""}
																			onChange={(e) =>
																				setEditContentBlocksEn(
																					updateContentBlock(
																						editContentBlocksEn,
																						index,
																						{ imageUrl: e.target.value }
																					)
																				)
																			}
																			placeholder='Image URL'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<input
																			type='text'
																			value={block.imageAlt || ""}
																			onChange={(e) =>
																				setEditContentBlocksEn(
																					updateContentBlock(
																						editContentBlocksEn,
																						index,
																						{ imageAlt: e.target.value }
																					)
																				)
																			}
																			placeholder='Image alt text'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<input
																			type='text'
																			value={block.imageCaption || ""}
																			onChange={(e) =>
																				setEditContentBlocksEn(
																					updateContentBlock(
																						editContentBlocksEn,
																						index,
																						{ imageCaption: e.target.value }
																					)
																				)
																			}
																			placeholder='Image caption'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																	</div>
																)}
															</div>
														))}
														<div className='flex space-x-2'>
															<button
																type='button'
																onClick={() =>
																	setEditContentBlocksEn(
																		addContentBlock(
																			editContentBlocksEn,
																			"paragraph",
																			{}
																		)
																	)
																}
																className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
																+ Add Paragraph
															</button>
															<button
																type='button'
																onClick={() =>
																	setEditContentBlocksEn(
																		addContentBlock(
																			editContentBlocksEn,
																			"image",
																			{}
																		)
																	)
																}
																className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
																+ Add Image
															</button>
														</div>
													</div>
												</div>

												{/* Rich Content Editor for Arabic */}
												<div className='md:col-span-2'>
													<label className='block text-sm font-medium text-gray-700 mb-2'>
														Content (AR)
													</label>
													<div className='border border-gray-300 rounded-lg p-4 space-y-4'>
														{editContentBlocksAr.map((block, index) => (
															<div
																key={index}
																className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
																<div className='flex items-center justify-between mb-2'>
																	<span className='text-sm font-medium text-gray-600'>
																		{block.type === "paragraph"
																			? "فقرة"
																			: "صورة"}{" "}
																		{index + 1}
																	</span>
																	<div className='flex items-center space-x-2'>
																		<button
																			type='button'
																			onClick={() =>
																				setEditContentBlocksAr(
																					removeContentBlock(
																						editContentBlocksAr,
																						index
																					)
																				)
																			}
																			className='text-red-600 hover:text-red-800'>
																			<X className='w-4 h-4' />
																		</button>
																	</div>
																</div>
																{block.type === "paragraph" ? (
																	<div className='space-y-2'>
																		<input
																			type='text'
																			value={block.title || ""}
																			onChange={(e) =>
																				setEditContentBlocksAr(
																					updateContentBlock(
																						editContentBlocksAr,
																						index,
																						{ title: e.target.value }
																					)
																				)
																			}
																			placeholder='عنوان الفقرة (اختياري)'
																			dir='rtl'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<textarea
																			value={block.text || ""}
																			onChange={(e) =>
																				setEditContentBlocksAr(
																					updateContentBlock(
																						editContentBlocksAr,
																						index,
																						{ text: e.target.value }
																					)
																				)
																			}
																			placeholder='نص الفقرة'
																			dir='rtl'
																			rows={3}
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																	</div>
																) : (
																	<div className='space-y-2'>
																		<input
																			type='url'
																			value={block.imageUrl || ""}
																			onChange={(e) =>
																				setEditContentBlocksAr(
																					updateContentBlock(
																						editContentBlocksAr,
																						index,
																						{ imageUrl: e.target.value }
																					)
																				)
																			}
																			placeholder='رابط الصورة'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<input
																			type='text'
																			value={block.imageAlt || ""}
																			onChange={(e) =>
																				setEditContentBlocksAr(
																					updateContentBlock(
																						editContentBlocksAr,
																						index,
																						{ imageAlt: e.target.value }
																					)
																				)
																			}
																			placeholder='النص البديل للصورة'
																			dir='rtl'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																		<input
																			type='text'
																			value={block.imageCaption || ""}
																			onChange={(e) =>
																				setEditContentBlocksAr(
																					updateContentBlock(
																						editContentBlocksAr,
																						index,
																						{ imageCaption: e.target.value }
																					)
																				)
																			}
																			placeholder='تعليق الصورة'
																			dir='rtl'
																			className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																		/>
																	</div>
																)}
															</div>
														))}
														<div className='flex space-x-2'>
															<button
																type='button'
																onClick={() =>
																	setEditContentBlocksAr(
																		addContentBlock(
																			editContentBlocksAr,
																			"paragraph",
																			{}
																		)
																	)
																}
																className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
																+ إضافة فقرة
															</button>
															<button
																type='button'
																onClick={() =>
																	setEditContentBlocksAr(
																		addContentBlock(
																			editContentBlocksAr,
																			"image",
																			{}
																		)
																	)
																}
																className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
																+ إضافة صورة
															</button>
														</div>
													</div>
												</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Status
											</label>
											<select
												value={editForm.status || post.status}
												onChange={(e) =>
													setEditForm((prev) => ({
														...prev,
														status: e.target.value as
															| "draft"
															| "published"
															| "archived",
													}))
												}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
												<option value='draft'>Draft</option>
												<option value='published'>Published</option>
												<option value='archived'>Archived</option>
											</select>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Category
											</label>
											<select
												value={editForm.category || ""}
												onChange={(e) =>
													setEditForm((prev) => ({
														...prev,
														category: e.target.value,
													}))
												}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
												{categories.map((category) => (
													<option key={category._id} value={category._id}>
														{getLocalizedText(category.name)}
													</option>
												))}
											</select>
										</div>
										<div className='flex items-center space-x-3'>
											<input
												type='checkbox'
												checked={editForm.featured || post.featured}
												onChange={(e) =>
													setEditForm((prev) => ({
														...prev,
														featured: e.target.checked,
													}))
												}
												className='w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500'
											/>
											<label className='text-sm font-medium text-gray-700'>
												Featured
											</label>
										</div>

										{/* Post Image */}
										<div className='md:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Post Image URL
											</label>
											<input
												type='url'
												value={editForm.postImage !== undefined ? editForm.postImage : (post.postImage || "")}
												onChange={(e) =>
													setEditForm((prev) => ({
														...prev,
														postImage: e.target.value,
													}))
												}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
												placeholder='Enter image URL or leave empty to remove image'
											/>
											{/* Image Preview */}
											{(() => {
												const currentImageUrl = editForm.postImage !== undefined ? editForm.postImage : post.postImage;
												return currentImageUrl && currentImageUrl.trim() !== "" && (
													<div className='mt-3'>
														<p className='text-sm text-gray-600 mb-2'>Preview:</p>
														<div className='relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50'>
															<img
																src={currentImageUrl}
																alt="Post preview"
																className='w-full h-full object-cover'
																onLoad={() => {}}
																onError={(e) => {
																	e.currentTarget.style.display = "none";
																	const fallback = e.currentTarget.nextElementSibling as HTMLElement;
																	if (fallback) {
																		fallback.style.display = "flex";
																	}
																}}
															/>
															<div
																className='absolute inset-0 flex items-center justify-center text-gray-500'
																style={{ display: "none" }}
															>
																<div className='text-center'>
																	<FileText className='w-12 h-12 mx-auto mb-2' />
																	<p className='text-sm'>Invalid image URL</p>
																</div>
															</div>
														</div>
													</div>
												);
											})()}
										</div>
									</div>
									<div className='flex justify-end space-x-3'>
										<button
											onClick={handleCancelEdit}
											className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'>
											Cancel
										</button>
										<button
											onClick={() => handleSaveEdit(post._id)}
											className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
											Save Changes
										</button>
									</div>
								</div>
							) : (
								/* Post Display */
								<div className='relative'>
									{/* Featured Badge */}
									{post.featured && (
										<div className='absolute top-4 right-4 z-10'>
											<div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1'>
												<Star className='w-3 h-3 fill-current' />
												<span>Featured</span>
											</div>
										</div>
									)}

									{/* Post Image */}
									<div className='h-48 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden'>
										{post.postImage && post.postImage.trim() !== "" ? (
											<img
												src={post.postImage}
												alt={getLocalizedText(post.title)}
												className='w-full h-full object-cover'
												onLoad={() => {}}
												onError={(e) => {
													e.currentTarget.style.display = "none";
													const fallback = e.currentTarget
														.nextElementSibling as HTMLElement;
													if (fallback) {
														fallback.style.display = "flex";
													}
												}}
											/>
										) : null}
										<div
											className='w-full h-full flex items-center justify-center'
											style={{
												display:
													post.postImage && post.postImage.trim() !== ""
														? "none"
														: "flex",
											}}>
											<FileText className='w-16 h-16 text-teal-300' />
										</div>
										{/* Status Badge Overlay */}
										<div className='absolute top-4 left-4'>
											<span
												className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getStatusBadgeColor(
													post.status
												)}`}>
												{post.status.charAt(0).toUpperCase() +
													post.status.slice(1)}
											</span>
										</div>
									</div>

									{/* Post Content */}
									<div className='p-6'>
										{/* Title and Meta */}
										<div className='mb-4'>
											<h3 className='text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight'>
												{getLocalizedText(post.title)}
											</h3>

											<div className='flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3'>
												<div className='flex items-center space-x-1'>
													<div className='w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center'>
														<User className='w-3 h-3 text-teal-600' />
													</div>
													<span className='font-medium'>{post.authorName}</span>
												</div>
												<div className='flex items-center space-x-1'>
													<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
														<Calendar className='w-3 h-3 text-blue-600' />
													</div>
													<span>{formatDate(post.createdAt)}</span>
												</div>
												<div className='flex items-center space-x-1'>
													<div className='w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center'>
														<Tag className='w-3 h-3 text-purple-600' />
													</div>
													<span className='font-medium'>
														{getCategoryName(post.category)}
													</span>
												</div>
											</div>
										</div>

										{/* Content Preview */}
										<p className='text-gray-700 line-clamp-3 mb-4 leading-relaxed'>
											{getContentPreview(post.content)}
										</p>

										{/* Tags */}
										{post.tags && post.tags.length > 0 && (
											<div className='flex flex-wrap gap-2 mb-4'>
												{post.tags.map((tag, index) => (
													<span
														key={index}
														className='px-3 py-1 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-xs rounded-full border border-teal-200 font-medium'>
														#{tag}
													</span>
												))}
											</div>
										)}

										{/* Stats and Actions */}
										<div className='flex items-center justify-between pt-4 border-t border-gray-100'>
											<div className='flex items-center space-x-4 text-sm text-gray-500'>
												<div className='flex items-center space-x-1'>
													<div className='w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center'>
														<span className='text-xs'>👁</span>
													</div>
													<span>{post.views || 0}</span>
												</div>
												<div className='flex items-center space-x-1'>
													<div className='w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center'>
														<span className='text-xs'>❤</span>
													</div>
													<span>{post.likes || 0}</span>
												</div>
											</div>

											<div className='flex items-center space-x-2'>
												<button
													onClick={() =>
														setShowComments(
															showComments === post._id ? null : post._id
														)
													}
													className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105'
													title='View comments'>
													<MessageCircle className='w-4 h-4' />
												</button>
												<button
													onClick={() => handleEdit(post)}
													className='p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-105'
													title='Edit post'>
													<Edit className='w-4 h-4' />
												</button>
												<button
													onClick={() =>
														handleDelete(post._id, getLocalizedText(post.title))
													}
													className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105'
													title='Delete post'>
													<Trash2 className='w-4 h-4' />
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</motion.div>

						{/* Comments Section */}
						{showComments === post._id && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className='mt-4'>
								<CommentsSection postId={post._id} />
							</motion.div>
						)}
					</React.Fragment>
				))}
			</div>

			{/* Empty State */}
			{filteredPosts.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-gray-400 mb-4'>
						<FileText className='w-16 h-16 mx-auto' />
					</div>
					<h3 className='text-lg font-semibold text-gray-900 mb-2'>
						{posts.length === 0
							? "No posts yet"
							: "No posts match your filters"}
					</h3>
					<p className='text-gray-600'>
						{posts.length === 0
							? "Create your first post to get started with your blog."
							: "Try adjusting your search criteria or filters to find more posts."}
					</p>
				</div>
			)}

			{/* Add Post Modal */}
			{showAddForm && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<motion.div
						ref={addFormRef}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className='bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
						{/* Header */}
						<div className='flex items-center justify-between p-6 border-b border-gray-200'>
							<h2 className='text-2xl font-bold text-gray-900'>Add New Post</h2>
							<button
								onClick={() => setShowAddForm(false)}
								className='text-gray-400 hover:text-gray-600 transition-colors'>
								<X className='w-6 h-6' />
							</button>
						</div>

						{/* Form */}
						<div className='p-6 space-y-6'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								{/* Title EN */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Title (EN) *
									</label>
									<input
										type='text'
										value={addTitleEn}
										onChange={(e) => setAddTitleEn(e.target.value)}
										required
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										placeholder='Enter post title in English'
									/>
								</div>
								{/* Title AR */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Title (AR) *
									</label>
									<input
										type='text'
										value={addTitleAr}
										onChange={(e) => setAddTitleAr(e.target.value)}
										required
										dir='rtl'
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										placeholder='أدخل عنوان المقال بالعربية'
									/>
								</div>

								{/* Author Name */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Author Name *
									</label>
									<input
										type='text'
										value={addFormData.authorName}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												authorName: e.target.value,
											}))
										}
										required
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										placeholder='Enter author name'
									/>
								</div>

								{/* Author Email */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Author Email *
									</label>
									<input
										type='email'
										value={addFormData.authorEmail}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												authorEmail: e.target.value,
											}))
										}
										required
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										placeholder='Enter author email'
									/>
								</div>

								{/* Category */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Category *
									</label>
									<select
										value={addFormData.category}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												category: e.target.value,
											}))
										}
										required
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
										<option value=''>Select a category</option>
										{categories.map((category) => (
											<option key={category._id} value={category._id}>
												{getLocalizedText(category.name)}
											</option>
										))}
									</select>
								</div>

								{/* Status */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Status
									</label>
									<select
										value={addFormData.status}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												status: e.target.value as
													| "draft"
													| "published"
													| "archived",
											}))
										}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
										<option value='draft'>Draft</option>
										<option value='published'>Published</option>
										<option value='archived'>Archived</option>
									</select>
								</div>

								{/* Featured */}
								<div className='flex items-center space-x-3'>
									<input
										type='checkbox'
										checked={addFormData.featured}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												featured: e.target.checked,
											}))
										}
										className='w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500'
									/>
									<label className='text-sm font-medium text-gray-700'>
										Featured Post
									</label>
								</div>

								{/* Post Image */}
								<div className='lg:col-span-2'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Post Image URL *
									</label>
									<input
										type='url'
										value={addFormData.postImage}
										onChange={(e) =>
											setAddFormData((prev) => ({
												...prev,
												postImage: e.target.value,
											}))
										}
										required
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										placeholder='Enter image URL'
									/>
								</div>

								{/* Tags */}
								<div className='lg:col-span-2'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Tags
									</label>
									<div className='flex space-x-2 mb-3'>
										<input
											type='text'
											value={tagInput}
											onChange={(e) => setTagInput(e.target.value)}
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), handleAddTag())
											}
											className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											placeholder='Enter tag and press Enter'
										/>
										<button
											type='button'
											onClick={handleAddTag}
											className='px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
											<Plus className='w-5 h-5' />
										</button>
									</div>
									{addFormData.tags.length > 0 && (
										<div className='flex flex-wrap gap-2'>
											{addFormData.tags.map((tag, index) => (
												<span
													key={index}
													className='inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full'>
													{tag}
													<button
														type='button'
														onClick={() => handleRemoveTag(tag)}
														className='ml-2 text-teal-600 hover:text-teal-800'>
														<X className='w-3 h-3' />
													</button>
												</span>
											))}
										</div>
									)}
								</div>

								{/* Content Editor Toggle */}
								<div className='lg:col-span-2'>
									<div className='flex items-center justify-between mb-4'>
										<label className='block text-sm font-medium text-gray-700'>
											Content Editor
										</label>
										<div className='flex items-center space-x-4'>
											<button
												type='button'
												onClick={() => setUseRichEditor(false)}
												className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
													!useRichEditor
														? "bg-teal-600 text-white"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}>
												Simple Text
											</button>
											<button
												type='button'
												onClick={() => setUseRichEditor(true)}
												className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
													useRichEditor
														? "bg-teal-600 text-white"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}>
												Rich Editor
											</button>
										</div>
									</div>
								</div>

								{/* Content EN/AR */}
								{!useRichEditor ? (
									<>
										<div className='lg:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Content (EN) *
											</label>
											<p className='text-sm text-gray-500 mb-2'>
												Tip: Use double line breaks (press Enter twice) to
												create separate paragraphs.
											</p>
											<textarea
												value={addContentEn}
												onChange={(e) => setAddContentEn(e.target.value)}
												required
												rows={12}
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical'
												placeholder='Write your post content in English...

Use double line breaks to create separate paragraphs.

Each paragraph will be saved as a separate content block.'
											/>
										</div>
										<div className='lg:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Content (AR) *
											</label>
											<p className='text-sm text-gray-500 mb-2'>
												نصيحة: استخدم فاصلين أسطر (اضغط Enter مرتين) لإنشاء
												فقرات منفصلة.
											</p>
											<textarea
												value={addContentAr}
												onChange={(e) => setAddContentAr(e.target.value)}
												required
												dir='rtl'
												rows={12}
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical'
												placeholder='اكتب محتوى المقال بالعربية...

استخدم فاصلين أسطر لإنشاء فقرات منفصلة.

كل فقرة ستُحفظ ككتلة محتوى منفصلة.'
											/>
										</div>
									</>
								) : (
									<>
										{/* Rich Content Editor for English */}
										<div className='lg:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Content (EN) *
											</label>
											<div className='border border-gray-300 rounded-lg p-4 space-y-4'>
												{addContentBlocksEn.map((block, index) => (
													<div
														key={index}
														className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
														<div className='flex items-center justify-between mb-2'>
															<span className='text-sm font-medium text-gray-600'>
																{block.type === "paragraph"
																	? "Paragraph"
																	: "Image"}{" "}
																{index + 1}
															</span>
															<div className='flex items-center space-x-2'>
																<button
																	type='button'
																	onClick={() =>
																		setAddContentBlocksEn(
																			removeContentBlock(
																				addContentBlocksEn,
																				index
																			)
																		)
																	}
																	className='text-red-600 hover:text-red-800'>
																	<X className='w-4 h-4' />
																</button>
															</div>
														</div>
														{block.type === "paragraph" ? (
															<div className='space-y-2'>
																<input
																	type='text'
																	value={block.title || ""}
																	onChange={(e) =>
																		setAddContentBlocksEn(
																			updateContentBlock(
																				addContentBlocksEn,
																				index,
																				{ title: e.target.value }
																			)
																		)
																	}
																	placeholder='Paragraph title (optional)'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<textarea
																	value={block.text || ""}
																	onChange={(e) =>
																		setAddContentBlocksEn(
																			updateContentBlock(
																				addContentBlocksEn,
																				index,
																				{ text: e.target.value }
																			)
																		)
																	}
																	placeholder='Paragraph text'
																	rows={3}
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
															</div>
														) : (
															<div className='space-y-2'>
																<input
																	type='url'
																	value={block.imageUrl || ""}
																	onChange={(e) =>
																		setAddContentBlocksEn(
																			updateContentBlock(
																				addContentBlocksEn,
																				index,
																				{ imageUrl: e.target.value }
																			)
																		)
																	}
																	placeholder='Image URL'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<input
																	type='text'
																	value={block.imageAlt || ""}
																	onChange={(e) =>
																		setAddContentBlocksEn(
																			updateContentBlock(
																				addContentBlocksEn,
																				index,
																				{ imageAlt: e.target.value }
																			)
																		)
																	}
																	placeholder='Image alt text'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<input
																	type='text'
																	value={block.imageCaption || ""}
																	onChange={(e) =>
																		setAddContentBlocksEn(
																			updateContentBlock(
																				addContentBlocksEn,
																				index,
																				{ imageCaption: e.target.value }
																			)
																		)
																	}
																	placeholder='Image caption'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
															</div>
														)}
													</div>
												))}
												<div className='flex space-x-2'>
													<button
														type='button'
														onClick={() =>
															setAddContentBlocksEn(
																addContentBlock(
																	addContentBlocksEn,
																	"paragraph",
																	{}
																)
															)
														}
														className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
														+ Add Paragraph
													</button>
													<button
														type='button'
														onClick={() =>
															setAddContentBlocksEn(
																addContentBlock(addContentBlocksEn, "image", {})
															)
														}
														className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
														+ Add Image
													</button>
												</div>
											</div>
										</div>

										{/* Rich Content Editor for Arabic */}
										<div className='lg:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Content (AR) *
											</label>
											<div className='border border-gray-300 rounded-lg p-4 space-y-4'>
												{addContentBlocksAr.map((block, index) => (
													<div
														key={index}
														className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
														<div className='flex items-center justify-between mb-2'>
															<span className='text-sm font-medium text-gray-600'>
																{block.type === "paragraph" ? "فقرة" : "صورة"}{" "}
																{index + 1}
															</span>
															<div className='flex items-center space-x-2'>
																<button
																	type='button'
																	onClick={() =>
																		setAddContentBlocksAr(
																			removeContentBlock(
																				addContentBlocksAr,
																				index
																			)
																		)
																	}
																	className='text-red-600 hover:text-red-800'>
																	<X className='w-4 h-4' />
																</button>
															</div>
														</div>
														{block.type === "paragraph" ? (
															<div className='space-y-2'>
																<input
																	type='text'
																	value={block.title || ""}
																	onChange={(e) =>
																		setAddContentBlocksAr(
																			updateContentBlock(
																				addContentBlocksAr,
																				index,
																				{ title: e.target.value }
																			)
																		)
																	}
																	placeholder='عنوان الفقرة (اختياري)'
																	dir='rtl'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<textarea
																	value={block.text || ""}
																	onChange={(e) =>
																		setAddContentBlocksAr(
																			updateContentBlock(
																				addContentBlocksAr,
																				index,
																				{ text: e.target.value }
																			)
																		)
																	}
																	placeholder='نص الفقرة'
																	dir='rtl'
																	rows={3}
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
															</div>
														) : (
															<div className='space-y-2'>
																<input
																	type='url'
																	value={block.imageUrl || ""}
																	onChange={(e) =>
																		setAddContentBlocksAr(
																			updateContentBlock(
																				addContentBlocksAr,
																				index,
																				{ imageUrl: e.target.value }
																			)
																		)
																	}
																	placeholder='رابط الصورة'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<input
																	type='text'
																	value={block.imageAlt || ""}
																	onChange={(e) =>
																		setAddContentBlocksAr(
																			updateContentBlock(
																				addContentBlocksAr,
																				index,
																				{ imageAlt: e.target.value }
																			)
																		)
																	}
																	placeholder='النص البديل للصورة'
																	dir='rtl'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
																<input
																	type='text'
																	value={block.imageCaption || ""}
																	onChange={(e) =>
																		setAddContentBlocksAr(
																			updateContentBlock(
																				addContentBlocksAr,
																				index,
																				{ imageCaption: e.target.value }
																			)
																		)
																	}
																	placeholder='تعليق الصورة'
																	dir='rtl'
																	className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
																/>
															</div>
														)}
													</div>
												))}
												<div className='flex space-x-2'>
													<button
														type='button'
														onClick={() =>
															setAddContentBlocksAr(
																addContentBlock(
																	addContentBlocksAr,
																	"paragraph",
																	{}
																)
															)
														}
														className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
														+ إضافة فقرة
													</button>
													<button
														type='button'
														onClick={() =>
															setAddContentBlocksAr(
																addContentBlock(addContentBlocksAr, "image", {})
															)
														}
														className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
														+ إضافة صورة
													</button>
												</div>
											</div>
										</div>
									</>
								)}
							</div>

							{/* Submit Button */}
							<div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
								<button
									type='button'
									onClick={() => setShowAddForm(false)}
									className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
									Cancel
								</button>
								<button
									type='button'
									onClick={handleAddPost}
									disabled={
										addContentEn.length < 10 ||
										addContentAr.length < 10 ||
										!addTitleEn ||
										!addTitleAr ||
										!addFormData.authorName ||
										!addFormData.authorEmail ||
										!addFormData.category ||
										!addFormData.postImage
									}
									className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'>
									<Plus className='w-5 h-5' />
									<span>Create Post</span>
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}

			{/* Delete Post Modal */}
			{showDeletePostModal && postToDelete && (
				<DeletionModal
					isOpen={showDeletePostModal}
					onClose={cancelDeletePost}
					onConfirm={confirmDeletePost}
					title='Confirm Delete Post'
					description='Are you sure you want to delete this post? This action cannot be undone.'
					itemName={postToDelete.title}
					itemDescription=''
					isDeleting={false}
					type='post'
				/>
			)}
		</div>
	);
};

export default ManagePosts;
