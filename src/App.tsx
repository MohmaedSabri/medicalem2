/** @format */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import TopBar from "./components/TopBar";

// Import i18n configuration
import './i18n';

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./components/BlogDetail"));
const Contact = lazy(() => import("./components/Contact"));
const Favorites = lazy(() => import("./pages/Favorites"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 1,
		},
	},
});

function App() {
	const pageVariants = {
		initial: { opacity: 0, x: 100 },
		in: { opacity: 1, x: 0 },
		out: { opacity: 0, x: -100 },
	};

	const pageTransition = {
		type: "tween" as const,
		ease: "anticipate" as const,
		duration: 0.5,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<ProductsProvider>
				<CategoriesProvider>
					<LanguageProvider>
						<Router>
							<AuthProvider>
								<AppContent />
								<Routes>
								{/* Contact Route */}
								<Route
									path='/contact'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='contact'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<Contact />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>
								{/* Login Route */}
								<Route
									path='/login'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='login'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header isLoginPage />
												<Login />
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Dashboard Route - Protected */}
								<Route
									path='/dashboard'
									element={
										<ProtectedRoute>
											<AnimatePresence mode='wait'>
												<motion.div
													key='dashboard'
													initial='initial'
													animate='in'
													exit='out'
													variants={pageVariants}
													transition={pageTransition}>
													<Dashboard />
												</motion.div>
											</AnimatePresence>
										</ProtectedRoute>
									}
								/>

								{/* Products Page Route */}
								<Route
									path='/products'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='products'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<ProductsPage />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Product Detail Route */}
								<Route
									path='/product/:id'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='product-detail'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<ProductDetail />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Favorites Route */}
								<Route
									path='/favorites'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='favorites'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<Favorites />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Blog Route */}
								<Route
									path='/blog'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='blog'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<Blog />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Blog Detail Route */}
								<Route
									path='/blog/:id'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='blog-detail'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<BlogDetail />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* About Route */}
								<Route
									path='/about'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='about'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Header />
												<Suspense fallback={<LoadingSpinner />}>
													<About />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>

								{/* Home Route */}
								<Route
									path='/'
									element={
										<AnimatePresence mode='wait'>
											<motion.div
												key='home'
												initial='initial'
												animate='in'
												exit='out'
												variants={pageVariants}
												transition={pageTransition}>
												<Suspense fallback={<LoadingSpinner />}>
													<Home />
												</Suspense>
											</motion.div>
										</AnimatePresence>
									}
								/>
							</Routes>
							{/* Toast Notifications */}
							<Toaster
								position="top-right"
								toastOptions={{
									duration: 4000,
									style: {
										background: '#363636',
										color: '#fff',
									},
									success: {
										duration: 4000,
										style: {
											background: '#10b981',
											color: '#fff',
										},
									},
									error: {
										duration: 4000,
										style: {
											background: '#ef4444',
											color: '#fff',
										},
									},
								}}
							/>
							</AuthProvider>
						</Router>
						</LanguageProvider>
					</CategoriesProvider>
				</ProductsProvider>
			</QueryClientProvider>
	);
}

const AppContent = () => {
	const location = useLocation();
	const hideChrome = location.pathname.startsWith("/dashboard");
	return hideChrome ? null : <TopBar />;
};

export default App;
