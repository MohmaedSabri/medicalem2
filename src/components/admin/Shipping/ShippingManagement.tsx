/** @format */

import React, { useState, useEffect } from "react";
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
  RefreshCw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  getShippingConfig, 
  saveShippingConfig, 
  updateEmirateShippingCost,
  addEmirate,
  removeEmirate,
  EmirateShipping 
} from "../../../config/shippingConfig";
import { showToast } from "../../../utils/toast";

const ShippingManagement: React.FC = () => {
  const { t } = useTranslation();
  const [shippingConfig, setShippingConfig] = useState(getShippingConfig());
  const [editingEmirate, setEditingEmirate] = useState<string | null>(null);
  const [editingCost, setEditingCost] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmirateName, setNewEmirateName] = useState("");
  const [newEmirateCost, setNewEmirateCost] = useState<number>(0);

  // Load shipping config on component mount
  useEffect(() => {
    setShippingConfig(getShippingConfig());
  }, []);

  const handleEditStart = (emirate: EmirateShipping) => {
    setEditingEmirate(emirate.name);
    setEditingCost(emirate.cost);
  };

  const handleEditSave = () => {
    if (editingEmirate && editingCost >= 0) {
      updateEmirateShippingCost(editingEmirate, editingCost);
      setShippingConfig(getShippingConfig());
      setEditingEmirate(null);
      setEditingCost(0);
      showToast('success', 'shipping-updated', t('shippingCostUpdated'));
    }
  };

  const handleEditCancel = () => {
    setEditingEmirate(null);
    setEditingCost(0);
  };

  const handleAddEmirate = () => {
    if (newEmirateName.trim() && newEmirateCost >= 0) {
      addEmirate(newEmirateName.trim(), newEmirateCost);
      setShippingConfig(getShippingConfig());
      setNewEmirateName("");
      setNewEmirateCost(0);
      setShowAddForm(false);
      showToast('success', 'emirate-added', t('emirateAdded'));
    }
  };

  const handleDeleteEmirate = (emirateName: string) => {
    if (window.confirm(t('confirmDeleteEmirate'))) {
      removeEmirate(emirateName);
      setShippingConfig(getShippingConfig());
      showToast('success', 'emirate-deleted', t('emirateDeleted'));
    }
  };

  const handleExportConfig = () => {
    const config = getShippingConfig();
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipping-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'config-exported', t('configExported'));
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.emirates && Array.isArray(config.emirates)) {
          saveShippingConfig(config);
          setShippingConfig(getShippingConfig());
          showToast('success', 'config-imported', t('configImported'));
        } else {
          showToast('error', 'invalid-config', t('invalidConfigFile'));
        }
      } catch (error) {
        showToast('error', 'import-failed', t('failedToImportConfig'));
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleResetToDefault = () => {
    if (window.confirm(t('confirmResetToDefault'))) {
      // Reset to default configuration
      const defaultConfig = {
        emirates: [
          { name: "Dubai", cost: 10 },
          { name: "Abu Dhabi", cost: 15 },
          { name: "Sharjah", cost: 10 },
          { name: "Al Ain", cost: 15 },
          { name: "Ajman", cost: 10 },
          { name: "Ras Al Khaimah", cost: 15 },
          { name: "Fujairah", cost: 15 },
          { name: "Umm Al Quwain", cost: 15 },
          { name: "Khor Fakkan", cost: 15 },
          { name: "Kalba", cost: 60 },
        ],
        lastUpdated: new Date().toISOString(),
      };
      saveShippingConfig(defaultConfig);
      setShippingConfig(getShippingConfig());
      showToast('success', 'config-reset', t('configResetToDefault'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Truck className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('shippingManagement')}</h2>
            <p className="text-gray-600">{t('manageShippingCosts')}</p>
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
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('reset')}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addEmirate')}</span>
          </motion.button>
        </div>
      </div>

      {/* Add New Emirate Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addNewEmirate')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('emirateName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newEmirateName}
                onChange={(e) => setNewEmirateName(e.target.value)}
                placeholder={t('enterEmirateName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('shippingCost')} (AED) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newEmirateCost}
                onChange={(e) => setNewEmirateCost(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddEmirate}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" />
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

      {/* Emirates List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('emiratesShippingCosts')}</h3>
          <p className="text-sm text-gray-600">{t('lastUpdated')}: {new Date(shippingConfig.lastUpdated).toLocaleString()}</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {shippingConfig.emirates.map((emirate, index) => (
            <motion.div
              key={emirate.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{emirate.name}</h4>
                    <p className="text-sm text-gray-600">{t('shippingCost')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {editingEmirate === emirate.name ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingCost}
                        onChange={(e) => setEditingCost(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">AED</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleEditSave}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
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
                        <span className="font-semibold text-green-600">{emirate.cost} AED</span>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditStart(emirate)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title={t('edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteEmirate(emirate.name)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">{t('shippingSummary')}</h4>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          {t('totalEmirates')}: {shippingConfig.emirates.length} | 
          {t('averageCost')}: {(shippingConfig.emirates.reduce((sum, e) => sum + e.cost, 0) / shippingConfig.emirates.length).toFixed(2)} AED
        </p>
        <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>{t('syncNotice')}:</strong> {t('localStorageNotice')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingManagement;
