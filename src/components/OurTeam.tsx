import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart,
  Shield,
  Zap,
  Quote
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: { en: string; ar: string };
  position: { en: string; ar: string };
  image: string;
}

const OurTeam: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();

  // Helper function to get localized text
  const getLocalizedText = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
    }
    return "";
  };

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: { en: 'Eng. Mohamed Medhat', ar: 'م. محمد مدحت' },
      position: { en: 'CEO - Co Founder', ar: 'الرئيس التنفيذي - الشريك المؤسس' },
      image: 'https://i.postimg.cc/QNbcpqNq/ceo.jpg',
    },
    {
      id: '2',
      name: { en: 'Dr. Phumdon H. Norman', ar: 'د. فومدون اتش. نورمان' },
      position: { en: 'Neurologist', ar: 'أخصائي الأعصاب' },
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    },
    {
      id: '3',
      name: { en: 'Nicolas D. Case', ar: 'نيكولاس دي. كيس' },
      position: { en: 'Pediatric Nurse', ar: 'ممرض أطفال' },
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      y: -30,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 60, 
      opacity: 0,
      scale: 0.8,
      rotateY: 15
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      y: -40,
      opacity: 0,
      scale: 0.9,
      rotateY: -10,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: -2,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const titleVariants = {
    hidden: { 
      y: -30, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="team-header"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-50px", amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div 
                className="inline-flex items-center space-x-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                whileHover={{ scale: 1.05, backgroundColor: "#0f766e", color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                <Heart className="w-4 h-4" />
                <span>{t('ourTeam')}</span>
              </motion.div>
            </motion.div>

            <motion.h2 
              variants={titleVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center"
            >
              {t('meetOurExpertTeam')}
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className={`text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {t('teamDescription')}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="team-cards"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-30px", amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {/* Team Members */}
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                whileHover="hover"
                className="group"
                custom={index}
                style={{ perspective: "1000px" }}
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-teal-500/30 hover:border-teal-300 transition-all duration-500 overflow-hidden border border-gray-100 relative">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Profile Image */}
                  <div className="relative h-64 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={getLocalizedText(member.name)}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>

                  {/* Content */}
                  <motion.div 
                    className="p-6 text-center"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.h3 
                      className={`text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                        {getLocalizedText(member.name)}
                      </motion.h3>
                    <motion.p 
                      className={`text-teal-600 font-medium text-sm group-hover:text-teal-700 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                        {getLocalizedText(member.position)}
                        </motion.p>
                      </motion.div>
                    </div>
              </motion.div>
            ))}

            {/* Quote Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="group"
              style={{ perspective: "1000px" }}
            >
              <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-500 overflow-hidden h-full flex flex-col justify-center p-6 text-white relative">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-1000 delay-200"></div>
                </div>
                
                {/* Decorative Icons */}
                <motion.div 
                  className="absolute top-4 right-4 flex space-x-2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart className="w-3 h-3" />
                      </motion.div>
                  <motion.div 
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: -180 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Shield className="w-3 h-3" />
                      </motion.div>
                    </motion.div>

                {/* Quote Content */}
                <motion.div 
                  className="text-center relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Quote className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  </motion.div>
                  <blockquote className="text-lg font-medium mb-4 leading-relaxed">
                    {t('teamQuote')}
                  </blockquote>
                  <div className="text-sm opacity-90">
                    <p className="font-semibold">"Dorar"</p>
                    <p className="text-xs mt-1">{t('innovationTeam')}</p>
                      </div>
                  </motion.div>
                </div>
              </motion.div>
          </motion.div>
        </AnimatePresence>


      </div>
    </section>
  );
};

export default OurTeam;