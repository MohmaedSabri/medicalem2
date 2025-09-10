/** @format */

import React from "react";
import { useSubCategories } from "../../../hooks/useSubCategories";
import { useLanguage } from "../../../contexts/LanguageContext";

type SubcategorySelectProps = {
	value: string;
	onChange: (value: string) => void;
	error?: string;
};

const SubcategorySelect: React.FC<SubcategorySelectProps> = ({ value, onChange, error }) => {
	const { data: subcategories = [] } = useSubCategories();
	const { currentLanguage } = useLanguage();

	const getLocalizedText = (value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'object' && value !== null) {
			const valueObj = value as Record<string, string>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || '';
		}
		return '';
	};

	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>Subcategory *</label>
			<select
				name='subcategory'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
					error ? "border-red-500" : "border-gray-300"
				}`}>
				<option value=''>Select a subcategory</option>
				{subcategories.map((sub: { _id: string; name: unknown }) => (
					<option key={sub._id} value={sub._id}>
						{getLocalizedText(sub.name)}
					</option>
				))}
			</select>
			{error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
		</div>
	);
};

export default SubcategorySelect;


