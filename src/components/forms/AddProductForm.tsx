/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useProducts } from "../../contexts/ProductsContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { GenericForm } from "./GenericFrom";
import { productCreateSchema, ProductCreateSchema } from "../../schamas/product";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useLanguage } from "../../contexts/LanguageContext";

const AddProductForm: React.FC = () => {
	const { addProduct } = useProducts();
	const { t } = useTranslation();
	const { data: subcategories } = useSubCategories();
	const { currentLanguage } = useLanguage();

	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (value && typeof value === "object") {
			const obj = value as Record<string, string>;
			return obj[currentLanguage] || obj.en || obj.ar || "";
		}
		return "";
	};

	const selectOptions = {
		subcategory:
			(subcategories?.map((s) => {
				const id = (s as unknown as { _id?: string })._id || "";
				const rawName = (s as unknown as { name?: unknown }).name ?? (s as unknown as { localized?: { name?: unknown } }).localized?.name;
				const label = getLocalizedText(rawName) || "Subcategory";
				return { value: id, label };
			}) ?? []),
	} as const;

	const defaultValues: Partial<ProductCreateSchema> = {
		nameEn: "",
		nameAr: "",
		descriptionEn: "",
		descriptionAr: "",
		longDescriptionEn: "",
		longDescriptionAr: "",
		price: 0,
		subcategory: "",
		images: [],
		features: [],
		specifications: "",
		inStock: true,
		stockQuantity: 0,
		shippingEn: "",
		shippingAr: "",
		warrantyEn: "",
		warrantyAr: "",
		certifications: [],
	};

	const handleSubmit = async (data: ProductCreateSchema) => {
		try {
			const specificationsObj: Record<string, string> = {};
			if (data.specifications) {
				data.specifications.split(",").forEach((spec) => {
					const [key, value] = spec.split(":").map((s) => s.trim());
					if (key && value) specificationsObj[key] = value;
				});
			}

			const newProduct = {
				name: { en: data.nameEn, ar: data.nameAr },
				description: { en: data.descriptionEn, ar: data.descriptionAr },
				longDescription: { en: data.longDescriptionEn, ar: data.longDescriptionAr },
				price: data.price,
				subcategory: data.subcategory,
				image: (data.images && data.images[0]) || "",
				images: data.images || [],
				features: data.features || [],
				specifications: specificationsObj,
				inStock: data.inStock,
				stockQuantity: data.stockQuantity,
				shipping: { en: data.shippingEn || "", ar: data.shippingAr || "" },
				warranty: { en: data.warrantyEn || "", ar: data.warrantyAr || "" },
				certifications: data.certifications || [],
			};

			const success = await addProduct(newProduct as unknown as Omit<import("../../types").Product, "_id">);
			if (success) {
				toast.success("Product added successfully!");
			} else {
				toast.error("Failed to add product. Please try again.");
			}
		} catch {
			toast.error("Failed to add product. Please try again.");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='max-w-4xl mx-auto'>
			<div className='bg-white rounded-xl shadow-sm p-6'>
				<div className='flex items-center space-x-3 mb-6'>
					<div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
						<Plus className='h-6 w-6 text-white' />
					</div>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>
							{t('addProduct')}
						</h2>
						<p className='text-gray-600'>
							{t('createNewProduct')}
						</p>
					</div>
				</div>

				<GenericForm<ProductCreateSchema>
					schema={productCreateSchema}
					defaultValues={defaultValues}
					onSubmit={handleSubmit}
					submitButtonText={'Add Product'}
					className='w-full'
					selectOptions={selectOptions}
				/>
			</div>
		</motion.div>
	);
};

export default AddProductForm;