/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Truck, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X,
  MapPin,
  DollarSign,
  Download,
  Upload,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  useShippingOptions,
  useCreateShippingOption,
  useUpdateShippingOption,
  useDeleteShippingOption,
  useBulkCreateShippingOptions
} from "../../../hooks/useShipping";
import { ShippingOption } from "../../../types/shipping";

const ShippingManagement: React.FC = () => {
  const { t } = useTranslation();
  const [editingShipping, setEditingShipping] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShippingName, setNewShippingName] = useState("");
  const [newShippingPrice, setNewShippingPrice] = useState<number>(0);

  // API hooks
  const { data: shippingOptions = [], isLoading, error } = useShippingOptions();
  const createShippingMutation = useCreateShippingOption();
  const updateShippingMutation = useUpdateShippingOption();
  const deleteShippingMutation = useDeleteShippingOption();
  const bulkCreateMutation = useBulkCreateShippingOptions();

  const handleEditStart = (shipping: ShippingOption) => {
    setEditingShipping(shipping._id);
    setEditingName(shipping.name);
    setEditingPrice(shipping.price);
  };

  const handleEditSave = () => {
    if (editingShipping && editingName.trim() && editingPrice >= 0) {
      updateShippingMutation.mutate({
        id: editingShipping,
        data: {
          name: editingName.trim(),
          price: editingPrice,
        },
      });
      setEditingShipping(null);
      setEditingName("");
      setEditingPrice(0);
    }
  };

  const handleEditCancel = () => {
    setEditingShipping(null);
    setEditingName("");
    setEditingPrice(0);
  };

  const handleAddShipping = () => {
    if (newShippingName.trim() && newShippingPrice >= 0) {
      createShippingMutation.mutate({
        name: newShippingName.trim(),
        price: newShippingPrice,
      });
      setNewShippingName("");
      setNewShippingPrice(0);
      setShowAddForm(false);
    }
  };

  const handleDeleteShipping = (id: string) => {
    if (window.confirm(t('confirmDeleteShipping'))) {
      deleteShippingMutation.mutate(id);
    }
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(shippingOptions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipping-options-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data) && data.every(item => item.name && typeof item.price === 'number')) {
          bulkCreateMutation.mutate({
            shippingOptions: data.map(item => ({
              name: item.name,
              price: item.price,
            })),
          });
        } else {
          // Handle single object
          if (data.name && typeof data.price === 'number') {
            createShippingMutation.mutate({
              name: data.name,
              price: data.price,
            });
          }
        }
      } catch (error) {
        console.error('Error importing shipping options:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm(t('confirmResetToDefault'))) {
      const defaultOptions = [
        { name: "Free Shipping", price: 0 },
        { name: "Standard Shipping", price: 15 },
        { name: "Express Shipping", price: 25 },
        { name: "Overnight Shipping", price: 45 },
      ];
      
      bulkCreateMutation.mutate({
        shippingOptions: defaultOptions,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">{t('loading')}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <X className="w-5 h-5 text-red-600" />
          <h3 className="text-red-800 font-medium">{t('errorLoadingShipping')}</h3>
        </div>
        <p className="text-red-700 mt-2">{t('errorLoadingShippingDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('shippingManagement')}</h2>
            <p className="text-gray-600">{t('manageShippingOptions')}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportConfig}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            title={t('exportConfig')}
          >
            <Download className="w-4 h-4" />
            <span>{t('export')}</span>
          </motion.button>
          
          <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{t('import')}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResetToDefault}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            title={t('resetToDefault')}
            disabled={bulkCreateMutation.isPending}
          >
            {bulkCreateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{t('reset')}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addShippingOption')}</span>
          </motion.button>
        </div>
      </div>

      {/* Add New Shipping Option Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addNewShippingOption')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('shippingName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newShippingName}
                onChange={(e) => setNewShippingName(e.target.value)}
                placeholder={t('enterShippingName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('shippingPrice')} (AED) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newShippingPrice}
                onChange={(e) => setNewShippingPrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddShipping}
              disabled={createShippingMutation.isPending}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {createShippingMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{t('add')}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(false)}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>{t('cancel')}</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Shipping Options List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('shippingOptions')}</h3>
          <p className="text-sm text-gray-600">{t('totalOptions')}: {shippingOptions.length}</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {shippingOptions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('noShippingOptions')}</p>
            </div>
          ) : (
            shippingOptions.map((shipping, index) => (
              <motion.div
                key={shipping._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{shipping.name}</h4>
                      <p className="text-sm text-gray-600">{t('shippingPrice')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {editingShipping === shipping._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">AED</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleEditSave}
                          disabled={updateShippingMutation.isPending}
                          className="text-green-600 hover:text-green-700 disabled:opacity-50"
                        >
                          {updateShippingMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleEditCancel}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">{shipping.price} AED</span>
                        </div>
                        <div className="flex space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditStart(shipping)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title={t('edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteShipping(shipping._id)}
                            disabled={deleteShippingMutation.isPending}
                            className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                            title={t('delete')}
                          >
                            {deleteShippingMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">{t('shippingSummary')}</h4>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          {t('totalOptions')}: {shippingOptions.length} | 
          {t('averagePrice')}: {shippingOptions.length > 0 ? (shippingOptions.reduce((sum, s) => sum + s.price, 0) / shippingOptions.length).toFixed(2) : 0} AED
        </p>
      </div>
    </div>
  );
};

export default ShippingManagement;