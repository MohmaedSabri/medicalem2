/** @format */

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
	children, 
	redirectTo = '/x7k9m2p4q8w1n5r3t6y0u9i8o7p6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m0' 
}) => {
	const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuth();
	const location = useLocation();

	// Check auth status when component mounts
	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	// Show loading spinner while checking authentication
	if (isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center'>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className='text-center'
				>
					<div className='animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto mb-6'></div>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className='text-gray-700 text-lg font-medium'
					>
						Verifying authentication...
					</motion.p>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className='text-gray-500 text-sm mt-2'
					>
						Please wait while we check your credentials
					</motion.p>
				</motion.div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated || !user) {
		// Store the attempted location for redirect after login
		sessionStorage.setItem('redirectAfterLogin', location.pathname);
		
		return (
			<Navigate 
				to={redirectTo} 
				replace 
				state={{ from: location }}
			/>
		);
	}

	// User is authenticated, render the protected content
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{children}
		</motion.div>
	);
};

export default ProtectedRoute;
