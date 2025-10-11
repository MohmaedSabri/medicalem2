/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
	Download, 
	Printer, 
	ArrowLeft
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";

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
	const [isGenerating, setIsGenerating] = useState(false);

	// Sample invoice data - in real app, this would come from props or API
	const [invoiceData] = useState<InvoiceData>({
		invoiceNumber: "25-3104",
		date: "06/10/2025",
		dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
		customerName: "TAJMEEL WELLNESS CLINIC",
		customerEmail: "info@tajmeel.com",
		customerPhone: "+971 50 123 4567",
		customerPhoneType: "clinic" as const,
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
			const pdf = new jsPDF();
			
			// Set font
			pdf.setFont("helvetica");
			
			// Function to add logo image to PDF
			const addLogoToPDF = () => {
				return new Promise<void>((resolve) => {
					// Try to fetch the image as blob first to avoid CORS issues
					fetch('https://i.postimg.cc/x1bkFGQh/logo.png')
						.then(response => response.blob())
						.then(blob => {
							const img = new Image();
							const url = URL.createObjectURL(blob);
							
							img.onload = () => {
								try {
									// Create high-quality canvas for better image quality
									const canvas = document.createElement('canvas');
									const ctx = canvas.getContext('2d');
									
									// Use higher resolution for better quality
									const scale = 2; // 2x resolution for crisp image
									canvas.width = 80 * scale;
									canvas.height = 80 * scale;
									
									// Enable image smoothing for better quality
									ctx!.imageSmoothingEnabled = true;
									ctx!.imageSmoothingQuality = 'high';
									
									// Draw image on canvas with high quality
									ctx?.drawImage(img, 0, 0, 80 * scale, 80 * scale);
									
									// Convert to base64 with high quality
									const imgData = canvas.toDataURL('image/png', 1.0);
									
									// Add image to PDF with better size (40x40 instead of 25x25)
									pdf.addImage(imgData, 'PNG', 20, 15, 40, 40);
									
									// Clean up
									URL.revokeObjectURL(url);
									resolve();
								} catch (error) {
									console.error('Error adding logo to PDF:', error);
									// Fallback to text logo
									pdf.setTextColor(14, 165, 233);
									pdf.setFontSize(20);
									pdf.setFont("helvetica", "bold");
									pdf.text("DORAR", 20, 35);
									URL.revokeObjectURL(url);
									resolve();
								}
							};
							
							img.onerror = () => {
								console.error('Error loading logo image');
								// Fallback to text logo
								pdf.setTextColor(14, 165, 233);
								pdf.setFontSize(20);
								pdf.setFont("helvetica", "bold");
								pdf.text("DORAR", 20, 35);
								URL.revokeObjectURL(url);
								resolve();
							};
							
							img.src = url;
						})
						.catch(error => {
							console.error('Error fetching logo:', error);
							// Fallback to text logo
							pdf.setTextColor(14, 165, 233);
							pdf.setFontSize(20);
							pdf.setFont("helvetica", "bold");
							pdf.text("DORAR", 20, 35);
							resolve();
						});
				});
			};
			
			// Wait for logo to be added
			await addLogoToPDF();
			
			// Reset text color for company details
			pdf.setTextColor(0, 0, 0);
			
			// Company Header - Compact layout
			pdf.setFontSize(10);
			pdf.setFont("helvetica", "bold");
			pdf.text("Tel. +971 4 818 3181", 70, 30);
			pdf.text("Address: 203 Clover Bay Tower, Business Bay Dubai", 70, 35);
			pdf.text("P.O Box: 29968 UAE - RAK", 70, 40);
			pdf.text("Email: info@dorarmed.com", 70, 45);
			pdf.text("Website: www.dorarmed.com", 70, 50);

			// Proforma Invoice Title
			pdf.setFontSize(14);
			pdf.setFont("helvetica", "bold");
			pdf.text("PROFORMA INVOICE", 20, 60);

			// Offer Details - Compact
			pdf.setFontSize(9);
			pdf.setFont("helvetica", "normal");
			pdf.text("To: TAJMEEL WELLNESS CLINIC", 20, 70);
			pdf.text("Abu Dhabi, UAE", 20, 75);
			pdf.text(`Offer No: ${invoiceData.invoiceNumber}`, 20, 80);
			pdf.text(`Date: ${invoiceData.date}`, 20, 85);
			pdf.text("Validity: 30 Days", 20, 90);
			pdf.text("Reference No: RFQ-Tajmeel Wellness Clinic-NFA-BME,OT NFA/ BM/ 3515", 20, 95);
			
			// Items Table Header - Compact
			pdf.setFontSize(9);
			pdf.setFont("helvetica", "bold");
			pdf.text("#SR", 20, 105);
			pdf.text("Description", 35, 105);
			pdf.text("Qty.", 120, 105);
			pdf.text("Unit Price (AED)", 140, 105);
			pdf.text("Total Price (AED)", 170, 105);
			
			// Draw line
			pdf.line(20, 110, 190, 110);
			
			// Items - Compact
			let yPosition = 118;
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(8);
			invoiceData.items.forEach((item, index) => {
				pdf.text((index + 1).toString(), 20, yPosition);
				// Split long descriptions into multiple lines
				const descriptionLines = item.name.split('\n');
				descriptionLines.forEach((line, lineIndex) => {
					pdf.text(line, 35, yPosition + (lineIndex * 4));
				});
				pdf.text(item.quantity.toString(), 120, yPosition);
				pdf.text(formatPrice(item.price), 140, yPosition);
				pdf.text(formatPrice(item.total), 170, yPosition);
				yPosition += Math.max(8, descriptionLines.length * 4 + 2);
			});
			
			// Totals - Compact
			yPosition += 5;
			pdf.line(20, yPosition, 190, yPosition);
			yPosition += 5;
			
			pdf.setFontSize(9);
			pdf.setFont("helvetica", "normal");
			pdf.text("Total Price (AED):", 140, yPosition);
			pdf.text(formatPrice(invoiceData.subtotal), 170, yPosition);
			yPosition += 6;
			
			pdf.text("VAT @ 5% (AED):", 140, yPosition);
			pdf.text(formatPrice(invoiceData.vat), 170, yPosition);
			yPosition += 6;
			
			pdf.setFont("helvetica", "bold");
			pdf.text("Total Amount (AED):", 140, yPosition);
			pdf.text(formatPrice(invoiceData.total), 170, yPosition);
			
			// Terms and Conditions - Compact (2 columns)
			yPosition += 15;
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(10);
			pdf.text("TERMS AND CONDITIONS", 20, yPosition);
			
			pdf.setFontSize(7);
			pdf.setFont("helvetica", "normal");
			yPosition += 8;
			
			// Left column
			pdf.setFont("helvetica", "bold");
			pdf.text("Payment Terms:", 20, yPosition);
			pdf.setFont("helvetica", "normal");
			pdf.text("50% Advance, 50% on Delivery", 20, yPosition + 4);
			
			pdf.setFont("helvetica", "bold");
			pdf.text("Installation:", 20, yPosition + 10);
			pdf.setFont("helvetica", "normal");
			pdf.text("On-site by Engineers", 20, yPosition + 14);
			
			pdf.setFont("helvetica", "bold");
			pdf.text("Delivery:", 20, yPosition + 20);
			pdf.setFont("helvetica", "normal");
			pdf.text("3-4 Weeks from LPO", 20, yPosition + 24);
			
			pdf.setFont("helvetica", "bold");
			pdf.text("Training:", 20, yPosition + 30);
			pdf.setFont("helvetica", "normal");
			pdf.text("On-site by Factory Engineers", 20, yPosition + 34);
			
			pdf.setFont("helvetica", "bold");
			pdf.text("Warranty:", 20, yPosition + 40);
			pdf.setFont("helvetica", "normal");
			pdf.text("5 years against defects", 20, yPosition + 44);
			
			// Right column - Signature
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(8);
			pdf.text("For Dorar Medical Equipment", 110, yPosition);
			pdf.setFontSize(7);
			pdf.setFont("helvetica", "normal");
			pdf.text("Eng. Reji Reghunathan", 110, yPosition + 6);
			pdf.text("Sales Engineer", 110, yPosition + 12);
			pdf.text("Dubai, UAE", 110, yPosition + 18);
			pdf.text("Mob: +971527059743", 110, yPosition + 24);
			
			// Important Note - English Only
			yPosition += 55;
			pdf.setFontSize(7);
			pdf.setFont("helvetica", "bold");
			pdf.text("Note:", 20, yPosition);
			pdf.setFont("helvetica", "normal");
			pdf.text("This invoice is for quotation purposes only and is not a final authorized invoice.", 20, yPosition + 4);
			pdf.text("Please contact our sales team to issue the official stamped invoice.", 20, yPosition + 8);
			
			// Save the PDF
			pdf.save(`proforma-invoice-${invoiceData.invoiceNumber}.pdf`);
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
								className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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
								<h1 className="text-3xl font-bold text-primary-600 mb-2">PROFORMA INVOICE</h1>
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
												{invoiceData.customerPhoneType === 'home' ? t('homePhone') : t('clinicPhone')}:
											</span> {invoiceData.customerPhone}
										</p>
										<p>
											<span className="font-medium">{t('email')}:</span> {invoiceData.customerEmail}
										</p>
									</div>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-2">Offer Details:</h3>
									<div className="space-y-1 text-gray-600">
										<p><span className="font-medium">Validity:</span> 30 Days</p>
										<p><span className="font-medium">Reference No:</span> RFQ-Tajmeel Wellness Clinic-NFA-BME,OT NFA/ BM/ 3515</p>
									</div>
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
									<span className="text-gray-600">Total Price (AED):</span>
									<span className="text-gray-900 font-medium">{formatPrice(invoiceData.subtotal)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">VAT @ 5% (AED):</span>
									<span className="text-gray-900 font-medium">{formatPrice(invoiceData.vat)}</span>
								</div>
								<div className="border-t border-gray-300 pt-3">
									<div className="flex justify-between text-lg font-bold">
										<span className="text-gray-900">Total Amount (AED):</span>
										<span className="text-primary-600">{formatPrice(invoiceData.total)}</span>
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
							<div className="space-y-3">
								<div className="font-semibold text-gray-900">For Dorar Medical Equipment</div>
								<div className="space-y-1 text-sm">
									<div>Eng. Reji Reghunathan</div>
									<div>Sales Engineer</div>
									<div>Dubai, UAE</div>
									<div>Mob: +971527059743</div>
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
