/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../types";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginForm>>({});
	const [loginError, setLoginError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name as keyof LoginForm]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginForm> = {};

		if (!form.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(form.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!form.password) {
			newErrors.password = "Password is required";
		} else if (form.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setLoginError("");

		try {
			const success = await login(form.email, form.password);
			if (success) {
				// Check if there's a redirect path stored
				const redirectPath = sessionStorage.getItem('redirectAfterLogin');
				
				if (redirectPath && redirectPath !== '/x7k9m2p4q8w1n5r3t6y0u9i8o7p6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m0') {
					// Navigate to the originally requested page
					navigate(redirectPath);
					// Clear the stored redirect path
					sessionStorage.removeItem('redirectAfterLogin');
				} else {
					// Default redirect to dashboard
					navigate("/z9x8c7v6b5n4m3a2s1d4f5g6h7j8k9l0p1o2i3u4y5t6r7e8w9q0");
				}
			} else {
				setLoginError("Invalid email or password. Please try again.");
			}
		} catch {
			setLoginError("An error occurred during login. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				className='max-w-md w-full space-y-8'>
				
				{/* Login Form */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='bg-white p-8 rounded-2xl shadow-xl'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Email Field */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' />
								</div>
								<motion.input
									whileFocus={{ scale: 1.02 }}
									type='email'
									name='email'
									value={form.email}
									onChange={handleChange}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
										errors.email
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}
									placeholder='john@medequippro.com'
								/>
							</div>
							{errors.email && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='mt-1 text-sm text-red-600'>
									{errors.email}
								</motion.p>
							)}
						</div>

						{/* Password Field */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' />
								</div>
								<motion.input
									whileFocus={{ scale: 1.02 }}
									type={showPassword ? 'text' : 'password'}
									name='password'
									value={form.password}
									onChange={handleChange}
									className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
										errors.password
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}
									placeholder='Enter your password'
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							{errors.password && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className='mt-1 text-sm text-red-600'>
									{errors.password}
								</motion.p>
							)}
						</div>

						{/* Login Error */}
						{loginError && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='p-3 bg-red-50 border border-red-200 rounded-lg'>
								<p className='text-sm text-red-600 text-center'>{loginError}</p>
							</motion.div>
						)}

						{/* Submit Button */}
						<motion.button
							type='submit'
							disabled={isLoading}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full bg-teal-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2'>
							{isLoading ? (
								<>
									<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
									<span>Signing in...</span>
								</>
							) : (
								<span>Sign In</span>
							)}
						</motion.button>
					</form>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Login;
