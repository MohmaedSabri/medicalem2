/** @format */

import React from "react";

type BilingualTextInputProps = {
	labelEn: string;
	labelAr: string;
	valueEn: string;
	valueAr: string;
	onChange: (field: "en" | "ar", value: string) => void;
	placeholderEn?: string;
	placeholderAr?: string;
	textarea?: boolean;
};

const BilingualTextInput: React.FC<BilingualTextInputProps> = ({
	labelEn,
	labelAr,
	valueEn,
	valueAr,
	onChange,
	placeholderEn,
	placeholderAr,
	textarea,
}) => {
	return (
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				{labelEn}
			</label>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
				<div>
					<label className='block text-xs font-medium text-gray-600 mb-1'>English (EN)</label>
					{textarea ? (
						<textarea
							value={valueEn}
							onChange={(e) => onChange("en", e.target.value)}
							rows={4}
							className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder={placeholderEn}
						/>
					) : (
						<input
							type='text'
							value={valueEn}
							onChange={(e) => onChange("en", e.target.value)}
							className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder={placeholderEn}
						/>
					)}
				</div>
				<div>
					<label className='block text-xs font-medium text-gray-600 mb-1'>العربية (AR)</label>
					{textarea ? (
						<textarea
							value={valueAr}
							onChange={(e) => onChange("ar", e.target.value)}
							rows={4}
							className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder={placeholderAr}
							dir='auto'
						/>
					) : (
						<input
							type='text'
							value={valueAr}
							onChange={(e) => onChange("ar", e.target.value)}
							className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
							placeholder={placeholderAr}
							dir='auto'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default BilingualTextInput;


