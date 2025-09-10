import React, { useState } from "react";
import { useForm, FieldPath, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnyObjectSchema } from "yup";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// Define schema field type for better typing
interface SchemaField {
	type?: string;
	oneOf?: string[];
	tests?: Array<{
		OPTIONS?: {
			name?: string;
		};
	}>;
	// Additional properties for better enum detection
	_whitelist?: Set<string>;
	spec?: {
		oneOf?: string[];
	};
}

type GenericFormProps<T extends FieldValues> = {
	schema: AnyObjectSchema;
	defaultValues?: Partial<T>;
	onSubmit: (data: T) => void | Promise<void>;
	submitButtonText?: string;
	className?: string;
	selectOptions?: Record<string, { value: string; label: string }[]>;
	context?: Record<string, unknown>;
};

function getInputType(
	fieldSchema: SchemaField,
	key: string,
	selectOptions?: Record<string, { value: string; label: string }[]>
): string {
	if (key === "videoFile") return "video";
	if (key === "pdfFile") return "pdf";

	// Textarea heuristics based on common content fields
	const textareaKeys = [
		"description",
		"longDescription",
		"content",
		"message",
		"bio",
		"specifications",
	];
	if (textareaKeys.some((k) => key.toLowerCase().includes(k))) {
		return "textarea";
	}

	// Special case: treat confirmPassword as password input, not select
	if (
		key.toLowerCase().includes("confirmpassword") ||
		key.toLowerCase() === "confirm_password"
	) {
		return "password";
	}

	// Check if selectOptions are provided for this field
	if (selectOptions && selectOptions[key] && selectOptions[key].length > 0) {
		return "select";
	}

	// Enhanced enum detection - check multiple possible sources
	// Only treat as select if there are valid string enum values
	const enumValues = getEnumValues(fieldSchema);
	if (enumValues.length > 0) return "select";

	// Enhanced enum detection - check multiple possible sources
	const hasEnumValues =
		(Array.isArray(fieldSchema?.oneOf) && fieldSchema.oneOf.length > 0) ||
		(Array.isArray(fieldSchema?.spec?.oneOf) &&
			fieldSchema.spec.oneOf.length > 0) ||
		(fieldSchema?._whitelist && fieldSchema._whitelist.size > 0);

	if (hasEnumValues) return "select";

	const type = fieldSchema?.type;

	// Arrays of primitive values
	if (type === "array") return "array";
	const isEmail = fieldSchema?.tests?.some(
		(t: { OPTIONS?: { name?: string } }) => t?.OPTIONS?.name === "email"
	);

	if (isEmail) return "email";

	// Check if field is password related
	if (key.toLowerCase().includes("password")) return "password";

	// Check if field is datetime related
	if (
		key.toLowerCase().includes("time") ||
		key.toLowerCase().includes("date")
	) {
		return "datetime-local";
	}

	// Common enum field name patterns (fallback detection)
	const enumPatterns = [
		"status",
		"type",
		"category",
		"priority",
		"state",
		"role",
		"mode",
	];
	if (
		enumPatterns.some((pattern) => key.toLowerCase().includes(pattern)) &&
		type === "string"
	) {
		return "select";
	}

	switch (type) {
		case "string":
			return "text";
		case "number":
			return "number";
		case "boolean":
			return "checkbox";
		case "date":
			return "date";
		default:
			return "text";
	}
}

