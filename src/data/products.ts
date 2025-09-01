/** @format */

export interface Product {
	id: number;
	name: string;
	description: string;
	longDescription: string;
	image: string;
	images: string[];
	category: string;
	price: number;
	rating: number;
	reviews: number;
	features: string[];
	specifications: Record<string, string>;
	inStock: boolean;
	stockQuantity: number;
	shipping: string;
	warranty: string;
	certifications: string[];
}

export interface ProductsData {
	products: Product[];
	categories: string[];
}

export const productsData: ProductsData = {
	products: [
		{
			id: 1,
			name: "Advanced MRI Scanner Pro",
			description:
				"High-resolution 3T magnetic resonance imaging system with AI-enhanced diagnostics and advanced pulse sequences for superior patient care and diagnostic accuracy.",
			longDescription:
				"High-resolution magnetic resonance imaging system with AI-enhanced diagnostics for superior patient care and diagnostic accuracy. This state-of-the-art equipment features advanced pulse sequences, 3T magnetic field strength, and comprehensive AI-powered diagnostic assistance. Perfect for hospitals, imaging centers, and research facilities requiring the highest quality diagnostic imaging.",
			image:
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Imaging Equipment",
			price: 2500000,
			rating: 4.9,
			reviews: 127,
			features: [
				"3T Magnetic Field",
				"AI Diagnostics",
				"Advanced Pulse Sequences",
				"24/7 Support",
				"FDA Approved",
				"5-Year Warranty",
				"Cloud Storage",
				"Mobile App Integration",
			],
			specifications: {
				fieldStrength: "3T",
				weight: "4500 kg",
				dimensions: "2.5m x 2.1m x 1.8m",
				power: "45 kW",
				cooling: "Liquid Helium",
			},
			inStock: true,
			stockQuantity: 3,
			shipping: "Free on orders over $2M",
			warranty: "5 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
		{
			id: 2,
			name: "Digital X-Ray System Elite",
			description:
				"State-of-the-art digital radiography with instant imaging, reduced radiation exposure, and wireless connectivity for enhanced patient safety.",
			longDescription:
				"State-of-the-art digital radiography with instant imaging and reduced radiation exposure for enhanced patient safety. Features wireless connectivity and cloud storage for seamless workflow integration. This advanced system provides superior image quality while minimizing patient radiation exposure, making it ideal for busy radiology departments and emergency rooms.",
			image:
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Diagnostic Tools",
			price: 150000,
			rating: 4.8,
			reviews: 89,
			features: [
				"Digital Imaging",
				"Low Radiation",
				"Wireless Connectivity",
				"Instant Results",
				"Cloud Storage",
				"Mobile App Support",
				"AI Image Enhancement",
				"Multi-format Export",
			],
			specifications: {
				resolution: "4096 x 4096",
				weight: "180 kg",
				dimensions: "1.2m x 0.8m x 1.5m",
				power: "3.5 kW",
				radiation: "Reduced by 40%",
			},
			inStock: true,
			stockQuantity: 8,
			shipping: "Free on orders over $100K",
			warranty: "3 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
		{
			id: 3,
			name: "Portable Ultrasound Pro",
			description:
				"Compact ultrasound system with crystal-clear imaging, multiple transducers, and cloud connectivity for various medical applications.",
			longDescription:
				"Portable ultrasound system with crystal-clear imaging for various applications in modern healthcare facilities. Ideal for emergency rooms, clinics, and mobile medical units. This compact system delivers hospital-quality imaging in a portable package, making it perfect for point-of-care diagnostics and emergency situations.",
			image:
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Imaging Equipment",
			price: 85000,
			rating: 4.7,
			reviews: 156,
			features: [
				"Portable Design",
				"Multiple Transducers",
				"Cloud Storage",
				"HD Display",
				"Battery Powered",
				"WiFi Enabled",
				"Touch Screen",
				"Emergency Mode",
			],
			specifications: {
				weight: "2.8 kg",
				dimensions: "35cm x 25cm x 8cm",
				battery: "4-6 hours",
				display: '15.6" HD Touch',
				transducers: "4 included",
			},
			inStock: true,
			stockQuantity: 15,
			shipping: "Free on orders over $50K",
			warranty: "2 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
		{
			id: 4,
			name: "Patient Monitor Advanced",
			description:
				"Multi-parameter patient monitoring system with real-time data analytics and wireless connectivity for comprehensive patient care.",
			longDescription:
				"Advanced vital signs monitoring with real-time data analysis and wireless connectivity for comprehensive patient care. Features touch screen interface and mobile app integration. This sophisticated monitoring system provides continuous surveillance of multiple vital parameters, ensuring optimal patient safety and care quality in critical care environments.",
			image:
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Monitoring Systems",
			price: 45000,
			rating: 4.6,
			reviews: 203,
			features: [
				"Multi-Parameter",
				"Real-time Analytics",
				"Wireless",
				"Touch Screen",
				"Mobile App",
				"Cloud Sync",
				"Alarm System",
				"Trend Analysis",
			],
			specifications: {
				parameters: "8 vital signs",
				weight: "3.2 kg",
				dimensions: "40cm x 30cm x 12cm",
				battery: "6-8 hours",
				display: '12" HD Touch',
			},
			inStock: true,
			stockQuantity: 22,
			shipping: "Free on orders over $25K",
			warranty: "3 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
		{
			id: 5,
			name: "Surgical Robot Assistant",
			description:
				"Precision robotic surgical system with haptic feedback and 4K visualization for minimally invasive procedures.",
			longDescription:
				"Precision robotic surgical system with haptic feedback and 4K visualization for minimally invasive procedures. This advanced surgical assistant provides surgeons with enhanced precision, control, and visualization during complex procedures, reducing patient recovery time and improving surgical outcomes.",
			image:
				"https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Surgical Equipment",
			price: 3200000,
			rating: 4.9,
			reviews: 67,
			features: [
				"4K Visualization",
				"Haptic Feedback",
				"Precision Control",
				"Minimally Invasive",
				"AI Assistance",
				"Training Mode",
				"Remote Consultation",
				"Data Analytics",
			],
			specifications: {
				precision: "0.1mm",
				weight: "1200 kg",
				dimensions: "3.2m x 2.8m x 2.4m",
				power: "8 kW",
				arms: "4 robotic arms",
			},
			inStock: true,
			stockQuantity: 2,
			shipping: "Free on orders over $3M",
			warranty: "7 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
		{
			id: 6,
			name: "ECG Machine Professional",
			description:
				"Advanced electrocardiograph with 12-lead analysis, wireless connectivity, and AI-powered diagnostic assistance.",
			longDescription:
				"Advanced electrocardiograph with 12-lead analysis, wireless connectivity, and AI-powered diagnostic assistance. This professional-grade ECG machine provides accurate cardiac monitoring and analysis, making it essential for cardiology departments, emergency rooms, and primary care facilities.",
			image:
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
			images: [
				"https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659743/pexels-photo-7659743.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg?auto=compress&cs=tinysrgb&w=800",
				"https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=800",
			],
			category: "Diagnostic Tools",
			price: 28000,
			rating: 4.5,
			reviews: 178,
			features: [
				"12-Lead Analysis",
				"AI Diagnostics",
				"Wireless",
				"Touch Screen",
				"Cloud Storage",
				"Mobile App",
				"Printing",
				"Data Export",
			],
			specifications: {
				leads: "12-lead",
				weight: "4.5 kg",
				dimensions: "45cm x 35cm x 15cm",
				battery: "8-10 hours",
				display: '10" HD Touch',
			},
			inStock: true,
			stockQuantity: 18,
			shipping: "Free on orders over $20K",
			warranty: "2 years comprehensive",
			certifications: ["FDA", "CE", "ISO 13485"],
		},
	],
	categories: [
		"All",
		"Imaging Equipment",
		"Diagnostic Tools",
		"Monitoring Systems",
		"Surgical Equipment",
	],
};

export default productsData;
