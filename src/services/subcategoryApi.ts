import { apiRepo } from "../config/apiRepo";
import { endpoints } from "../config/endpoints";
import { SubCategory, CreateSubCategoryData, UpdateSubCategoryData } from "../types";

// SubCategory API service
export const subcategoryApi = {
  // Get all subcategories
  async getAllSubCategories(): Promise<SubCategory[]> {
    const response = await apiRepo.GET(endpoints.SUBCATEGORIES);
    return response.data;
  },

  // Get subcategory by ID
  async getSubCategoryById(id: string): Promise<SubCategory> {
    const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
    const response = await apiRepo.GET(url);
    return response.data;
  },

  // Get subcategories by parent category ID
  async getSubCategoriesByParent(parentCategoryId: string): Promise<SubCategory[]> {
    const url = endpoints.SUBCATEGORIES_BY_PARENT.replace(":parentId", parentCategoryId);
    const response = await apiRepo.GET(url);
    return response.data;
  },

  // Create new subcategory
  async createSubCategory(subcategoryData: CreateSubCategoryData): Promise<SubCategory> {
    const response = await apiRepo.POST(endpoints.SUBCATEGORIES, subcategoryData);
    return response.data;
  },

  // Update subcategory
  async updateSubCategory(id: string, subcategoryData: UpdateSubCategoryData): Promise<SubCategory> {
    const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
    const response = await apiRepo.PATCH(url, subcategoryData);
    return response.data;
  },

  // Delete subcategory
  async deleteSubCategory(id: string): Promise<{ message: string }> {
    const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
    const response = await apiRepo.DELETE(url);
    return response.data;
  },
};
