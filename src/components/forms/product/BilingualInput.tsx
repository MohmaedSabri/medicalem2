/** @format */

import React from "react";

interface BilingualInputProps {
	label: string;
	valueEn: string;
	valueAr: string;
	onChangeEn: (val: string) => void;
	onChangeAr: (val: string) => void;
	placeholderEn?: string;
	placeholderAr?: string;
	required?: boolean;
	error?: string;
}

const BilingualInput: React.FC<BilingualInputProps> = ({
	label,
	valueEn,
	valueAr,
	onChangeEn,
	onChangeAr,
	placeholderEn,
	placeholderAr,
	required,
	error,
}) => {
	return (
		<div className='md:col-span-2'>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				{label} {required ? "*" : ""}
			</label>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
				<div>
					<label className='block text-xs font-medium text-gray-600 mb-1'>
						English (EN)
					</label>
					<input
						type='text'
						value={valueEn}
						onChange={(e) => onChangeEn(e.target.value)}
						className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
							error ? "border-red-500" : "border-gray-300"
						}`}
						placeholder={placeholderEn}
					/>
				</div>
				<div>
					<label className='block text-xs font-medium text-gray-600 mb-1'>
						العربية (AR)
					</label>
					<input
						type='text'
						value={valueAr}
						onChange={(e) => onChangeAr(e.target.value)}
						className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
							error ? "border-red-500" : "border-gray-300"
						}`}
						placeholder={placeholderAr}
						dir='auto'
					/>
				</div>
			</div>
			{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
		</div>
	);
};

export default BilingualInput;
