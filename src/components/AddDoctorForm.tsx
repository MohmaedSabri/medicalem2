import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useCreateDoctor } from '../hooks/useDoctors';
import { CreateDoctorData } from '../types';
import { X, Plus, Trash2, User, Award, Heart, Briefcase, MapPin, Phone, Mail, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddDoctorFormProps {
  onClose: () => void;
}

const AddDoctorForm: React.FC<AddDoctorFormProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const createDoctorMutation = useCreateDoctor();

  const [formData, setFormData] = useState<CreateDoctorData>({
    name: { en: '', ar: '' },
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    image: '',
    skills: [],
    qualifications: [],
    experience: [],
    location: { en: '', ar: '' },
    contact: '',
    socialMedia: [],
    specialization: { en: '', ar: '' },
  });

  const [currentSkill, setCurrentSkill] = useState({ en: '', ar: '' });
  const [currentQualification, setCurrentQualification] = useState({ en: '', ar: '' });
  const [currentExperience, setCurrentExperience] = useState({ en: '', ar: '' });
  const [currentSocialMedia, setCurrentSocialMedia] = useState('');

  const handleInputChange = (field: keyof CreateDoctorData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBilingualInputChange = (field: keyof CreateDoctorData, lang: 'en' | 'ar', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as any),
        [lang]: value
      }
    }));
  };

  const addSkill = () => {
    if (currentSkill.en.trim() && currentSkill.ar.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill]
      }));
      setCurrentSkill({ en: '', ar: '' });
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addQualification = () => {
    if (currentQualification.en.trim() && currentQualification.ar.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, currentQualification]
      }));
      setCurrentQualification({ en: '', ar: '' });
    }
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (currentExperience.en.trim() && currentExperience.ar.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, currentExperience]
      }));
      setCurrentExperience({ en: '', ar: '' });
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSocialMedia = () => {
    if (currentSocialMedia.trim()) {
      setFormData(prev => ({
        ...prev,
        socialMedia: [...prev.socialMedia, currentSocialMedia]
      }));
      setCurrentSocialMedia('');
    }
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createDoctorMutation.mutateAsync(formData);
      toast.success(t('doctorAddedSuccessfully'));
      onClose();
    } catch (error) {
      toast.error(t('failedToAddDoctor'));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.en.trim() &&
      formData.name.ar.trim() &&
      formData.title.en.trim() &&
      formData.title.ar.trim() &&
      formData.description.en.trim() &&
      formData.description.ar.trim() &&
      formData.image.trim() &&
      formData.location.en.trim() &&
      formData.location.ar.trim() &&
      formData.contact.trim() &&
      formData.specialization.en.trim() &&
      formData.specialization.ar.trim()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-3" />
                {t('addDoctor')}
              </h1>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-500" />
                {t('basicInformation')}
              </h2>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')} (English)
                  </label>
                  <input
                    type="text"
                    value={formData.name.en}
                    onChange={(e) => handleBilingualInputChange('name', 'en', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('name')} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.name.ar}
                    onChange={(e) => handleBilingualInputChange('name', 'ar', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="د. جون سميث"
                    required
                  />
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('title')} (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => handleBilingualInputChange('title', 'en', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Cardiologist"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('title')} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.title.ar}
                    onChange={(e) => handleBilingualInputChange('title', 'ar', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="أخصائي قلب"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description')} (English)
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => handleBilingualInputChange('description', 'en', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Expert heart surgeon with 15+ years experience"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description')} (Arabic)
                  </label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => handleBilingualInputChange('description', 'ar', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="جراح قلب خبير مع أكثر من 15 سنة خبرة"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('imageUrl')}
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://example.com/doctor-image.jpg"
                  required
                />
              </div>
            </div>

            {/* Specialization */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-500" />
                {t('specialization')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('specialization')} (English)
                  </label>
                  <input
                    type="text"
                    value={formData.specialization.en}
                    onChange={(e) => handleBilingualInputChange('specialization', 'en', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Cardiology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('specialization')} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.specialization.ar}
                    onChange={(e) => handleBilingualInputChange('specialization', 'ar', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="أمراض القلب"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-teal-500" />
                {t('skills')}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={currentSkill.en}
                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, en: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Skill (English)"
                  />
                  <input
                    type="text"
                    value={currentSkill.ar}
                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, ar: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="المهارة (العربية)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addSkill')}
                </button>

                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{skill.en}</span>
                        <span className="text-gray-500 mx-2">-</span>
                        <span className="text-gray-600">{skill.ar}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-500" />
                {t('qualifications')}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={currentQualification.en}
                    onChange={(e) => setCurrentQualification(prev => ({ ...prev, en: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Qualification (English)"
                  />
                  <input
                    type="text"
                    value={currentQualification.ar}
                    onChange={(e) => setCurrentQualification(prev => ({ ...prev, ar: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="المؤهل (العربية)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addQualification}
                  className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addQualification')}
                </button>

                <div className="space-y-2">
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{qualification.en}</span>
                        <span className="text-gray-500 mx-2">-</span>
                        <span className="text-gray-600">{qualification.ar}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-teal-500" />
                {t('experience')}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={currentExperience.en}
                    onChange={(e) => setCurrentExperience(prev => ({ ...prev, en: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Experience (English)"
                  />
                  <input
                    type="text"
                    value={currentExperience.ar}
                    onChange={(e) => setCurrentExperience(prev => ({ ...prev, ar: e.target.value }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="الخبرة (العربية)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addExperience')}
                </button>

                <div className="space-y-2">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{exp.en}</span>
                        <span className="text-gray-500 mx-2">-</span>
                        <span className="text-gray-600">{exp.ar}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-teal-500" />
                {t('contactInformation')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+971 55 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="doctor@example.com"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('location')} (English)
                  </label>
                  <input
                    type="text"
                    value={formData.location.en}
                    onChange={(e) => handleBilingualInputChange('location', 'en', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Riyadh, Saudi Arabia"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('location')} (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.location.ar}
                    onChange={(e) => handleBilingualInputChange('location', 'ar', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="الرياض، المملكة العربية السعودية"
                    required
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('socialMedia')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentSocialMedia}
                    onChange={(e) => setCurrentSocialMedia(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/doctor"
                  />
                  <button
                    type="button"
                    onClick={addSocialMedia}
                    className="px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.socialMedia.map((social, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-700">{social}</span>
                      <button
                        type="button"
                        onClick={() => removeSocialMedia(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || createDoctorMutation.isPending}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createDoctorMutation.isPending ? t('saving') : t('addDoctor')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddDoctorForm;

