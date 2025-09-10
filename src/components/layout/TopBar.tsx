/** @format */

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import Contactinfo from "../../constant/Contactinfo";

const TopBar: React.FC = () => {
    const { isRTL } = useLanguage();
    
    return (
        <div className=' z-50 hidden md:block bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-10 text-xs sm:text-sm'>
                    <div className='flex items-center'>
                        <a
                            href={`mailto:${Contactinfo.email}`}
                            className='flex items-center hover:text-teal-100 transition-colors'
                        >
                            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span>{Contactinfo.email}</span>
                        </a>
                        <a
                            href={`tel:${Contactinfo.phone}`}
                            className={`hidden md:flex items-center hover:text-teal-100 transition-colors ${isRTL ? 'mr-6' : 'ml-6'}`}
                        >
                            <Phone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            <span dir="ltr">{Contactinfo.phone}</span>
                        </a>
                    </div>
                    <div className='hidden sm:flex items-center'>
                        <MapPin className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        <span className='truncate'>{Contactinfo.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;


