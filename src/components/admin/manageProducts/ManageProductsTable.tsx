/** @format */

import React from "react";
import { Package, Edit, Trash2, Eye } from "lucide-react";
import { Product } from "../../../types";

interface ManageProductsTableProps {
  products: Product[];
  totalCount: number;
  searchTerm: string;
  selectedSubcategory: string;
  onView: (productId: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  deletingProductId: string | null;
  getLocalizedText: (value: any) => string;
}

const ManageProductsTable: React.FC<ManageProductsTableProps> = ({
  products,
  totalCount,
  searchTerm,
  selectedSubcategory,
  onView,
  onEdit,
  onDelete,
  deletingProductId,
  getLocalizedText,
}) => {
  return (
    <>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Product
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Subcategory
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Stock
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                  <div className='flex flex-col items-center space-y-2'>
                    <Package className='h-12 w-12 text-gray-300' />
                    <p className='text-lg font-medium'>No products found</p>
                    <p className='text-sm'>
                      {searchTerm || selectedSubcategory !== ""
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first product"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-12 w-12'>
                        <img
                          className='h-12 w-12 rounded-lg object-cover'
                          src={product.image}
                          alt={getLocalizedText(product.name)}
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {getLocalizedText(product.name)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
                      {typeof product.subcategory === "string"
                        ? product.subcategory
                        : getLocalizedText(product.subcategory?.name) || "Uncategorized"}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${product.price.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {product.stockQuantity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => onView(product._id)}
                        className='text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors'>
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className='text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors'>
                        <Edit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        disabled={deletingProductId === product._id}
                        className='text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {products.length > 0 && (
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <span>Showing {products.length} of {totalCount} products</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProductsTable;


