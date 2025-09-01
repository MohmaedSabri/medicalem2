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
      console.error("Error fetching subcategories:", error);
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
      console.error("Error fetching subcategory:", error);
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
      console.error("Error fetching subcategories by parent:", error);
      throw error;
    }
  },

  // Create new subcategory
  async createSubCategory(subcategoryData: CreateSubCategoryData): Promise<SubCategory> {
    try {
      const response = await axiosClient.post(endpoints.SUBCATEGORIES, subcategoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
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
      console.error("Error updating subcategory:", error);
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
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },
};
