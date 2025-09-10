/** @format */

import * as yup from "yup";

export const productCreateSchema = yup.object({
  // Bilingual fields
  nameEn: yup.string().trim().required("Product name (EN) is required"),
  nameAr: yup.string().trim().required("Product name (AR) is required"),

  descriptionEn: yup.string().trim().required("Description (EN) is required"),
  descriptionAr: yup.string().trim().required("Description (AR) is required"),

  longDescriptionEn: yup.string().trim().required("Long description (EN) is required"),
  longDescriptionAr: yup.string().trim().required("Long description (AR) is required"),

  // Pricing and relations
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .moreThan(0, "Price must be greater than 0"),
  subcategory: yup.string().trim().required("Subcategory is required"),

  // Media
  images: yup
    .array()
    .of(yup.string().url("Image must be a valid URL").trim())
    .min(1, "At least one image is required"),

  // Features/specifications
  features: yup.array().of(yup.string().trim()).default([]),
  specifications: yup.string().trim().default(""),

  // Stock
  inStock: yup.boolean().default(true),
  stockQuantity: yup
    .number()
    .typeError("Stock quantity must be a number")
    .min(0, "Stock quantity cannot be negative")
    .default(0),

  // Shipping/Warranty bilingual
  shippingEn: yup.string().trim().default(""),
  shippingAr: yup.string().trim().default(""),
  warrantyEn: yup.string().trim().default(""),
  warrantyAr: yup.string().trim().default(""),

  // Certifications
  certifications: yup.array().of(yup.string().trim()).default([]),
});

export type ProductCreateSchema = yup.InferType<typeof productCreateSchema>;


