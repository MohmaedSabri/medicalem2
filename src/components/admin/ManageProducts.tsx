/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
//
import { Product } from "../../types";
import { useProducts } from "../../contexts/ProductsContext";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useNavigate } from "react-router-dom";
import EditProductForm from "../forms/EditProductForm";
import DeletionModal from "../ui/DeletionModal";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { showToast } from "../../utils/toast";
import ManageProductsHeader from "./manageProducts/ManageProductsHeader";
import ManageProductsFilters from "./manageProducts/ManageProductsFilters";
import ManageProductsTable from "./manageProducts/ManageProductsTable";

const ManageProducts: React.FC = () => {
	const { products, deleteProduct } = useProducts();
	const { data: subcategories = [] } = useSubCategories();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (typeof value === "object" && value !== null) {
			const v = value as Record<string, string>;
			return v[currentLanguage] || v.en || v.ar || "";
		}
		return "";
	};
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubcategory, setSelectedSubcategory] = useState("");
	const subcategoriesList = [
		{ id: "all", name: "All Subcategories" },
		...subcategories.map(
			(sub: { _id: string; name: string | { en: string; ar: string } }) => ({
				id: sub._id,
				name: getLocalizedText(sub.name),
			})
		),
	];
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Product | null>(null);

	const filteredProducts = products.filter((product) => {
		const productName = getLocalizedText(product.name);
		const productDescription = getLocalizedText(product.description);
		const matchesSearch =
			productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			productDescription.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubcategory =
			selectedSubcategory === "" ||
			selectedSubcategory === "all" ||
			(selectedSubcategory !== "all" &&
				(typeof product.subcategory === "string"
					? product.subcategory === selectedSubcategory
					: product.subcategory?._id === selectedSubcategory));
		return matchesSearch && matchesSubcategory;
	});

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
	};

	const handleDelete = (product: Product) => {
		setProductToDelete(product);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!productToDelete) return;

		setDeletingProduct(productToDelete._id);
		try {
			// local state update only
			deleteProduct(productToDelete._id);
			setShowDeleteModal(false);
			setProductToDelete(null);
			showToast(
				"success",
				"product-delete",
				t("productDeleted", { defaultValue: "Product deleted successfully" })
			);
		} catch {
			// Error deleting product
			showToast(
				"error",
				"product-delete-error",
				t("failedToDeleteProduct", { defaultValue: "Failed to delete product" })
			);
		} finally {
			setDeletingProduct(null);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setProductToDelete(null);
	};

	const handleView = (productId: string) => {
		navigate(`/product/${productId}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='max-w-5xl mx-auto'>
			<div className='bg-white rounded-xl shadow-sm p-6'>
				{/* Header */}
				<ManageProductsHeader
					title={'Manage Products'}
					subtitle={'View, edit, and delete your product inventory'}
					onAddClick={() => navigate("/z9x8c7v6b5n4m3a2s1d4f5g6h7j8k9l0p1o2i3u4y5t6r7e8w9q0?tab=add-product")}
					addLabel={t("addProduct")}
				/>

				{/* Search and Filters */}
				<ManageProductsFilters
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					selectedSubcategory={selectedSubcategory}
					onSelectSubcategory={setSelectedSubcategory}
					subcategories={subcategoriesList}
				/>

				{/* Products Table */}
				<ManageProductsTable
					products={filteredProducts}
					totalCount={products.length}
					searchTerm={searchTerm}
					selectedSubcategory={selectedSubcategory}
					onView={handleView}
					onEdit={handleEdit}
					onDelete={handleDelete}
					deletingProductId={deletingProduct}
					getLocalizedText={getLocalizedText}
				/>
			</div>

			{/* Edit Product Modal */}
			{editingProduct && (
				<EditProductForm
					product={editingProduct}
					onClose={() => setEditingProduct(null)}
				/>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && productToDelete && (
				<DeletionModal
					isOpen={showDeleteModal}
					onClose={cancelDelete}
					onConfirm={confirmDelete}
					title={t("confirmDelete", { defaultValue: "Confirm Delete" })}
					description={t("deleteProductWarning", {
						defaultValue:
							"Are you sure you want to delete this product? This action cannot be undone.",
					})}
					itemName={getLocalizedText(productToDelete.name)}
					itemDescription={getLocalizedText(productToDelete.description)}
					isDeleting={deletingProduct === productToDelete._id}
					type='product'
				/>
			)}
		</motion.div>
	);
};

export default ManageProducts;
