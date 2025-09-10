/** @format */

import React from "react";
import { motion } from "framer-motion";
import SectionDivider from "./SectionDivider";

const DiagonalDividerDemo: React.FC = () => {
	const dividerVariants = [
		{ name: "Diagonal", variant: "diagonal", color: "#f8fafc", height: 80 },
		{
			name: "Diagonal Asymmetric",
			variant: "diagonal-asymmetric",
			color: "#e2e8f0",
			height: 80,
		},
		{
			name: "Wave Diagonal",
			variant: "wave-diagonal",
			color: "#f1f5f9",
			height: 100,
		},
		{
			name: "Stepped Diagonal",
			variant: "stepped-diagonal",
			color: "#e2e8f0",
			height: 80,
		},
		{ name: "Zigzag", variant: "zigzag", color: "#f8fafc", height: 80 },
		{
			name: "Diagonal (Reversed)",
			variant: "diagonal",
			color: "#e2e8f0",
			height: 80,
			reverse: true,
		},
		{
			name: "Wave Diagonal (Reversed)",
			variant: "wave-diagonal",
			color: "#f1f5f9",
			height: 100,
			reverse: true,
		},
	];

	return (
		<section className='py-20 bg-gradient-to-br from-gray-50 to-white'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
						Diagonal Divider Showcase
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						Explore different diagonal and slanted divider styles that create
						dynamic visual flow between sections.
					</p>
				</motion.div>

				<div className='space-y-16'>
					{dividerVariants.map((divider, index) => (
						<motion.div
							key={divider.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className='relative'>
							{/* Top Section */}
							<div className='bg-gradient-to-r from-teal-500 to-blue-600 text-white p-8 rounded-t-2xl'>
								<h3 className='text-2xl font-semibold mb-2'>
									Section {index + 1}
								</h3>
								<p className='text-teal-100'>
									This section demonstrates the "{divider.name}" divider
									variant.
								</p>
							</div>

							{/* Divider */}
							<div className='relative z-10'>
								<SectionDivider
									variant={divider.variant as any}
									color={divider.color}
									height={divider.height}
									reverse={divider.reverse}
								/>
							</div>

							{/* Bottom Section */}
							<div className='bg-white p-8 rounded-b-2xl shadow-lg border border-gray-100'>
								<h4 className='text-xl font-semibold text-gray-900 mb-3'>
									{divider.name} Divider
								</h4>
								<div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
									<div>
										<span className='font-medium'>Variant:</span>{" "}
										{divider.variant}
									</div>
									<div>
										<span className='font-medium'>Height:</span>{" "}
										{divider.height}px
									</div>
									<div>
										<span className='font-medium'>Color:</span> {divider.color}
									</div>
									<div>
										<span className='font-medium'>Reversed:</span>{" "}
										{divider.reverse ? "Yes" : "No"}
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Usage Instructions */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className='mt-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-2xl'>
					<h3 className='text-2xl font-semibold mb-4'>How to Use</h3>
					<div className='grid md:grid-cols-2 gap-6'>
						<div>
							<h4 className='text-lg font-medium text-teal-300 mb-2'>
								Basic Usage
							</h4>
							<pre className='bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto'>
								{`<SectionDivider 
  variant="wave-diagonal" 
  color="#f8fafc" 
  height={100} 
/>`}
							</pre>
						</div>
						<div>
							<h4 className='text-lg font-medium text-teal-300 mb-2'>
								With Reverse
							</h4>
							<pre className='bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto'>
								{`<SectionDivider 
  variant="diagonal-asymmetric" 
  color="#f1f5f9" 
  height={80} 
  reverse={true}
/>`}
							</pre>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default DiagonalDividerDemo;
