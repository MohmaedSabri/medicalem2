import { apiRepo } from "../config/apiRepo";
import { endpoints } from "../config/endpoints";
import { Review } from "../types";

// Review creation interface
export interface CreateReviewData {
  user: string;
  rating: number;
  comment: string;
  productId: string;
}

// Review update interface
export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

// Review API service
export const reviewApi = {
  // Get all reviews
  async getAllReviews(): Promise<Review[]> {
    const response = await apiRepo.GET(endpoints.REVIEWS);
    return response.data;
  },

  // Get review by ID
  async getReviewById(id: string): Promise<Review> {
    const response = await apiRepo.GET(endpoints.REVIEWS_BY_ID.replace(":id", id));
    return response.data;
  },

  // Create new review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const response = await apiRepo.POST(endpoints.REVIEWS, reviewData);
    return response.data;
  },

  // Update review
  async updateReview(id: string, reviewData: UpdateReviewData): Promise<Review> {
    const response = await apiRepo.PATCH(endpoints.REVIEWS_BY_ID.replace(":id", id), reviewData);
    return response.data;
  },

  // Delete review
  async deleteReview(id: string): Promise<{ message: string }> {
    const response = await apiRepo.DELETE(endpoints.REVIEWS_BY_ID.replace(":id", id));
    return response.data;
  },

  // Get reviews by user
  async getReviewsByUser(user: string): Promise<Review[]> {
    const response = await apiRepo.GET(endpoints.REVIEWS_BY_USER.replace(":user", encodeURIComponent(user)));
    return response.data;
  },

  // Get reviews by rating
  async getReviewsByRating(rating: number): Promise<Review[]> {
    const response = await apiRepo.GET(endpoints.REVIEWS_BY_RATING.replace(":rating", String(rating)));
    return response.data;
  },

  // Get reviews for specific product
  async getProductReviews(productId: string): Promise<{
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
  }> {
    const response = await apiRepo.GET(endpoints.REVIEWS_BY_PRODUCT.replace(":productId", productId));
    return response.data;
  }
};

export default reviewApi;
