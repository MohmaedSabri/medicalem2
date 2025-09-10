/** @format */

import React from "react";
import { FileText } from "lucide-react";
import { ContentBlock } from "../../../types";

interface BlogPostContentProps {
	content: ContentBlock[];
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
	return (
		<article className='prose prose-sm sm:prose-base md:prose-lg max-w-none mb-6 sm:mb-8 px-4 sm:px-6 md:px-8'>
			<div className='text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg'>
				{content.map((block, index) => (
					<div key={index} className='mb-4 sm:mb-6'>
						{block.type === "paragraph" ? (
							<div>
								{block.title && (
									<h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight'>
										{block.title}
									</h3>
								)}
								<p className='leading-relaxed sm:leading-loose'>{block.text}</p>
							</div>
						) : block.type === "image" ? (
							<div className='my-4 sm:my-6 md:my-8'>
								<img
									src={block.imageUrl}
									alt={block.imageAlt || "Post image"}
									className='w-full h-auto rounded-md sm:rounded-lg shadow-lg'
									loading='lazy'
									onError={(e) => {
										e.currentTarget.style.display = "none";
										const fallback = e.currentTarget
											.nextElementSibling as HTMLElement;
										if (fallback) {
											fallback.style.display = "block";
										}
									}}
									onLoad={() => {}}
								/>
								<div
									className='w-full h-32 sm:h-40 md:h-48  rounded-md sm:rounded-lg shadow-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200'
									style={{ display: "none" }}>
									<div className='text-center p-2 sm:p-4'>
										<FileText className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 text-gray-400' />
										<p className='text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2'>
											Image unavailable
										</p>
										<p className='text-xs text-gray-400 break-all max-w-[200px] sm:max-w-xs'>
											{block.imageUrl}
										</p>
									</div>
								</div>
								{block.imageCaption && (
									<p className='text-xs sm:text-sm text-gray-600 italic mt-2 text-center px-2'>
										{block.imageCaption}
									</p>
								)}
							</div>
						) : null}
					</div>
				))}
			</div>
		</article>
	);
};

export default BlogPostContent;
