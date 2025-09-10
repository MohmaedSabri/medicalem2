import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useDoctor } from '../hooks/useDoctors';
import { Doctor } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Award, 
  Briefcase, 
  Heart,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Footer from '../components/layout/Footer';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  
  const { data: doctor, isLoading, error } = useDoctor(id!, currentLanguage);
  
  // Type assertion to help TypeScript understand the doctor type
  const doctorData = doctor as Doctor | undefined;

  // Helper function to get localized text
  const getLocalizedText = (value: string | { en: string; ar: string } | undefined): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
    }
    return "";
  };

  // Helper function to get localized array
  const getLocalizedArray = (value: Array<{ en: string; ar: string }> | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((item: { en: string; ar: string }) => getLocalizedText(item));
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('doctorNotFound')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('theDoctorYouAreLookingForDoesNotExist')}
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('backToDoctors')}</span>
          </Link>
        </div>
      </div>
    );
  }

  const skills = doctorData?.skills ? getLocalizedArray(doctorData.skills) : [];
  const qualifications = doctorData?.qualifications ? getLocalizedArray(doctorData.qualifications) : [];
  const experience = doctorData?.experience ? getLocalizedArray(doctorData.experience) : [];

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 py-16 lg:py-24 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"
          >
            {/* Doctor Image */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="w-64 h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={doctorData?.image || ''}
                    alt={getLocalizedText(doctorData?.name)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Doctor Info */}
            <div className="lg:col-span-2 text-white">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {getLocalizedText(doctorData?.name)}
                </h1>
                <p className="text-xl lg:text-2xl text-teal-100 mb-6">
                  {getLocalizedText(doctorData?.title)}
                </p>
                <p className="text-lg text-teal-50 mb-8 leading-relaxed">
                  {getLocalizedText(doctorData?.description)}
                </p>


                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <MapPin className="w-5 h-5 text-teal-200" />
                    <span className="text-teal-100">
                      {getLocalizedText(doctorData?.location)}
                    </span>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <Phone className="w-5 h-5 text-teal-200" />
                    <span className="text-teal-100">{doctorData?.contact}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Specialization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Award className="w-6 h-6 text-teal-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('specialization')}
                  </h2>
                </div>
                <p className="text-lg text-gray-700">
                  {getLocalizedText(doctorData?.specialization)}
                </p>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Heart className={`w-6 h-6 text-teal-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('skills')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <CheckCircle className={`w-5 h-5 text-teal-500 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Qualifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Award className={`w-6 h-6 text-teal-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('qualifications')}
                  </h2>
                </div>
                <div className="space-y-4">
                  {qualifications.map((qualification, index) => (
                    <div key={index} className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <div className={`w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                      <span className="text-gray-700">{qualification}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className={`flex items-center mb-6 ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Briefcase className={`w-6 h-6 text-teal-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('experience')}
                  </h2>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <div className={`w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                      <span className="text-gray-700">{exp}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {t('contactInformation')}
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <Phone className={`w-5 h-5 text-teal-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <span className="text-gray-700">{doctorData?.contact}</span>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <MapPin className={`w-5 h-5 text-teal-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    <span className="text-gray-700">
                      {getLocalizedText(doctorData?.location)}
                    </span>
                  </div>
                </div>

                {/* Social Media */}
                {doctorData?.socialMedia && doctorData.socialMedia.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Me
                    </h4>
                    <div className="space-y-2">
                      {doctorData.socialMedia.map((social: string, index: number) => (
                        <a
                          key={index}
                          href={social}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-teal-600 hover:text-teal-700 transition-colors duration-200`}
                        >
                          <ExternalLink className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          <span className="text-sm">{social}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DoctorDetail;
