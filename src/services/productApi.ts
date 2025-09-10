import { apiRepo } from "../config/apiRepo";
import { endpoints } from "../config/endpoints";

// Localized value type
type LocalizedValue = string | { en: string; ar: string };

// Product interface based on the API documentation
export interface ApiProduct {
  _id: string;
  name: LocalizedValue;
  description: LocalizedValue;
  longDescription: LocalizedValue;
  image: string;
  images: string[];
  subcategory: {
    _id: string;
    name: LocalizedValue;
    description?: LocalizedValue;
  } | string;
  price: number;
  reviews?: Array<{
    _id: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  averageRating?: number;
  totalReviews?: number;
  features: Array<LocalizedValue>;
  specifications: Record<string, LocalizedValue>;
  inStock: boolean;
  stockQuantity: number;
  shipping: LocalizedValue;
  warranty: LocalizedValue;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

// Product creation interface (accept localized fields per API spec)
export interface CreateProductData {
  name?: LocalizedValue;
  description?: LocalizedValue;
  longDescription?: LocalizedValue;
  image?: string;
  images?: string[];
  subcategory?: string;
  price?: number;
  features?: Array<LocalizedValue>;
  specifications?: Record<string, LocalizedValue>;
  inStock?: boolean;
  stockQuantity?: number;
  shipping?: LocalizedValue;
  warranty?: LocalizedValue;
  certifications?: string[];
}

// Product update interface
export type UpdateProductData = Partial<CreateProductData>;

// Review interface
export interface ReviewData {
  user: string;
  rating: number;
  comment: string;
}

// Product API service
export const productApi = {
  // Get all products
  async getAllProducts(): Promise<ApiProduct[]> {
    const response = await apiRepo.GET(endpoints.PRODUCTS);
    return response.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<ApiProduct> {
    const response = await apiRepo.GET(endpoints.PRODUCTS_BY_ID.replace(':id', id));
    return response.data;
  },

  // Create new product
  async createProduct(productData: CreateProductData): Promise<ApiProduct> {
    const response = await apiRepo.POST(endpoints.PRODUCTS, productData);
    return response.data;
  },

  // Update product
  async updateProduct(id: string, productData: UpdateProductData): Promise<ApiProduct> {
    const response = await apiRepo.PATCH(endpoints.PRODUCTS_BY_ID.replace(':id', id), productData);
    return response.data;
  },

  // Delete product
  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await apiRepo.DELETE(endpoints.PRODUCTS_BY_ID.replace(':id', id));
    return response.data;
  },

  // Add review to product
  async addReview(productId: string, reviewData: ReviewData): Promise<ApiProduct> {
    const response = await apiRepo.POST(endpoints.PRODUCT_REVIEWS.replace(':productId', productId), reviewData);
    return response.data;
  },

  // Get product reviews
  async getProductReviews(productId: string): Promise<{
    reviews: Array<{
      _id: string;
      user: string;
      rating: number;
      comment: string;
      createdAt: string;
    }>;
    averageRating: number;
    totalReviews: number;
  }> {
    const response = await apiRepo.GET(endpoints.PRODUCT_REVIEWS.replace(':productId', productId));
    return response.data;
  }
};

export default productApi;
