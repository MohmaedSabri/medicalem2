/** @format */

import React, { useState, useMemo } from "react";
// import { motion } from "framer-motion";
import { usePosts } from "../../hooks/usePosts";
import { useLanguage } from "../../contexts/LanguageContext";
// import { useTranslation } from "react-i18next";
import { Post } from "../../types";
import PostFilters from "./Post/PostFilters";
import PostListItem from "./Post/PostListItem";
import PostCreateForm from "./Post/PostCreateForm";
import PostEditForm from "./Post/PostEditForm";

const ManagePosts: React.FC = () => {
	const { currentLanguage } = useLanguage();
	const { data: postsData, isLoading } = usePosts(
		{ limit: 100 },
		currentLanguage
	);
	// const { t } = useTranslation();

	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [featuredFilter, setFeaturedFilter] = useState<string>("all");
	const [showAddForm, setShowAddForm] = useState(false);
	const [showComments, setShowComments] = useState<string | null>(null);

	// Filter posts based on search and filters
	const filteredPosts = useMemo(() => {
		if (!postsData?.posts) return [];

		return postsData.posts.filter((post: Post) => {
			// Search filter
			const titleEn = typeof post.title === 'string' ? post.title : post.title?.en || '';
			const titleAr = typeof post.title === 'string' ? post.title : post.title?.ar || '';
			const matchesSearch = searchQuery === "" || 
				titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
				titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

			// Status filter
			const matchesStatus = statusFilter === "all" || post.status === statusFilter;

			// Category filter
			const matchesCategory = categoryFilter === "all" || 
				(typeof post.category === "string" ? post.category === categoryFilter : post.category?._id === categoryFilter);

			// Featured filter
			const matchesFeatured = featuredFilter === "all" || 
				(featuredFilter === "featured" && post.featured) ||
				(featuredFilter === "not-featured" && !post.featured);

			return matchesSearch && matchesStatus && matchesCategory && matchesFeatured;
		});
	}, [postsData?.posts, searchQuery, statusFilter, categoryFilter, featuredFilter]);

	const handleEditPost = (post: Post) => {
		setEditingPost(post);
	};

	const handleCloseEdit = () => {
		setEditingPost(null);
	};

	const handleSaveEdit = () => {
		setEditingPost(null);
		// The PostEditForm will handle the actual save
	};

	const handleAddPost = () => {
		setShowAddForm(true);
	};

	const handleCloseAddForm = () => {
		setShowAddForm(false);
	};

	const handleCreateSuccess = () => {
		setShowAddForm(false);
		// The PostCreateForm will handle the actual creation
	};

	const handleViewComments = (postId: string) => {
		setShowComments(showComments === postId ? null : postId);
	};

	if (isLoading) {
		return (
			<div className='p-6'>
				<div className='animate-pulse'>
					<div className='h-8 bg-gray-300 rounded w-1/4 mb-6'></div>
					<div className='space-y-4'>
						{[...Array(5)].map((_, i) => (
							<div key={i} className='h-32 bg-gray-300 rounded'></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold text-gray-800 mb-2'>Manage Posts</h1>
				<p className='text-gray-600'>
					Create, edit, and manage your blog posts
				</p>
			</div>

			{/* Filters */}
			<PostFilters
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				categoryFilter={categoryFilter}
				setCategoryFilter={setCategoryFilter}
				featuredFilter={featuredFilter}
				setFeaturedFilter={setFeaturedFilter}
				onAddPost={handleAddPost}
			/>

			{/* Posts List */}
			<div className='space-y-4'>
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post: Post) => (
						<PostListItem
							key={post._id}
							post={post}
							onEdit={handleEditPost}
							onViewComments={handleViewComments}
							showComments={showComments}
						/>
					))
				) : (
					<div className='text-center py-12'>
						<div className='text-gray-400 mb-4'>
							<svg
								className='w-16 h-16 mx-auto'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
						</div>
						<h3 className='text-lg font-medium text-gray-600 mb-2'>
							No posts found
						</h3>
						<p className='text-gray-500 mb-4'>
							{searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || featuredFilter !== 'all'
								? 'Try adjusting your filters or search terms'
								: 'Get started by creating your first post'
							}
						</p>
						{(!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && featuredFilter === 'all') && (
							<button
								onClick={handleAddPost}
								className='inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
							>
								Create First Post
							</button>
						)}
					</div>
				)}
			</div>

			{/* Create Post Modal */}
			{showAddForm && (
				<PostCreateForm
					onClose={handleCloseAddForm}
					onSuccess={handleCreateSuccess}
				/>
			)}

			{/* Edit Post Modal */}
			{editingPost && (
				<PostEditForm
					post={editingPost}
					onClose={handleCloseEdit}
					onSave={handleSaveEdit}
				/>
			)}
		</div>
	);
};

export default ManagePosts;
