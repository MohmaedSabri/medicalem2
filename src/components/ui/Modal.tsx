/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children?: React.ReactNode;
	maxWidthClassName?: string; // e.g., 'max-w-md', 'max-w-lg'
}

function AppModal({ isOpen, onClose, title, children, maxWidthClassName = "max-w-lg" }: ModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
					onClick={onClose}>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className={`w-full ${maxWidthClassName} rounded-xl bg-white shadow-2xl`}
						onClick={(e) => e.stopPropagation()}>
						<div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
							<h3 className='text-base font-semibold text-gray-900'>{title}</h3>
							<button
								onClick={onClose}
								className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
								<X className='w-5 h-5' />
							</button>
						</div>
						<div className='p-4'>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default AppModal;


