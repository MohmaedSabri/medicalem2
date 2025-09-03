import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '../services/postApi';
import { queryKeys } from '../config/queryKeys';
import { CreatePostData, UpdatePostData, PostFilters, CreateCommentData } from '../types';
import toast from 'react-hot-toast';

// Hook for fetching all posts
export const usePosts = (filters: PostFilters = {}, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.list(filters as Record<string, string | number | boolean | undefined>, language),
    queryFn: () => postApi.getAllPosts(filters, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single post
export const usePost = (id: string, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(id, language),
    queryFn: () => postApi.getPostById(id, language),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching featured posts
export const useFeaturedPosts = (limit: number = 5, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.featured(limit, language),
    queryFn: () => postApi.getFeaturedPosts(limit, language),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for searching posts
export const useSearchPosts = (query: string, page: number = 1, limit: number = 10, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.search(query, page, limit, language),
    queryFn: () => postApi.searchPosts(query, page, limit, language),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching posts by category
export const usePostsByCategory = (categoryId: string, filters: Omit<PostFilters, 'category'> = {}, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.byCategory(categoryId, filters as Record<string, string | number | boolean | undefined>, language),
    queryFn: () => postApi.getPostsByCategory(categoryId, filters, language),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching posts by author
export const usePostsByAuthor = (email: string, filters: Omit<PostFilters, 'search'> = {}, language?: string) => {
  return useQuery({
    queryKey: queryKeys.posts.byAuthor(email, filters as Record<string, string | number | boolean | undefined>, language),
    queryFn: () => postApi.getPostsByAuthor(email, filters, language),
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
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to like post');
    },
  });
};

// Comment hooks
// Hook for fetching post comments
export const usePostComments = (postId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.posts.comments(postId, page, limit),
    queryFn: () => postApi.getPostComments(postId, page, limit),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for adding a comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentData }: { postId: string; commentData: CreateCommentData }) =>
      postApi.addComment(postId, commentData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      toast.success('Comment added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      postApi.deleteComment(postId, commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
};

