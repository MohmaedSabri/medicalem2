import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useDoctors } from '../hooks/useDoctors';
import { 
  Search, 
  MapPin, 
  Phone,
  User,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const Doctors: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Get doctors with filters
  const { data: doctors = [], isLoading, error } = useDoctors({
    search: searchQuery || undefined,
    specialization: selectedSpecialization || undefined,
    location: selectedLocation || undefined,
    lang: currentLanguage
  }) as { data: unknown[], isLoading: boolean, error: unknown };

  // Helper function to get localized text
  const getLocalizedText = (value: unknown): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const valueObj = value as Record<string, string>;
      return valueObj[currentLanguage as "en" | "ar"] || valueObj.en || valueObj.ar || "";
    }
    return "";
  };

  // Get unique specializations for filter
  const specializations = Array.from(
    new Set(doctors.map((doctor: unknown) => getLocalizedText((doctor as any).specialization)))
  ).filter(Boolean);

  // Get unique locations for filter
  const locations = Array.from(
    new Set(doctors.map((doctor: unknown) => getLocalizedText((doctor as any).location)))
  ).filter(Boolean);



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('errorLoadingDoctors')}
          </h2>
          <p className="text-gray-600">
            {t('pleaseTryAgainLater')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-primary-500 py-16 lg:py-24 pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mt-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {t('ourExpertDoctors')}
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              {t('meetOurQualifiedMedicalProfessionals')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('searchDoctors')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Specialization Filter */}
                <div>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('allSpecializations')}</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('allLocations')}</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : doctors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-gray-400 text-6xl mb-4">DR</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('noDoctorsFound')}
              </h3>
              <p className="text-gray-600">
                {t('tryAdjustingYourFilters')}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor: unknown) => (
                <motion.div
                  key={(doctor as any)._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group"
                >
                  <Link to={`/doctors/${(doctor as any)._id}`} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 overflow-hidden border border-gray-100 h-full">
                    {/* Doctor Image */}
                    <div className="relative h-64 bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden">
                      <motion.img
                        src={(doctor as any).image}
                        alt={getLocalizedText((doctor as any).name)}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6">
                      <motion.h3 
                        className={`text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {getLocalizedText((doctor as any).name)}
                      </motion.h3>
                      
                      <motion.p 
                        className={`text-primary-600 font-semibold mb-3 group-hover:text-primary-700 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {getLocalizedText((doctor as any).title)}
                      </motion.p>

                      <motion.p 
                        className={`text-gray-600 text-sm mb-4 line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {getLocalizedText((doctor as any).description)}
                      </motion.p>

                      {/* Specialization */}
                      <div className={`flex items-center mb-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <Award className={`w-4 h-4 text-primary-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className="text-sm text-gray-600">
                          {getLocalizedText((doctor as any).specialization)}
                        </span>
                      </div>

                      {/* Location */}
                      <div className={`flex items-center mb-4 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <MapPin className={`w-4 h-4 text-primary-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className="text-sm text-gray-600">
                          {getLocalizedText((doctor as any).location)}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <Phone className={`w-4 h-4 text-primary-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className="text-sm text-gray-600">
                          {(doctor as any).contact}
                        </span>
                      </div>

                      {/* Action Button (non-link to avoid nested links) */}
                      <div
                        className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                      >
                        <User className="w-5 h-5" />
                        <span>{t('viewProfile')}</span>
                      </div>
                    </div>
                  </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Doctors;
