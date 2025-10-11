/** @format */

export interface EmirateShipping {
  name: string;
  cost: number;
}

export interface ShippingConfig {
  emirates: EmirateShipping[];
  lastUpdated: string;
}

// Default shipping configuration
const defaultShippingConfig: ShippingConfig = {
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

// Storage key for shipping configuration
const SHIPPING_CONFIG_KEY = 'shippingConfig';

// Get shipping configuration from localStorage or return default
export const getShippingConfig = (): ShippingConfig => {
  try {
    const stored = localStorage.getItem(SHIPPING_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure the structure is valid
      if (parsed.emirates && Array.isArray(parsed.emirates)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading shipping config:', error);
  }
  
  // Return default config and save it
  saveShippingConfig(defaultShippingConfig);
  return defaultShippingConfig;
};

// Save shipping configuration to localStorage
export const saveShippingConfig = (config: ShippingConfig): void => {
  try {
    const configToSave = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(SHIPPING_CONFIG_KEY, JSON.stringify(configToSave));
  } catch (error) {
    console.error('Error saving shipping config:', error);
  }
};

// Get shipping cost for a specific emirate
export const getShippingCost = (emirateName: string): number => {
  const config = getShippingConfig();
  const emirate = config.emirates.find(e => e.name.toLowerCase() === emirateName.toLowerCase());
  return emirate?.cost || 0;
};

// Update shipping cost for a specific emirate
export const updateEmirateShippingCost = (emirateName: string, newCost: number): void => {
  const config = getShippingConfig();
  const emirateIndex = config.emirates.findIndex(e => e.name.toLowerCase() === emirateName.toLowerCase());
  
  if (emirateIndex !== -1) {
    config.emirates[emirateIndex].cost = newCost;
    saveShippingConfig(config);
  }
};

// Add new emirate
export const addEmirate = (name: string, cost: number): void => {
  const config = getShippingConfig();
  const existingIndex = config.emirates.findIndex(e => e.name.toLowerCase() === name.toLowerCase());
  
  if (existingIndex !== -1) {
    // Update existing emirate
    config.emirates[existingIndex].cost = cost;
  } else {
    // Add new emirate
    config.emirates.push({ name, cost });
  }
  
  saveShippingConfig(config);
};

// Remove emirate
export const removeEmirate = (emirateName: string): void => {
  const config = getShippingConfig();
  config.emirates = config.emirates.filter(e => e.name.toLowerCase() !== emirateName.toLowerCase());
  saveShippingConfig(config);
};
