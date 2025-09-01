import axiosClient from "../config/axiosClient";
import { endpoints } from "../config/endpoints";
import { SubCategory, CreateSubCategoryData, UpdateSubCategoryData } from "../types";

// SubCategory API service
export const subcategoryApi = {
  // Get all subcategories
  async getAllSubCategories(): Promise<SubCategory[]> {
    try {
      const response = await axiosClient.get(endpoints.SUBCATEGORIES);
      return response.data;
    } catch (error) {
      // Error fetching subcategories
      throw error;
    }
  },

  // Get subcategory by ID
  async getSubCategoryById(id: string): Promise<SubCategory> {
    try {
      const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      // Error fetching subcategory
      throw error;
    }
  },

  // Get subcategories by parent category ID
  async getSubCategoriesByParent(parentCategoryId: string): Promise<SubCategory[]> {
    try {
      const url = endpoints.SUBCATEGORIES_BY_PARENT.replace(":parentId", parentCategoryId);
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      // Error fetching subcategories by parent
      throw error;
    }
  },

  // Create new subcategory
  async createSubCategory(subcategoryData: CreateSubCategoryData): Promise<SubCategory> {
    try {
      const response = await axiosClient.post(endpoints.SUBCATEGORIES, subcategoryData);
      return response.data;
    } catch (error) {
      // Error creating subcategory
      throw error;
    }
  },

  // Update subcategory
  async updateSubCategory(id: string, subcategoryData: UpdateSubCategoryData): Promise<SubCategory> {
    try {
      const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
      const response = await axiosClient.patch(url, subcategoryData);
      return response.data;
    } catch (error) {
      // Error updating subcategory
      throw error;
    }
  },

  // Delete subcategory
  async deleteSubCategory(id: string): Promise<{ message: string }> {
    try {
      const url = endpoints.SUBCATEGORIES_BY_ID.replace(":id", id);
      const response = await axiosClient.delete(url);
      return response.data;
    } catch (error) {
      // Error deleting subcategory
      throw error;
    }
  },
};
