/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../contexts/CategoriesContext";
import { useSubCategories } from "../../hooks/useSubCategories";
import { usePosts } from "../../hooks/usePosts";
import AddProductForm from "../forms/AddProductForm";
import ManageProducts from "../admin/ManageProducts";
import ManageCategories from "../admin/ManageCategories";
import ManageSubCategories from "../admin/ManageSubCategories";
import PostCreateForm from "../admin/Post/PostCreateForm";
import ManagePosts from "../admin/ManagePosts";
import AddDoctorForm from "../forms/AddDoctorForm";
import ManageDoctors from "../admin/ManageDoctors";
import ContactInfoManagement from "../admin/ContactInfo/ContactInfoManagement";
import ShippingManagement from "../admin/Shipping/ShippingManagement";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { useDoctors } from "../../hooks/useDoctors";
import { Doctor } from "../../types";
import { Package, Tag, FileText, User } from "lucide-react";
import DashboardSidebar from "../admin/Dashboard/DashboardSidebar";
import DashboardHeader from "../admin/Dashboard/DashboardHeader";
import DashboardContent from "../admin/Dashboard/DashboardContent";

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (typeof value === "object" && value !== null) {
			const valueObj = value as Record<string, string>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || "";
		}
		return "";
	};
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Use the products hook to get real-time data
	const { data: apiProducts = [], isLoading: productsLoading } = useProducts();

	// Use the categories context to get real-time data
	const { categories, loading: categoriesLoading } = useCategories();

	// Use the subcategories hook to get real-time data
	const { data: subcategories = [], isLoading: subcategoriesLoading } =
		useSubCategories();

	// Use the posts hook to get real-time data with language support
	const { data: postsData = { posts: [] }, isLoading: postsLoading } = usePosts(
		{ limit: 100 },
		currentLanguage
	);

	// Use the doctors hook to get real-time data
	const { data: doctors = [], isLoading: doctorsLoading } = useDoctors({ 
		lang: currentLanguage 
	}) as { data: Doctor[], isLoading: boolean };

	// Transform API products to local format for display
	const products = (apiProducts || []).map((product) => ({
		id: product._id,
		name: getLocalizedText(product.name),
		price: product.price,
		image: product.image,
		inStock: product.inStock,
		averageRating: product.averageRating || 0,
		subcategory:
			typeof product.subcategory === "string"
				? product.subcategory
				: product.subcategory?._id || "",
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
		subcategoryValue:
			| string
			| { _id: string; name: string; description: string }
	): string => {
		if (typeof subcategoryValue === "string") {
			const subcategory = subcategories.find(
				(sub) => sub._id === subcategoryValue
			);
			return subcategory
				? getLocalizedText(subcategory.name)
				: subcategoryValue;
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
			(sub) =>
				sub.parentCategory &&
				(typeof sub.parentCategory === "string"
					? sub.parentCategory === category._id
					: sub.parentCategory._id === category._id)
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
				{ pathname: "/z9x8c7v6b5n4m3a2s1d4f5g6h7j8k9l0p1o2i3u4y5t6r7e8w9q0", search: params.toString() },
				{ replace: true }
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const handleLogout = () => {
		logout();
		navigate("/x7k9m2p4q8w1n5r3t6y0u9i8o7p6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m0");
	};


	const titleByTab = useMemo<Record<string, string>>(
		() => ({
			dashboard: t("dashboard"),
			"add-product": t("addProduct"),
			products: t("manageProducts"),
			categories: t("manageCategories"),
			subcategories: t("manageSubCategories"),
			"add-post": t("addPost"),
			posts: t("managePosts"),
			"add-doctor": t("addDoctor"),
			doctors: t("manageDoctors"),
			"contact-info": t("contactInformation"),
			shipping: t("shippingManagement"),
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
						products.reduce((sum, p) => sum + (p.averageRating || 0), 0) /
						products.length
				  ).toFixed(1)
				: "0.0";
		const totalCategories = categories.length;
		const categoriesWithProducts = categories.filter((category) =>
			products.some((product) => product.subcategory === category._id)
		).length;
		const totalPosts = postsData.posts.length;
		const publishedPosts = postsData.posts.filter(
			(p) => p.status === "published"
		).length;
		const featuredPosts = postsData.posts.filter((p) => p.featured).length;
		const totalDoctors = doctors.length;
		const topRatedDoctors = doctors.filter((d: Doctor) => d.rating >= 4.5).length;

		return [
			{
				label: t("totalProducts"),
				value: totalProducts.toString(),
				color: "bg-blue-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t("inStock"),
				value: inStockProducts.toString(),
				color: "bg-primary-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t("totalCategories"),
				value: totalCategories.toString(),
				color: "bg-teal-500",
				icon: Tag,
				loading: categoriesLoading,
			},
			{
				label: t("activeCategories"),
				value: categoriesWithProducts.toString(),
				color: "bg-purple-500",
				icon: Tag,
				loading: categoriesLoading || subcategoriesLoading,
			},
			{
				label: t("totalPosts"),
				value: totalPosts.toString(),
				color: "bg-indigo-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t("publishedPosts"),
				value: publishedPosts.toString(),
				color: "bg-primary-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t("featuredPosts"),
				value: featuredPosts.toString(),
				color: "bg-yellow-500",
				icon: FileText,
				loading: postsLoading,
			},
			{
				label: t("totalValue"),
				value: `$${(totalValue / 1000).toFixed(1)}K`,
				color: "bg-orange-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t("avgRating"),
				value: avgRating,
				color: "bg-indigo-500",
				icon: Package,
				loading: productsLoading,
			},
			{
				label: t("totalDoctors"),
				value: totalDoctors.toString(),
				color: "bg-cyan-500",
				icon: User,
				loading: doctorsLoading,
			},
			{
				label: t("topRatedDoctors"),
				value: topRatedDoctors.toString(),
				color: "bg-emerald-500",
				icon: User,
				loading: doctorsLoading,
			},
		];
	}, [
		products,
		productsLoading,
		categories,
		categoriesLoading,
		subcategoriesLoading,
		postsData.posts,
		postsLoading,
		doctors,
		doctorsLoading,
		t,
	]);

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
				return (
					<PostCreateForm 
						onClose={() => setActiveTab("dashboard")} 
						onSuccess={() => setActiveTab("posts")} 
					/>
				);
			case "posts":
				return <ManagePosts />;
			case "add-doctor":
				return <AddDoctorForm onClose={() => setActiveTab("dashboard")} />;
			case "doctors":
				return <ManageDoctors />;
			case "contact-info":
				return <ContactInfoManagement />;
			case "shipping":
				return <ShippingManagement />;
			case "dashboard":
			default:
				return (
					<DashboardContent
						activeTab={activeTab}
						user={user}
						dashboardStats={dashboardStats}
						products={products}
						productsLoading={productsLoading}
						categories={categories}
						categoriesLoading={categoriesLoading}
						subcategories={subcategories}
						subcategoriesLoading={subcategoriesLoading}
						posts={postsData.posts}
						postsLoading={postsLoading}
						getSubcategoryName={getSubcategoryName}
						getProductCountForCategory={getProductCountForCategory}
						getLocalizedText={getLocalizedText}
						onTabChange={setActiveTab}
					/>
				);
		}
	};

	return (
		<div className='h-screen bg-gray-50 flex overflow-hidden'>
			<DashboardSidebar
				activeTab={activeTab}
				sidebarOpen={sidebarOpen}
				onTabChange={setActiveTab}
				onSidebarClose={() => setSidebarOpen(false)}
				onLogout={handleLogout}
			/>

			{/* Main Content */}
			<div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
				<DashboardHeader
					title={titleByTab[activeTab] || t("dashboard")}
					sidebarOpen={sidebarOpen}
					onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
				/>

				{/* Page Content */}
				<main className='flex-1 p-6 overflow-y-auto'>{renderContent()}</main>
			</div>
		</div>
	);
};

export default Dashboard;
