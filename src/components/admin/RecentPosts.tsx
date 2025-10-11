/** @format */

import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

interface Post {
	_id: string;
	title: string | { en: string; ar: string };
	authorName: string;
	category: string | { _id: string; name: string | { en: string; ar: string } };
	status: string;
	featured: boolean;
}

interface RecentPostsProps {
	posts: Post[];
	postsLoading: boolean;
	getLocalizedText: (value: unknown) => string;
}

const RecentPosts: React.FC<RecentPostsProps> = ({
	posts,
	postsLoading,
	getLocalizedText,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
			className='bg-white rounded-xl shadow-sm p-6'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>
				{t("recentPosts")}
			</h3>
			{postsLoading ? (
				<div className='space-y-3'>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className={`flex items-center ${
								isRTL
									? "flex-row-reverse space-x-reverse space-x-3"
									: "space-x-3"
							}`}>
							<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
							<div
								className={`flex-1 ${
									isRTL ? "text-right" : "text-left"
								}`}>
								<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
								<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
							</div>
						</div>
					))}
				</div>
			) : posts.length > 0 ? (
				<div className='space-y-3'>
					{posts.slice(0, 3).map((post) => (
						<div
							key={post._id}
							className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${
								isRTL
									? "flex-row-reverse space-x-reverse space-x-3"
									: "space-x-3"
							}`}>
							<div className='w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center'>
								<FileText className='h-5 w-5 text-indigo-600' />
							</div>
							<div
								className={`flex-1 ${
									isRTL ? "text-right" : "text-left"
								}`}>
								<p className='font-medium text-gray-900 line-clamp-1'>
									{getLocalizedText(post.title)}
								</p>
								<p className='text-sm text-gray-500'>
									{post.authorName}
								</p>
								<p className='text-xs text-gray-400'>
									{getLocalizedText(post.category)}
								</p>
							</div>
							<div
								className={`flex flex-col space-y-1 ${
									isRTL ? "items-start" : "items-end"
								}`}>
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										post.status === "published"
											? "bg-primary-100 text-primary-800"
											: post.status === "draft"
											? "bg-yellow-100 text-yellow-800"
											: "bg-gray-100 text-gray-800"
									}`}>
									{post.status}
								</span>
								{post.featured && (
									<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
										{t("featured")}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className='text-gray-500 text-center py-8'>
					{t("noPostsYet")}
				</p>
			)}
		</motion.div>
	);
};

export default RecentPosts;
