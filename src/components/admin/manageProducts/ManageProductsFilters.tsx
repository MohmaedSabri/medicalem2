/** @format */

import React from "react";
import { Search, Filter } from "lucide-react";

interface SubcategoryOption {
  id: string;
  name: string;
}

interface ManageProductsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (value: string) => void;
  subcategories: SubcategoryOption[];
}

const ManageProductsFilters: React.FC<ManageProductsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedSubcategory,
  onSelectSubcategory,
  subcategories,
}) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 mb-6'>
      <div className='flex-1 relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search products by name or description...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
        />
      </div>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Filter className='h-5 w-5 text-gray-400' />
        </div>
        <select
          value={selectedSubcategory}
          onChange={(e) => onSelectSubcategory(e.target.value)}
          className='block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none'>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ManageProductsFilters;


