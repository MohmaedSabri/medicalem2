/** @format */

import React from "react";
import { Package, Plus } from "lucide-react";

interface ManageProductsHeaderProps {
  title: string;
  subtitle: string;
  onAddClick: () => void;
  addLabel: string;
}

const ManageProductsHeader: React.FC<ManageProductsHeaderProps> = ({ title, subtitle, onAddClick, addLabel }) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center space-x-3'>
        <div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
          <Package className='h-6 w-6 text-white' />
        </div>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
          <p className='text-gray-600'>{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onAddClick}
        className='inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
        <Plus className='h-4 w-4' />
        <span>{addLabel}</span>
      </button>
    </div>
  );
};

export default ManageProductsHeader;


