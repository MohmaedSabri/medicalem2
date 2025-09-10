/** @format */

import { toast, ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "custom";

export const showToast = (
  type: ToastType,
  id: string,
  message: string,
  options?: ToastOptions
) => {
  // Ensure a single toast per id
  // react-hot-toast will replace existing toast with the same id
  switch (type) {
    case "success":
      return toast.success(message, { id, ...options });
    case "error":
      return toast.error(message, { id, ...options });
    case "loading":
      return toast.loading(message, { id, ...options });
    case "custom":
    default:
      return toast(message, { id, ...options });
  }
};

export const dismissToast = (id?: string) => toast.dismiss(id);


