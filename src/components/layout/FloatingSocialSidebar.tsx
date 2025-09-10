import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, MessageCircle, MapPin, MessageSquare } from 'lucide-react';
import Contactinfo from '../../constant/Contactinfo';

interface FloatingSocialSidebarProps {
  isVisible: boolean;
}

const FloatingSocialSidebar: React.FC<FloatingSocialSidebarProps> = ({ isVisible }) => {
  const socialLinks = [
    { icon: Mail, href: `mailto:${Contactinfo.email}`, label: 'Email', color: 'hover:bg-red-500' },
    { icon: Phone, href: `tel:${Contactinfo.phone}`, label: 'Phone', color: 'hover:bg-green-500' },
    { icon: MessageSquare, href: Contactinfo.whatsapp, label: 'WhatsApp', color: 'hover:bg-green-600' },
    { icon: Facebook, href: Contactinfo.facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: Contactinfo.instagram, label: 'Instagram', color: 'hover:bg-pink-500' },
    { icon: Twitter, href: Contactinfo.twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Linkedin, href: Contactinfo.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: MapPin, href: Contactinfo.map, label: 'Location', color: 'hover:bg-purple-500' },
    { icon: MessageCircle, href: '/contact', label: 'Contact Form', color: 'hover:bg-teal-500' },
  ];

  return (
    //help
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            type: "tween"
          }}
          className="fixed left-4 top-[30vh] transform  z-50 hidden lg:block"
        >
          <div className="flex flex-col space-y-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') || social.href.startsWith('mailto:') || social.href.startsWith('tel:') ? '_blank' : '_self'}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : ''}
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut",
                  type: "tween"
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-14 h-14 rounded-full bg-[#00796a] shadow-2xl
                  border-2 border-white/30
                  flex items-center justify-center
                  text-white hover:text-white
                  transition-all duration-300
                  ${social.color}
                  group
                `}
                title={social.label}
              >
                <social.icon className="w-6 h-6" />
                
                {/* Tooltip */}
                <div className="absolute left-16 bg-[#00796a] text-white px-3 py-2 rounded-lg 
                              shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                              whitespace-nowrap pointer-events-none border border-white/20">
                  {social.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 
                                w-2 h-2 bg-[#00796a] rotate-45 border-l border-b border-white/20"></div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingSocialSidebar;
