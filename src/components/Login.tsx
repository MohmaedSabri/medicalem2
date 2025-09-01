/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
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
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginForm>>({});
	const [loginError, setLoginError] = useState("");

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
				navigate("/dashboard");
			} else {
				setLoginError("Invalid email or password. Please try again.");
			}
		} catch (error) {
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
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className='text-center'>
					<motion.button
						whileHover={{ x: -5 }}
						onClick={() => navigate("/")}
						className='inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors mb-6'>
						<ArrowLeft className='h-4 w-4' />
						<span>Back to Home</span>
					</motion.button>

					<h2 className='text-3xl font-bold text-gray-900 mb-2'>
						Welcome Back
					</h2>
					<p className='text-gray-600'>
						Sign in to access your medical equipment dashboard
					</p>
				</motion.div>

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
									type={showPassword ? "text" : "password"}
									name='password'
									value={form.password}
									onChange={handleChange}
									className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
										errors.password
											? "border-red-300 bg-red-50"
											: "border-gray-300"
									}`}
									placeholder='Enter your password'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									{showPassword ? (
										<EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
									) : (
										<Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
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

						{/* Remember & Forgot */}
						<div className='flex items-center justify-between'>
							<label className='flex items-center'>
								<input
									type='checkbox'
									className='rounded border-gray-300 text-teal-600 focus:ring-teal-500'
								/>
								<span className='ml-2 text-sm text-gray-600'>Remember me</span>
							</label>
							<motion.a
								whileHover={{ scale: 1.05 }}
								href='#'
								className='text-sm text-teal-600 hover:text-teal-700 transition-colors'>
								Forgot password?
							</motion.a>
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

					{/* Sign Up Link */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='mt-6 text-center'>
						<p className='text-gray-600'>
							Don't have an account?{" "}
							<motion.a
								whileHover={{ scale: 1.05 }}
								href='#'
								className='text-teal-600 hover:text-teal-700 font-medium transition-colors'>
								Create Account
							</motion.a>
						</p>
					</motion.div>

					{/* Demo Credentials */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className='mt-6 p-4 bg-gray-50 rounded-lg'>
						<p className='text-xs text-gray-600 text-center'>
							<strong>Demo Credentials:</strong>
							<br />
							Email: demo@medequippro.com
							<br />
							Password: demo123
						</p>
					</motion.div>
				</motion.div>

				{/* Security Notice */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className='text-center text-sm text-gray-600'>
					<p>🔒 Your data is protected with enterprise-grade security</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Login;
