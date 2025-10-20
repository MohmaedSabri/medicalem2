/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
	Download, 
	Printer, 
	ArrowLeft
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { toast } from "react-hot-toast";
import jsPDFInvoiceTemplate from "jspdf-invoice-template";
import { pdf } from "@react-pdf/renderer";
import InvoicePdf from "../components/pdf/InvoicePdf";

type OnCreateFn = (doc: { setLineHeightFactor: (n: number) => void; setFontSize: (n: number) => void }) => void;

type InvoiceTemplateParameters = {
    returnJsPDFDocObject: boolean;
    fileName: string;
    orientationLandscape?: boolean;
    compress?: boolean;
    logo?: { src: string; width: number; height: number; margin?: { top: number; left: number }; type?: string };
    business?: { name?: string; address?: string; phone?: string; email?: string; website?: string };
    contact?: { label?: string; name?: string; address?: string; phone?: string; email?: string; otherInfo?: string };
    invoice: {
        label?: string;
        num?: number | string;
        invDate?: string;
        invGenDate?: string;
        headerBorder?: boolean;
        tableBodyBorder?: boolean;
        header: Array<{ title: string; style?: { width?: number } }>;
        table: Array<(string | number)[]>;
        additionalRows?: Array<{ col1?: string; col2?: string; col3?: string; style?: { fontSize?: number } }>;
        invDescLabel?: string;
        invDesc?: string;
    };
    footer?: { text?: string };
    pageEnable?: boolean;
    pageLabel?: string;
    onJsPDFDocCreation?: OnCreateFn;
};

interface InvoiceData {
	invoiceNumber: string;
	date: string;
	dueDate: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerPhoneType: 'home' | 'clinic';
	customerAddress: string;
	items: Array<{
		name: string;
		quantity: number;
		price: number;
		total: number;
	}>;
	subtotal: number;
	shipping: number;
	vat: number;
	total: number;
	paymentMethod: string;
	notes?: string;
}

