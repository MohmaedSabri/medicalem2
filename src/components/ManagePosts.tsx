/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Star, Calendar, User, Tag, FileText, Plus, X } from "lucide-react";
import { usePosts, useDeletePost, useUpdatePost, useCreatePost } from "../hooks/usePosts";
import { useCategories } from "../contexts/CategoriesContext";
import { Post, UpdatePostData, CreatePostData } from "../types";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const ManagePosts: React.FC = () => {
	const { data: postsData, isLoading } = usePosts({ limit: 100 });
	const { mutate: deletePost } = useDeletePost();
	const { mutate: updatePost } = useUpdatePost();
	const { mutate: createPost } = useCreatePost();
	const { categories } = useCategories();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const [editingPost, setEditingPost] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<UpdatePostData>({});
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [featuredFilter, setFeaturedFilter] = useState<string>("all");
	const [showAddForm, setShowAddForm] = useState(false);
	const [addFormData, setAddFormData] = useState<CreatePostData>({
		title: "",
		content: "",
		authorName: "",
		authorEmail: "",
		postImage: "",
		category: "",
		tags: [],
		status: "draft",
		featured: false,
	});
	const [tagInput, setTagInput] = useState("");

	const posts = postsData?.posts || [];

	// Filter posts based on search and filters
	const filteredPosts = posts.filter((post) => {
		const matchesSearch = searchQuery === "" || 
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesStatus = statusFilter === "all" || post.status === statusFilter;
		const matchesCategory = categoryFilter === "all" || 
			(typeof post.category === "string" ? post.category === categoryFilter : post.category._id === categoryFilter);
		const matchesFeatured = featuredFilter === "all" || 
			(featuredFilter === "featured" ? post.featured : !post.featured);

		return matchesSearch && matchesStatus && matchesCategory && matchesFeatured;
	});

	// Handle delete
	const handleDelete = (postId: string, postTitle: string) => {
		if (window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
			deletePost(postId);
		}
	};

	// Handle edit
	const handleEdit = (post: Post) => {
		setEditingPost(post._id);
		setEditForm({
			title: post.title,
			content: post.content,
			status: post.status,
			featured: post.featured,
			category: typeof post.category === "string" ? post.category : post.category._id,
			tags: post.tags,
		});
	};

	// Handle save edit
	const handleSaveEdit = (postId: string) => {
		updatePost(
			{ id: postId, postData: editForm },
			{
				onSuccess: () => {
					setEditingPost(null);
					setEditForm({});
					toast.success("Post updated successfully!");
				},
			}
		);
	};

	// Handle cancel edit
	const handleCancelEdit = () => {
		setEditingPost(null);
		setEditForm({});
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
		createPost(addFormData, {
			onSuccess: () => {
				setShowAddForm(false);
				setAddFormData({
					title: "",
					content: "",
					authorName: "",
					authorEmail: "",
					postImage: "",
					category: "",
					tags: [],
					status: "draft",
					featured: false,
				});
				setTagInput("");
				toast.success("Post created successfully!");
			},
		});
	};

	// Handle add tag
	const handleAddTag = () => {
		if (tagInput.trim() && !addFormData.tags.includes(tagInput.trim())) {
			setAddFormData(prev => ({
				...prev,
				tags: [...prev.tags, tagInput.trim()],
			}));
			setTagInput("");
		}
	};

	// Handle remove tag
	const handleRemoveTag = (tagToRemove: string) => {
		setAddFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove),
		}));
	};

	// Get category name
	const getCategoryName = (category: string | { _id: string; name: string; description: string }) => {
		if (typeof category === "string") {
			const cat = categories.find((c) => c._id === category);
			return cat ? cat.name : category;
		}
		return category.name;
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
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className="bg-white rounded-lg p-6 animate-pulse">
						<div className="h-4 bg-gray-200 rounded mb-2"></div>
						<div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
						<div className="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Manage Posts</h2>
				<div className="flex items-center space-x-4">
				<div className="text-sm text-gray-600">
						Total: {filteredPosts.length} posts
					</div>
					<button
						onClick={() => setShowAddForm(true)}
						className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
					>
						<FileText className="w-4 h-4" />
						<span>Add Post</span>
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Search */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Search Posts
						</label>
						<input
							type="text"
							placeholder="Search by title, content, or author..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Status Filter */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Statuses</option>
							<option value="published">Published</option>
							<option value="draft">Draft</option>
							<option value="archived">Archived</option>
						</select>
					</div>

					{/* Category Filter */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category
						</label>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Categories</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					{/* Featured Filter */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Featured
						</label>
						<select
							value={featuredFilter}
							onChange={(e) => setFeaturedFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Posts</option>
							<option value="featured">Featured Only</option>
							<option value="not-featured">Not Featured</option>
						</select>
					</div>
				</div>

				{/* Filter Summary and Clear */}
				<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
					<div className="flex items-center space-x-4 text-sm text-gray-600">
						<span>Showing {filteredPosts.length} of {posts.length} posts</span>
						{(searchQuery || statusFilter !== "all" || categoryFilter !== "all" || featuredFilter !== "all") && (
							<span className="text-blue-600 font-medium">Filters applied</span>
						)}
					</div>
					<button
						onClick={clearFilters}
						className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
					>
						Clear Filters
					</button>
				</div>
			</div>

			{/* Posts List */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{filteredPosts.map((post) => (
					<motion.div
						key={post._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
					>
						{editingPost === post._id ? (
							/* Edit Form */
							<div className="p-6 space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Title
										</label>
										<input
											type="text"
											value={editForm.title || ""}
											onChange={(e) =>
												setEditForm((prev) => ({ ...prev, title: e.target.value }))
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Status
										</label>
										<select
											value={editForm.status || post.status}
											onChange={(e) =>
												setEditForm((prev) => ({ ...prev, status: e.target.value as "draft" | "published" | "archived" }))
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										>
											<option value="draft">Draft</option>
											<option value="published">Published</option>
											<option value="archived">Archived</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Category
										</label>
										<select
											value={editForm.category || ""}
											onChange={(e) =>
												setEditForm((prev) => ({ ...prev, category: e.target.value }))
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										>
											{categories.map((category) => (
												<option key={category._id} value={category._id}>
													{category.name}
												</option>
											))}
										</select>
									</div>
									<div className="flex items-center space-x-3">
										<input
											type="checkbox"
											checked={editForm.featured || post.featured}
											onChange={(e) =>
												setEditForm((prev) => ({ ...prev, featured: e.target.checked }))
											}
											className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
										/>
										<label className="text-sm font-medium text-gray-700">
											Featured
										</label>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Content
									</label>
									<textarea
										value={editForm.content || ""}
										onChange={(e) =>
											setEditForm((prev) => ({ ...prev, content: e.target.value }))
										}
										rows={4}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical"
									/>
								</div>
								<div className="flex justify-end space-x-3">
									<button
										onClick={handleCancelEdit}
										className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
									>
										Cancel
									</button>
									<button
										onClick={() => handleSaveEdit(post._id)}
										className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
									>
										Save Changes
									</button>
								</div>
							</div>
						) : (
							/* Post Display */
							<div className="relative">
								{/* Featured Badge */}
											{post.featured && (
									<div className="absolute top-4 right-4 z-10">
										<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
											<Star className="w-3 h-3 fill-current" />
											<span>Featured</span>
										</div>
									</div>
								)}

								{/* Post Image */}
								<div className="h-48 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
									{post.postImage ? (
										<img
											src={post.postImage}
											alt={post.title}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<FileText className="w-16 h-16 text-teal-300" />
										</div>
									)}
									{/* Status Badge Overlay */}
									<div className="absolute top-4 left-4">
											<span
											className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getStatusBadgeColor(
													post.status
												)}`}
											>
											{post.status.charAt(0).toUpperCase() + post.status.slice(1)}
											</span>
										</div>
								</div>

								{/* Post Content */}
								<div className="p-6">
									{/* Title and Meta */}
									<div className="mb-4">
										<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
											{post.title}
										</h3>
										
										<div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3">
											<div className="flex items-center space-x-1">
												<div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
													<User className="w-3 h-3 text-teal-600" />
												</div>
												<span className="font-medium">{post.authorName}</span>
											</div>
											<div className="flex items-center space-x-1">
												<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
													<Calendar className="w-3 h-3 text-blue-600" />
												</div>
												<span>{formatDate(post.createdAt)}</span>
											</div>
											<div className="flex items-center space-x-1">
												<div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
													<Tag className="w-3 h-3 text-purple-600" />
												</div>
												<span className="font-medium">{getCategoryName(post.category)}</span>
											</div>
											</div>
										</div>

									{/* Content Preview */}
									<p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">
											{post.content}
										</p>

									{/* Tags */}
										{post.tags && post.tags.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
												{post.tags.map((tag, index) => (
													<span
														key={index}
													className="px-3 py-1 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-xs rounded-full border border-teal-200 font-medium"
													>
														#{tag}
													</span>
												))}
											</div>
										)}

									{/* Stats and Actions */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<div className="flex items-center space-x-4 text-sm text-gray-500">
											<div className="flex items-center space-x-1">
												<div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
													<span className="text-xs">👁</span>
												</div>
												<span>{post.views || 0}</span>
											</div>
											<div className="flex items-center space-x-1">
												<div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
													<span className="text-xs">❤</span>
												</div>
												<span>{post.likes || 0}</span>
										</div>
									</div>

										<div className="flex items-center space-x-2">
										<button
											onClick={() => handleEdit(post)}
												className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-105"
											title="Edit post"
										>
											<Edit className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(post._id, post.title)}
												className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
											title="Delete post"
										>
											<Trash2 className="w-4 h-4" />
										</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</motion.div>
				))}
			</div>

			{/* Empty State */}
			{filteredPosts.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-4">
						<FileText className="w-16 h-16 mx-auto" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{posts.length === 0 ? "No posts yet" : "No posts match your filters"}
					</h3>
					<p className="text-gray-600">
						{posts.length === 0 
							? "Create your first post to get started with your blog."
							: "Try adjusting your search criteria or filters to find more posts."
						}
					</p>
				</div>
			)}

			{/* Add Post Modal */}
			{showAddForm && (
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
								onClick={() => setShowAddForm(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						{/* Form */}
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Title */}
								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Title *
									</label>
									<input
										type="text"
										value={addFormData.title}
										onChange={(e) => setAddFormData(prev => ({ ...prev, title: e.target.value }))}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="Enter post title"
									/>
								</div>

								{/* Author Name */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Author Name *
									</label>
									<input
										type="text"
										value={addFormData.authorName}
										onChange={(e) => setAddFormData(prev => ({ ...prev, authorName: e.target.value }))}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
										value={addFormData.authorEmail}
										onChange={(e) => setAddFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="Enter author email"
									/>
								</div>

								{/* Category */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Category *
									</label>
									<select
										value={addFormData.category}
										onChange={(e) => setAddFormData(prev => ({ ...prev, category: e.target.value }))}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									>
										<option value="">Select a category</option>
										{categories.map((category) => (
											<option key={category._id} value={category._id}>
												{category.name}
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
										value={addFormData.status}
										onChange={(e) => setAddFormData(prev => ({ ...prev, status: e.target.value as "draft" | "published" | "archived" }))}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
										checked={addFormData.featured}
										onChange={(e) => setAddFormData(prev => ({ ...prev, featured: e.target.checked }))}
										className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
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
									<input
										type="url"
										value={addFormData.postImage}
										onChange={(e) => setAddFormData(prev => ({ ...prev, postImage: e.target.value }))}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										placeholder="Enter image URL"
									/>
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
											className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											placeholder="Enter tag and press Enter"
										/>
										<button
											type="button"
											onClick={handleAddTag}
											className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
										>
											<Plus className="w-5 h-5" />
										</button>
									</div>
									{addFormData.tags.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{addFormData.tags.map((tag, index) => (
												<span
													key={index}
													className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full"
												>
													{tag}
													<button
														type="button"
														onClick={() => handleRemoveTag(tag)}
														className="ml-2 text-teal-600 hover:text-teal-800"
													>
														<X className="w-3 h-3" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>

								{/* Content */}
								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Content *
									</label>
									<textarea
										value={addFormData.content}
										onChange={(e) => setAddFormData(prev => ({ ...prev, content: e.target.value }))}
										required
										rows={12}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical"
										placeholder="Write your post content here..."
									/>
									<p className="text-sm text-gray-500 mt-2">
										Minimum 10 characters required. Current: {addFormData.content.length}
									</p>
								</div>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
								<button
									type="button"
									onClick={() => setShowAddForm(false)}
									className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleAddPost}
									disabled={addFormData.content.length < 10 || !addFormData.title || !addFormData.authorName || !addFormData.authorEmail || !addFormData.category || !addFormData.postImage}
									className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
								>
									<Plus className="w-5 h-5" />
									<span>Create Post</span>
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default ManagePosts;
