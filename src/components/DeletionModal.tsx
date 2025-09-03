/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

interface DeletionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	itemName: string;
	itemDescription?: string;
	isDeleting?: boolean;
	type?:
		| "product"
		| "category"
		| "subcategory"
		| "post"
		| "comment"
		| "generic";
}

const DeletionModal: React.FC<DeletionModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	itemName,
	itemDescription,
	isDeleting = false,
	type = "generic",
}) => {
	const { isRTL } = useLanguage();
	const { t } = useTranslation();

	if (!isOpen) return null;

	const getTypeIcon = () => {
		switch (type) {
			case "product":
				return "📦";
			case "category":
				return "🏷️";
			case "subcategory":
				return "📁";
			case "post":
				return "📄";
			case "comment":
				return "💬";
			default:
				return "⚠️";
		}
	};

	const getTypeColor = () => {
		switch (type) {
			case "product":
				return "bg-blue-50 border-blue-200 text-blue-800";
			case "category":
				return "bg-teal-50 border-teal-200 text-teal-800";
			case "subcategory":
				return "bg-purple-50 border-purple-200 text-purple-800";
			case "post":
				return "bg-indigo-50 border-indigo-200 text-indigo-800";
			case "comment":
				return "bg-gray-50 border-gray-200 text-gray-800";
			default:
				return "bg-red-50 border-red-200 text-red-800";
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
			onClick={onClose}>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className='bg-white rounded-xl shadow-2xl w-full max-w-md mx-4'
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<div className='flex items-center space-x-3'>
						<div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
							<AlertTriangle className='h-5 w-5 text-red-600' />
						</div>
						<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
					</div>
					<button
						onClick={onClose}
						disabled={isDeleting}
						className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Content */}
				<div className='p-6'>
					<p className='text-gray-600 mb-6'>{description}</p>

					{/* Item to delete */}
					<div className={`border rounded-lg p-4 mb-6 ${getTypeColor()}`}>
						<div className='flex items-start space-x-3'>
							<span className='text-2xl'>{getTypeIcon()}</span>
							<div className='flex-1'>
								<p className='font-medium text-sm mb-1'>
									{t("itemToDelete", { defaultValue: "Item to delete:" })}
								</p>
								<p className='font-semibold'>{itemName}</p>
								{itemDescription && (
									<p className='text-sm opacity-75 mt-1'>{itemDescription}</p>
								)}
							</div>
						</div>
					</div>

					{/* Warning */}
					<div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
						<div className='flex items-start space-x-3'>
							<Trash2 className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
							<div>
								<p className='text-sm font-medium text-red-800'>
									{t("warning", { defaultValue: "Warning" })}
								</p>
								<p className='text-sm text-red-700 mt-1'>
									{t("deletionWarning", {
										defaultValue:
											"This action cannot be undone. All associated data will be permanently removed.",
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div
						className={`flex ${
							isRTL ? "space-x-reverse space-x-3" : "space-x-3"
						}`}>
						<button
							onClick={onClose}
							disabled={isDeleting}
							className='flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
							{t("cancel", { defaultValue: "Cancel" })}
						</button>
						<button
							onClick={onConfirm}
							disabled={isDeleting}
							className='flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'>
							{isDeleting ? (
								<>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									<span>{t("deleting", { defaultValue: "Deleting..." })}</span>
								</>
							) : (
								<>
									<Trash2 className='w-4 h-4' />
									<span>{t("delete", { defaultValue: "Delete" })}</span>
								</>
							)}
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default DeletionModal;
