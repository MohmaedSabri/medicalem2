/** @format */

import React from "react";
import { Plus, X } from "lucide-react";

type ImageUrlsInputProps = {
	label?: string;
	images: string[];
	onAdd: (url: string) => void;
	onRemove: (index: number) => void;
};

const ImageUrlsInput: React.FC<ImageUrlsInputProps> = ({ label = "Product Images", images, onAdd, onRemove }) => {
	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				{label}
			</label>
			<div className='space-y-3'>
				<div className='flex gap-2'>
					<div className='flex-1 relative'>
						<input
							type='url'
							placeholder='https://example.com/image.jpg'
							className='block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								const target = e.target as HTMLInputElement;
								if (target.value.trim()) {
									onAdd(target.value.trim());
									target.value = "";
								}
							}
							}}
						/>
					</div>
					<button
						type='button'
						onClick={() => {
							const input = document.querySelector(
								'input[type="url"]'
							) as HTMLInputElement | null;
							if (input && input.value.trim()) {
								onAdd(input.value.trim());
								input.value = "";
							}
						}}
						className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2'>
						<Plus className='h-4 w-4' />
						Add
					</button>
				</div>

				{images.length > 0 && (
					<div className='space-y-2'>
						<p className='text-sm text-gray-600'>Current Images ({images.length}):</p>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
							{images.map((imageUrl, index) => (
								<div key={index} className='relative group'>
									<img
										src={imageUrl}
										alt={`Product image ${index + 1}`}
										className='w-full h-24 object-cover rounded-lg border border-gray-200'
										onError={(e) => {
											e.currentTarget.src =
												"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
										}}
									/>
									<button
										type='button'
										onClick={() => onRemove(index)}
										className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'>
										<X className='h-3 w-3' />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				<p className='text-sm text-gray-500'>Add one or more image URLs. Press Enter or click Add to include each image.</p>
			</div>
		</div>
	);
};

export default ImageUrlsInput;


