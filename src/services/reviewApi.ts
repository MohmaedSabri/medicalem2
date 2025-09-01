import { apiRepo } from "../config/apiRepo";
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
    try {
      const response = await apiRepo.GET("/reviews");
      return response.data;
    } catch (error) {
      // Error fetching reviews
      throw error;
    }
  },

  // Get review by ID
  async getReviewById(id: string): Promise<Review> {
    try {
      const response = await apiRepo.GET(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      // Error fetching review
      throw error;
    }
  },

  // Create new review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      const response = await apiRepo.POST("/reviews", reviewData);
      return response.data;
    } catch (error) {
      // Error creating review
      throw error;
    }
  },

  // Update review
  async updateReview(id: string, reviewData: UpdateReviewData): Promise<Review> {
    try {
      const response = await apiRepo.PATCH(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      // Error updating review
      throw error;
    }
  },

  // Delete review
  async deleteReview(id: string): Promise<{ message: string }> {
    try {
      const response = await apiRepo.DELETE(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      // Error deleting review
      throw error;
    }
  },

  // Get reviews by user
  async getReviewsByUser(user: string): Promise<Review[]> {
    try {
      const response = await apiRepo.GET(`/reviews/user/${encodeURIComponent(user)}`);
      return response.data;
    } catch (error) {
      // Error fetching user reviews
      throw error;
    }
  },

  // Get reviews by rating
  async getReviewsByRating(rating: number): Promise<Review[]> {
    try {
      const response = await apiRepo.GET(`/reviews/rating/${rating}`);
      return response.data;
    } catch (error) {
      // Error fetching reviews by rating
      throw error;
    }
  },

  // Get reviews for specific product
  async getProductReviews(productId: string): Promise<{
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
  }> {
    try {
      const response = await apiRepo.GET(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      // Error fetching product reviews
      throw error;
    }
  }
};

export default reviewApi;
