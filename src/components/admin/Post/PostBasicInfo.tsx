/** @format */

import React from "react";

interface PostBasicInfoProps {
	editTitleEn: string;
	setEditTitleEn: (value: string) => void;
	editTitleAr: string;
	setEditTitleAr: (value: string) => void;
	editAuthorName: string;
	setEditAuthorName: (value: string) => void;
	editAuthorEmail: string;
	setEditAuthorEmail: (value: string) => void;
	editForm: {
		postImage?: string;
		category?: string;
		status?: string;
		featured?: boolean;
		tags?: string[];
	};
	setEditForm: (form: any) => void;
	categories: Array<{ _id: string; name: string | { en: string; ar: string } }>;
}

const PostBasicInfo: React.FC<PostBasicInfoProps> = ({
	editTitleEn,
	setEditTitleEn,
	editTitleAr,
	setEditTitleAr,
	editAuthorName,
	setEditAuthorName,
	editAuthorEmail,
	setEditAuthorEmail,
	editForm,
	setEditForm,
	categories,
}) => {
	const canPreviewImage = (url: string | undefined): boolean => {
		if (!url) return false;
		const trimmed = url.trim();
		return (
			/^https?:\/\//i.test(trimmed) ||
			/^data:image\//i.test(trimmed) ||
			/^blob:/i.test(trimmed)
		);
	};

	return (
		<>
			{/* Basic Information */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						English Title *
					</label>
					<input
						type='text'
						value={editTitleEn}
						onChange={(e) => setEditTitleEn(e.target.value)}
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
						value={editTitleAr}
						onChange={(e) => setEditTitleAr(e.target.value)}
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
						value={editAuthorName}
						onChange={(e) => setEditAuthorName(e.target.value)}
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
						value={editAuthorEmail}
						onChange={(e) => setEditAuthorEmail(e.target.value)}
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
					value={editForm.postImage || ""}
					onChange={(e) =>
						setEditForm({ ...editForm, postImage: e.target.value })
					}
					className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
					placeholder='Enter image URL'
				/>
				{canPreviewImage(editForm.postImage) && (
					<div className='relative mt-2 w-32 h-32 rounded border overflow-hidden'>
						<img src={editForm.postImage} alt='preview' className='w-full h-full object-cover' />
						<button
							type='button'
							onClick={() => setEditForm({ ...editForm, postImage: "" })}
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
					value={editForm.category || ""}
					onChange={(e) =>
						setEditForm({ ...editForm, category: e.target.value })
					}
					className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
					<option value=''>Select a category</option>
					{categories.map((category) => (
						<option key={category._id} value={category._id}>
							{typeof category.name === 'string' ? category.name : category.name.en || category.name.ar || ''}
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
						value={editForm.status || "draft"}
						onChange={(e) =>
							setEditForm({ ...editForm, status: e.target.value as any })
						}
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
						<option value='draft'>Draft</option>
						<option value='published'>Published</option>
						<option value='archived'>Archived</option>
					</select>
				</div>
				<div className='flex items-center'>
					<label className='flex items-center'>
						<input
							type='checkbox'
							checked={editForm.featured || false}
							onChange={(e) =>
								setEditForm({ ...editForm, featured: e.target.checked })
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
					value={editForm.tags?.join(", ") || ""}
					onChange={(e) =>
						setEditForm({
							...editForm,
							tags: e.target.value.split(",").map((tag) => tag.trim()),
						})
					}
					className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
					placeholder='Enter tags separated by commas'
				/>
			</div>
		</>
	);
};

export default PostBasicInfo;
