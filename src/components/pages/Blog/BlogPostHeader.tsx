/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	Eye,
	Heart,
	Calendar,
	User,
	Clock,
	FileText,
	Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Post, ContentBlock } from "../../../types";

interface BlogPostHeaderProps {
	post: Post;
	getTitle: () => string;
	getContent: () => ContentBlock[];
	formatDate: (dateString: string) => string;
	calculateReadingTime: (content: ContentBlock[]) => number;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
	post,
	getTitle,
	getContent,
	formatDate,
	calculateReadingTime,
}) => {
	const { t } = useTranslation();
	const { isRTL, currentLanguage } = useLanguage();

	return (
		<>
			{/* Hero Image */}
			<div className='relative'>
				<img
					src={post.postImage}
					alt={getTitle()}
					className='w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-primary-600/20'></div>

				{/* Category Badge */}
				<div className='absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4'>
					<span className='inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg border border-white/20 shadow-lg'>
						<FileText className='w-3 h-3 sm:w-4 sm:h-4 text-primary-600' />
						<span className='hidden xs:inline'>
							{(() => {
								if (typeof post.category === 'string') return post.category;
								if (post.category?.name) {
									const name = post.category.name;
									if (typeof name === 'string') return name;
									if (typeof name === 'object' && name !== null) {
										return name[currentLanguage as 'en' | 'ar'] || name.en || name.ar || 'Uncategorized';
									}
								}
								return 'Uncategorized';
							})()}
						</span>
						<span className='xs:hidden'>
							{(() => {
								let categoryName = 'Uncategorized';
								if (typeof post.category === 'string') {
									categoryName = post.category;
								} else if (post.category?.name) {
									const name = post.category.name;
									if (typeof name === 'string') {
										categoryName = name;
									} else if (typeof name === 'object' && name !== null) {
										categoryName = name[currentLanguage as 'en' | 'ar'] || name.en || name.ar || 'Uncategorized';
									}
								}
								return String(categoryName).substring(0, 8) + '...';
							})()}
						</span>
					</span>
				</div>

				{/* Featured Badge */}
				{post.featured && (
					<div className='absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4'>
						<span className='inline-flex items-center space-x-1 bg-yellow-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg shadow-lg'>
							<Star className='w-3 h-3 sm:w-4 sm:h-4' />
							<span className='hidden xs:inline'>{t("featured")}</span>
							<span className='xs:hidden'>★</span>
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className='p-4 sm:p-6 md:p-8'>
				{/* About the Author - top */}
				<div className='mb-6 sm:mb-8 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm'>
					<h3 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2'>
						<User className='w-5 h-5 sm:w-6 sm:h-6 text-primary-600' />
						<span>{t("aboutTheAuthor")}</span>
					</h3>
					<div className='flex items-center space-x-3 sm:space-x-4'>
						<div className='w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0'>
							<User className='w-6 h-6 sm:w-7 sm:h-7 text-primary-600' />
						</div>
						<div className='min-w-0 flex-1'>
							<h4 className='text-base sm:text-lg font-semibold text-gray-900 truncate'>
								{post.authorName}
							</h4>
							<p className='text-sm sm:text-base text-gray-600 truncate'>{post.authorEmail}</p>
						</div>
					</div>
				</div>

				{/* Header */}
				<header className='mb-6 sm:mb-8'>
					<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight'>
						{getTitle()}
					</h1>
					{/* Meta Information */}
					<div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base'>
						<div className='flex items-center space-x-1 sm:space-x-2'>
							<User className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0' />
							<span className='truncate max-w-[120px] sm:max-w-none'>{post.authorName}</span>
						</div>
						<div className='flex items-center space-x-1 sm:space-x-2'>
							<Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0' />
							<span className='hidden xs:inline'>{formatDate(post.createdAt)}</span>
							<span className='xs:hidden'>{new Date(post.createdAt).toLocaleDateString()}</span>
						</div>
						<div className='flex items-center space-x-1 sm:space-x-2'>
							<Clock className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0' />
							<span>
								{calculateReadingTime(getContent())} {t("minRead")}
							</span>
						</div>
						<div className='flex items-center space-x-1 sm:space-x-2'>
							<Eye className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0' />
							<span>
								{post.views} {t("views")}
							</span>
						</div>
						<div className='flex items-center space-x-1 sm:space-x-2'>
							<Heart className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0' />
							<span>
								{post.likes} {t("likes")}
							</span>
						</div>
					</div>
					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className='flex flex-wrap gap-2'>
							{post.tags.map((tag, index) => (
								<span
									key={index}
									className='px-2 sm:px-3 py-1 bg-primary-100 text-primary-700 text-xs sm:text-sm rounded-full border border-primary-200'>
									#{tag}
								</span>
							))}
						</div>
					)}
				</header>
			</div>
		</>
	);
};

export default BlogPostHeader;
