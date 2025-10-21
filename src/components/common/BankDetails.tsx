/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { bankDetails } from "../../config/bankDetails";
import { toast } from "react-hot-toast";

const BankDetails: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [copiedField, setCopiedField] = React.useState<string | null>(null);

	const copyToClipboard = async (text: string, fieldName: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			toast.success(`${fieldName} copied to clipboard!`, {
				duration: 2000,
				icon: "📋",
			});
			setTimeout(() => setCopiedField(null), 2000);
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const bankInfo = [
		{
			label: t("bankDetails.bankNameLabel"),
			value: isRTL ? bankDetails.bankNameArabic : bankDetails.bankName,
			field: "bankName",
		},
		{
			label: t("bankDetails.accountNameLabel"),
			value: bankDetails.accountName,
			field: "accountName",
		},
		{
			label: t("bankDetails.accountNumberLabel"),
			value: bankDetails.accountNumber,
			field: "accountNumber",
		},
		{
			label: t("bankDetails.ibanLabel"),
			value: bankDetails.iban,
			field: "iban",
		},
		{
			label: t("bankDetails.accountTypeLabel"),
			value: bankDetails.accountType,
			field: "accountType",
		},
		{
			label: t("bankDetails.currencyLabel"),
			value: bankDetails.currency,
			field: "currency",
		},
		{
			label: t("bankDetails.branchLabel"),
			value: bankDetails.branch,
			field: "branch",
		},
		{
			label: t("bankDetails.customerTRNLabel"),
			value: bankDetails.customerTRN,
			field: "customerTRN",
		},
		{
			label: t("bankDetails.poBoxNumberLabel"),
			value: bankDetails.poBoxNumber,
			field: "poBoxNumber",
		},
		{
			label: t("bankDetails.emirateLabel"),
			value: bankDetails.emirate,
			field: "emirate",
		},
		{
			label: t("bankDetails.countryLabel"),
			value: bankDetails.country,
			field: "country",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className='bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100'>
			{/* Header */}
			<div className={`text-center mb-8 ${isRTL ? "text-right" : "text-left"}`}>
				<h3 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
					{t("bankDetails.bankNameLabel")}
				</h3>
				<p className='text-gray-600'>
					{isRTL ? bankDetails.bankNameArabic : bankDetails.bankName}
				</p>
			</div>

			{/* Bank Details Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6'>
				{bankInfo.map((item, index) => (
					<motion.div
						key={item.field}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
						className='group relative bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200'>
						<div
							className={`flex items-center justify-between ${
								isRTL ? "flex-row-reverse" : ""
							}`}>
							<div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
								<p className='text-sm font-medium text-gray-500 mb-1'>
									{item.label}
								</p>
								<p className='text-base font-semibold text-gray-900 break-all'>
									{item.value}
								</p>
							</div>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => copyToClipboard(item.value, item.label)}
								className={`ml-3 p-2 rounded-lg transition-all duration-200 ${
									copiedField === item.field
										? "bg-green-100 text-green-600"
										: "bg-white text-gray-400 hover:bg-gray-200 hover:text-gray-600"
								} ${isRTL ? "ml-0 mr-3" : ""}`}
								title={`Copy ${item.label}`}>
								{copiedField === item.field ? (
									<Check className='w-4 h-4' />
								) : (
									<Copy className='w-4 h-4' />
								)}
							</motion.button>
						</div>
					</motion.div>
				))}
			</div>

			{/* Important Notice */}
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
				<div
					className={`flex items-start gap-3 ${
						isRTL ? "flex-row-reverse" : ""
					}`}>
					<div className='flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
						<span className='text-white text-sm font-bold'>!</span>
					</div>
					<div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
						<p className='text-sm font-medium text-blue-800 mb-1'>
							{isRTL ? "ملاحظة مهمة" : "Important Notice"}
						</p>
						<p className='text-sm text-blue-700'>
							{isRTL
								? "يرجى التأكد من استخدام تفاصيل الحساب الصحيحة عند إجراء التحويلات. يمكنك النقر على أيقونة النسخ لنسخ المعلومات بسهولة."
								: "Please ensure you use the correct account details when making transfers. You can click the copy icon to easily copy the information."}
						</p>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default BankDetails;
