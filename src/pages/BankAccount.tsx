/** @format */

import React from "react";
import { motion } from "framer-motion";
import { 
	Building2, 
	MapPin, 
	Phone, 
	Mail, 
	Globe, 
	CreditCard,
	FileText,
	Copy,
	CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "../components/layout/Footer";
import { toast } from "react-hot-toast";

const BankAccount: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [copiedField, setCopiedField] = React.useState<string | null>(null);

	const bankDetails = {
		companyName: "DORAR MEDICAL EQUIPMENT",
		phone: "+971 4 818 3181",
		address: "Office 203 Clover Bay Tower, Business Bay, Dubai, UAE",
		poBox: "29968",
		email: "info@dorarmed.com",
		website: "www.dorarmed.com",
		trn: "100472279700003",
		emirate: "Ras Al Khaimah",
		country: "United Arab Emirates",
		accountType: "Current Account",
		accountNumber: "3707551115001",
		iban: "AE520340003707551115001",
		currency: "AED",
		branch: "EI Ras Al Khaimah Al Muntasir"
	};

	const copyToClipboard = async (text: string, fieldName: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(fieldName);
			toast.success(`${fieldName} copied to clipboard!`);
			setTimeout(() => setCopiedField(null), 2000);
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const DetailCard = ({ 
		icon, 
		title, 
		value, 
		fieldName, 
		copyable = false 
	}: { 
		icon: React.ReactNode; 
		title: string; 
		value: string; 
		fieldName: string;
		copyable?: boolean;
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
		>
			<div className="flex items-start justify-between">
				<div className="flex items-start ">
					<div className="p-3 bg-primary-100 rounded-xl text-primary-600 mx-2">
						{icon}
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900 mb-2 mx-2">{title}</h3>
						<p className="text-gray-700 font-mono text-sm break-all">{value}</p>
					</div>
				</div>
				{copyable && (
					<button
						onClick={() => copyToClipboard(value, fieldName)}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						title="Copy to clipboard"
					>
						{copiedField === fieldName ? (
							<CheckCircle className="w-5 h-5 text-green-500" />
						) : (
							<Copy className="w-5 h-5 text-gray-400 hover:text-gray-600" />
						)}
					</button>
				)}
			</div>
		</motion.div>
	);

	return (
		<div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 mx-2">
						{t('bankAccountDetails')}
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{t('bankAccountDescription')}
					</p>
				</motion.div>

				{/* Company Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8"
				>
					<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
						<Building2 className="w-6 h-6 text-primary-600 mx-2" />
						<span>{t('companyInformation')}</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<DetailCard
							icon={<Building2 className="w-6 h-6" />}
							title={t('companyName')}
							value={bankDetails.companyName}
							fieldName="Company Name"
							copyable
						/>
						<DetailCard
							icon={<Phone className="w-6 h-6" />}
							title={t('phone')}
							value={bankDetails.phone}
							fieldName="Phone"
							copyable
						/>
						<DetailCard
							icon={<MapPin className="w-6 h-6" />}
							title={t('address')}
							value={bankDetails.address}
							fieldName="Address"
							copyable
						/>
						<DetailCard
							icon={<FileText className="w-6 h-6" />}
							title={t('poBox')}
							value={bankDetails.poBox}
							fieldName="P.O Box"
							copyable
						/>
						<DetailCard
							icon={<Mail className="w-6 h-6" />}
							title={t('email')}
							value={bankDetails.email}
							fieldName="Email"
							copyable
						/>
						<DetailCard
							icon={<Globe className="w-6 h-6" />}
							title={t('website')}
							value={bankDetails.website}
							fieldName="Website"
							copyable
						/>
					</div>
				</motion.div>

				{/* Banking Details */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="mb-8"
				>
					<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
						<CreditCard className="w-6 h-6 text-primary-600 mx-2" />
						<span>{t('bankingDetails')}</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<DetailCard
							icon={<FileText className="w-6 h-6" />}
							title={t('customerTRN')}
							value={bankDetails.trn}
							fieldName="Customer TRN"
							copyable
						/>
						<DetailCard
							icon={<MapPin className="w-6 h-6" />}
							title={t('emirate')}
							value={bankDetails.emirate}
							fieldName="Emirate"
							copyable
						/>
						<DetailCard
							icon={<Globe className="w-6 h-6" />}
							title={t('country')}
							value={bankDetails.country}
							fieldName="Country"
							copyable
						/>
						<DetailCard
							icon={<CreditCard className="w-6 h-6" />}
							title={t('accountType')}
							value={bankDetails.accountType}
							fieldName="Account Type"
							copyable
						/>
						<DetailCard
							icon={<FileText className="w-6 h-6" />}
							title={t('accountNumber')}
							value={bankDetails.accountNumber}
							fieldName="Account Number"
							copyable
						/>
						<DetailCard
							icon={<CreditCard className="w-6 h-6" />}
							title={t('iban')}
							value={bankDetails.iban}
							fieldName="IBAN"
							copyable
						/>
						<DetailCard
							icon={<FileText className="w-6 h-6" />}
							title={t('currency')}
							value={bankDetails.currency}
							fieldName="Currency"
							copyable
						/>
						<DetailCard
							icon={<Building2 className="w-6 h-6" />}
							title={t('branch')}
							value={bankDetails.branch}
							fieldName="Branch"
							copyable
						/>
					</div>
				</motion.div>

				{/* Important Notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
				>
					<div className="flex items-start space-x-3">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<FileText className="w-6 h-6 text-yellow-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-yellow-800 mb-2">
								{t('importantNotice')}
							</h3>
							<p className="text-yellow-700">
								{t('bankAccountNotice')}
							</p>
						</div>
					</div>
				</motion.div>
			</div>
			<Footer />
		</div>
	);
};

export default BankAccount;
