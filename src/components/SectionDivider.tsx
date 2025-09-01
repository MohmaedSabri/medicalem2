/** @format */

import React from "react";
import { motion } from "framer-motion";

interface SectionDividerProps {
	variant?:
		| "curve-up"
		| "curve-down"
		| "wave"
		| "diagonal"
		| "diagonal-asymmetric"
		| "wave-diagonal"
		| "stepped-diagonal"
		| "zigzag";
	color?: string;
	height?: number;
	className?: string;
	reverse?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
	variant = "curve-up",
	color = "#f8fafc",
	height = 80,
	className = "",
	reverse = false,
}) => {
	const renderDivider = () => {
		switch (variant) {
			case "curve-up":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height}V0C240 ${height * 0.3} 480 ${height * 0.5} 720 ${
								height * 0.3
							}C960 ${height * 0.1} 1200 0 1440 ${height * 0.2}V${height}H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "curve-down":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 0V${height}C240 ${height * 0.7} 480 ${height * 0.5} 720 ${
								height * 0.7
							}C960 ${height * 0.9} 1200 ${height} 1440 ${height * 0.8}V0H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "wave":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height * 0.5}C240 ${height * 0.3} 480 ${
								height * 0.7
							} 720 ${height * 0.5}C960 ${height * 0.3} 1200 ${
								height * 0.7
							} 1440 ${height * 0.5}V${height}H0V${height * 0.5}Z`}
							fill={color}
						/>
					</svg>
				);
			case "diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path d={`M0 ${height}L1440 0V${height}H0Z`} fill={color} />
					</svg>
				);
			case "diagonal-asymmetric":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height}L960 ${height * 0.3}L1440 0V${height}H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "wave-diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height}L360 ${height * 0.8}L720 ${height * 0.4}L1080 ${
								height * 0.2
							}L1440 0V${height}H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "stepped-diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height}L480 ${height * 0.7}L480 ${height * 0.5}L960 ${
								height * 0.3
							}L960 ${height * 0.1}L1440 0V${height}H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "zigzag":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 ${height}L240 ${height * 0.6}L480 ${height * 0.8}L720 ${
								height * 0.4
							}L960 ${height * 0.9}L1200 ${height * 0.2}L1440 ${
								height * 0.7
							}L1440 ${height}H0Z`}
							fill={color}
						/>
					</svg>
				);
			default:
				return null;
		}
	};

	// Reverse the divider if needed
	const renderReversedDivider = () => {
		if (!reverse) return renderDivider();

		switch (variant) {
			case "diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path d={`M0 0L1440 ${height}V0H0Z`} fill={color} />
					</svg>
				);
			case "diagonal-asymmetric":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 0L960 ${height * 0.7}L1440 ${height}V0H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "wave-diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 0L360 ${height * 0.2}L720 ${height * 0.6}L1080 ${
								height * 0.8
							}L1440 ${height}V0H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "stepped-diagonal":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 0L480 ${height * 0.3}L480 ${height * 0.5}L960 ${
								height * 0.7
							}L960 ${height * 0.9}L1440 ${height}V0H0Z`}
							fill={color}
						/>
					</svg>
				);
			case "zigzag":
				return (
					<svg
						viewBox={`0 0 1440 ${height}`}
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full h-auto'
						preserveAspectRatio='none'>
						<path
							d={`M0 0L240 ${height * 0.4}L480 ${height * 0.2}L720 ${
								height * 0.6
							}L960 ${height * 0.1}L1200 ${height * 0.8}L1440 ${
								height * 0.3
							}L1440 0H0Z`}
							fill={color}
						/>
					</svg>
				);
			default:
				return renderDivider();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, scaleY: 0 }}
			whileInView={{ opacity: 1, scaleY: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className={`w-full ${className}`}
			style={{ position: "relative" }}>
			{renderReversedDivider()}
		</motion.div>
	);
};

export default SectionDivider;
