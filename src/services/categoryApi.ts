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
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await apiRepo.GET(`${CATEGORIES_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    try {
      const response = await apiRepo.POST(CATEGORIES_BASE_URL, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    try {
      const response = await apiRepo.PATCH(`${CATEGORIES_BASE_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<{ message: string }> {
    try {
      const response = await apiRepo.DELETE(`${CATEGORIES_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryApi;
