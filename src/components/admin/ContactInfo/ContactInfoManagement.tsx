/** @format */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContactInfo, useUpdateContactInfo, useAddPartner, useUpdatePartner, useDeletePartner } from '../../../hooks/useContactInfo';
import { ContactInfoUpdateData, PartnerData, PartnerUpdateData } from '../../../services/contactInfoApi';
import { Edit, Plus, Trash2, Save, X, ExternalLink, Image, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { showToast } from '../../../utils/toast';

const ContactInfoManagement: React.FC = () => {
	const { t } = useTranslation();
	const { data: contactInfo, isLoading, error } = useContactInfo();
	const updateContactInfoMutation = useUpdateContactInfo();
	const addPartnerMutation = useAddPartner();
	const updatePartnerMutation = useUpdatePartner();
	const deletePartnerMutation = useDeletePartner();

	const [isEditing, setIsEditing] = useState(false);
	const [editingPartner, setEditingPartner] = useState<string | null>(null);
	const [showAddPartner, setShowAddPartner] = useState(false);
	const [editingPartnerData, setEditingPartnerData] = useState<PartnerData>({
		src: '',
		alt: '',
		title: '',
		href: ''
	});

	// Form states
	const [formData, setFormData] = useState<ContactInfoUpdateData>({});
	const [partnerFormData, setPartnerFormData] = useState<PartnerData>({
		src: '',
		alt: '',
		title: '',
		href: ''
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handlePartnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPartnerFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		try {
			await updateContactInfoMutation.mutateAsync(formData);
			setIsEditing(false);
			setFormData({});
			showToast('success', 'contact-info-updated', t('contactInfoUpdated'));
		} catch (error) {
			showToast('error', 'contact-info-update-failed', t('updateFailed'));
		}
	};

	const handleAddPartner = async () => {
		try {
			await addPartnerMutation.mutateAsync(partnerFormData);
			setPartnerFormData({ src: '', alt: '', title: '', href: '' });
			setShowAddPartner(false);
			showToast('success', 'partner-added', t('partnerAdded'));
		} catch (error) {
			showToast('error', 'partner-add-failed', t('addPartnerFailed'));
		}
	};


	const handleDeletePartner = async (partnerId: string) => {
		if (window.confirm(t('confirmDeletePartner'))) {
			try {
				await deletePartnerMutation.mutateAsync(partnerId);
				showToast('success', 'partner-deleted', t('partnerDeleted'));
			} catch (error) {
				showToast('error', 'partner-delete-failed', t('deletePartnerFailed'));
			}
		}
	};

	const startEditing = () => {
		if (contactInfo) {
			setFormData({
				email: contactInfo.email,
				phone: contactInfo.phone,
				address: contactInfo.address,
				map: contactInfo.map,
				whatsapp: contactInfo.whatsapp,
				instagram: contactInfo.instagram,
				facebook: contactInfo.facebook,
				twitter: contactInfo.twitter,
				linkedin: contactInfo.linkedin,
				threads: contactInfo.threads,
				ceophoto: contactInfo.ceophoto,
				ceosmallphoto: contactInfo.ceosmallphoto,
			});
		}
		setIsEditing(true);
	};

	const startEditingPartner = (partnerId: string) => {
		const partner = contactInfo?.partners?.find(p => p._id === partnerId);
		if (partner) {
			setEditingPartnerData({
				src: partner.src,
				alt: partner.alt,
				title: partner.title,
				href: partner.href
			});
			setEditingPartner(partnerId);
		}
	};

	const handleEditPartnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditingPartnerData(prev => ({ ...prev, [name]: value }));
	};

	const handleSavePartnerEdit = async () => {
		if (editingPartner) {
			try {
				await updatePartnerMutation.mutateAsync({ partnerId: editingPartner, data: editingPartnerData });
				setEditingPartner(null);
				setEditingPartnerData({ src: '', alt: '', title: '', href: '' });
				showToast('success', 'partner-updated', t('partnerUpdated'));
			} catch (error) {
				showToast('error', 'partner-update-failed', t('updatePartnerFailed'));
			}
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
				<div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{t('errorLoadingContactInfo')}</p>
			</div>
		);
	}

	if (!contactInfo) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-600">{t('noContactInfoFound')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900">{t('contactInformation')}</h2>
				{!isEditing && (
					<button
						onClick={startEditing}
						className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Edit className="w-4 h-4" />
						<span>{t('edit')}</span>
					</button>
				)}
			</div>

			{/* Contact Info Form */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-xl shadow-sm p-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Email */}
					<div>
						<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
							<Mail className="w-4 h-4" />
							<span>{t('email')}</span>
						</label>
						<input
							type="email"
							name="email"
							value={isEditing ? formData.email || '' : contactInfo.email}
							onChange={handleInputChange}
							disabled={!isEditing}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
						/>
					</div>

					{/* Phone */}
					<div>
						<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
							<Phone className="w-4 h-4" />
							<span>{t('phone')}</span>
						</label>
						<input
							type="tel"
							name="phone"
							value={isEditing ? formData.phone || '' : contactInfo.phone}
							onChange={handleInputChange}
							disabled={!isEditing}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
						/>
					</div>

					{/* Address */}
					<div className="md:col-span-2">
						<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
							<MapPin className="w-4 h-4" />
							<span>{t('address')}</span>
						</label>
						<textarea
							name="address"
							value={isEditing ? formData.address || '' : contactInfo.address}
							onChange={handleInputChange}
							disabled={!isEditing}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
						/>
					</div>

					{/* Social Media Links */}
					<div className="md:col-span-2">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('socialMediaLinks')}</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{ key: 'whatsapp', label: 'WhatsApp', icon: Globe },
								{ key: 'instagram', label: 'Instagram', icon: Globe },
								{ key: 'facebook', label: 'Facebook', icon: Globe },
								{ key: 'twitter', label: 'Twitter', icon: Globe },
								{ key: 'linkedin', label: 'LinkedIn', icon: Globe },
								{ key: 'threads', label: 'Threads', icon: Globe },
							].map(({ key, label, icon: Icon }) => (
								<div key={key}>
									<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
										<Icon className="w-4 h-4" />
										<span>{label}</span>
									</label>
									<input
										type="url"
										name={key}
										value={isEditing ? formData[key as keyof ContactInfoUpdateData] || '' : contactInfo[key as keyof typeof contactInfo] || ''}
										onChange={handleInputChange}
										disabled={!isEditing}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
									/>
								</div>
							))}
						</div>
					</div>

					{/* CEO Photos */}
					<div className="md:col-span-2">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ceoPhotos')}</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
									<Image className="w-4 h-4" />
									<span>{t('ceoPhoto')}</span>
								</label>
								<input
									type="url"
									name="ceophoto"
									value={isEditing ? formData.ceophoto || '' : contactInfo.ceophoto}
									onChange={handleInputChange}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
								/>
							</div>
							<div>
								<label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
									<Image className="w-4 h-4" />
									<span>{t('ceoSmallPhoto')}</span>
								</label>
								<input
									type="url"
									name="ceosmallphoto"
									value={isEditing ? formData.ceosmallphoto || '' : contactInfo.ceosmallphoto}
									onChange={handleInputChange}
									disabled={!isEditing}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				{isEditing && (
					<div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
						<button
							onClick={() => {
								setIsEditing(false);
								setFormData({});
							}}
							className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							<X className="w-4 h-4" />
							<span>{t('cancel')}</span>
						</button>
						<button
							onClick={handleSave}
							disabled={updateContactInfoMutation.isPending}
							className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
						>
							<Save className="w-4 h-4" />
							<span>{updateContactInfoMutation.isPending ? t('saving') : t('save')}</span>
						</button>
					</div>
				)}
			</motion.div>

			{/* Partners Management */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-xl shadow-sm p-6"
			>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-lg font-semibold text-gray-900">{t('partners')}</h3>
					<button
						onClick={() => setShowAddPartner(true)}
						className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Plus className="w-4 h-4" />
						<span>{t('addPartner')}</span>
					</button>
				</div>

				{/* Partners List */}
				<div className="space-y-4">
					{contactInfo.partners?.map((partner) => (
						<div key={partner._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
							<div className="flex items-center space-x-4">
								<img
									src={partner.src}
									alt={partner.alt}
									className="w-12 h-12 object-cover rounded-lg"
									onError={(e) => {
										e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Logo';
									}}
								/>
								<div>
									<h4 className="font-medium text-gray-900">{partner.title}</h4>
									<p className="text-sm text-gray-600">{partner.alt}</p>
									<a
										href={partner.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
									>
										<span>{partner.href}</span>
										<ExternalLink className="w-3 h-3" />
									</a>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => startEditingPartner(partner._id!)}
									className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								>
									<Edit className="w-4 h-4" />
								</button>
								<button
									onClick={() => handleDeletePartner(partner._id!)}
									className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Add Partner Modal */}
				{showAddPartner && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('addPartner')}</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('imageUrl')}</label>
									<input
										type="url"
										name="src"
										value={partnerFormData.src}
										onChange={handlePartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="https://example.com/logo.png"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('altText')}</label>
									<input
										type="text"
										name="alt"
										value={partnerFormData.alt}
										onChange={handlePartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Partner logo alt text"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('title')}</label>
									<input
										type="text"
										name="title"
										value={partnerFormData.title}
										onChange={handlePartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Partner Company Name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('websiteUrl')}</label>
									<input
										type="url"
										name="href"
										value={partnerFormData.href}
										onChange={handlePartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="https://partner.com"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-3 mt-6">
								<button
									onClick={() => {
										setShowAddPartner(false);
										setPartnerFormData({ src: '', alt: '', title: '', href: '' });
									}}
									className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								>
									{t('cancel')}
								</button>
								<button
									onClick={handleAddPartner}
									disabled={addPartnerMutation.isPending}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								>
									{addPartnerMutation.isPending ? t('adding') : t('add')}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Edit Partner Modal */}
				{editingPartner && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('editPartner')}</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('imageUrl')}</label>
									<input
										type="url"
										name="src"
										value={editingPartnerData.src}
										onChange={handleEditPartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="https://example.com/logo.png"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('altText')}</label>
									<input
										type="text"
										name="alt"
										value={editingPartnerData.alt}
										onChange={handleEditPartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Partner logo alt text"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('title')}</label>
									<input
										type="text"
										name="title"
										value={editingPartnerData.title}
										onChange={handleEditPartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Partner Company Name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">{t('websiteUrl')}</label>
									<input
										type="url"
										name="href"
										value={editingPartnerData.href}
										onChange={handleEditPartnerInputChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="https://partner.com"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-3 mt-6">
								<button
									onClick={() => {
										setEditingPartner(null);
										setEditingPartnerData({ src: '', alt: '', title: '', href: '' });
									}}
									className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								>
									{t('cancel')}
								</button>
								<button
									onClick={handleSavePartnerEdit}
									disabled={updatePartnerMutation.isPending}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								>
									{updatePartnerMutation.isPending ? t('saving') : t('save')}
								</button>
							</div>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default ContactInfoManagement;
