import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ChatWidget from '@/components/chat/ChatWidget';
import useAuthStore from '@/store/useAuthStore';
import useWishlistStore from '@/store/useWishlistStore';
import { shouldShowChatWidget } from '@/utils/chatVisibility';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const FlightsPage = lazy(() => import('@/pages/FlightsPage'));
const FlightDetailPage = lazy(() => import('@/pages/FlightDetailPage'));
const HotelsPage = lazy(() => import('@/pages/HotelsPage'));
const HotelDetailPage = lazy(() => import('@/pages/HotelDetailPage'));
const FlightHotelPage = lazy(() => import('@/pages/FlightHotelPage'));
const PackageDetailPage = lazy(() => import('@/pages/PackageDetailPage'));
const ToursPage = lazy(() => import('@/pages/ToursPage'));
const TourDetailPage = lazy(() => import('@/pages/TourDetailPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const DealsPage = lazy(() => import('@/pages/DealsPage'));
const DestinationDetailPage = lazy(() => import('@/pages/DestinationDetailPage'));
const CityDetailPage = lazy(() => import('@/pages/CityDetailPage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const LandmarkDetailPage = lazy(() => import('@/pages/LandmarkDetailPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const BookingConfirmationPage = lazy(() => import('@/pages/BookingConfirmationPage'));
const TripPlannerPage = lazy(() => import('@/pages/TripPlannerPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const BookingsPage = lazy(() => import('@/pages/BookingsPage'));
const TripsPage = lazy(() => import('@/pages/TripsPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const OtpVerificationPage = lazy(() => import('@/pages/OtpVerificationPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Footer pages
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));

/** Page loading fallback */
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
                <p className="text-on-surface-variant text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}

function RouteAwareChatWidget() {
    const location = useLocation();
    return shouldShowChatWidget(location.pathname) ? <ChatWidget /> : null;
}

export default function App() {
    // Hydrate auth token from persisted storage on app startup
    useEffect(() => {
        useAuthStore.getState().hydrate();
    }, []);

    // Sync wishlist with auth state
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    useEffect(() => {
        if (isAuthenticated) {
            useWishlistStore.getState().fetchWishlist();
        } else {
            useWishlistStore.getState().clearLocalWishlist();
        }
    }, [isAuthenticated]);

    return (
        // 1. الـ Provider لازم يغلف كل حاجة عشان الـ Error يروح
        <GoogleOAuthProvider clientId="383857845928-arkhkpea7flg4bq2po0t77cihsk1pd7l.apps.googleusercontent.com">
            <ErrorBoundary>
                <BrowserRouter>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '16px',
                                padding: '14px 20px',
                                color: '#2A2F37',
                                fontFamily: 'Manrope, sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                            },
                            success: {
                                iconTheme: { primary: '#294CD6', secondary: '#F2F1FF' },
                            },
                            error: {
                                iconTheme: { primary: '#B41340', secondary: '#FFEFEF' },
                            },
                        }}
                    />

                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public routes */}
                            <Route path={ROUTES.HOME} element={<LandingPage />} />
                            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                            <Route path={ROUTES.VERIFY_OTP} element={<OtpVerificationPage />} />
                            <Route path={ROUTES.FLIGHTS} element={<FlightsPage />} />
                            <Route path={ROUTES.FLIGHT_DETAIL} element={<FlightDetailPage />} />
                            <Route path={ROUTES.HOTELS} element={<HotelsPage />} />
                            <Route path={ROUTES.HOTEL_DETAIL} element={<HotelDetailPage />} />
                            <Route path={ROUTES.FLIGHT_HOTEL} element={<FlightHotelPage />} />
                            <Route path={ROUTES.PACKAGE_DETAIL} element={<PackageDetailPage />} />
                            <Route path={ROUTES.TOURS} element={<ToursPage />} />
                            <Route path={ROUTES.TOUR_DETAIL} element={<TourDetailPage />} />
                            <Route path={ROUTES.MAP} element={<MapPage />} />
                            <Route path={ROUTES.DEALS} element={<DealsPage />} />
                            <Route path={ROUTES.DEALS_DETAIL} element={<DestinationDetailPage />} />
                            <Route path={ROUTES.CITY_DETAIL} element={<CityDetailPage />} />
                            <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
                            <Route path={ROUTES.LANDMARK_DETAIL} element={<LandmarkDetailPage />} />
                            <Route path={ROUTES.SUPPORT} element={<SupportPage />} />

                            {/* Footer pages */}
                            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                            <Route path={ROUTES.CAREERS} element={<CareersPage />} />
                            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                            <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
                            <Route path={ROUTES.TERMS} element={<TermsPage />} />

                            {/* Protected routes */}
                            <Route path={ROUTES.CHECKOUT} element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                            <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
                            <Route path={ROUTES.TRIP_PLANNER} element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
                            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path={ROUTES.BOOKINGS} element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
                            <Route path={ROUTES.TRIPS} element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
                            <Route path={ROUTES.WISHLIST} element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

                            {/* 404 */}
                            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                    <RouteAwareChatWidget />
                </BrowserRouter>
            </ErrorBoundary>
        </GoogleOAuthProvider>
    );
}