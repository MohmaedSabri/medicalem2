/** @format */

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const TopBar: React.FC = () => {
    const { isRTL } = useLanguage();
    
    return (
        <div className=' z-50 hidden md:block bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-10 text-xs sm:text-sm'>
                    <div className='flex items-center'>
                        <a
                            href='mailto:info@dorarmed.com'
                            className='flex items-center hover:text-teal-100 transition-colors'
                        >
                            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span>info@dorarmed.com</span>
                        </a>
                        <a
                            href='tel:+971556707773'
                            className={`hidden md:flex items-center hover:text-teal-100 transition-colors ${isRTL ? 'mr-6' : 'ml-6'}`}
                        >
                            <Phone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span dir="ltr">+971 55 670 7773</span>
                        </a>
                    </div>
                    <div className='hidden sm:flex items-center'>
                        <MapPin className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className='truncate'>Dubai Healthcare City, Building 40, Office 503</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;


