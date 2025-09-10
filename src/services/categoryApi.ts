import { apiRepo } from "../config/apiRepo";
import { endpoints } from "../config/endpoints";
import { Category, CreateCategoryData, UpdateCategoryData } from "../types";

// Category API service
export const categoryApi = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    const response = await apiRepo.GET(endpoints.CATEGORIES);
    return response.data;
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiRepo.GET(
      endpoints.CATEGORIES_BY_ID.replace(":id", id)
    );
    return response.data;
  },

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const response = await apiRepo.POST(endpoints.CATEGORIES, categoryData);
    return response.data;
  },

  // Update category
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<Category> {
    const response = await apiRepo.PATCH(
      endpoints.CATEGORIES_BY_ID.replace(":id", id),
      categoryData
    );
    return response.data;
  },

  // Delete category
  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await apiRepo.DELETE(
      endpoints.CATEGORIES_BY_ID.replace(":id", id)
    );
    return response.data;
  },
};

export default categoryApi;
