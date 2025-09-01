/** @format */

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const TopBar: React.FC = () => {
    return (
        <div className=' z-50 bg-gradient-to-r from-teal-600 to-teal-700 text-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-10 text-xs sm:text-sm'>
                    <div className='flex items-center space-x-4 sm:space-x-6'>
                        <a
                            href='mailto:info@medequippro.com'
                            className='flex items-center space-x-2 hover:text-teal-100 transition-colors'
                        >
                            <Mail className='h-4 w-4' />
                            <span>info@medequippro.com</span>
                        </a>
                        <a
                            href='tel:+1234567890'
                            className='hidden md:flex items-center space-x-2 hover:text-teal-100 transition-colors'
                        >
                            <Phone className='h-4 w-4' />
                            <span dir="ltr">+1 (234) 567-890</span>
                        </a>
                    </div>
                    <div className='hidden sm:flex items-center space-x-2'>
                        <MapPin className='h-4 w-4' />
                        <span className='truncate'>123 Health Ave, Wellness City</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;


