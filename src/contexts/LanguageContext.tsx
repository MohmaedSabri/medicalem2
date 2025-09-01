import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
	currentLanguage: string;
	changeLanguage: (language: string) => void;
	isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};

interface LanguageProviderProps {
	children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
	const { i18n } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState('en');

	// Check if language is stored in localStorage
	useEffect(() => {
		const savedLanguage = localStorage.getItem('language');
		if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
			setCurrentLanguage(savedLanguage);
			i18n.changeLanguage(savedLanguage);
			document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
		}
	}, [i18n]);

	const changeLanguage = (language: string) => {
		setCurrentLanguage(language);
		i18n.changeLanguage(language);
		localStorage.setItem('language', language);
		document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
	};

	const isRTL = currentLanguage === 'ar';

	const value: LanguageContextType = {
		currentLanguage,
		changeLanguage,
		isRTL,
	};

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};
