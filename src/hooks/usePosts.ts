import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../services/postApi';
import { queryKeys } from '../config/queryKeys';
import { Post, CreatePostData, UpdatePostData, PostFilters } from '../types';
import toast from 'react-hot-toast';

// Hook for fetching all posts
export const usePosts = (filters: PostFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () => postApi.getAllPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching featured posts
export const useFeaturedPosts = (limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.posts.featured(),
    queryFn: () => postApi.getFeaturedPosts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for searching posts
export const useSearchPosts = (query: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.posts.search(query),
    queryFn: () => postApi.searchPosts(query, page, limit),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching posts by category
export const usePostsByCategory = (categoryId: string, filters: Omit<PostFilters, 'category'> = {}) => {
  return useQuery({
    queryKey: queryKeys.posts.byCategory(categoryId),
    queryFn: () => postApi.getPostsByCategory(categoryId, filters),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching posts by author
export const usePostsByAuthor = (email: string, filters: Omit<PostFilters, 'search'> = {}) => {
  return useQuery({
    queryKey: queryKeys.posts.byAuthor(email),
    queryFn: () => postApi.getPostsByAuthor(email, filters),
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostData) => postApi.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });
};

// Hook for updating a post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, postData }: { id: string; postData: UpdatePostData }) =>
      postApi.updatePost(id, postData),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(updatedPost._id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update post');
    },
  });
};

// Hook for deleting a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });
};

// Hook for liking a post
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.likePost(id),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to like post');
    },
  });
};

