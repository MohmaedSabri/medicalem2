/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Plus,
	Package,
	LogOut,
	Menu,
	X,
	Tag,
	FileText,
	Globe,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../contexts/CategoriesContext";
import { useSubCategories } from "../hooks/useSubCategories";
import { usePosts } from "../hooks/usePosts";
import AddProductForm from "./AddProductForm";
import ManageProducts from "./ManageProducts";
import ManageCategories from "./ManageCategories";
import ManageSubCategories from "./ManageSubCategories";
import AddPostForm from "./AddPostForm";
import ManagePosts from "./ManagePosts";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const { isRTL, currentLanguage, changeLanguage } = useLanguage();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'object' && value !== null) {
			const valueObj = value as Record<string, any>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || '';
		}
		return '';
	};
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Use the products hook to get real-time data
	const { data: apiProducts = [], isLoading: productsLoading } = useProducts();

	// Use the categories context to get real-time data
	const { categories, loading: categoriesLoading } = useCategories();

	// Use the subcategories hook to get real-time data
	const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubCategories();

	// Use the posts hook to get real-time data with language support
	const { data: postsData = { posts: [] }, isLoading: postsLoading } = usePosts({ limit: 100 }, currentLanguage);

	// Transform API products to local format for display
	const products = (apiProducts || []).map((product) => ({
		id: product._id,
		name: getLocalizedText(product.name),
		price: product.price,
		image: product.image,
		inStock: product.inStock,
		averageRating: product.averageRating || 0,
		subcategory: typeof product.subcategory === 'string' ? product.subcategory : (product.subcategory?._id || ''),
	})) as Array<{
		id: string;
		name: string;
		price: number;
		image: string;
		inStock: boolean;
		averageRating: number;
		subcategory: string;
	}>;

	// Helper function to get subcategory name by ID or object
	const getSubcategoryName = (
		subcategoryValue: string | { _id: string; name: string; description: string }
	): string => {
		if (typeof subcategoryValue === "string") {
			const subcategory = subcategories.find((sub) => sub._id === subcategoryValue);
			return subcategory ? getLocalizedText(subcategory.name) : subcategoryValue;
		}
		return getLocalizedText(subcategoryValue.name);
	};

	// Helper function to get product count for a category (using subcategories)
	const getProductCountForCategory = (category: {
		_id: string;
		name: string | { en: string; ar: string };
	}): number => {
		// Get all subcategories that belong to this category
		const categorySubcategories = subcategories.filter(
			(sub) => typeof sub.parentCategory === 'string' 
				? sub.parentCategory === category._id 
				: sub.parentCategory._id === category._id
		);
		
		// Count products that belong to any of these subcategories
		return products.filter((product) => 
			categorySubcategories.some((sub) => sub._id === product.subcategory)
		).length;
	};

	// Sync active tab with query string (?tab=...)
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tab = params.get("tab");
		if (tab && tab !== activeTab) {
			setActiveTab(tab);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (activeTab) {
			params.set("tab", activeTab);
			navigate(
				{ pathname: "/dashboard", search: params.toString() },
				{ replace: true }
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const sidebarItems = [
		{ id: "dashboard", label: t('dashboard'), icon: LayoutDashboard },
		{ id: "add-product", label: t('addProduct'), icon: Plus },
		{ id: "products", label: t('manageProducts'), icon: Package },
		{ id: "categories", label: t('manageCategories'), icon: Tag },
		{ id: "subcategories", label: t('manageSubCategories'), icon: Tag },
		{ id: "add-post", label: t('addPost'), icon: FileText },
		{ id: "posts", label: t('managePosts'), icon: FileText },
	];

	const titleByTab = useMemo<Record<string, string>>(
		() => ({
			dashboard: t('dashboard'),
			"add-product": t('addProduct'),
			products: t('manageProducts'),
			categories: t('manageCategories'),
			subcategories: t('manageSubCategories'),
			"add-post": t('addPost'),
			posts: t('managePosts'),
		}),
		[t]
	);

	// Calculate real-time statistics
	const dashboardStats = useMemo(() => {
		const totalProducts = products.length;
		const inStockProducts = products.filter((p) => p.inStock).length;
		const totalValue = products.reduce((sum, p) => sum + p.price, 0);
		const avgRating =
			products.length > 0
				? (
						products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length
				  ).toFixed(1)
				: "0.0";
		const totalCategories = categories.length;
		const categoriesWithProducts = categories.filter((category) =>
			products.some((product) => product.subcategory === category._id)
		).length;
		const totalPosts = postsData.posts.length;
		const publishedPosts = postsData.posts.filter((p) => p.status === "published").length;
		const featuredPosts = postsData.posts.filter((p) => p.featured).length;

		return [
			{
				label: t('totalProducts'),
				value: totalProducts.toString(),
				color: "bg-blue-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t('inStock'),
				value: inStockProducts.toString(),
				color: "bg-green-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t('totalCategories'),
				value: totalCategories.toString(),
				color: "bg-teal-500",
				icon: Tag,
				loading: categoriesLoading,
			},
			{
				label: t('activeCategories'),
				value: categoriesWithProducts.toString(),
				color: "bg-purple-500",
				icon: Tag,
				loading: categoriesLoading || subcategoriesLoading,
			},
			{
				label: t('totalPosts'),
				value: totalPosts.toString(),
				color: "bg-indigo-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t('publishedPosts'),
				value: publishedPosts.toString(),
				color: "bg-green-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t('featuredPosts'),
				value: featuredPosts.toString(),
				color: "bg-yellow-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t('totalValue'),
				value: `$${(totalValue / 1000).toFixed(1)}K`,
				color: "bg-orange-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t('avgRating'),
				value: avgRating,
				color: "bg-indigo-500",
				icon: Package,
				loading: productsLoading,
			},
		];
	}, [products, productsLoading, categories, categoriesLoading, subcategories, subcategoriesLoading, postsData.posts, postsLoading, t]);

	const renderContent = () => {
		switch (activeTab) {
			case "add-product":
				return <AddProductForm />;
			case "products":
				return <ManageProducts />;
			case "categories":
				return <ManageCategories />;
			case "subcategories":
				return <ManageSubCategories />;
			case "add-post":
				return <AddPostForm onClose={() => setActiveTab("dashboard")} />;
			case "posts":
				return <ManagePosts />;
			case "dashboard":
			default:
				return (
					<div className='space-y-6'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h2 className='text-2xl font-bold text-gray-900 mb-4'>
								{t('welcomeBack')}, {user?.name}!
							</h2>
							<p className='text-gray-600'>
								{t('overviewDescription')}
							</p>
						</motion.div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{dashboardStats.map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-600 mb-1'>
												{stat.label}
											</p>
											{stat.loading ? (
												<div className='h-8 w-16 bg-gray-200 rounded animate-pulse'></div>
											) : (
												<p className='text-2xl font-bold text-gray-900'>
													{stat.value}
												</p>
											)}
										</div>
										<div
											className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
											<stat.icon className='h-6 w-6 text-white' />
										</div>
									</div>
								</motion.div>
							))}
						</div>

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Recent Products */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className='bg-white rounded-xl shadow-sm p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									{t('recentProducts')}
								</h3>
								{productsLoading ? (
									<div className='space-y-3'>
										{[...Array(3)].map((_, i) => (
											<div key={i} className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
												<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
												<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
													<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
													<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
												</div>
											</div>
										))}
									</div>
								) : products.length > 0 ? (
									<div className='space-y-3'>
										{products.slice(0, 3).map((product) => (
											<div
												key={product.id}
												className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
												<img
													src={product.image}
													alt={product.name}
													className='w-10 h-10 rounded-lg object-cover'
												/>
												<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
													<p className='font-medium text-gray-900'>
														{product.name}
													</p>
													<p className='text-sm text-gray-500'>
														{t('currencySymbol')} {product.price.toLocaleString()}
													</p>
													<p className='text-xs text-gray-400'>
														{getSubcategoryName(product.subcategory)}
													</p>
												</div>
												<div
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														product.inStock
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}>
													{product.inStock ? t('inStock') : t('outOfStock')}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className='text-gray-500 text-center py-8'>
										{t('noProductsYet')}
									</p>
								)}
							</motion.div>

							{/* Recent Categories */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className='bg-white rounded-xl shadow-sm p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									{t('recentCategories')}
								</h3>
								{categoriesLoading ? (
									<div className='space-y-3'>
										{[...Array(3)].map((_, i) => (
											<div key={i} className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
												<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
												<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
													<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
													<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
												</div>
											</div>
										))}
									</div>
								) : categories.length > 0 ? (
									<div className='space-y-3'>
										{categories.slice(0, 3).map((category) => {
											const productCount = getProductCountForCategory(category);

											return (
												<div
													key={category._id}
													className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
													<div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
														<Tag className='h-5 w-5 text-teal-600' />
													</div>
													<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
														<p className='font-medium text-gray-900'>
															{getLocalizedText(category.name)}
														</p>
														<p className='text-sm text-gray-500'>
															{productCount} {t('products')}
														</p>
													</div>
													<div className='px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
														{productCount > 0 ? t('active') : t('empty')}
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<p className='text-gray-500 text-center py-8'>
										{t('noCategoriesYet')}
									</p>
								)}
							</motion.div>
						</div>

						{/* Recent Posts Section */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t('recentPosts')}
							</h3>
							{postsLoading ? (
								<div className='space-y-3'>
									{[...Array(3)].map((_, i) => (
										<div key={i} className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
											<div className='w-10 h-10 bg-gray-200 rounded animate-pulse'></div>
											<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
												<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2'></div>
												<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
											</div>
										</div>
									))}
								</div>
							) : postsData.posts.length > 0 ? (
								<div className='space-y-3'>
									{postsData.posts.slice(0, 3).map((post) => (
										<div
											key={post._id}
											className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
											<div className='w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center'>
												<FileText className='h-5 w-5 text-indigo-600' />
											</div>
											<div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
												<p className='font-medium text-gray-900 line-clamp-1'>
													{getLocalizedText(post.title)}
												</p>
												<p className='text-sm text-gray-500'>
													{post.authorName}
												</p>
												<p className='text-xs text-gray-400'>
													{getLocalizedText(post.category)}
												</p>
											</div>
											<div className={`flex flex-col space-y-1 ${isRTL ? 'items-start' : 'items-end'}`}>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														post.status === "published"
															? "bg-green-100 text-green-800"
															: post.status === "draft"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{post.status}
												</span>
												{post.featured && (
													<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
														{t('featured')}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className='text-gray-500 text-center py-8'>
									{t('noPostsYet')}
								</p>
							)}
						</motion.div>

						{/* Quick Actions */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className='bg-white rounded-xl shadow-sm p-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t('quickActions')}
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
								<button
									onClick={() => setActiveTab("add-product")}
									className='p-4 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 text-center group'>
									<Plus className='h-8 w-8 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-teal-700'>{t('addProduct')}</p>
									<p className='text-sm text-teal-600'>
										{t('createNewProduct')}
									</p>
								</button>

								<button
									onClick={() => setActiveTab("categories")}
									className='p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group'>
									<Tag className='h-8 w-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-blue-700'>{t('manageCategories')}</p>
									<p className='text-sm text-blue-600'>
										{t('organizeCategories')}
									</p>
								</button>

								<button
									onClick={() => setActiveTab("products")}
									className='p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center group'>
									<Package className='h-8 w-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-purple-700'>{t('manageProducts')}</p>
									<p className='text-sm text-purple-600'>
										{t('editInventory')}
									</p>
								</button>

								<button
									onClick={() => setActiveTab("add-post")}
									className='p-4 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-center group'>
									<FileText className='h-8 w-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-indigo-700'>{t('addPost')}</p>
									<p className='text-sm text-indigo-600'>
										{t('createNewPost')}
									</p>
								</button>

								<button
									onClick={() => setActiveTab("posts")}
									className='p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center group'>
									<FileText className='h-8 w-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform' />
									<p className='font-medium text-green-700'>{t('managePosts')}</p>
									<p className='text-sm text-green-600'>
										{t('editPosts')}
									</p>
								</button>
							</div>
						</motion.div>
					</div>
				);
		}
	};

	return (
		<div className='h-screen bg-gray-50 flex overflow-hidden'>
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`
				}`}>
				<div className='flex flex-col h-screen'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h1 className='text-xl font-bold text-teal-600'>{t('medicalEqPro')}</h1>
						<button
							onClick={() => setSidebarOpen(false)}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<X className='h-5 w-5' />
						</button>
					</div>

					{/* User Info */}
					<div className='p-6 border-b border-gray-200'>
						<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
							<div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center'>
								<span className='text-white font-semibold text-sm'>
									{user?.name?.charAt(0).toUpperCase()}
								</span>
							</div>
							<div className={`${isRTL ? 'text-right' : 'text-left'}`}>
								<p className='font-medium text-gray-900'>{user?.name}</p>
								<p className='text-sm text-gray-500'>{user?.email}</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className='flex-1 p-6 space-y-2'>
						{sidebarItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => {
										setActiveTab(item.id);
										setSidebarOpen(false);
									}}
									className={`w-full flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-3'} px-4 py-3 rounded-lg text-left transition-all duration-200 ${
										activeTab === item.id
											? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
									}`}>
									<Icon
										className={`h-5 w-5 ${
											activeTab === item.id ? "text-teal-600" : "text-gray-500"
										}`}
									/>
									<span className='font-medium'>{item.label}</span>
								</button>
							);
						})}
					</nav>

					{/* Language Switcher */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={() => changeLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
							className={`w-full flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-3'} px-4 py-3 rounded-lg text-left text-teal-600 hover:bg-teal-50 transition-all duration-200 hover:shadow-sm`}>
							<Globe className='h-5 w-5' />
							<span className='font-medium'>
								{currentLanguage === 'en' ? t('arabic') : t('english')}
							</span>
						</button>
					</div>

					{/* Logout */}
					<div className='p-6 border-t border-gray-200'>
						<button
							onClick={handleLogout}
							className={`w-full flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-3'} px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm`}>
							<LogOut className='h-5 w-5' />
							<span className='font-medium'>{t('logout')}</span>
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
				{/* Top Bar */}
				<header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0'>
					<div className='flex items-center justify-between'>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<Menu className='h-6 w-6' />
						</button>

						<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
							<h1 className='text-xl font-semibold text-gray-900'>
								{titleByTab[activeTab] || t('dashboard')}
							</h1>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className='flex-1 p-6 overflow-y-auto'>{renderContent()}</main>
			</div>
		</div>
	);
};

export default Dashboard;
