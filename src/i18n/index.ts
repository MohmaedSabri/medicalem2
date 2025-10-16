/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Contactinfo from "../constant/Contactinfo";

// English translations
const enTranslations = {
	translation: {
		// Navigation
		home: "Home",
		products: "Products",
		blog: "Blog",
		about: "About",
		favorites: "Favorites",
		contact: "Contact",

		// Header
		medEquipPro: "Dorar",
		medicalEquipmentSolutions: "Medical Equipment Solutions",
		selectCategory: "Select Category",
		viewProducts: "View products",
		subcategories: "Subcategories",
		viewAllProducts: "View All Products",
		noCategoriesAvailable: "No categories available",
		language: "Language",
		english: "English",
		arabic: "العربية",

		// Common
		details: "Details",
		addOrder: "Add Order",
		contactSales: "Contact Sales",
		addToCart: "Add to Cart",
		addedToCart: "Added to Cart",
		viewCart: "View Cart",
		professionalMedicalEquipment: "Professional Medical Equipment",

		// Contact Info Management
		socialMediaLinks: "Social Media Links",
		ceoPhotos: "CEO Photos",
		ceoPhoto: "CEO Photo",
		ceoSmallPhoto: "CEO Small Photo",
		partners: "Partners",
		addPartner: "Add Partner",
		editPartner: "Edit Partner",
		altText: "Alt Text",
		websiteUrl: "Website URL",
		adding: "Adding...",
		contactInfoUpdated: "Contact information updated successfully",
		updateFailed: "Failed to update contact information",
		partnerAdded: "Partner added successfully",
		addPartnerFailed: "Failed to add partner",
		partnerUpdated: "Partner updated successfully",
		updatePartnerFailed: "Failed to update partner",
		confirmDeletePartner: "Are you sure you want to delete this partner?",
		partnerDeleted: "Partner deleted successfully",
		deletePartnerFailed: "Failed to delete partner",
		errorLoadingContactInfo: "Error loading contact information",
		noContactInfoFound: "No contact information found",

		// Favorites Page
		favoritesTitle: "My Favorites",
		favoritesSubtitle:
			"Your saved medical equipment favorites for easy access and comparison.",
		loadingFavorites: "Loading favorites...",
		errorLoadingFavoritesTitle: "Error loading products",
		errorLoadingFavoritesDescription:
			"Failed to load your favorite products. Please try again.",
		noFavoritesYet: "No favorites yet",
		emptyFavoritesHint:
			"Browse products and tap the heart to save them here.",
		browseProducts: "Browse Products",

		// Cart Page
		cartTitle: "Shopping Cart",
		cartSubtitle: "Review your selected medical equipment and proceed to checkout.",
		loadingCart: "Loading cart...",
		errorLoadingCartTitle: "Error loading cart",
		errorLoadingCartDescription: "Failed to load your cart items. Please try again.",
		cartEmpty: "Your cart is empty",
		emptyCartHint: "Add some medical equipment to your cart to get started.",
		cartItems: "Cart Items",
		clearCart: "Clear Cart",
		orderSummary: "Order Summary",
		subtotal: "Subtotal",
		shipping: "Shipping",
		free: "Free",
		total: "Total",
		proceedToCheckout: "Proceed to Checkout",
		continueShopping: "Continue Shopping",
		addedToCartMessage: "added to cart!",
		removedFromCartMessage: "removed from cart",
		cartClearedMessage: "Cart cleared successfully",

		// Checkout Page
		checkoutTitle: "Checkout",
		checkoutSubtitle: "Complete your order and we'll deliver your medical equipment safely.",
		haveCoupon: "Have a coupon?",
		clickHereToEnter: "Click here to enter your code",
		couponDescription: "If you have a coupon code, please apply it below.",
		couponCode: "Coupon code",
		applyCoupon: "Apply coupon",
		billingDetails: "Billing Details",
		contactDetails: "Contact Details",
		firstName: "First name",
		lastName: "Last name",
		phone: "Phone",
		email: "Email address",
		address: "Address",
		country: "Country",
		selectCountry: "Select Country",
		selectCountryFirst: "Please select a country first",
		otherCountry: "Other Country",
		emirate: "Emirate",
		selectEmirate: "Please select Emirate",
		streetAddress: "Apartment / Building / Street address",
		streetAddressPlaceholder: "Apartment, Building and street name",
		createAccount: "Create an account?",
		password: "Create account password",
		additionalInfo: "Additional information",
		orderNotes: "Order notes",
		optional: "optional",
		orderNotesPlaceholder: "Notes about your order, e.g. special notes for delivery.",
		deliveryNotice: "Please allow 1-2 business days for delivery after order processing.",
		yourOrder: "Your order",
		paymentMethods: "Payment Methods",
		vat: "VAT",
		termsAgreement: "I have read and agree to the website",
		termsAndConditions: "Terms and conditions",
		placeOrder: "Place order",
		processingOrder: "Processing order...",

		// Product related
		uncategorized: "Uncategorized",
		more: "more",
		rating: "Rating",

		// Actions
		close: "Close",
		search: "Search",
		filter: "Filter",
		sort: "Sort",
		view: "View",
		back: "Back",
		print: "Print",
		downloadPDF: "Download PDF",
		generating: "Generating...",

		// Status
		inStock: "In Stock",
		outOfStock: "Out of Stock",
		loading: "Loading...",
		error: "Error",
		success: "Success",

		// Bank Account
		bankAccountDetails: "Bank Account Details",
		bankAccountDescription: "Complete banking information for payments and transfers",
		companyInformation: "Company Information",
		companyName: "Company Name",
		bankingDetails: "Banking Details",
		customerTRN: "Customer TRN",
		poBox: "P.O Box",
		accountType: "Account Type",
		accountNumber: "Account Number",
		iban: "IBAN",
		currency: "Currency",
		branch: "Branch",
		importantNotice: "Important Notice",
		bankAccountNotice: "Please use your Order ID as the payment reference when making bank transfers. All payments should be made in AED currency.",
		clickToViewBankDetails: "Click to view our banking details for payment",
		viewBankDetails: "View Bank Details",

		// Invoice
		invoice: "Invoice",
		invoiceDetails: "Invoice Details",
		billTo: "Bill To",
		description: "Description",
		qty: "Qty",
		price: "Price",
		paymentMethod: "Payment Method",
		notes: "Notes",
		dueDate: "Due Date",

		// Contact
		getInTouch: "Get in Touch",
		sendMessage: "Send Message",

		// Newsletter
		newsletter: "Newsletter",
		subscribeToNewsletter: "Subscribe to our newsletter",
		newsletterEmail: "Email Address",
		subscribe: "Subscribe",
		subscribing: "Subscribing...",
		subscribed: "Subscribed!",
		subscriptionSuccess: "Thank you for subscribing to our newsletter!",
		subscriptionError: "Failed to subscribe. Please try again.",
		invalidEmail: "Please enter a valid email address",
		emailRequired: "Email address is required",
		name: "Name",
		message: "Message",
		subject: "Subject",
		
		// Phone Types
		homePhone: "Home Use",
		clinicPhone: "Clinic Use",
		enterHomePhone: "Enter your home use phone number",
		enterClinicPhone: "Enter your clinic use phone number",
		
		// Shipping Management
		shippingManagement: "Shipping Management",
		manageShippingCosts: "Manage shipping costs for different emirates",
		addEmirate: "Add Emirate",
		addNewEmirate: "Add New Emirate",
		emirateName: "Emirate Name",
		enterEmirateName: "Enter emirate name",
		shippingCost: "Shipping Cost",
		emiratesShippingCosts: "Emirates Shipping Costs",
		lastUpdated: "Last Updated",
		shippingSummary: "Shipping Summary",
		totalEmirates: "Total Emirates",
		averageCost: "Average Cost",
		shippingCostUpdated: "Shipping cost updated successfully",
		emirateAdded: "Emirate added successfully",
		emirateDeleted: "Emirate deleted successfully",
		confirmDeleteEmirate: "Are you sure you want to delete this emirate?",
		exportConfig: "Export shipping configuration",
		export: "Export",
		import: "Import",
		reset: "Reset",
		resetToDefault: "Reset to default configuration",
		configExported: "Configuration exported successfully",
		configImported: "Configuration imported successfully",
		invalidConfigFile: "Invalid configuration file",
		failedToImportConfig: "Failed to import configuration",
		configResetToDefault: "Configuration reset to default",
		confirmResetToDefault: "Are you sure you want to reset to default configuration? This will overwrite all current settings.",
		syncNotice: "Sync Notice",
		localStorageNotice: "Changes are saved locally on this device only. Use Export/Import to sync across devices.",
		
		// Shipping API Management
		manageShippingOptions: "Manage shipping options and pricing",
		addShippingOption: "Add Shipping Option",
		addNewShippingOption: "Add New Shipping Option",
		shippingName: "Shipping Name",
		enterShippingName: "Enter shipping method name",
		shippingPrice: "Shipping Price",
		shippingOptions: "Shipping Options",
		totalOptions: "Total Options",
		noShippingOptions: "No shipping options available",
		shippingMethod: "Shipping Method",
		selectShippingMethod: "Select shipping method",
		confirmDeleteShipping: "Are you sure you want to delete this shipping option?",
		errorLoadingShipping: "Error loading shipping options",
		errorLoadingShippingDescription: "Failed to load shipping options. Please try again later.",
		averagePrice: "Average Price",
		readyToUpgrade:
			"Ready to upgrade your medical facility? Contact our experts for personalized equipment recommendations and competitive pricing.",
		emailUs: "Email Us",
		callUs: "Call Us",
		visitUs: "Visit Us",
		sendUsQuestions: "Send us your questions anytime",
		supportHotline: "24/7 support hotline",
		sendUsMessage: "Send Us a Message",
		messageSentSuccessfully: "Message Sent Successfully!",
		thankYouContacting:
			"Thank you for contacting us. We'll get back to you within 24 hours.",
		fullName: "Full Name",
		emailAddress: "Email Address",
		phoneNumber: "Phone Number",
		product: "Product",
		selectProductOptional: "Select a product (optional)",
		quantity: "Quantity",
		tellUsAboutNeeds: "Tell us about your medical equipment needs...",
		includeDeliveryInfo: "Include delivery location, timeline, and any specs.",
		sending: "Sending...",
		failedToSendMessage:
			"Failed to send message. Please try again or contact us directly.",
		noProductSelected: "No product selected",
		ourLocation: "Our Location",
		medEquipProHeadquarters: "Dorar Medical Equipment",
		medicalDistrictNewYork: Contactinfo.address,
		businessHours: "Business Hours",
		mondayFriday: "Monday - Friday: 8:00 AM - 6:00 PM",
		emergencySupport: "Emergency Support",
		available247: "Available 24/7 for urgent issues",
		phoneNumberValue: Contactinfo.phone,
		phoneNumberPlaceholder: "+971 55 670 7773",

		// About
		aboutUs: "About Us",
		aboutUsDescription:
			"We are dedicated to delivering advanced, reliable medical equipment and integrated solutions that empower clinicians and improve patient outcomes. Our commitment to quality, safety, and innovation drives everything we do.",
		ourStory: "Our Story",
		ourMission: "Our Mission",
		ourVision: "Our Vision",
		ourValues: "Values",
		missionDescription:
			"Delivering state-of-the-art medical devices with uncompromising quality and support.",
		visionDescription:
			"Empowering healthcare systems through innovation and accessible technology.",
		valuesDescription:
			"Integrity, safety, collaboration, and continuous improvement.",

		// Blog
		readMore: "Read More",
		share: "Share",
		author: "Author",
		date: "Date",
		category: "Category",

		// Dashboard
		dashboard: "Dashboard",
		addProduct: "Add Product",
		manageProducts: "Manage Products",
		editProduct: "Edit Product",
		deleteProduct: "Delete Product",
		manageCategories: "Manage Categories",
		manageCategoriesDescription:
			"View, edit, and delete your product categories",
		addNewCategory: "Add New Category",
		categoryName: "Category Name",
		addCategory: "Add Category",
		created: "Created",
		actions: "Actions",
		viewCategory: "View Category",
		editCategory: "Edit Category",
		deleteCategory: "Delete Category",
		noDescription: "No description",
		noCategoriesFound: "No categories found",
		tryAdjustingSearch: "Try adjusting your search terms.",
		createFirstCategory: "Get started by creating your first category.",
		searchCategoriesPlaceholder: "Search categories by name or description...",
		updateCategory: "Update Category",
		manageSubCategories: "Manage SubCategories",
		manageSubcategoriesDescription:
			"Organize subcategories under their parent categories",
		categoriesAndSubcategories: "Categories & Subcategories",
		addSubcategory: "Add Subcategory",
		noSubcategoriesYet:
			'No subcategories yet. Click "Add Subcategory" to create one.',
		createSubcategory: "Create Subcategory",
		editSubcategory: "Edit Subcategory",
		parentCategory: "Parent Category",
		selectParentCategory: "Select a parent category",
		subcategoryName: "Subcategory Name",
		enterSubcategoryName: "Enter subcategory name",
		enterSubcategoryDescription: "Enter subcategory description",
		saving: "Saving...",
		updated: "Updated successfully",
		added: "Added successfully",
		failedToSave: "Failed to save subcategory",
		confirmDeleteSubcategory:
			"Are you sure you want to delete this subcategory?",
		addPost: "Add Post",
		managePosts: "Manage Posts",
		settings: "Settings",
		logout: "Logout",
		login: "Login",
		register: "Register",

		// Hero Section
		advancedMedicalEquipment: "Advanced Medical Equipment ",
		equipment: "You Can Trust",
		forHealthcareExcellence: "for Healthcare Excellence",
		heroDescription:
			"Since 2008, we have been committed to elevating healthcare standards across the region, providing advanced medical solutions you can trust. From specialized dermatology devices to complete operating room equipment and advanced medical gas systems.",
		exploreProducts: "Explore Products",
		contactUs: "Contact Us",
		yearsExperience: "Years Experience",
		medicalDevices: "Medical Devices",
		healthcareClients: "Healthcare Clients",
		currencySymbol: "د.إ",

		// CEO Section
		meetOurCEO: "Meet Our Co-Founder",
		ceoName: "Eng. Mohamed Medhat",
		ceoDescription1:
			"Dorar Medical was founded in 2008 with a mission to elevate healthcare standards in the UAE and the GCC.",
		ceoDescription2:
			"Initially a specialized medical equipment supplier, the company has grown into a leading provider of integrated healthcare solutions. Based in Ras Al Khaimah with an operational hub in Dubai, Dorar Medical supports hospitals and medical centers from concept to full operation, delivering modern, turnkey healthcare facilities.",
		deputyCEO: "Co-Founder",
		chiefOperationsOfficer: "Chief Operations Officer",

		// Our Team Section
		ourTeam: "Our Team",
		meetOurExpertTeam: "Meet Our Expert Team",
		teamDescription:
			"Our diverse team of medical professionals, engineers, and healthcare experts work together to deliver innovative solutions and exceptional service to healthcare facilities worldwide.",
		specialties: "Specialties",
		keyAchievements: "Key Achievements",
		connectOnLinkedIn: "Connect on LinkedIn",
		joinOurTeam: "Join Our Team",
		joinTeamDescription:
			"We're always looking for talented individuals who share our passion for improving healthcare through innovative medical equipment solutions.",
		viewCareers: "View Careers",
		teamQuote:
			'"Excellence in healthcare technology is not just our goal, it\'s our commitment to saving lives."',
		innovationTeam: "Innovation Team",

		// Why Choose Us Section
		whyChooseMedEquipPro: "Why Choose Dorar?",
		whyChooseDescription:
			"We're committed to delivering exceptional medical equipment solutions that enhance healthcare delivery and improve patient outcomes worldwide.",
		cuttingEdgeTechnology: "Cutting-Edge Technology",
		cuttingEdgeDescription:
			"Latest innovations in medical equipment with AI-powered diagnostics and smart connectivity.",
		fdaCertified: "FDA Certified",
		fdaDescription:
			"All our products meet the highest safety and quality standards with full regulatory compliance.",
		support247: "24/7 Support",
		supportDescription:
			"Round-the-clock technical support and maintenance services to keep your equipment running smoothly.",
		certifiedProducts: "Certified Products",
		countriesServed: "Countries Served",
		happyClients: "Happy Clients",
		readyToTransform: "Ready to Transform Your Healthcare Facility?",
		transformDescription:
			"Get in touch with our experts to find the perfect medical equipment solutions for your needs.",

		// Consultation Section
		since2008: "Since 2008",
		weRiseInCare: '"We rise in care...',
		toMakeAnImpact: 'to make an impact."',
		drivenByOneGoal:
			'"we\'ve been driven by one goal to elevate healthcare delivery standards in the UAE and the GCC region"',
		getFreeConsultation: "Get Free Consultation",

		// Partners Section
		trustedPartners: "Trusted Partners",
		ourPartners: "Our Partners",
		partnersDescription: "We work with leading healthcare organizations and medical institutions worldwide to deliver cutting-edge medical equipment solutions.",
		partnersNote: "Join our growing network of healthcare partners and experience the difference of working with industry leaders.",

		// Footer
		leadingProvider:
			"Leading provider of advanced medical equipment solutions, empowering healthcare professionals worldwide with cutting-edge technology.",
		stayConnected: "Stay Connected",
		newsletterDescription:
			"Subscribe to our newsletter for the latest updates on medical equipment and healthcare innovations.",
		enterYourEmail: "Enter your email",
		allRightsReserved: "© 2024 Dorar. All rights reserved.",
		privacyPolicy: "Privacy Policy",
		termsOfService: "Terms of Service",
		cookiePolicy: "Cookie Policy",
		connectingHealthcare: "Connecting healthcare professionals worldwide",

		// Featured Products Section
		premiumMedicalEquipment: "Premium Medical Equipment",
		featured: "Best Selling Products",
		featuredProductsDescription:
			"Discover our cutting-edge medical devices designed to enhance patient care and improve healthcare outcomes with innovative technology.",
		learnMore: "Learn More",
		requestDemo: "Request Demo",

		// Products Page
		ourProducts: "Our",
		productsDescription:
			"Discover our comprehensive range of cutting-edge medical equipment designed to enhance patient care and improve healthcare outcomes.",
		searchProducts: "Search products...",
		sortByName: "Sort by Name",
		sortByPriceLow: "Price: Low to High",
		sortByPriceHigh: "Price: High to Low",
		sortByRating: "Sort by Rating",
		grid: "Grid",
		list: "List",
		loadingProducts: "Loading products from API...",
		errorLoadingProducts: "Error Loading Products",
		failedToLoadProducts: "Failed to load products from the API",
		retry: "Retry",
		noProductsFound: "No Products Found",
		clearFilters: "Clear Filters",

		// Blog Page
		ourMedical: "Our Medical",
		blogDescription:
			"Discover insights, tips, and the latest updates from our team of medical equipment experts",
		featuredArticles: "Featured Articles",
		latestArticles: "Latest Articles",
		searchPosts: "Search Posts",
		searchPostsPlaceholder: "Search posts...",
		categories: "Categories",
		allCategories: "All Categories",
		sortBy: "Sort By",
		newestFirst: "Newest First",
		oldestFirst: "Oldest First",
		mostViewed: "Most Viewed",
		mostLiked: "Most Liked",
		postsFound: "posts found",
		readArticle: "Read Article",
		previous: "Previous",
		next: "Next",
		noValidPostsFound: "No valid posts found",
		noValidPostsDescription:
			"The available posts contain invalid or placeholder content. Please contact an administrator to add proper blog posts.",
		note: "Note",
		postsFilteredOut:
			"posts were found but filtered out due to poor content quality.",
		stayUpdated: "Stay Updated with Medical Innovation",
		stayUpdatedDescription:
			"Subscribe to our newsletter for the latest insights on medical equipment and healthcare technology.",

		// Blog Detail Page
		backToBlog: "Back to Blog",
		postNotFound: "Post Not Found",
		postNotFoundDescription:
			"The post you're looking for doesn't exist or has been removed.",
		aboutTheAuthor: "About the Author",
		minRead: "min read",
		views: "views",
		likes: "likes",
		like: "Like",
		liked: "Liked",

		// Dashboard
		welcomeBack: "Welcome back",
		overviewDescription:
			"Here's an overview of your medical equipment business.",
		totalCategories: "Total Categories",
		activeCategories: "Active Categories",
		totalPosts: "Total Posts",
		publishedPosts: "Published Posts",
		featuredPosts: "Featured Posts",
		totalValue: "Total Value",
		avgRating: "Avg Rating",
		recentCategories: "Recent Categories",
		recentPosts: "Recent Posts",
		quickActions: "Quick Actions",

		createNewProduct: "Create a new product listing",
		organizeCategories: "Organize your product categories",
		editInventory: "Edit and organize your inventory",
		createNewPost: "Create a new blog post",
		editPosts: "Edit and organize your blog posts",

		// Form Fields
		productName: "Product Name",
		subcategory: "Subcategory",
		images: "Images",
		reviews: "Reviews",
		features: "Features",
		specifications: "Specifications",
		stockQuantity: "Stock Quantity",
		warranty: "Warranty",
		certifications: "Certifications",
		enterProductName: "Enter product name",
		enterPrice: "Enter price",
		selectSubcategory: "Select subcategory",
		enterSpecifications: "Enter product specifications",
		enterShipping: "Enter shipping information",
		enterWarranty: "Enter warranty information",
		addFeature: "Add Feature",
		addCertification: "Add Certification",
		remove: "Remove",
		saveProduct: "Save Product",

		// Post Form Fields
		enterTitle: "Enter post title",
		enterAuthorName: "Enter author name",
		enterAuthorEmail: "Enter author email",
		enterPostImage: "Enter post image URL",
		enterContent: "Write your post content here...",
		enterTag: "Enter tag",
		addTag: "Add Tag",
		createPost: "Create Post",
		draft: "Draft",
		published: "Published",
		minimumCharacters: "Minimum 10 characters required. Current:",
		noProductsYet: "No products yet. Add your first product to get started!",
		noCategoriesYet:
			"No categories yet. Create your first category to organize products!",
		noPostsYet: "No posts yet. Create your first blog post to get started!",
		active: "Active",
		empty: "Empty",
		medicalEqPro: "MedicalEq Pro",
		confirmDeleteCategory:
			'Are you sure you want to delete "{{name}}"? This action cannot be undone.',

		// Privacy Policy
		privacyPolicySubtitle:
			"Your privacy and data protection are our top priorities. Learn how we collect, use, and protect your information.",
		lastUpdatedDate: "December 2024",
		introduction: "Introduction",
		introductionContent:
			"At Dorar Medical Equipment, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
		introductionContent2:
			"By using our website and services, you consent to the data practices described in this policy. We encourage you to read this Privacy Policy carefully to understand our practices regarding your personal information.",
		informationCollection: "Information We Collect",
		informationCollectionContent:
			"We collect information you provide directly to us, such as when you create an account, make a purchase, contact us, or subscribe to our newsletter. This may include your name, email address, phone number, billing address, and payment information. We also automatically collect certain information about your device and usage patterns when you visit our website.",
		dataUsage: "How We Use Your Information",
		dataUsageContent:
			"We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and personalize your experience. We may also use your information for marketing purposes, customer support, and to comply with legal obligations.",
		dataProtection: "Data Protection and Security",
		dataProtectionContent:
			"We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption and secure servers to safeguard your data.",
		dataSharing: "Information Sharing",
		dataSharingContent:
			"We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our website and conducting our business.",
		cookies: "Cookies and Tracking Technologies",
		cookiesContent:
			"We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.",
		yourRights: "Your Rights and Choices",
		yourRightsContent:
			"You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights or for any privacy-related questions, please contact us using the information provided below.",
		policyUpdates: "Policy Updates",
		policyUpdatesContent:
			'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.',
		privacyContactDescription:
			"If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us. We are here to help and ensure your privacy concerns are addressed promptly.",

		// Testimonials Section
		whatOurClientsSay: "What Our Clients Say",
		testimonialsDescription:
			"Discover why healthcare professionals across the region trust Dorar Medical for their equipment needs. Read testimonials from our satisfied clients.",
		autoPlayOn: "Auto-play On",
		autoPlayOff: "Auto-play Off",

		// Partners Section
		doctors: "Team",
		ourExpertDoctors: "Our Expert Team",
		meetOurQualifiedMedicalProfessionals: "Meet Our Qualified Medical Professionals",
		searchDoctors: "Search Team",
		allSpecializations: "All Specializations",
		allLocations: "All Locations",
		all: "All",
		noDoctorsFound: "No Team Found",
		tryAdjustingYourFilters: "Try adjusting your filters",
		viewProfile: "View Profile",
		doctorNotFound: "Doctor Not Found",
		theDoctorYouAreLookingForDoesNotExist: "The doctor you are looking for does not exist",
		backToDoctors: "Back to Team",
		specialization: "Specialization",
		skills: "Skills",
		qualifications: "Qualifications",
		experience: "Experience",
		contactInformation: "Contact Information",
		socialMedia: "Social Media",
		visitProfile: "Visit Profile",
		errorLoadingDoctors: "Error Loading Team",
		pleaseTryAgainLater: "Please try again later",

		// Doctor Management
		addDoctor: "Add Member",
		manageDoctors: "Manage Members",
		manageDoctorsDescription: "View, edit, and delete your members",
		totalDoctors: "Total Members",
		topRatedDoctors: "Top Rated Members",
		noDoctorsYet: "No members yet",
		addYourFirstDoctor: "Add your first doctor to get started!",
		doctorAddedSuccessfully: "Doctor added successfully",
		failedToAddDoctor: "Failed to add doctor",
		doctorDeletedSuccessfully: "Doctor deleted successfully",
		failedToDeleteDoctor: "Failed to delete doctor",
		confirmDeleteDoctor: "Delete Doctor",
		confirmDeleteDoctorDescription: "Are you sure you want to delete {{name}}? This action cannot be undone.",
		editFunctionalityComingSoon: "Edit functionality coming soon",
		basicInformation: "Basic Information",
		imageUrl: "Image URL",
		addSkill: "Add Skill",
		addQualification: "Add Qualification",
		addExperience: "Add Experience",
		cancel: "Cancel",
		deleting: "Deleting...",
		edit: "Edit",
		delete: "Delete",
		editDoctor: "Edit Doctor",
		updateDoctor: "Update Doctor",
		doctorUpdatedSuccessfully: "Doctor updated successfully",
		failedToUpdateDoctor: "Failed to update doctor",
	},
};

