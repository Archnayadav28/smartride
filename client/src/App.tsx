import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { MainLayout } from './layouts/MainLayout';
import ConnectionStatus from './components/ConnectionStatus';

// Page imports
import LoginPage from './pages/LoginPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import BusBookingPage from './pages/BusBookingPage';
import CabBookingPage from './pages/CabBookingPage';
import HotelBookingPage from './pages/HotelBookingPage';
import OffersPage from './pages/OffersPage';
import HelpPage from './pages/HelpPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import ReviewPage from './pages/ReviewPage';
import MapPage from './pages/MapPage';
import TripDetailPage from './pages/TripDetailPage';
import ProfileEditPage from './pages/ProfileEditPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ConnectionProvider>
            <ConnectionStatus />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/otp-verification" element={<OtpVerificationPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="trip-information" element={<BookingsPage />} />
                <Route path="booking/bus" element={<BusBookingPage />} />
                <Route path="booking/cab" element={<CabBookingPage />} />
                <Route path="booking/hotel" element={<HotelBookingPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="guides" element={<OffersPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="account/settings" element={<SettingsPage />} />
                <Route path="account/review" element={<ReviewPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="trip/:id" element={<TripDetailPage />} />
                <Route path="profile/edit" element={<ProfileEditPage />} />
                <Route path="profile/complete" element={<CompleteProfilePage />} />
                <Route path="account/complete" element={<CompleteProfilePage />} />
              </Route>
            </Routes>
          </ConnectionProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
