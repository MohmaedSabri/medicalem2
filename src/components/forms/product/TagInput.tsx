/** @format */

import React, { useState } from "react";
import { X } from "lucide-react";

type TagInputProps = {
	label: string;
	placeholder?: string;
	tags: string[];
	onAdd: (value: string) => void;
	onRemove: (index: number) => void;
};

const TagInput: React.FC<TagInputProps> = ({ label, placeholder, tags, onAdd, onRemove }) => {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		const value = inputValue.trim();
		if (value) {
			onAdd(value);
			setInputValue("");
		}
	};

	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
			<div className='flex space-x-2 mb-2'>
				<input
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
					placeholder={placeholder}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAdd();
						}
					}}
				/>
				<button
					type='button'
					onClick={handleAdd}
					className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
					Add
				</button>
			</div>
			{tags.length > 0 && (
				<div className='flex flex-wrap gap-2'>
					{tags.map((tag, index) => (
						<span key={index} className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800'>
							{tag}
							<button
								type='button'
								onClick={() => onRemove(index)}
								className='ml-2 text-gray-600 hover:text-gray-800'>
								<X className='h-4 w-4' />
								</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
};

export default TagInput;


