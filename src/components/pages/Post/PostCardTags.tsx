/** @format */

import React from "react";

interface PostCardTagsProps {
	tags: string[];
	variant?: "default" | "featured" | "compact" | "management";
}

const PostCardTags: React.FC<PostCardTagsProps> = ({ tags, variant = "default" }) => {
	if (!tags || tags.length === 0) {
		return null;
	}

	const getTagSize = () => {
		switch (variant) {
			case "compact":
				return "px-2 py-1 text-xs";
			case "management":
				return "px-4 py-2 text-sm";
			default:
				return "px-2 sm:px-3 py-1 text-xs sm:text-sm";
		}
	};

	return (
		<div className="flex flex-wrap gap-2 sm:gap-3">
			{tags.map((tag, tagIndex) => (
				<span
					key={tagIndex}
					className={`${getTagSize()} bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 rounded-full border border-teal-200 font-medium`}>
					#{tag}
				</span>
			))}
		</div>
	);
};

export default PostCardTags;
