import { useLanguage } from '../contexts/LanguageContext';

export const useLocalization = () => {
  const { currentLanguage } = useLanguage();

  const getLocalizedText = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
    }
    return "";
  };

  const getLocalizedProductField = (value: any): string => {
    return getLocalizedText(value);
  };

  const getLocalizedCategoryName = (category: any): string => {
    if (!category) return "";
    return getLocalizedText(category.name);
  };

  return {
    getLocalizedText,
    getLocalizedProductField,
    getLocalizedCategoryName,
    currentLanguage
  };
};