const Invoice: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation() as { state?: Partial<InvoiceData> };
	const [isGenerating, setIsGenerating] = useState(false);

	// Build invoice data from navigation state with sensible fallback
	const [invoiceData] = useState<InvoiceData>(() => {
		const fallback: InvoiceData = {
			invoiceNumber: "25-3104",
			date: "06/10/2025",
			dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
			customerName: "TAJMEEL WELLNESS CLINIC",
			customerEmail: "info@tajmeel.com",
			customerPhone: "+971 50 123 4567",
			customerPhoneType: "clinic",
			customerAddress: "Abu Dhabi, UAE",
			items: [
				{ 
					name: "DERMA BED PREMIUM LEATHER FINISH\nManufacturer: MECKRON (TURKEY) DERMA CHAIR\nModel: BF-1482", 
					quantity: 12, 
					price: 17000, 
					total: 204000 
				},
				{ 
					name: "ASSISTANT STOOL", 
					quantity: 12, 
					price: 0, 
					total: 0 
				},
			],
			subtotal: 204000,
			shipping: 0,
			vat: 10200,
			total: 214200,
			paymentMethod: "Bank Transfer",
			notes: "Thank you for your business!"
		};

		const state = (location.state || {}) as Partial<InvoiceData>;
		const merged: InvoiceData = {
			...fallback,
			...state,
			items: Array.isArray(state.items) && state.items.length > 0 ? (state.items as InvoiceData['items']) : fallback.items,
		};
		return merged;
	});


	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "AED",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const generatePDF = async () => {
		setIsGenerating(true);
		try {
			const columns = [
				{ title: "#", style: { width: 8 , marginTop: 10 } },
				{ title: "Item", style: { width: 55 , marginTop: 10 } },
				{ title: "Price", style: { width: 22 , marginTop: 10 } },
				{ title: "Qty", style: { width: 15 , marginTop: 10 } },
				{ title: "Unit", style: { width: 12 , marginTop: 10 } },
				{ title: "Total", style: { width: 23 , marginTop: 10 } }
			];

			const tableRows = invoiceData.items.map((item, index) => {
				return [
					index + 1,
					item.name,
					Number(item.price),
					Number(item.quantity),
					"pcs",
					Number(item.total),
					
					
				];
			});

			// add spacer rows between invoice rows for visual padding
			const tableRowsWithSpacers: Array<(string | number)[]> = [];
			tableRows.forEach((row) => {
					
				tableRowsWithSpacers.push(row);

			});

			const parameters: InvoiceTemplateParameters = {
				returnJsPDFDocObject: true,
				fileName: `proforma-invoice-${invoiceData.invoiceNumber}`,
				orientationLandscape: false,
				compress: true,
				logo: {
					src: "/logo.png",
					width: 60,
					height: 40,
					margin: { top: -10, left: 8 },
					type: 'PNG'
				},
				business: {
					name: "Dorar Medical Equipment",
					address: "203 Clover Bay Tower, Business Bay Dubai",
					phone: "+971 4 818 3181",
					email: "info@dorarmed.com",
					website: "www.dorarmed.com"
				},
				contact: {
					label: "Invoice issued for:",
					name: invoiceData.customerName,
					address: invoiceData.customerAddress,
					phone: invoiceData.customerPhone,
					email: invoiceData.customerEmail,
					otherInfo: ""
				},
				invoice: {
					label: "Invoice #: ",
					num: invoiceData.invoiceNumber,
					invDate: `Date: ${invoiceData.date}`,
					invGenDate: `Due: ${invoiceData.dueDate}`,
					headerBorder: false,
					tableBodyBorder: false,
					header: columns,
					table: tableRowsWithSpacers,
					additionalRows: [
						{ col1: ' ', col2: ' ', col3: ' ' }, // spacer row for padding above totals
						{ col1: 'Subtotal:', col2: invoiceData.subtotal.toFixed(2), col3: 'AED' },
						{ col1: 'VAT:', col2: invoiceData.vat.toFixed(2), col3: 'AED' },
						{ col1: 'Total:', col2: invoiceData.total.toFixed(2), col3: 'AED', style: { fontSize: 14 } },
						{ col1: ' ', col2: ' ', col3: ' ' } // spacer after totals
					],
					invDescLabel: 'Notes',
					invDesc: invoiceData.notes || ''
				},
				footer: {
					text: "The invoice is created on a computer and is valid without the signature and stamp."
				},
				pageEnable: true,
				pageLabel: "Page ",
				onJsPDFDocCreation: (doc) => {
					if (typeof doc.setLineHeightFactor === 'function') {
						doc.setLineHeightFactor(1.3);
					}
				}
			};

			const callTemplate = (jsPDFInvoiceTemplate as unknown) as (params: InvoiceTemplateParameters) => { jsPDFDocObject: { save: () => void } };
			const maybeDefault = (jsPDFInvoiceTemplate as unknown) as { default?: typeof callTemplate };
			const run = maybeDefault.default ?? callTemplate;
			// Also generate a React PDF version and download
			const blob = await pdf(
				<InvoicePdf
					logoSrc={"/logo.png"}
					business={{
						name: "Dorar Medical Equipment",
						address: "203 Clover Bay Tower, Business Bay Dubai",
						phone: "+971 4 818 3181",
						email: "info@dorarmed.com",
						website: "www.dorarmed.com"
					}}
					contact={{
						name: invoiceData.customerName,
						address: invoiceData.customerAddress,
						phone: invoiceData.customerPhone,
						email: invoiceData.customerEmail
					}}
					invoiceMeta={{
						number: invoiceData.invoiceNumber,
						date: invoiceData.date,
						dueDate: invoiceData.dueDate
					}}
					items={invoiceData.items}
					totals={{ subtotal: invoiceData.subtotal, vat: invoiceData.vat, total: invoiceData.total, currency: 'AED' }}
					terms={[
						"Payment: 50% advance, 50% on delivery",
						"Delivery: 3-4 weeks from LPO",
						"Installation & Training: On-site by certified engineers",
						"Warranty: 5 years against manufacturing defects"
					]}
				/>
			).toBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `proforma-invoice-${invoiceData.invoiceNumber}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
								URL.revokeObjectURL(url);
			toast.success("Invoice downloaded successfully!");
		} catch (error) {
			toast.error("Failed to generate PDF");
			console.error("PDF generation error:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-8"
				>
					<div className="flex items-center justify-between mb-6">
						<button
							onClick={() => navigate(-1)}
							className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span>{t('back')}</span>
						</button>
						
						<div className="flex space-x-3 mx-2">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handlePrint}
								className="flex items-center mx-2 space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
							>
								<Printer className="w-4 h-4" />
								<span>{t('print')}</span>
							</motion.button>
							
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={generatePDF}
								disabled={isGenerating}
								className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
							>
								{isGenerating ? (
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
								) : (
									<Download className="w-4 h-4" />
								)}
								<span>{isGenerating ? t('generating') : t('downloadPDF')}</span>
							</motion.button>
						</div>
					</div>
				</motion.div>

				{/* Invoice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:rounded-none"
				>
					{/* Company Header */}
					<div className="mb-8">
						{/* Logo and Company Details */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
							<div className="flex items-start space-x-6 mb-4 sm:mb-0">
								{/* Company Logo */}
								<div className="flex-shrink-0">
									<img
										src="https://i.postimg.cc/x1bkFGQh/logo.png"
										alt="Dorar Medical Equipment Logo"
										className="w-20 h-20 object-contain rounded-lg shadow-sm"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.style.display = 'none';
											const fallback = document.createElement('div');
											fallback.className = 'w-20 h-20 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm';
											fallback.innerHTML = '<span class="text-white font-bold text-lg">D</span>';
											target.parentNode?.appendChild(fallback);
										}}
									/>
								</div>
								
								{/* Company Details */}
								<div className="space-y-1 text-gray-600 text-sm">
									<p><span className="font-semibold text-gray-900">Tel.</span> +971 4 818 3181</p>
									<p><span className="font-semibold text-gray-900">Address:</span> 203 Clover Bay Tower, Business Bay Dubai</p>
									<p><span className="font-semibold text-gray-900">P.O Box:</span> 29968 UAE - RAK</p>
									<p><span className="font-semibold text-gray-900">Email:</span> info@dorarmed.com</p>
									<p><span className="font-semibold text-gray-900">Website:</span> www.dorarmed.com</p>
								</div>
							</div>
							
							{/* Proforma Invoice Title */}
							<div className="text-right">
								<h1 className="text-3xl font-bold text-green-600 mb-2">PROFORMA INVOICE</h1>
								<div className="text-sm text-gray-500">
									<p>Offer No: {invoiceData.invoiceNumber}</p>
									<p>Date: {invoiceData.date}</p>
								</div>
							</div>
						</div>
						
						{/* Offer Details */}
						<div className="bg-gray-50 rounded-lg p-6 mb-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
									<div className="space-y-1 text-gray-600">
										<p className="font-medium">{invoiceData.customerName}</p>
										<p>{invoiceData.customerAddress}</p>
										<p>
											<span className="font-medium">
												{"Phone Number"}:
											</span> {invoiceData.customerPhone}
										</p>
										<p>
											<span className="font-medium">{t('email')}:</span> {invoiceData.customerEmail}
										</p>
									</div>
								</div>
								<div>
									
								</div>
							</div>
						</div>
					</div>


					{/* Items Table */}
					<div className="mb-8">
						<div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
							<table className="w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#SR</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
										<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty.</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (AED)</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price (AED)</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{invoiceData.items.map((item, index) => (
										<tr key={index} className="hover:bg-gray-50">
											<td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
											<td className="px-4 py-4 text-sm text-gray-700 whitespace-pre-line">{item.name}</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{item.quantity}</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{formatPrice(item.price)}</td>
											<td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatPrice(item.total)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Totals */}
					<div className="flex justify-end mb-8">
						<div className="w-80 bg-gray-50 rounded-lg p-6">
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Subtotal (AED):</span>
									<span className="text-gray-900 font-medium">{formatPrice(invoiceData.subtotal)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">VAT @ 5% (AED):</span>
									<span className="text-gray-900 font-medium">{formatPrice(invoiceData.vat)}</span>
								</div>
								<div className="border-t border-gray-300 pt-3">
									<div className="flex justify-between text-lg font-bold">
										
										<span className="text-green-600">Total Amount:</span>
										<span className="text-gray-900 font-medium">{formatPrice(invoiceData.total)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Terms and Conditions */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">TERMS AND CONDITIONS</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
							<div className="space-y-3">
								<div>
									<span className="font-semibold">Payment Terms:</span> 50% Advance, 50% on Delivery
								</div>
								<div>
									<span className="font-semibold">Installation:</span> On-site by Engineers
								</div>
								<div>
									<span className="font-semibold">Delivery:</span> 3-4 Weeks from LPO
								</div>
								<div>
									<span className="font-semibold">Training:</span> On-site by Factory Engineers
								</div>
								<div>
									<span className="font-semibold">Warranty:</span> 5 years against defects
								</div>
							</div>
						</div>
					</div>


					{/* Important Note */}
					<div className="mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
						<div className="text-sm">
							<div className="font-semibold text-yellow-800 mb-2">Note:</div>
							<div className="text-yellow-700 leading-relaxed">
								This invoice is for quotation purposes only and is not a final authorized invoice. Please contact our sales team to issue the official stamped invoice from Dorar Medical Equipment.
							</div>
						</div>
					</div>
				</motion.div>
			</div>
			<Footer />
		</div>
	);
};

export default Invoice;
