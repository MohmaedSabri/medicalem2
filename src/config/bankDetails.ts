/** @format */

export const bankDetails = {
	bankName: "SHARJAH ISLAMIC BANK",
	bankNameArabic: "مصرف الشارقة الإسلامي",
	accountName: "DORAR MEDICAL EQUIPMENT",
	customerTRN: "100506176500003",
	poBoxNumber: "29968",
	emirate: "Ras Al Khaimah",
	country: "United Arab Emirates",
	accountType: "Current Account - Corporate",
	accountNumber: "0012317086001",
	iban: "AE670410000012317086001",
	currency: "AED",
	branch: "Mall of the Emirates",
} as const;

export type BankDetails = typeof bankDetails;
