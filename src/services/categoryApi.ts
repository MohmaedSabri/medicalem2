import { apiRepo } from "../config/apiRepo";
import { Category, CreateCategoryData, UpdateCategoryData } from "../types";

// Base URL for categories API
const CATEGORIES_BASE_URL = "/categories";

// Category API service
export const categoryApi = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiRepo.GET(CATEGORIES_BASE_URL);
      return response.data;
    } catch (error) {
      // Error fetching categories
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await apiRepo.GET(`${CATEGORIES_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      // Error fetching category
      throw error;
    }
  },

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    try {
      const response = await apiRepo.POST(CATEGORIES_BASE_URL, categoryData);
      return response.data;
    } catch (error) {
      // Error creating category
      throw error;
    }
  },

  // Update category
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    try {
      const response = await apiRepo.PATCH(`${CATEGORIES_BASE_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      // Error updating category
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<{ message: string }> {
    try {
      const response = await apiRepo.DELETE(`${CATEGORIES_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      // Error deleting category
      throw error;
    }
  }
};

export default categoryApi;
