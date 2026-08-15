import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider, useReservation } from './context/ReservationContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DivisionQuickSwitcher } from './components/DivisionQuickSwitcher';
import { RestaurantGrid } from './components/RestaurantGrid';
import { FilterDrawer } from './components/FilterDrawer';
import { ReservationModal } from './components/ReservationModal';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { AuthModal } from './components/AuthModal';
import { HostPortalModal } from './components/HostPortalModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';

// Toast Notification Overlay
const ToastNotification = () => {
  const { toast } = useReservation();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-gold-500/40 shadow-2xl"
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-crimson-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs font-bold text-white max-w-xs">{toast.message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

function MainLayout() {
  const { isHostPortalOpen, setIsHostPortalOpen, isAdminModalOpen, setIsAdminModalOpen } = useReservation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-gold-500 selection:text-black">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DivisionQuickSwitcher />
        <RestaurantGrid />
      </main>
      <Footer />

      {/* Interactive Floating Modals & Drawers */}
      <FilterDrawer />
      <ReservationModal />
      <RestaurantDetailModal />
      <MyBookingsDrawer />
      <AuthModal />
      <HostPortalModal isOpen={isHostPortalOpen} onClose={() => setIsHostPortalOpen(false)} />
      <AdminDashboardModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      <ToastNotification />
    </div>
  );
}


import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReservationProvider>
          <MainLayout />
        </ReservationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

