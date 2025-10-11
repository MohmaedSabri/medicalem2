import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useContactInfo } from '../../hooks/useContactInfo';

const WhatsAppFloatingButton: React.FC = () => {
  const { data: contactInfo } = useContactInfo();
  
  return (
    <motion.a
      href={contactInfo?.whatsapp || ''}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <div className="relative group">
        {/* Main Button */}
        <div className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-colors duration-200">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        
        {/* Simple Tooltip */}
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          WhatsApp
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-1 h-1 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </motion.a>
  );
};

export default WhatsAppFloatingButton;
