/** @format */

import { useInView } from "framer-motion";
import { useRef } from "react";

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (amount = 0.1) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount, once: true });
	return { ref, isInView };
};

// Animation variants for different scroll effects
export const scrollVariants = {
	// Fade in from bottom
	fadeInUp: {
		hidden: { opacity: 0, y: 60 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
				staggerChildren: 0.1,
			},
		},
	},

	// Fade in from left
	fadeInLeft: {
		hidden: { opacity: 0, x: -60 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
			},
		},
	},

	// Fade in from right
	fadeInRight: {
		hidden: { opacity: 0, x: 60 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
			},
		},
	},

	// Scale in
	scaleIn: {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const,
			},
		},
	},

	// Slide up with stagger
	slideUpStagger: {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
				ease: "easeOut" as const,
			},
		},
	},

	// Slide up individual item
	slideUpItem: {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" as const },
		},
	},

	// Parallax effect
	parallax: {
		hidden: { opacity: 0, y: 100 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 1.2,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 100,
			},
		},
	},

	// Rotate in
	rotateIn: {
		hidden: { opacity: 0, rotate: -180, scale: 0.5 },
		visible: {
			opacity: 1,
			rotate: 0,
			scale: 1,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 200,
			},
		},
	},

	// Bounce in
	bounceIn: {
		hidden: { opacity: 0, scale: 0.3, y: 50 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 300,
				damping: 15,
			},
		},
	},

	// Slide in from sides
	slideInFromSides: {
		hidden: { opacity: 0, x: -100 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 100,
			},
		},
	},

	// Fade in with delay
	fadeInDelayed: (delay: number = 0) => ({
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				delay,
				ease: "easeOut" as const,
			},
		},
	}),

	// Text reveal
	textReveal: {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const,
			},
		},
	},

	// Card hover effect
	cardHover: {
		hidden: { opacity: 0, y: 20, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.5, ease: "easeOut" as const },
		},
		hover: {
			y: -10,
			scale: 1.02,
			transition: { duration: 0.3, ease: "easeOut" as const },
		},
	},

	// Image reveal
	imageReveal: {
		hidden: { opacity: 0, scale: 1.1 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 1.2,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 100,
			},
		},
	},

	// Counter animation
	counter: {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const,
				type: "spring" as const,
				stiffness: 200,
			},
		},
	},

	// Progress bar
	progressBar: {
		hidden: { width: 0 },
		visible: {
			width: "100%",
			transition: {
				duration: 1.5,
				ease: "easeOut" as const,
				delay: 0.3,
			},
		},
	},

	// Floating animation
	floating: {
		hidden: { y: 0 },
		visible: {
			y: [-10, 10, -10],
			transition: {
				duration: 4,
				repeat: Infinity,
				ease: "easeInOut" as const,
			},
		},
	},

	// Pulse animation
	pulse: {
		hidden: { scale: 1 },
		visible: {
			scale: [1, 1.05, 1],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut" as const,
			},
		},
	},

	// Wave animation
	wave: {
		hidden: { rotate: 0 },
		visible: {
			rotate: [0, 5, -5, 0],
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: "easeInOut" as const,
			},
		},
	},
};

// Hover variants
export const hoverVariants = {
	lift: {
		hover: {
			y: -8,
			scale: 1.02,
			transition: { duration: 0.3, ease: "easeOut" as const },
		},
	},

	scale: {
		hover: {
			scale: 1.05,
			transition: { duration: 0.3, ease: "easeOut" as const },
		},
	},

	rotate: {
		hover: {
			rotate: 5,
			transition: { duration: 0.3, ease: "easeOut" as const },
		},
	},

	glow: {
		hover: {
			boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
			transition: { duration: 0.3, ease: "easeOut" as const },
		},
	},
};

// Stagger children variants
export const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

export const staggerItem = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" as const },
	},
};

// Page transition variants
export const pageVariants = {
	initial: {
		opacity: 0,
		x: 100,
		scale: 0.95,
	},
	in: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: "easeOut" as const,
		},
	},
	out: {
		opacity: 0,
		x: -100,
		scale: 0.95,
		transition: {
			duration: 0.4,
			ease: "easeIn" as const,
		},
	},
};

// Scroll-triggered parallax effect
export const useParallax = (speed: number = 0.5) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { amount: 0, once: false });

	return {
		ref,
		style: {
			transform: isInView ? `translateY(${speed * 20}px)` : "translateY(0px)",
			transition: "transform 0.1s ease-out",
		},
	};
};

// Intersection observer options
export const intersectionOptions = {
	amount: 0.1,
	rootMargin: "0px 0px -100px 0px",
};