function formatLabel(key: string): string {
	if (key === "bio") return "Bio - Field of specialization";
	return key
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Extracts enum values from different possible sources in Yup schema
 * Supports .oneOf() arrays and other Yup enum patterns
 * Filters out Yup ref objects which are used for validation, not options
 */
function getEnumValues(fieldSchema: SchemaField): string[] {
	// Helper function to check if a value is a Yup ref object
	const isYupRef = (value: unknown): boolean => {
		return (
			value !== null &&
			typeof value === "object" &&
			("key" in value || "isContext" in value || "getter" in value)
		);
	};

	// Helper function to filter out non-string values and Yup refs
	const filterValidOptions = (values: unknown[]): string[] => {
		return values.filter(
			(value): value is string => typeof value === "string" && !isYupRef(value)
		);
	};

	// Check oneOf array (most common for Yup schemas)
	if (Array.isArray(fieldSchema?.oneOf) && fieldSchema.oneOf.length > 0) {
		const validOptions = filterValidOptions(fieldSchema.oneOf);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	// Check spec.oneOf (alternative Yup structure)
	if (
		Array.isArray(fieldSchema?.spec?.oneOf) &&
		fieldSchema.spec.oneOf.length > 0
	) {
		const validOptions = filterValidOptions(fieldSchema.spec.oneOf);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	// Check _whitelist (Yup internal structure)
	if (fieldSchema?._whitelist && fieldSchema._whitelist.size > 0) {
		const whitelistArray = Array.from(fieldSchema._whitelist);
		const validOptions = filterValidOptions(whitelistArray);
		if (validOptions.length > 0) {
			return validOptions;
		}
	}

	return [];
}

/**
 * Automatically formats enum values for display in select options
 * Converts kebab-case, snake_case, and other patterns to proper Title Case
 * Examples: "in-progress" → "In Progress", "user_admin" → "User Admin"
 */
function formatSelectOption(value: string): string {
	// Handle empty or invalid values
	if (!value || typeof value !== "string") return value;

	// Generic enum formatting logic
	return value
		.split("-") // Split on hyphens (e.g., "in-progress")
		.map((word) => word.split("_")) // Split on underscores (e.g., "status_active")
		.flat() // Flatten the array
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
		.join(" "); // Join with spaces
}

export function GenericForm<T extends FieldValues>({
	schema,
	defaultValues,
	onSubmit,
	submitButtonText = "Submit",
	className = "",
	selectOptions = {},
	context = {},
}: GenericFormProps<T>) {
	const isGoogleAuth = Boolean((context as { isGoogleAuth?: boolean })?.isGoogleAuth);
	// State for password visibility per field
	const [passwordVisibility, setPasswordVisibility] = useState<
		Record<string, boolean>
	>({});
	// Temporary inputs for array fields
	const [arrayInputValues, setArrayInputValues] = useState<Record<string, string>>({});
	// File input previews
	const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<T>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: yupResolver(schema, { context }) as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		defaultValues: defaultValues as any,
	});

	const fields = Object.entries(schema.fields) as [string, SchemaField][];

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		key: string
	) => {
		const file = e.target.files?.[0];
		if (file) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			setValue(key as FieldPath<T>, file as any);
			try {
				const url = URL.createObjectURL(file);
				setFilePreviews((prev) => ({ ...prev, [key]: url }));
			} catch {
				// ignore preview errors
			}
		}
	};

	const togglePasswordVisibility = (fieldKey: string) => {
		setPasswordVisibility((prev) => ({
			...prev,
			[fieldKey]: !prev[fieldKey],
		}));
	};

	const handleArrayAdd = (fieldKey: string) => {
		const valueToAdd = (arrayInputValues[fieldKey] || "").trim();
		if (!valueToAdd) return;
		const currentValue = (watch(fieldKey as FieldPath<T>) as unknown as string[]) || [];
		const nextValue = Array.from(new Set([...(currentValue || []), valueToAdd]));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setValue(fieldKey as FieldPath<T>, nextValue as any, { shouldValidate: true });
		setArrayInputValues((prev) => ({ ...prev, [fieldKey]: "" }));
	};

	const handleArrayRemove = (fieldKey: string, index: number) => {
		const currentValue = (watch(fieldKey as FieldPath<T>) as unknown as string[]) || [];
		const nextValue = currentValue.filter((_, i) => i !== index);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setValue(fieldKey as FieldPath<T>, nextValue as any, { shouldValidate: true });
	};

	const handleImageArrayRemove = (fieldKey: string, index: number) => {
		const current = (watch(fieldKey as FieldPath<T>) as unknown as string[]) || [];
		const updated = current.filter((_, i) => i !== index);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setValue(fieldKey as FieldPath<T>, updated as any, { shouldValidate: true });
	};

	// Wrapper function to handle the form submission with mutation
	const handleFormSubmit = (data: T) => {
		onSubmit(data);
	};

	const isImageUrl = (url: string): boolean => {
		if (!url) return false;
		const trimmed = url.trim();
		return (
			/^https?:\/\//i.test(trimmed) ||
			/^data:image\//i.test(trimmed) ||
			/^blob:/i.test(trimmed) ||
			/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(trimmed)
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className={`max-w-sm mx-auto ${className}`}>
			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
				{fields.map(([key, fieldSchema]) => {
					const inputType = getInputType(fieldSchema, key, selectOptions);
					const label = formatLabel(key);
					const hasError = !!errors[key as FieldPath<T>];
					const isPasswordField = inputType === "password";
					const isPasswordVisible = passwordVisibility[key] || false;
					const actualInputType =
						isPasswordField && isPasswordVisible ? "text" : inputType;

					// Watch current value for array/image previews
					const watchedValue = watch(key as FieldPath<T>);

					return (
						<motion.div
							key={key}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.4,
								delay: fields.indexOf([key, fieldSchema]) * 0.1,
							}}>
							<label className='block text-xs font-medium text-slate-700 mb-1'>
								{label}
								{key === "email" && isGoogleAuth && (
									<span className="ml-1 text-xs text-gray-500">(from Google account)</span>
								)}
							</label>

							{inputType === "select" ? (
								<select
									{...register(key as FieldPath<T>)}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none bg-white text-slate-900 text-sm ${
										hasError
											? "border-red-300 focus:ring-red-500"
											: "border-slate-300 hover:border-teal-400"
										}`}>
									<option value=''>Select {label.toLowerCase()}...</option>
									{selectOptions[key]
										? selectOptions[key]!.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
										  ))
										: getEnumValues(fieldSchema).map((opt: string) => (
												<option key={opt} value={opt}>
													{formatSelectOption(opt)}
												</option>
										  ))}
								</select>
							) : inputType === "textarea" ? (
								<div className='relative'>
									<textarea
										{...register(key as FieldPath<T>)}
										rows={key.toLowerCase().includes("long") ? 5 : 3}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 text-sm ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
											}`}
										placeholder={`Enter ${label.toLowerCase()}`}
									/>
								</div>
							) : inputType === "array" ? (
								<div>
									<div className='flex gap-2'>
										<input
											type='text'
											value={arrayInputValues[key] || ""}
											onChange={(e) =>
												setArrayInputValues((prev) => ({ ...prev, [key]: e.target.value }))
											}
											className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
												hasError
													? "border-red-300 focus:ring-red-500"
													: "border-slate-300 hover:border-teal-400"
												}`}
											placeholder={`Add ${label.toLowerCase()} item and click Add`}
										/>
										<button
											type='button'
											onClick={() => handleArrayAdd(key)}
											className='px-3 py-2 rounded-lg bg-teal-600 text-white text-xs hover:bg-teal-700'>
											Add
										</button>
									</div>
									<input
										{...register(key as FieldPath<T>)}
										type='hidden'
									/>
									<div className='mt-2 flex flex-wrap gap-2'>
										{!(Array.isArray(watchedValue) && key.toLowerCase().includes("image")) &&
											(((watch(key as FieldPath<T>) as unknown as string[]) || []).map(
												(item, idx) => (
													<span
														key={`${key}-${idx}-${item}`}
														className='inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-800 text-xs border border-teal-200'>
														{item}
														<button
															type='button'
															onClick={() => handleArrayRemove(key, idx)}
															className='ml-1 text-teal-700 hover:text-teal-900'>
																&times;
															</button>
													</span>
												)
											))}
									</div>
									{Array.isArray(watchedValue) && key.toLowerCase().includes("image") && (
										<div className='mt-3 grid grid-cols-3 gap-2'>
											{(watchedValue as unknown as string[])
												.filter((u) => typeof u === 'string' && isImageUrl(u))
												.slice(0, 9)
												.map((u, i) => (
													<div key={`${key}-thumb-${i}`} className='relative w-full pt-[100%] bg-gray-100 rounded overflow-hidden'>
														<img src={u} alt={`preview-${i}`} className='absolute inset-0 w-full h-full object-cover' />
														<button
															type='button'
															onClick={() => handleImageArrayRemove(key, i)}
															className='absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
															title='Remove image'
														>
															&times;
														</button>
													</div>
												))}
										</div>
									)}
								</div>
							) : inputType === "checkbox" ? (
								<div className='flex items-center'>
									<input
										type='checkbox'
										{...register(key as FieldPath<T>)}
										className='rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-3 w-3'
									/>
									<span className='ml-2 text-xs text-slate-700'>{label}</span>
								</div>
							) : inputType === "file" ? (
								<div className='relative'>
									<input
										type='file'
										accept='image/*'
										onChange={(e) => handleFileChange(e, key)}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 text-sm ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
											}`}
									/>
									{filePreviews[key] && (
										<div className='mt-2'>
											<img src={filePreviews[key]} alt='preview' className='w-24 h-24 object-cover rounded border' />
										</div>
									)}
								</div>
							) : inputType === "video" ? (
								<div className='relative'>
									<input
										type='file'
										accept='video/*'
										onChange={(e) => handleFileChange(e, key)}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 text-sm ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
											}`}
									/>
								</div>
							) : inputType === "pdf" ? (
								<div className='relative'>
									<input
										type='file'
										accept='.pdf,application/pdf'
										onChange={(e) => handleFileChange(e, key)}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 text-sm ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
											}`}
									/>
								</div>
							) : inputType === "datetime-local" ? (
								<div className='relative'>
									<input
										type='datetime-local'
										{...register(key as FieldPath<T>)}
										min={new Date().toISOString().slice(0, 16)}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white text-slate-900 text-sm ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
											} [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:bg-teal-100 [&::-webkit-calendar-picker-indicator]:rounded-md [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:hover:bg-teal-200`}
									/>
								</div>
							) : (
								<div className='relative'>
									<input
										type={actualInputType}
										{...register(key as FieldPath<T>)}
										readOnly={key === "email" && isGoogleAuth}
										className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm ${
											isPasswordField ? "pr-10" : ""
										} ${
											hasError
												? "border-red-300 focus:ring-red-500"
												: "border-slate-300 hover:border-teal-400"
										} text-slate-900 placeholder-slate-500 ${
											key === "email" && isGoogleAuth 
												? "bg-gray-100 cursor-not-allowed" 
												: ""
										}`}
										placeholder={`Enter ${label.toLowerCase()}`}
									/>
									{isPasswordField && (
										<button
											type='button'
											onClick={() => togglePasswordVisibility(key)}
											className='absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200'>
											{isPasswordVisible ? (
												<EyeOff className='w-4 h-4' />
											) : (
												<Eye className='w-4 h-4' />
											)}
										</button>
									)}
									{typeof watchedValue === 'string' && key.toLowerCase().includes('image') && isImageUrl(watchedValue) && (
										<div className='mt-2'>
											<img src={watchedValue} alt='preview' className='w-24 h-24 object-cover rounded border' />
										</div>
									)}
								</div>
							)}

							{hasError && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='mt-1 text-xs text-red-600 flex items-center'>
									<svg
										className='w-3 h-3 mr-1'
										fill='currentColor'
										viewBox='0 0 20 20'>
										<path
											fillRule='evenodd'
											d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
											clipRule='evenodd'
										/>
									</svg>
									{errors[key as FieldPath<T>]?.message as string}
								</motion.p>
							)}
						</motion.div>
					);
				})}

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type='submit'
					disabled={isSubmitting}
					className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
						isSubmitting ? "animate-pulse" : ""
					}`}
				>
					{isSubmitting ? (
						<div className='flex items-center justify-center'>
							<svg
								className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
							</svg>
							Processing...
						</div>
					) : (
						submitButtonText
					)}
				</motion.button>
			</form>
		</motion.div>
	);
}