import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDoctors, useDeleteDoctor } from '../../hooks/useDoctors';
import { Doctor } from '../../types';
import EditDoctorForm from '../forms/EditDoctorForm';
import { 
  Search, 
  Edit, 
  Trash2, 
  User, 
  MapPin, 
  Phone, 
  Award,
  Eye,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageDoctors: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const { data: doctors = [], isLoading } = useDoctors({ lang: currentLanguage });
  const deleteDoctorMutation = useDeleteDoctor();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // Helper function to get localized text
  const getLocalizedText = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
    }
    return "";
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => {
    const name = getLocalizedText(doctor.name).toLowerCase();
    const title = getLocalizedText(doctor.title).toLowerCase();
    const specialization = getLocalizedText(doctor.specialization).toLowerCase();
    const location = getLocalizedText(doctor.location).toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || 
           title.includes(query) || 
           specialization.includes(query) || 
           location.includes(query);
  });

  const handleDelete = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDoctor) {
      try {
        await deleteDoctorMutation.mutateAsync(selectedDoctor._id);
        toast.success(t('doctorDeletedSuccessfully'));
        setShowDeleteModal(false);
        setSelectedDoctor(null);
      } catch (error) {
        toast.error(t('failedToDeleteDoctor'));
      }
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setShowEditForm(true);
  };

  const handleView = (doctor: Doctor) => {
    // TODO: Implement view functionality
    window.open(`/doctors/${doctor._id}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (showEditForm && doctorToEdit) {
    return (
      <EditDoctorForm
        doctor={doctorToEdit}
        onClose={() => {
          setShowEditForm(false);
          setDoctorToEdit(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-3 text-teal-500" />
                  {t('manageDoctors')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t('manageDoctorsDescription')}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm text-gray-500">
                  {t('totalDoctors')}: <span className="font-semibold text-gray-900">{doctors.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('searchDoctors')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? t('noDoctorsFound') : t('noDoctorsYet')}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? t('tryAdjustingYourSearch') : t('addYourFirstDoctor')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Doctor Image */}
                  <div className="relative h-48 bg-gradient-to-br from-teal-50 to-blue-50">
                    <img
                      src={doctor.image}
                      alt={getLocalizedText(doctor.name)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <button
                          onClick={() => setSelectedDoctor(doctor)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getLocalizedText(doctor.name)}
                    </h3>
                    <p className="text-teal-600 font-medium text-sm mb-3">
                      {getLocalizedText(doctor.title)}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {getLocalizedText(doctor.description)}
                    </p>

                    {/* Specialization */}
                    <div className={`flex items-center mb-3 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <Award className={`w-4 h-4 text-teal-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className="text-sm text-gray-600">
                        {getLocalizedText(doctor.specialization)}
                      </span>
                    </div>

                    {/* Location */}
                    <div className={`flex items-center mb-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <MapPin className={`w-4 h-4 text-teal-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className="text-sm text-gray-600">
                        {getLocalizedText(doctor.location)}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <Phone className={`w-4 h-4 text-teal-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className="text-sm text-gray-600">
                        {doctor.contact}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(doctor)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('view')}
                      </button>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(doctor)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('confirmDeleteDoctor')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('confirmDeleteDoctorDescription', { name: getLocalizedText(selectedDoctor.name) })}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteDoctorMutation.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleteDoctorMutation.isPending ? t('deleting') : t('delete')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
