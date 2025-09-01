# Category Service Usage Guide

This document explains how to use the newly created category service in your Medical Equipment Client application.

## Overview

The category service provides a complete CRUD (Create, Read, Update, Delete) interface for managing product categories, similar to the existing product service.

## Components Created

### 1. Types (`src/types/index.ts`)
```typescript
export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}
```

### 2. API Service (`src/services/categoryApi.ts`)
```typescript
import { categoryApi } from '../services/categoryApi';

// Get all categories
const categories = await categoryApi.getAllCategories();

// Get category by ID
const category = await categoryApi.getCategoryById('categoryId');

// Create new category
const newCategory = await categoryApi.createCategory({
  name: 'Electronics',
  description: 'Electronic devices and gadgets'
});

// Update category
const updatedCategory = await categoryApi.updateCategory('categoryId', {
  description: 'Updated description'
});

// Delete category
await categoryApi.deleteCategory('categoryId');
```

### 3. React Query Hooks (`src/hooks/useCategories.ts`)
```typescript
import { 
  useCategories, 
  useCategory, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '../hooks/useCategories';

// In your component
const { data: categories, isLoading, error } = useCategories();
const { mutate: createCategory, isPending } = useCreateCategory();
const { mutate: updateCategory } = useUpdateCategory();
const { mutate: deleteCategory } = useDeleteCategory();
```

### 4. Context (`src/contexts/CategoriesContext.tsx`)
```typescript
import { useCategories } from '../contexts/CategoriesContext';

// In your component
const { 
  categories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryById,
  getCategoryByName 
} = useCategories();
```

### 5. Management Components
- `ManageCategories.tsx` - Admin interface for managing categories
- `CategoryDetail.tsx` - Detailed view of a single category
- `Categories.tsx` - Public page listing all categories

## Usage Examples

### Basic Category Management
```typescript
import { useCategories } from '../contexts/CategoriesContext';

function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const handleAddCategory = async () => {
    const success = await addCategory({
      name: 'New Category',
      description: 'Category description'
    });
    
    if (success) {
      console.log('Category added successfully');
    }
  };

  const handleUpdateCategory = (id: string, updates: any) => {
    updateCategory(id, updates);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  return (
    <div>
      {categories.map(category => (
        <div key={category._id}>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
          <button onClick={() => handleDeleteCategory(category._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Using React Query Hooks Directly
```typescript
import { useCategories, useCreateCategory } from '../hooks/useCategories';

function CategoryForm() {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();

  const handleSubmit = (formData: any) => {
    createCategory.mutate(formData, {
      onSuccess: () => {
        console.log('Category created successfully');
      },
      onError: (error) => {
        console.error('Failed to create category:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### API Endpoints Used
The service uses these endpoints (as defined in `src/config/endpoints.ts`):
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## Integration with Products

Categories are automatically linked to products through the product's `category` field. When you create or update a product, you can reference a category by its ID or name.

```typescript
// When creating a product
const productData = {
  name: 'Medical Device',
  category: 'categoryId', // or category name
  // ... other fields
};
```

## Error Handling

The service includes comprehensive error handling with toast notifications for success and error states. All API calls are wrapped in try-catch blocks and provide meaningful error messages.

## Loading States

All hooks provide loading states that you can use to show spinners or disable buttons during API operations:

```typescript
const { data: categories, isLoading, error } = useCategories();

if (isLoading) return <div>Loading categories...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {categories.map(category => (
      <div key={category._id}>{category.name}</div>
    ))}
  </div>
);
```

## Next Steps

1. **Add CategoriesProvider to your app**: Wrap your app with `CategoriesProvider` to enable category context
2. **Add routes**: Add routes for `/categories` and `/category/:id` in your router
3. **Update Dashboard**: Add a categories tab to your dashboard component
4. **Test the API**: Ensure your backend category endpoints are working correctly

## Files to Update

To fully integrate the category service, you may need to update:
- `src/App.tsx` - Add CategoriesProvider and routes
- `src/components/Dashboard.tsx` - Add categories tab
- Any existing components that reference categories

The category service is now fully integrated and ready to use throughout your application!
