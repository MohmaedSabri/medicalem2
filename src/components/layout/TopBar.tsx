/** @format */

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useContactInfo } from "../../hooks/useContactInfo";

const TopBar: React.FC = () => {
    const { isRTL } = useLanguage();
    const { data: contactInfo } = useContactInfo();
    
    return (
        <div className=' z-50 hidden md:block bg-gradient-to-r from-primary-600 to-primary-700 text-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-10 text-xs sm:text-sm'>
                    <div className='flex items-center'>
                        <a
                            href={`mailto:${contactInfo?.email || ''}`}
                            className='flex items-center hover:text-primary-100 transition-colors'
                        >
                            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span>{contactInfo?.email || ''}</span>
                        </a>
                        <a
                            href={`tel:${contactInfo?.phone || ''}`}
                            className={`hidden md:flex items-center hover:text-primary-100 transition-colors ${isRTL ? 'mr-6' : 'ml-6'}`}
                        >
                            <Phone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span dir="ltr">{contactInfo?.phone || ''}</span>
                        </a>
                    </div>
                    <div className='hidden sm:flex items-center'>
                        <MapPin className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className='truncate'>{contactInfo?.address || ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;


