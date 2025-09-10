/** @format */

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCreatePost } from "../../hooks/usePosts";
import { useCategories } from "../../contexts/CategoriesContext";
import { CreatePostData } from "../../types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import { GenericForm } from "./GenericFrom";
import { postCreateSchema, PostCreateSchema } from "../../schamas/post";

interface AddPostFormProps {
  onClose: () => void;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onClose }) => {
  const { mutate: createPost, isPending } = useCreatePost();
  const { categories } = useCategories();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const modalRef = useClickOutside<HTMLDivElement>(onClose);

  const getLocalizedText = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      const valueObj = value as Record<string, string>;
      return valueObj[currentLanguage] || valueObj.en || valueObj.ar || "";
    }
    return "";
  };

  const selectOptions = {
    category: categories.map((category) => ({ value: category._id, label: getLocalizedText(category.name) })),
    status: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
      { value: "archived", label: "Archived" },
    ],
  } as const;

  const defaultValues: Partial<PostCreateSchema> = {
    titleEn: "",
    titleAr: "",
    contentEn: "",
    contentAr: "",
    authorName: "",
    authorEmail: "",
    postImage: "",
    category: "",
    tags: [],
    status: "draft",
    featured: false,
  };

  const handleSubmit = (data: PostCreateSchema) => {
    const convertTextToContentBlocks = (text: string) => {
      if (!text.trim()) return [];
      const paragraphs = text.split("\n\n").filter((p) => p.trim());
      return paragraphs.map((paragraph) => ({ type: "paragraph" as const, text: paragraph.trim() }));
    };

    const payload: CreatePostData = {
      title: { en: data.titleEn, ar: data.titleAr },
      content: { en: convertTextToContentBlocks(data.contentEn || ""), ar: convertTextToContentBlocks(data.contentAr || "") },
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      postImage: data.postImage,
      category: data.category,
      tags: data.tags || [],
      status: data.status,
      featured: data.featured,
    };

    createPost(payload, { onSuccess: onClose });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Add New Post</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'>
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <div className='p-6 space-y-6'>
          <GenericForm<PostCreateSchema>
            schema={postCreateSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonText={isPending ? 'Creating...' : 'Create Post'}
            className='w-full'
            selectOptions={selectOptions}
          />
          <div className='flex justify-end space-x-4 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPostForm;


