/** @format */

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Post } from "../../../types";

interface PostCardActionsProps {
	post: Post;
	titleText: string;
	onEdit?: (post: Post) => void;
	onDelete?: (postId: string, postTitle: string) => void;
}

const PostCardActions: React.FC<PostCardActionsProps> = ({
	post,
	titleText,
	onEdit,
	onDelete,
}) => {
	if (!onEdit || !onDelete) {
		return null;
	}

	return (
		<div className="flex items-center space-x-3">
			<button
				onClick={() => onEdit(post)}
				className="p-3 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 hover:scale-105"
				title="Edit post">
				<Edit className="w-5 h-5" />
			</button>
			<button
				onClick={() => onDelete(post._id, titleText)}
				className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-100"
				title="Delete post">
				<Trash2 className="w-5 h-5" />
			</button>
		</div>
	);
};

export default PostCardActions;
