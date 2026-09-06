import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SpecsSection from './components/SpecsSection';
import InsideBoxSection from './components/InsideBoxSection';
import OrderModal from './components/OrderModal';
import Footer from './components/Footer';
import WorksWithOverlay from './components/WorksWithOverlay';

export default function App() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black">
      <Navbar onOpenOrder={() => setOrderModalOpen(true)} />

      <main>
        <HeroSection onOpenOrder={() => setOrderModalOpen(true)} />
        <SpecsSection />
        <InsideBoxSection onOpenOrder={() => setOrderModalOpen(true)} />
      </main>

      <Footer />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

      {/* True global fixed overlay — no clipping ancestors */}
      <WorksWithOverlay />
    </div>
  );
}
