/** @format */

// EmailJS Configuration
// Replace these values with your actual EmailJS credentials
// You can also use environment variables for production deployments

export const EMAILJS_CONFIG = {
	PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "1rbAYKCfSpoDxe029", // Your EmailJS public key
	SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_ybah0n8", // Your EmailJS service ID
	TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "Oregon", // Your EmailJS template ID
};

// EmailJS initialization
export const initEmailJS = () => {
	if (typeof window !== "undefined") {
		// Import EmailJS dynamically to avoid SSR issues
		import("@emailjs/browser").then(({ init }) => {
			init(EMAILJS_CONFIG.PUBLIC_KEY);
		});
	}
};
