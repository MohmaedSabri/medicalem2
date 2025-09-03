import axiosClient from "../config/axiosClient";
import { endpoints } from "../config/endpoints";
import { Post, CreatePostData, UpdatePostData, PostFilters, PostsResponse, Comment, CreateCommentData } from "../types";

// Post API service
export const postApi = {
  // Get all posts with filters
  async getAllPosts(filters: PostFilters = {}, language?: string): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (language) queryParams.append('lang', language);

    const url = queryParams.toString() ? `${endpoints.POSTS}/?${queryParams.toString()}` : endpoints.POSTS;
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Get post by ID
  async getPostById(id: string, language?: string): Promise<Post> {
    const queryParams = new URLSearchParams();
    if (language) queryParams.append('lang', language);
    
    const url = queryParams.toString() 
      ? `${endpoints.POSTS_BY_ID.replace(':id', id)}?${queryParams.toString()}`
      : endpoints.POSTS_BY_ID.replace(':id', id);
    
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Create new post
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await axiosClient.post(endpoints.POSTS, postData);
    return response.data;
  },

  // Update post
  async updatePost(id: string, postData: UpdatePostData, language?: string): Promise<Post> {
    const queryParams = new URLSearchParams();
    if (language) queryParams.append('lang', language);
    
    const url = queryParams.toString() 
      ? `${endpoints.POSTS_BY_ID.replace(':id', id)}?${queryParams.toString()}`
      : endpoints.POSTS_BY_ID.replace(':id', id);
    
    const response = await axiosClient.patch(url, postData);
    return response.data;
  },

  // Delete post
  async deletePost(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(endpoints.POSTS_BY_ID.replace(':id', id));
    return response.data;
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 5, language?: string): Promise<Post[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (language) queryParams.append('lang', language);
    
    const response = await axiosClient.get(`${endpoints.POSTS_FEATURED}?${queryParams.toString()}`);
    return response.data;
  },

  // Search posts
  async searchPosts(query: string, page: number = 1, limit: number = 10, language?: string): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (language) queryParams.append('lang', language);
    
    const response = await axiosClient.get(`${endpoints.POSTS_SEARCH}?${queryParams.toString()}`);
    return response.data;
  },

  // Get posts by category
  async getPostsByCategory(categoryId: string, filters: Omit<PostFilters, 'category'> = {}, language?: string): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', String(filters.status));
    if (filters.sortBy) queryParams.append('sortBy', String(filters.sortBy));
    if (filters.sortOrder) queryParams.append('sortOrder', String(filters.sortOrder));
    if (language) queryParams.append('lang', language);

    const url = queryParams.toString() 
      ? `${endpoints.POSTS_BY_CATEGORY.replace(':category', categoryId)}?${queryParams.toString()}`
      : endpoints.POSTS_BY_CATEGORY.replace(':category', categoryId);
    
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Get posts by author
  async getPostsByAuthor(email: string, filters: Omit<PostFilters, 'search'> = {}, language?: string): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', String(filters.status));
    if (filters.sortBy) queryParams.append('sortBy', String(filters.sortBy));
    if (filters.sortOrder) queryParams.append('sortOrder', String(filters.sortOrder));
    if (language) queryParams.append('lang', language);

    const url = queryParams.toString() 
      ? `${endpoints.POSTS_BY_AUTHOR.replace(':email', encodeURIComponent(email))}?${queryParams.toString()}`
      : endpoints.POSTS_BY_AUTHOR.replace(':email', encodeURIComponent(email));
    
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Like a post
  async likePost(id: string): Promise<{ message: string; likes: number }> {
    const response = await axiosClient.post(endpoints.POSTS_LIKE.replace(':id', id));
    return response.data;
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
    const response = await axiosClient.get(endpoints.POSTS_STATS);
    return response.data;
  },

  // Comment functionality
  // Add comment to post
  async addComment(postId: string, commentData: CreateCommentData): Promise<{ message: string; comment: Comment }> {
    const response = await axiosClient.post(endpoints.POSTS_COMMENTS.replace(':id', postId), commentData);
    return response.data;
  },

  // Get post comments
  async getPostComments(postId: string, page: number = 1, limit: number = 10): Promise<{
    comments: Comment[];
    totalComments: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    const response = await axiosClient.get(`${endpoints.POSTS_COMMENTS.replace(':id', postId)}?${queryParams.toString()}`);
    return response.data;
  },

  // Delete post comment
  async deleteComment(postId: string, commentId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(endpoints.POSTS_COMMENT_BY_ID.replace(':postId', postId).replace(':commentId', commentId));
    return response.data;
  },
};

