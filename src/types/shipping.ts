/** @format */

export interface ShippingOption {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingOptionRequest {
  name: string;
  price: number;
}

export interface UpdateShippingOptionRequest {
  name?: string;
  price?: number;
}

export interface BulkCreateShippingOptionsRequest {
  shippingOptions: CreateShippingOptionRequest[];
}

export interface ShippingApiResponse {
  message: string;
  data?: ShippingOption | ShippingOption[];
}

export interface ShippingBulkResponse {
  message: string;
  data: ShippingOption[];
}
