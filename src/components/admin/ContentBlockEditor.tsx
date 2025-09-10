/** @format */

import React from "react";
import { Plus, Trash2, Image as ImageIcon, Copy, ArrowUp, ArrowDown, X as XIcon } from "lucide-react";
import { ContentBlock, ContentParagraph, ContentImage } from "../../types";

interface ContentBlockEditorProps {
	blocks: ContentBlock[];
	setBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
	blocks,
	setBlocks,
}) => {
	// Helper functions for managing content blocks
	const addContentBlock = (
		blocks: ContentBlock[],
		type: "paragraph" | "image",
		newBlock: Partial<ContentParagraph> | Partial<ContentImage>
	): ContentBlock[] => {
		if (type === "paragraph") {
			const paragraphBlock = newBlock as Partial<ContentParagraph>;
			return [
				...blocks,
				{
					type: "paragraph",
					text: paragraphBlock.text || "",
					title: paragraphBlock.title || "",
				} as ContentParagraph,
			];
		} else if (type === "image") {
			const imageBlock = newBlock as Partial<ContentImage>;
			return [
				...blocks,
				{
					type: "image",
					imageUrl: imageBlock.imageUrl || "",
					imageAlt: imageBlock.imageAlt || "",
					imageCaption: imageBlock.imageCaption || "",
				} as ContentImage,
			];
		}
		return blocks;
	};

	const updateContentBlock = (
		blocks: ContentBlock[],
		index: number,
		updatedBlock: Partial<ContentParagraph> | Partial<ContentImage>
	): ContentBlock[] => {
		return blocks.map((block, i) =>
			i === index ? ({ ...block, ...updatedBlock } as ContentBlock) : block
		);
	};

	const removeContentBlock = (
		blocks: ContentBlock[],
		index: number
	): ContentBlock[] => {
		return blocks.filter((_, i) => i !== index);
	};

	const duplicateBlock = (blocks: ContentBlock[], index: number): ContentBlock[] => {
		const block = blocks[index];
		const clone = JSON.parse(JSON.stringify(block)) as ContentBlock;
		const next = [...blocks];
		next.splice(index + 1, 0, clone);
		return next;
	};

	const moveBlock = (blocks: ContentBlock[], from: number, to: number): ContentBlock[] => {
		if (to < 0 || to >= blocks.length) return blocks;
		const next = [...blocks];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		return next;
	};

	const canPreviewImage = (url: string): boolean => {
		if (!url) return false;
		const trimmed = url.trim();
		return (
			/^https?:\/\//i.test(trimmed) ||
			/^data:image\//i.test(trimmed) ||
			/^blob:/i.test(trimmed)
		);
	};

	return (
		<div className='space-y-4'>
			{blocks.map((block, index) => (
				<div key={index} className='border border-gray-200 rounded-lg p-4'>
					<div className='flex items-center justify-between mb-2'>
						<span className='text-sm font-medium text-gray-600'>
							{block.type === "paragraph" ? "Paragraph" : "Image"} Block
						</span>
						<div className='flex items-center gap-1'>
							<button
								onClick={() => setBlocks(moveBlock(blocks, index, index - 1))}
								title='Move up'
								className='p-1 rounded hover:bg-gray-100'
								disabled={index === 0}
							>
								<ArrowUp className='w-4 h-4 text-gray-600' />
							</button>
							<button
								onClick={() => setBlocks(moveBlock(blocks, index, index + 1))}
								title='Move down'
								className='p-1 rounded hover:bg-gray-100'
								disabled={index === blocks.length - 1}
							>
								<ArrowDown className='w-4 h-4 text-gray-600' />
							</button>
							<button
								onClick={() => setBlocks(duplicateBlock(blocks, index))}
								title='Duplicate'
								className='p-1 rounded hover:bg-gray-100'
							>
								<Copy className='w-4 h-4 text-gray-600' />
							</button>
							<button
								onClick={() => setBlocks(removeContentBlock(blocks, index))}
								title='Delete'
								className='p-1 text-red-500 hover:text-red-700'
							>
								<Trash2 className='w-4 h-4' />
							</button>
						</div>
					</div>

					{block.type === "paragraph" ? (
						<div className='space-y-2'>
							<input
								type='text'
								placeholder='Block title (optional)'
								value={(block as ContentParagraph).title || ""}
								onChange={(e) =>
									setBlocks(
										updateContentBlock(blocks, index, {
											title: e.target.value,
										} as Partial<ContentParagraph>)
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
							<textarea
								placeholder='Enter paragraph text...'
								value={(block as ContentParagraph).text || ""}
								onChange={(e) =>
									setBlocks(
										updateContentBlock(blocks, index, {
											text: e.target.value,
										} as Partial<ContentParagraph>)
									)
								}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
						</div>
					) : (
						<div className='space-y-2'>
							<input
								type='url'
								placeholder='Image URL'
								value={(block as ContentImage).imageUrl || ""}
								onChange={(e) =>
									setBlocks(
										updateContentBlock(blocks, index, {
											imageUrl: e.target.value,
										} as Partial<ContentImage>)
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
							{(block as ContentImage).imageUrl && canPreviewImage((block as ContentImage).imageUrl as string) && (
								<div className='relative mt-2 w-28 h-28 rounded border overflow-hidden'>
									<img src={(block as ContentImage).imageUrl as string} alt={(block as ContentImage).imageAlt || 'preview'} className='w-full h-full object-cover' />
									<button
										type='button'
										onClick={() => setBlocks(updateContentBlock(blocks, index, { imageUrl: "" } as Partial<ContentImage>))}
										className='absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
										title='Clear image'
									>
										<XIcon className='w-3 h-3' />
									</button>
								</div>
							)}
							<input
								type='text'
								placeholder='Image alt text'
								value={(block as ContentImage).imageAlt || ""}
								onChange={(e) =>
									setBlocks(
										updateContentBlock(blocks, index, {
											imageAlt: e.target.value,
										} as Partial<ContentImage>)
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
							<input
								type='text'
								placeholder='Image caption (optional)'
								value={(block as ContentImage).imageCaption || ""}
								onChange={(e) =>
									setBlocks(
										updateContentBlock(blocks, index, {
											imageCaption: e.target.value,
										} as Partial<ContentImage>)
									)
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							/>
						</div>
					)}
				</div>
			))}

			<div className='flex gap-2'>
				<button
					onClick={() =>
						setBlocks(
							addContentBlock(blocks, "paragraph", { text: "", title: "" })
						)
					}
					className='flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors'>
					<Plus className='w-4 h-4' />
					Add Paragraph
				</button>
				<button
					onClick={() =>
						setBlocks(
							addContentBlock(blocks, "image", {
								imageUrl: "",
								imageAlt: "",
								imageCaption: "",
							})
						)
					}
					className='flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors'>
					<ImageIcon className='w-4 h-4' />
					Add Image
				</button>
			</div>
		</div>
	);
};

export default ContentBlockEditor;
