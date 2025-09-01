/** @format */

import React from "react";

interface SectionBridgeProps {
	variant?: "overlap" | "floating" | "connected" | "gradient";
	children?: React.ReactNode;
	className?: string;
	height?: number;
}

const SectionBridge: React.FC<SectionBridgeProps> = ({
	variant = "overlap",
	children,
	className = "",
	height = 120,
}) => {
	const renderBridge = () => {
		switch (variant) {
			case "overlap":
				return (
					<div className={`relative -mt-16 ${className}`}>
						<div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white' />
						<div className='relative z-10'>{children}</div>
					</div>
				);
			case "floating":
				return (
					<div className={`relative -mt-12 ${className}`}>
						<div className='relative z-10 bg-white rounded-2xl shadow-lg p-6 mx-4 border border-gray-100'>
							{children}
						</div>
					</div>
				);
			case "connected":
				return (
					<div className={`relative ${className}`}>
						<div className='relative z-10 flex items-center justify-center py-6'>
							<div className='w-1 h-12 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full mx-2' />
							<div className='w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mx-2' />
							<div className='w-1 h-12 bg-gradient-to-b from-purple-500 to-teal-500 rounded-full mx-2' />
						</div>
						{children && (
							<div className='relative z-10 text-center'>{children}</div>
						)}
					</div>
				);
			case "gradient":
				return (
					<div className={`relative ${className}`}>
						<div className='absolute inset-0 bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50' />
						<div className='relative z-10'>{children}</div>
					</div>
				);
			default:
				return <div className={className}>{children}</div>;
		}
	};

	return renderBridge();
};

export default SectionBridge;
