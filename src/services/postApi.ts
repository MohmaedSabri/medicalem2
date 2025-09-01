import { apiRepo } from "../config/apiRepo";
import { Post, CreatePostData, UpdatePostData, PostFilters, PostsResponse } from "../types";

// Base URL for posts API
const POSTS_BASE_URL = "/posts";

// Post API service
export const postApi = {
  // Get all posts with filters
  async getAllPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = queryParams.toString() ? `${POSTS_BASE_URL}/?${queryParams.toString()}` : POSTS_BASE_URL;
      const response = await apiRepo.GET(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Get post by ID
  async getPostById(id: string): Promise<Post> {
    try {
      const response = await apiRepo.GET(`${POSTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  // Create new post
  async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await apiRepo.POST(POSTS_BASE_URL, postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update post
  async updatePost(id: string, postData: UpdatePostData): Promise<Post> {
    try {
      const response = await apiRepo.PATCH(`${POSTS_BASE_URL}/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete post
  async deletePost(id: string): Promise<{ message: string }> {
    try {
      const response = await apiRepo.DELETE(`${POSTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    try {
      const response = await apiRepo.GET(`${POSTS_BASE_URL}/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  },

  // Search posts
  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<PostsResponse> {
    try {
      const response = await apiRepo.GET(`${POSTS_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error searching posts:", error);
      throw error;
    }
  },

  // Get posts by category
  async getPostsByCategory(categoryId: string, filters: Omit<PostFilters, 'category'> = {}): Promise<PostsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = queryParams.toString() 
        ? `${POSTS_BASE_URL}/category/${categoryId}?${queryParams.toString()}`
        : `${POSTS_BASE_URL}/category/${categoryId}`;
      
      const response = await apiRepo.GET(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      throw error;
    }
  },

  // Get posts by author
  async getPostsByAuthor(email: string, filters: Omit<PostFilters, 'search'> = {}): Promise<PostsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = queryParams.toString() 
        ? `${POSTS_BASE_URL}/author/${encodeURIComponent(email)}?${queryParams.toString()}`
        : `${POSTS_BASE_URL}/author/${encodeURIComponent(email)}`;
      
      const response = await apiRepo.GET(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by author:", error);
      throw error;
    }
  },

  // Like a post
  async likePost(id: string): Promise<{ message: string; likes: number }> {
    try {
      const response = await apiRepo.POST(`${POSTS_BASE_URL}/${id}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  },

  // Get post statistics
  async getPostStats(): Promise<{
    overall: {
      totalPosts: number;
      totalViews: number;
      totalLikes: number;
      avgViews: number;
      avgLikes: number;
    };
    byStatus: Array<{ _id: string; count: number }>;
  }> {
    try {
      const response = await apiRepo.GET(`${POSTS_BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post stats:", error);
      throw error;
    }
  },
};