// Arabic translations
const arTranslations = {
	translation: {
		// Navigation
		home: "الرئيسية",
		products: "المنتجات",
		blog: "المدونة",
		about: "من نحن",
		favorites: "المفضلة",
		contact: "اتصل بنا",

		// Header
		medEquipPro: "درر",
		medicalEquipmentSolutions: "حلول المعدات الطبية",
		selectCategory: "اختر الفئة",
		viewProducts: "عرض المنتجات",
		subcategories: "الفئات الفرعية",
		viewAllProducts: "عرض جميع المنتجات",
		noCategoriesAvailable: "لا توجد فئات متاحة",
		language: "اللغة",
		english: "English",
		arabic: "العربية",
		switchToArabic: "العربية",
		switchToEnglish: "English",

		// Common
		details: "التفاصيل",
		addOrder: "إضافة طلب",
		contactSales: "تواصل مع المبيعات",
		addToCart: "أضف للسلة",
		addedToCart: "تم الإضافة للسلة",
		viewCart: "عرض السلة",
		professionalMedicalEquipment: "معدات طبية احترافية",

		// Contact Info Management
		socialMediaLinks: "روابط وسائل التواصل الاجتماعي",
		ceoPhotos: "صور الرئيس التنفيذي",
		ceoPhoto: "صورة الرئيس التنفيذي",
		ceoSmallPhoto: "صورة الرئيس التنفيذي الصغيرة",
		partners: "الشركاء",
		addPartner: "إضافة شريك",
		editPartner: "تعديل الشريك",
		altText: "النص البديل",
		websiteUrl: "رابط الموقع",
		adding: "جاري الإضافة...",
		contactInfoUpdated: "تم تحديث معلومات الاتصال بنجاح",
		updateFailed: "فشل في تحديث معلومات الاتصال",
		partnerAdded: "تم إضافة الشريك بنجاح",
		addPartnerFailed: "فشل في إضافة الشريك",
		partnerUpdated: "تم تحديث الشريك بنجاح",
		updatePartnerFailed: "فشل في تحديث الشريك",
		confirmDeletePartner: "هل أنت متأكد من حذف هذا الشريك؟",
		partnerDeleted: "تم حذف الشريك بنجاح",
		deletePartnerFailed: "فشل في حذف الشريك",
		errorLoadingContactInfo: "خطأ في تحميل معلومات الاتصال",
		noContactInfoFound: "لم يتم العثور على معلومات الاتصال",

		// Favorites Page
		favoritesTitle: "المفضلة",
		favoritesSubtitle:
			"قائمة معداتك الطبية المحفوظة للوصول السريع والمقارنة.",
		loadingFavorites: "جاري تحميل المفضلة...",
		errorLoadingFavoritesTitle: "خطأ في تحميل المنتجات",
		errorLoadingFavoritesDescription:
			"فشل في تحميل المنتجات المفضلة. يرجى المحاولة مرة أخرى.",
		noFavoritesYet: "لا توجد مفضلات بعد",
		emptyFavoritesHint:
			"تصفح المنتجات واضغط على أيقونة القلب لحفظها هنا.",
		browseProducts: "تصفح المنتجات",

		// Cart Page
		cartTitle: "سلة التسوق",
		cartSubtitle: "راجع المعدات الطبية المختارة واتقدم للدفع.",
		loadingCart: "جاري تحميل السلة...",
		errorLoadingCartTitle: "خطأ في تحميل السلة",
		errorLoadingCartDescription: "فشل في تحميل عناصر السلة. يرجى المحاولة مرة أخرى.",
		cartEmpty: "سلة التسوق فارغة",
		emptyCartHint: "أضف بعض المعدات الطبية إلى سلة التسوق للبدء.",
		cartItems: "عناصر السلة",
		clearCart: "مسح السلة",
		orderSummary: "ملخص الطلب",
		subtotal: "المجموع الفرعي",
		shipping: "الشحن",
		free: "مجاني",
		total: "المجموع",
		proceedToCheckout: "اتقدم للدفع",
		continueShopping: "متابعة التسوق",
		addedToCartMessage: "تم إضافته للسلة!",
		removedFromCartMessage: "تم حذفه من السلة",
		cartClearedMessage: "تم مسح السلة بنجاح",

		// Checkout Page
		checkoutTitle: "الدفع",
		checkoutSubtitle: "أكمل طلبك وسنقوم بتوصيل معداتك الطبية بأمان.",
		haveCoupon: "هل لديك كوبون؟",
		clickHereToEnter: "انقر هنا لإدخال الكود",
		couponDescription: "إذا كان لديك كود كوبون، يرجى تطبيقه أدناه.",
		couponCode: "كود الكوبون",
		applyCoupon: "تطبيق الكوبون",
		billingDetails: "تفاصيل الفواتير",
		contactDetails: "تفاصيل الاتصال",
		firstName: "الاسم الأول",
		lastName: "الاسم الأخير",
		phone: "الهاتف",
		email: "عنوان البريد الإلكتروني",
		address: "العنوان",
		emirate: "الإمارة",
		selectEmirate: "يرجى اختيار الإمارة",
		streetAddress: "عنوان الشقة / المبنى / الشارع",
		streetAddressPlaceholder: "الشقة، المبنى واسم الشارع",
		createAccount: "إنشاء حساب؟",
		password: "كلمة مرور الحساب",
		additionalInfo: "معلومات إضافية",
		orderNotes: "ملاحظات الطلب",
		optional: "اختياري",
		orderNotesPlaceholder: "ملاحظات حول طلبك، مثل ملاحظات خاصة للتسليم.",
		deliveryNotice: "يرجى السماح بـ 1-2 أيام عمل للتسليم بعد معالجة الطلب.",
		yourOrder: "طلبك",
		paymentMethods: "طرق الدفع",
		vat: "ضريبة القيمة المضافة",
		termsAgreement: "لقد قرأت ووافقت على موقع الويب",
		termsAndConditions: "الشروط والأحكام",
		placeOrder: "تأكيد الطلب",
		processingOrder: "جاري معالجة الطلب...",

		// Product related
		uncategorized: "غير مصنف",
		more: "المزيد",
		rating: "التقييم",

		// Actions
		close: "إغلاق",
		search: "بحث",
		filter: "تصفية",
		sort: "ترتيب",
		view: "عرض",
		back: "رجوع",
		print: "طباعة",
		downloadPDF: "تحميل PDF",
		generating: "جاري التوليد...",

		// Status
		inStock: "متوفر",
		outOfStock: "غير متوفر",
		loading: "جاري التحميل...",
		error: "خطأ",
		success: "نجح",

		// Bank Account
		bankAccountDetails: "تفاصيل الحساب البنكي",
		bankAccountDescription: "معلومات مصرفية كاملة للمدفوعات والتحويلات",
		companyInformation: "معلومات الشركة",
		companyName: "اسم الشركة",
		bankingDetails: "التفاصيل المصرفية",
		customerTRN: "رقم التسجيل الضريبي للعميل",
		poBox: "صندوق البريد",
		accountType: "نوع الحساب",
		accountNumber: "رقم الحساب",
		iban: "رقم الآيبان",
		currency: "العملة",
		branch: "الفرع",
		importantNotice: "إشعار مهم",
		bankAccountNotice: "يرجى استخدام رقم الطلب كمرجع للدفع عند إجراء التحويلات البنكية. يجب أن تكون جميع المدفوعات بالدرهم الإماراتي.",
		clickToViewBankDetails: "انقر لعرض تفاصيلنا المصرفية للدفع",
		viewBankDetails: "عرض التفاصيل المصرفية",

		// Invoice
		invoice: "الفاتورة",
		invoiceDetails: "تفاصيل الفاتورة",
		billTo: "الفاتورة إلى",
		description: "الوصف",
		qty: "الكمية",
		price: "السعر",
		paymentMethod: "طريقة الدفع",
		notes: "ملاحظات",
		dueDate: "تاريخ الاستحقاق",

		// Contact
		getInTouch: "تواصل معنا",
		sendMessage: "إرسال رسالة",
		name: "الاسم",
		message: "الرسالة",
		subject: "الموضوع",

		// Newsletter
		newsletter: "النشرة الإخبارية",
		subscribeToNewsletter: "اشترك في نشرتنا الإخبارية",
		newsletterEmail: "عنوان البريد الإلكتروني",
		subscribe: "اشتراك",
		subscribing: "جاري الاشتراك...",
		subscribed: "تم الاشتراك!",
		subscriptionSuccess: "شكراً لك على الاشتراك في نشرتنا الإخبارية!",
		subscriptionError: "فشل في الاشتراك. يرجى المحاولة مرة أخرى.",
		invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح",
		emailRequired: "عنوان البريد الإلكتروني مطلوب",
		
		// Phone Types
		homePhone: "هاتف المنزل",
		clinicPhone: "هاتف العيادة",
		enterHomePhone: "أدخل رقم هاتف المنزل",
		enterClinicPhone: "أدخل رقم هاتف العيادة",
		
		// Shipping Management
		shippingManagement: "إدارة الشحن",
		manageShippingCosts: "إدارة تكاليف الشحن للإمارات المختلفة",
		addEmirate: "إضافة إمارة",
		addNewEmirate: "إضافة إمارة جديدة",
		emirateName: "اسم الإمارة",
		enterEmirateName: "أدخل اسم الإمارة",
		shippingCost: "تكلفة الشحن",
		emiratesShippingCosts: "تكاليف شحن الإمارات",
		lastUpdated: "آخر تحديث",
		shippingSummary: "ملخص الشحن",
		totalEmirates: "إجمالي الإمارات",
		averageCost: "متوسط التكلفة",
		shippingCostUpdated: "تم تحديث تكلفة الشحن بنجاح",
		emirateAdded: "تم إضافة الإمارة بنجاح",
		emirateDeleted: "تم حذف الإمارة بنجاح",
		confirmDeleteEmirate: "هل أنت متأكد من حذف هذه الإمارة؟",
		exportConfig: "تصدير إعدادات الشحن",
		export: "تصدير",
		import: "استيراد",
		reset: "إعادة تعيين",
		resetToDefault: "إعادة تعيين إلى الإعدادات الافتراضية",
		configExported: "تم تصدير الإعدادات بنجاح",
		configImported: "تم استيراد الإعدادات بنجاح",
		invalidConfigFile: "ملف إعدادات غير صالح",
		failedToImportConfig: "فشل في استيراد الإعدادات",
		configResetToDefault: "تم إعادة تعيين الإعدادات إلى الافتراضية",
		confirmResetToDefault: "هل أنت متأكد من إعادة تعيين الإعدادات إلى الافتراضية؟ سيتم استبدال جميع الإعدادات الحالية.",
		syncNotice: "إشعار المزامنة",
		localStorageNotice: "التغييرات محفوظة محلياً على هذا الجهاز فقط. استخدم التصدير/الاستيراد للمزامنة عبر الأجهزة.",
		
		// Shipping API Management
		manageShippingOptions: "إدارة خيارات الشحن والأسعار",
		addShippingOption: "إضافة خيار شحن",
		addNewShippingOption: "إضافة خيار شحن جديد",
		shippingName: "اسم الشحن",
		enterShippingName: "أدخل اسم طريقة الشحن",
		shippingPrice: "سعر الشحن",
		shippingOptions: "خيارات الشحن",
		totalOptions: "إجمالي الخيارات",
		noShippingOptions: "لا توجد خيارات شحن متاحة",
		shippingMethod: "طريقة الشحن",
		selectShippingMethod: "اختر طريقة الشحن",
		confirmDeleteShipping: "هل أنت متأكد من حذف خيار الشحن هذا؟",
		errorLoadingShipping: "خطأ في تحميل خيارات الشحن",
		errorLoadingShippingDescription: "فشل في تحميل خيارات الشحن. يرجى المحاولة مرة أخرى لاحقاً.",
		averagePrice: "متوسط السعر",
		readyToUpgrade:
			"هل أنت مستعد لترقية منشأة الرعاية الصحية الخاصة بك؟ تواصل مع خبرائنا للحصول على توصيات معدات مخصصة وأسعار تنافسية.",
		emailUs: "راسلنا عبر البريد الإلكتروني",
		callUs: "اتصل بنا",
		visitUs: "زرنا",
		sendUsQuestions: "أرسل لنا أسئلتك في أي وقت",
		supportHotline: "خط دعم على مدار الساعة",
		sendUsMessage: "أرسل لنا رسالة",
		messageSentSuccessfully: "تم إرسال الرسالة بنجاح!",
		thankYouContacting: "شكراً لك على التواصل معنا. سنرد عليك خلال 24 ساعة.",
		fullName: "الاسم الكامل",
		emailAddress: "عنوان البريد الإلكتروني",
		phoneNumber: "رقم الهاتف",
		product: "المنتج",
		selectProductOptional: "اختر منتجاً (اختياري)",
		quantity: "الكمية",
		tellUsAboutNeeds: "أخبرنا عن احتياجاتك من المعدات الطبية...",
		includeDeliveryInfo: "تضمين موقع التسليم والجدول الزمني والمواصفات.",
		sending: "جاري الإرسال...",
		failedToSendMessage:
			"فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.",
		noProductSelected: "لم يتم اختيار منتج",
		ourLocation: "موقعنا",
		medEquipProHeadquarters: "درر للمعدات الطبية",
		medicalDistrictNewYork:
			"مدينة دبي الطبية، المبنى 40، المكتب 503، ص.ب: 29968 رأس الخيمة",
		businessHours: "ساعات العمل",
		mondayFriday: "الاثنين - الجمعة: 8:00 صباحاً - 6:00 مساءً",
		emergencySupport: "الدعم الطارئ",
		available247: "متاح على مدار الساعة للمشاكل العاجلة",
		phoneNumberValue: Contactinfo.phone,
		phoneNumberPlaceholder: "+971 55 670 7773",

		// About
		aboutUs: "من نحن",
		aboutUsDescription:
			"نحن متخصصون في تقديم معدات طبية متقدمة وموثوقة وحلول متكاملة تمكّن الأطباء وتحسن نتائج المرضى. التزامنا بالجودة والسلامة والابتكار يدفع كل ما نقوم به.",
		ourStory: "قصتنا",
		ourMission: "مهمتنا",
		ourVision: "رؤيتنا",
		ourValues: "قيمنا",
		missionDescription: "تقديم أجهزة طبية متطورة بجودة ودعم لا يتزعزع.",
		visionDescription:
			"تمكين أنظمة الرعاية الصحية من خلال الابتكار والتكنولوجيا المتاحة.",
		valuesDescription: "النزاهة والسلامة والتعاون والتحسين المستمر.",

		// Blog
		readMore: "اقرأ المزيد",
		share: "مشاركة",
		author: "الكاتب",
		date: "التاريخ",
		category: "الفئة",

		// Dashboard
		dashboard: "لوحة التحكم",
		addProduct: "إضافة منتج",
		manageProducts: "إدارة المنتجات",
		editProduct: "تعديل المنتج",
		deleteProduct: "حذف المنتج",
		manageCategories: "إدارة الفئات",
		manageCategoriesDescription: "عرض وتحرير وحذف فئات المنتجات الخاصة بك",
		addNewCategory: "إضافة فئة جديدة",
		categoryName: "اسم الفئة",
		addCategory: "إضافة فئة",
		created: "تاريخ الإنشاء",
		actions: "الإجراءات",
		viewCategory: "عرض الفئة",
		editCategory: "تعديل الفئة",
		deleteCategory: "حذف الفئة",
		noDescription: "لا يوجد وصف",
		noCategoriesFound: "لا توجد فئات",
		tryAdjustingSearch: "حاول تعديل كلمات البحث.",
		createFirstCategory: "ابدأ بإنشاء أول فئة.",
		searchCategoriesPlaceholder: "ابحث في الفئات بالاسم أو الوصف...",
		updateCategory: "تحديث الفئة",
		manageSubCategories: "إدارة الفئات الفرعية",
		manageSubcategoriesDescription: "تنظيم الفئات الفرعية تحت الفئات الرئيسية",
		categoriesAndSubcategories: "الفئات والفئات الفرعية",
		addSubcategory: "إضافة فئة فرعية",
		noSubcategoriesYet:
			'لا توجد فئات فرعية بعد. اضغط "إضافة فئة فرعية" لإنشاء واحدة.',
		createSubcategory: "إنشاء فئة فرعية",
		editSubcategory: "تعديل الفئة الفرعية",
		parentCategory: "الفئة الرئيسية",
		selectParentCategory: "اختر فئة رئيسية",
		subcategoryName: "اسم الفئة الفرعية",
		enterSubcategoryName: "أدخل اسم الفئة الفرعية",
		enterSubcategoryDescription: "أدخل وصف الفئة الفرعية",
		saving: "جاري الحفظ...",
		updated: "تم التحديث بنجاح",
		added: "تمت الإضافة بنجاح",
		failedToSave: "فشل حفظ الفئة الفرعية",
		confirmDeleteSubcategory: "هل أنت متأكد أنك تريد حذف هذه الفئة الفرعية؟",
		addPost: "إضافة مقال",
		managePosts: "إدارة المقالات",
		settings: "الإعدادات",
		logout: "تسجيل الخروج",
		login: "تسجيل الدخول",
		register: "التسجيل",

		// Hero Section
		advancedMedicalEquipment: "معدات طبية متقدمة ",
		equipment:  "يمكنك الوثوق بها",
		forHealthcareExcellence: "للرعاية الصحية المتقدمة",
		heroDescription:
			"منذ عام 2008، ونحن ملتزمون بالارتقاء بمعايير الرعاية الصحية في جميع أنحاء المنطقة، مقدمين حلولاً طبية متطورة يمكنك الوثوق بها. من أجهزة الأمراض الجلدية المتخصصة إلى تجهيزات غرف العمليات الكاملة وأنظمة الغازات الطبية المتقدمة.",
		exploreProducts: "استكشف المنتجات",
		contactUs: "اتصل بنا",
		yearsExperience: "سنوات الخبرة",
		medicalDevices: "الأجهزة الطبية",
		healthcareClients: "عملاء الرعاية الصحية",
		currencySymbol: "د.إ",

		// CEO Section
		meetOurCEO: "تعرف على الشريك المؤسس",
		ceoName: "م. محمد مدحت",
		ceoDescription1:
			"تأسست درر الطبية في عام 2008 بمهمة رفع معايير الرعاية الصحية في دولة الإمارات العربية المتحدة ودول مجلس التعاون الخليجي.",
		ceoDescription2:
			"بدأت كمورد متخصص للمعدات الطبية، ونمت الشركة لتصبح مزود رائد للحلول الصحية المتكاملة. مقرها في رأس الخيمة مع مركز عمليات في دبي، تدعم درر الطبية المستشفيات والمراكز الطبية من المفهوم إلى التشغيل الكامل، وتقدم مرافق صحية حديثة ومتكاملة.",
		deputyCEO: "الشريك المؤسس",
		chiefOperationsOfficer: "مدير العمليات",

		// Our Team Section
		ourTeam: "فريقنا",
		meetOurExpertTeam: "تعرف على فريق الخبراء لدينا",
		teamDescription:
			"فريقنا المتنوع من المتخصصين الطبيين والمهندسين وخبراء الرعاية الصحية يعملون معاً لتقديم حلول مبتكرة وخدمة استثنائية للمنشآت الصحية في جميع أنحاء العالم.",
		specialties: "التخصصات",
		keyAchievements: "الإنجازات الرئيسية",
		connectOnLinkedIn: "تواصل على لينكد إن",
		joinOurTeam: "انضم إلى فريقنا",
		joinTeamDescription:
			"نبحث دائماً عن الأفراد الموهوبين الذين يشاركوننا شغفنا لتحسين الرعاية الصحية من خلال حلول المعدات الطبية المبتكرة.",
		viewCareers: "عرض الوظائف",
		teamQuote:
			'"التميز في التكنولوجيا الصحية ليس مجرد هدفنا، بل التزامنا بإنقاذ الأرواح."',
		innovationTeam: "فريق الابتكار",

		// Why Choose Us Section
		whyChooseMedEquipPro: "لماذا تختار درر؟",
		whyChooseDescription:
			"نحن ملتزمون بتقديم حلول استثنائية للمعدات الطبية تعزز تقديم الرعاية الصحية وتحسن نتائج المرضى في جميع أنحاء العالم.",
		cuttingEdgeTechnology: "التكنولوجيا المتطورة",
		cuttingEdgeDescription:
			"أحدث الابتكارات في المعدات الطبية مع التشخيص المدعوم بالذكاء الاصطناعي والاتصال الذكي.",
		fdaCertified: "معتمد من إدارة الغذاء والدواء",
		fdaDescription:
			"جميع منتجاتنا تلبي أعلى معايير السلامة والجودة مع الامتثال التنظيمي الكامل.",
		support247: "الدعم على مدار الساعة",
		supportDescription:
			"خدمات الدعم الفني والصيانة على مدار الساعة لإبقاء معداتك تعمل بسلاسة.",
		certifiedProducts: "المنتجات المعتمدة",
		countriesServed: "البلدان المخدمة",
		happyClients: "العملاء السعداء",
		readyToTransform: "هل أنت مستعد لتحويل منشأة الرعاية الصحية الخاصة بك؟",
		transformDescription:
			"تواصل مع خبرائنا للعثور على حلول المعدات الطبية المثالية لاحتياجاتك.",

		// Consultation Section
		since2008: "منذ عام 2008",
		weRiseInCare: '"نحن نرتقي في الرعاية...',
		toMakeAnImpact: 'لإحداث تأثير."',
		drivenByOneGoal:
			'"لقد كنا مدفوعين بهدف واحد وهو رفع معايير الرعاية الصحية في دولة الإمارات العربية المتحدة ومنطقة دول مجلس التعاون الخليجي"',
		getFreeConsultation: "احصل على استشارة مجانية",

		// Partners Section
		trustedPartners: "شركاء موثوقون",
		ourPartners: "شركاؤنا",
		partnersDescription: "نعمل مع منظمات الرعاية الصحية والمؤسسات الطبية الرائدة في جميع أنحاء العالم لتقديم حلول المعدات الطبية المتطورة.",
		partnersNote: "انضم إلى شبكة شركاء الرعاية الصحية المتنامية لدينا واكتشف الفرق في العمل مع قادة الصناعة.",

		// Footer
		leadingProvider:
			"المزود الرائد لحلول المعدات الطبية المتقدمة، تمكين المتخصصين في الرعاية الصحية في جميع أنحاء العالم بأحدث التقنيات.",
		stayConnected: "ابق على اتصال",
		newsletterDescription:
			"اشترك في نشرتنا الإخبارية للحصول على أحدث التحديثات حول المعدات الطبية وابتكارات الرعاية الصحية.",
		enterYourEmail: "أدخل بريدك الإلكتروني",
		allRightsReserved: "© 2024 درر. جميع الحقوق محفوظة.",
		privacyPolicy: "سياسة الخصوصية",
		termsOfService: "شروط الخدمة",
		cookiePolicy: "سياسة ملفات تعريف الارتباط",
		connectingHealthcare:
			"ربط المتخصصين في الرعاية الصحية في جميع أنحاء العالم",

		// Featured Products Section
		premiumMedicalEquipment: "معدات طبية فاخرة",
		featured: "منتجاتنا المميزة",
		featuredProductsDescription:
			"اكتشف أجهزتنا الطبية المتطورة المصممة لتعزيز رعاية المرضى وتحسين نتائج الرعاية الصحية بالتكنولوجيا المبتكرة.",
		learnMore: "اعرف المزيد",
		requestDemo: "طلب عرض توضيحي",

		// Products Page
		ourProducts: "منتجاتنا",
		productsDescription:
			"اكتشف مجموعتنا الشاملة من المعدات الطبية المتطورة المصممة لتعزيز رعاية المرضى وتحسين نتائج الرعاية الصحية.",
		searchProducts: "البحث في المنتجات...",
		sortByName: "ترتيب حسب الاسم",
		sortByPriceLow: "السعر: من الأقل إلى الأعلى",
		sortByPriceHigh: "السعر: من الأعلى إلى الأقل",
		sortByRating: "ترتيب حسب التقييم",
		grid: "شبكة",
		list: "قائمة",
		loadingProducts: "جاري تحميل المنتجات من API...",
		errorLoadingProducts: "خطأ في تحميل المنتجات",
		failedToLoadProducts: "فشل في تحميل المنتجات من API",
		retry: "إعادة المحاولة",
		noProductsFound: "لم يتم العثور على منتجات",
		clearFilters: "مسح المرشحات",

		// Blog Page
		ourMedical: "مدونتنا الطبية",
		blogDescription:
			"اكتشف الرؤى والنصائح وأحدث التحديثات من فريق خبراء المعدات الطبية لدينا",
		featuredArticles: "المقالات المميزة",
		latestArticles: "أحدث المقالات",
		searchPosts: "البحث في المقالات",
		searchPostsPlaceholder: "البحث في المقالات...",
		categories: "الفئات",
		allCategories: "جميع الفئات",
		sortBy: "ترتيب حسب",
		newestFirst: "الأحدث أولاً",
		oldestFirst: "الأقدم أولاً",
		mostViewed: "الأكثر مشاهدة",
		mostLiked: "الأكثر إعجاباً",
		postsFound: "مقالات تم العثور عليها",
		readArticle: "اقرأ المقال",
		previous: "السابق",
		next: "التالي",
		noValidPostsFound: "لم يتم العثور على مقالات صالحة",
		noValidPostsDescription:
			"المقالات المتاحة تحتوي على محتوى غير صالح أو مؤقت. يرجى التواصل مع المسؤول لإضافة مقالات مدونة مناسبة.",
		note: "ملاحظة",
		postsFilteredOut:
			"مقالات تم العثور عليها ولكن تم تصفيتها بسبب جودة المحتوى الرديئة.",
		stayUpdated: "ابق على اطلاع بالابتكار الطبي",
		stayUpdatedDescription:
			"اشترك في نشرتنا الإخبارية للحصول على أحدث الرؤى حول المعدات الطبية وتكنولوجيا الرعاية الصحية.",

		// Blog Detail Page
		backToBlog: "العودة إلى المدونة",
		postNotFound: "المقال غير موجود",
		postNotFoundDescription: "المقال الذي تبحث عنه غير موجود أو تم حذفه.",
		aboutTheAuthor: "عن الكاتب",
		minRead: "دقائق للقراءة",
		views: "مشاهدات",
		likes: "إعجابات",
		like: "إعجاب",
		liked: "أعجبني",

		// Dashboard
		welcomeBack: "مرحباً بعودتك",
		overviewDescription: "إليك نظرة عامة على أعمال المعدات الطبية الخاصة بك.",
		totalCategories: "إجمالي الفئات",
		activeCategories: "الفئات النشطة",
		totalPosts: "إجمالي المقالات",
		publishedPosts: "المقالات المنشورة",
		featuredPosts: "المقالات المميزة",
		totalValue: "القيمة الإجمالية",
		avgRating: "متوسط التقييم",
		recentCategories: "الفئات الحديثة",
		recentPosts: "المقالات الحديثة",
		quickActions: "الإجراءات السريعة",

		createNewProduct: "إنشاء قائمة منتج جديد",
		organizeCategories: "تنظيم فئات المنتجات الخاصة بك",
		editInventory: "تحرير وتنظيم المخزون",
		createNewPost: "إنشاء مقال مدونة جديد",
		editPosts: "تحرير وتنظيم مقالات المدونة",

		// Form Fields
		productName: "اسم المنتج",
		subcategory: "الفئة الفرعية",
		images: "الصور",
		reviews: "التقييمات",
		features: "المميزات",
		specifications: "المواصفات",
		stockQuantity: "كمية المخزون",
		warranty: "الضمان",
		certifications: "الشهادات",
		enterProductName: "أدخل اسم المنتج",
		enterPrice: "أدخل السعر",
		selectSubcategory: "اختر الفئة الفرعية",
		enterSpecifications: "أدخل مواصفات المنتج",
		enterShipping: "أدخل معلومات الشحن",
		enterWarranty: "أدخل معلومات الضمان",
		addFeature: "إضافة ميزة",
		addCertification: "إضافة شهادة",
		remove: "إزالة",
		saveProduct: "حفظ المنتج",

		// Post Form Fields
		enterTitle: "Enter post title",
		enterAuthorName: "Enter author name",
		enterAuthorEmail: "Enter author email",
		enterPostImage: "Enter post image URL",
		enterContent: "Write your post content here...",
		enterTag: "Enter tag",
		addTag: "Add Tag",
		createPost: "Create Post",
		draft: "Draft",
		published: "Published",
		minimumCharacters: "Minimum 10 characters required. Current:",
		noProductsYet: "No products yet. Add your first product to get started!",
		noCategoriesYet:
			"No categories yet. Create your first category to organize products!",
		noPostsYet: "No posts yet. Create your first blog post to get started!",
		active: "Active",
		empty: "Empty",
		medicalEqPro: "MedicalEq Pro",
		confirmDeleteCategory:
			'Are you sure you want to delete "{{name}}"? This action cannot be undone.',

		// Privacy Policy
		privacyPolicySubtitle:
			"خصوصيتك وحماية بياناتك هي أولوياتنا القصوى. تعرف على كيفية جمعنا واستخدامنا وحماية معلوماتك.",
		lastUpdatedDate: "ديسمبر 2024",
		introduction: "مقدمة",
		introductionContent:
			"في درر للمعدات الطبية، نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية. تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا والكشف عن معلوماتك وحمايتها عند زيارة موقعنا الإلكتروني أو استخدام خدماتنا.",
		introductionContent2:
			"باستخدام موقعنا الإلكتروني وخدماتنا، فإنك توافق على ممارسات البيانات الموضحة في هذه السياسة. نشجعك على قراءة سياسة الخصوصية هذه بعناية لفهم ممارساتنا المتعلقة بمعلوماتك الشخصية.",
		informationCollection: "المعلومات التي نجمعها",
		informationCollectionContent:
			"نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو إجراء عملية شراء أو التواصل معنا أو الاشتراك في نشرتنا الإخبارية. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وعنوان الفواتير ومعلومات الدفع. نجمع أيضاً تلقائياً معلومات معينة حول جهازك وأنماط الاستخدام عند زيارة موقعنا الإلكتروني.",
		dataUsage: "كيف نستخدم معلوماتك",
		dataUsageContent:
			"نستخدم المعلومات التي نجمعها لتقديم خدماتنا وصيانتها وتحسينها ومعالجة المعاملات والتواصل معك وتخصيص تجربتك. قد نستخدم أيضاً معلوماتك لأغراض التسويق ودعم العملاء والامتثال للالتزامات القانونية.",
		dataProtection: "حماية البيانات والأمان",
		dataProtectionContent:
			"نطبق تدابير أمنية تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. نستخدم التشفير والخوادم الآمنة المعيارية في الصناعة لحماية بياناتك.",
		dataSharing: "مشاركة المعلومات",
		dataSharingContent:
			"نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف ثالثة دون موافقتك، باستثناء ما هو موضح في هذه السياسة. قد نشارك معلوماتك مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا الإلكتروني وإدارة أعمالنا.",
		cookies: "ملفات تعريف الارتباط وتقنيات التتبع",
		cookiesContent:
			"نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربة التصفح الخاصة بك وتحليل حركة المرور على الموقع وتخصيص المحتوى. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال تفضيلات المتصفح، على الرغم من أن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف الموقع.",
		yourRights: "حقوقك وخياراتك",
		yourRightsContent:
			"لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها. يمكنك أيضاً إلغاء الاشتراك في الاتصالات التسويقية في أي وقت. لممارسة هذه الحقوق أو لأي أسئلة متعلقة بالخصوصية، يرجى التواصل معنا باستخدام المعلومات المقدمة أدناه.",
		policyUpdates: "تحديثات السياسة",
		policyUpdatesContent:
			'قد نحدث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية أخرى. سنخطرك بأي تغييرات جوهرية عن طريق نشر السياسة المحدثة على موقعنا الإلكتروني وتحديث تاريخ "آخر تحديث".',
		privacyContactDescription:
			"إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، فلا تتردد في التواصل معنا. نحن هنا للمساعدة وضمان معالجة مخاوفك المتعلقة بالخصوصية على الفور.",

		// Testimonials Section
		whatOurClientsSay: "ماذا يقول عملاؤنا",
		testimonialsDescription:
			"اكتشف لماذا يثق المتخصصون في الرعاية الصحية في جميع أنحاء المنطقة في درر الطبية لتلبية احتياجاتهم من المعدات. اقرأ شهادات عملائنا الراضين.",
		autoPlayOn: "التشغيل التلقائي مفعل",
		autoPlayOff: "التشغيل التلقائي معطل",

		// Partners Section
		doctors: "الشركاء",
		ourExpertDoctors: "شركاؤنا الخبراء",
		meetOurQualifiedMedicalProfessionals: "تعرف على المتخصصين الطبيين المؤهلين لدينا",
		searchDoctors: "البحث في الشركاء",
		allSpecializations: "جميع التخصصات",
		allLocations: "جميع المواقع",
		all: "الكل",
		noDoctorsFound: "لم يتم العثور على شركاء",
		tryAdjustingYourFilters: "حاول تعديل المرشحات",
		viewProfile: "عرض الملف الشخصي",
		doctorNotFound: "الطبيب غير موجود",
		theDoctorYouAreLookingForDoesNotExist: "الطبيب الذي تبحث عنه غير موجود",
		backToDoctors: "العودة إلى الشركاء",
		specialization: "التخصص",
		skills: "المهارات",
		qualifications: "المؤهلات",
		experience: "الخبرة",
		contactInformation: "معلومات الاتصال",
		socialMedia: "وسائل التواصل الاجتماعي",
		visitProfile: "زيارة الملف الشخصي",
		errorLoadingDoctors: "خطأ في تحميل الشركاء",
		pleaseTryAgainLater: "يرجى المحاولة مرة أخرى لاحقاً",

		// Doctor Management
		addDoctor: "إضافة شريك",
		manageDoctors: "إدارة الشركاء",
		manageDoctorsDescription: "عرض وتحرير وحذف الشركاء",
		totalDoctors: "إجمالي الشركاء",
		topRatedDoctors: "الشركاء الأعلى تقييماً",
		noDoctorsYet: "لا يوجد شركاء بعد",
		addYourFirstDoctor: "أضف أول طبيب للبدء!",
		doctorAddedSuccessfully: "تم إضافة الطبيب بنجاح",
		failedToAddDoctor: "فشل في إضافة الطبيب",
		doctorDeletedSuccessfully: "تم حذف الطبيب بنجاح",
		failedToDeleteDoctor: "فشل في حذف الطبيب",
		confirmDeleteDoctor: "حذف الطبيب",
		confirmDeleteDoctorDescription: "هل أنت متأكد أنك تريد حذف {{name}}؟ لا يمكن التراجع عن هذا الإجراء.",
		editFunctionalityComingSoon: "وظيفة التحرير قريباً",
		basicInformation: "المعلومات الأساسية",
		imageUrl: "رابط الصورة",
		addSkill: "إضافة مهارة",
		addQualification: "إضافة مؤهل",
		addExperience: "إضافة خبرة",
		cancel: "إلغاء",
		deleting: "جاري الحذف...",
		edit: "تحرير",
		delete: "حذف",
		editDoctor: "تحرير الطبيب",
		updateDoctor: "تحديث الطبيب",
		doctorUpdatedSuccessfully: "تم تحديث الطبيب بنجاح",
		failedToUpdateDoctor: "فشل في تحديث الطبيب",
	},
};

i18n.use(initReactI18next).init({
	resources: {
		en: enTranslations,
		ar: arTranslations,
	},
	lng: "en", // default language
	fallbackLng: "en",
	interpolation: {
		escapeValue: false, // React already escapes values
	},
	react: {
		useSuspense: false,
	},
});

export default i18n;
