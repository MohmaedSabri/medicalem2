/** @format */

export interface ContactForm {
	name: string;
	email: string;
	phone: string;
	message: string;
}

export interface LoginForm {
	email: string;
	password: string;
}

export interface StatCounter {
	label: string;
	value: number;
	suffix: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "user";
}

export interface Review {
	_id: string;
	user: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	longDescription: string;
	image: string;
	images: string[];
	subcategory: string | { _id: string; name: string; description?: string };
	price: number;
	reviews?: Review[];
	averageRating?: number;
	totalReviews?: number;
	features: string[];
	specifications: Record<string, string>;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface ProductFormData {
	name: string;
	description: string;
	longDescription: string;
	price: number;
	subcategory: string;
	images: string[];
	rating: number;
	reviews: number;
	features: string[];
	specifications: string;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
}

// Category interfaces
export interface Category {
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryData {
	name: string;
	description?: string;
}

export interface UpdateCategoryData {
	name?: string;
	description?: string;
}

// Post interfaces
export interface Post {
	_id: string;
	title: string;
	content: string;
	authorName: string;
	authorEmail: string;
	postImage: string;
	category: string | { _id: string; name: string; description: string };
	tags: string[];
	status: "draft" | "published" | "archived";
	featured: boolean;
	views: number;
	likes: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePostData {
	title: string;
	content: string;
	authorName: string;
	authorEmail: string;
	postImage: string;
	category: string;
	tags: string[];
	status: "draft" | "published" | "archived";
	featured: boolean;
}

export interface UpdatePostData {
	title?: string;
	content?: string;
	postImage?: string;
	category?: string;
	tags?: string[];
	status?: "draft" | "published" | "archived";
	featured?: boolean;
}

export interface PostFilters {
	page?: number;
	limit?: number;
	status?: "draft" | "published" | "archived";
	featured?: boolean;
	category?: string;
	search?: string;
	sortBy?: "createdAt" | "views" | "likes" | "title";
	sortOrder?: "asc" | "desc";
}

export interface PostsResponse {
	posts: Post[];
	totalPages: number;
	currentPage: number;
	totalPosts: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// SubCategory interfaces
export interface SubCategory {
	_id: string;
	name: string;
	description: string;
	parentCategory: string | { _id: string; name: string; description: string };
	createdAt: string;
	updatedAt: string;
}

export interface CreateSubCategoryData {
	name: string;
	description: string;
	parentCategory: string;
}

export interface UpdateSubCategoryData {
	name?: string;
	description?: string;
	parentCategory?: string;
}
