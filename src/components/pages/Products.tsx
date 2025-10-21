/** @format */

import React, { useState, useEffect } from "react";
import { ArrowRight, Star, Zap } from "lucide-react";

const Products: React.FC = () => {
	const allProducts = [
		{
			_id: "1",
			name: "Advanced Medical Scanner",
			description:
				"State-of-the-art diagnostic imaging equipment with AI-powered analysis capabilities.",
			subcategory: { name: "Diagnostic" },
			image:
				"https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			_id: "2",
			name: "Smart Patient Monitor",
			description:
				"Real-time vital signs monitoring system with cloud connectivity and alerts.",
			subcategory: { name: "Monitoring" },
			image:
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			_id: "3",
			name: "Digital X-Ray System",
			description:
				"High-resolution imaging system with instant digital results and cloud storage.",
			subcategory: { name: "Imaging" },
			image:
				"https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
	];

	const [visibleProducts, setVisibleProducts] = useState([
		allProducts[0],
		allProducts[1],
	]);
	const [currentIndex, setCurrentIndex] = useState(2);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);

			setTimeout(() => {
				setVisibleProducts((prev) => {
					const newProducts = [...prev];
					newProducts[1] = allProducts[currentIndex % allProducts.length];
					return newProducts;
				});
				setCurrentIndex((prev) => prev + 1);
				setIsAnimating(false);
			}, 1000);
		}, 4000);

		return () => clearInterval(interval);
	}, [currentIndex]);

	const displayProducts = visibleProducts;

	return (
		<section
			id='products'
			className='py-6 sm:py-8 md:py-10 lg:py-12 relative overflow-hidden pb-16'>
			<style>{`
				@keyframes slideInFromRight {
					0% {
						transform: translateX(100%);
						opacity: 0;
					}
					100% {
						transform: translateX(0);
						opacity: 1;
					}
				}

				@keyframes slideOutToLeft {
					0% {
						transform: translateX(0);
						opacity: 1;
					}
					100% {
						transform: translateX(-100%);
						opacity: 0;
					}
				}

				.animate-slide-in {
					animation: slideInFromRight 1s ease-out forwards;
				}

				.animate-slide-out {
					animation: slideOutToLeft 1s ease-out forwards;
				}
			`}</style>

			<div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10'>
				<div className='text-center mb-6 sm:mb-8 md:mb-10'>
					<div className='inline-flex items-center space-x-1.5 sm:space-x-2 bg-primary-50 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full border border-primary-200 mb-3 sm:mb-4 md:mb-6'>
						<span className='text-primary-700 font-medium text-xs sm:text-sm md:text-base'>
							Premium Medical Equipment
						</span>
					</div>

					<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-600 mb-3 sm:mb-4 md:mb-6 px-2'>
						Featured Products
					</h2>
					<p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-2 md:px-0'>
						Discover our cutting-edge medical equipment designed for excellence
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto'>
					{displayProducts.map((product, index) => (
						<div
							key={product._id}
							className={`group relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ${
								index === 1 && isAnimating ? "animate-slide-in" : ""
							}`}>
							<div className='relative overflow-hidden h-72 md:h-96'>
								<div className='relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200'>
									<img
										src={product.image}
										alt={product.name}
										className='w-full h-full object-cover transition-all duration-500 group-hover:scale-105'
									/>

									<div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-primary-600/20'></div>

									<div className='absolute top-4 left-4'>
										<span className='inline-flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-sm'>
											<Star className='w-3 h-3 text-primary-600' />
											<span>{product.subcategory.name}</span>
										</span>
									</div>

									<div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
										<div className='text-center'>
											<div className='w-16 h-16 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center'>
												<Zap className='w-8 h-8 text-primary-600' />
											</div>
											<p className='text-primary-700 font-medium text-sm'>
												Medical Equipment
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className='p-6 md:p-8'>
								<div className='h-full flex flex-col'>
									<h3 className='text-2xl md:text-3xl font-semibold text-gray-900 mb-3 line-clamp-2'>
										{product.name}
									</h3>

									<p className='text-base md:text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-1'>
										{product.description}
									</p>

									<div className='flex flex-col sm:flex-row gap-3 mt-auto'>
										<button className='inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm'>
											<span>Learn More</span>
											<ArrowRight className='w-4 h-4' />
										</button>

										<button className='inline-flex items-center justify-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm'>
											<span>Request Demo</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className='text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20'>
					<button className='group relative inline-flex items-center space-x-2 sm:space-x-3 md:space-x-4 bg-white text-primary-600 border-2 border-primary-600 px-4 py-2.5 sm:px-6 sm:py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-semibold shadow-lg sm:shadow-xl hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-400 hover:bg-primary-600 hover:text-white text-sm sm:text-base transition-all duration-500 ease-out overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out rounded-lg sm:rounded-xl md:rounded-2xl'></div>

						<div className='relative z-10 flex items-center justify-center'>
							<span className='group-hover:drop-shadow-lg transition-all duration-300'>
								View All Products
							</span>
							<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 ease-out' />
						</div>
					</button>
				</div>
			</div>
		</section>
	);
};

function App() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Products />
		</div>
	);
}

export default App;
