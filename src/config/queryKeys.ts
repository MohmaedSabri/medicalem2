// React Query Keys for the application
export const queryKeys = {
  // Product related queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, string | number | boolean | undefined>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    reviews: (id: string) => [...queryKeys.products.detail(id), 'reviews'] as const,
  },

  // Category related queries
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters: Record<string, string | number | boolean | undefined>) => [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // User related queries
  users: {
    all: ['users'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },

  // Auth related queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    login: () => [...queryKeys.auth.all, 'login'] as const,
    logout: () => [...queryKeys.auth.all, 'logout'] as const,
  },

  // Post related queries
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: Record<string, string | number | boolean | undefined>, language?: string) => [...queryKeys.posts.lists(), filters, language] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string, language?: string) => [...queryKeys.posts.details(), id, language] as const,
    featured: (limit?: number, language?: string) => [...queryKeys.posts.all, 'featured', limit, language] as const,
    search: (query: string, page?: number, limit?: number, language?: string) => [...queryKeys.posts.all, 'search', query, page, limit, language] as const,
    byCategory: (categoryId: string, filters?: Record<string, string | number | boolean | undefined>, language?: string) => [...queryKeys.posts.all, 'category', categoryId, filters, language] as const,
    byAuthor: (email: string, filters?: Record<string, string | number | boolean | undefined>, language?: string) => [...queryKeys.posts.all, 'author', email, filters, language] as const,
    stats: () => [...queryKeys.posts.all, 'stats'] as const,
    comments: (postId: string, page?: number, limit?: number) => [...queryKeys.posts.detail(postId), 'comments', page, limit] as const,
  },
};

export default queryKeys;
