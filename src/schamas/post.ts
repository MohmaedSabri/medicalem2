/** @format */

import * as yup from "yup";

export const postCreateSchema = yup.object({
  titleEn: yup.string().trim().required("Title (EN) is required"),
  titleAr: yup.string().trim().required("Title (AR) is required"),
  contentEn: yup.string().trim().min(10, "Content (EN) must be at least 10 characters"),
  contentAr: yup.string().trim().min(10, "Content (AR) must be at least 10 characters"),
  authorName: yup.string().trim().required("Author name is required"),
  authorEmail: yup.string().trim().email("Invalid email").required("Author email is required"),
  postImage: yup.string().trim().url("Post image must be a valid URL").required("Post image is required"),
  category: yup.string().trim().required("Category is required"),
  tags: yup.array().of(yup.string().trim()).default([]),
  status: yup.mixed<"draft" | "published" | "archived">().oneOf(["draft", "published", "archived"]).default("draft"),
  featured: yup.boolean().default(false),
});

export type PostCreateSchema = yup.InferType<typeof postCreateSchema>;


