/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MotionProvider } from './context/MotionContext';
import { ProjectProvider } from './context/ProjectContext';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SettingsDrawer } from './components/SettingsDrawer';

export default function App() {
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string>('');
  const [showPreloader, setShowPreloader] = useState(true);

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForInquiry(serviceTitle);
  };

  return (
    <MotionProvider>
      <ProjectProvider>
        {/* Animated Editorial Preloader */}
        {showPreloader && (
          <LoadingScreen onComplete={() => setShowPreloader(false)} />
        )}

        {/* Subtle physical grain overlay */}
        <div className="editorial-grain" aria-hidden="true" />

        {/* Custom cursor follower */}
        <CustomCursor />

        <div className="min-h-screen flex flex-col selection:bg-neutral-200 selection:text-neutral-900">
          {/* Top navigation */}
          <Navbar onReplayIntro={() => setShowPreloader(true)} />

          <main className="flex-1">
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Services Section (10 visual disciplines) */}
            <Services onSelectServiceForInquiry={handleSelectService} />

            {/* 3. Portfolio & Showcase */}
            <Portfolio onSelectServiceForInquiry={handleSelectService} />

            {/* 4. About & Philosophy */}
            <About />

            {/* 5. Creative Process */}
            <Process />

            {/* 6. Contact & Project Inquiry System */}
            <Contact selectedServicePreset={selectedServiceForInquiry} />
          </main>

          {/* Footer & Floating Settings Trigger */}
          <Footer onReplayIntro={() => setShowPreloader(true)} />

          {/* Personalized Motion Settings Drawer */}
          <SettingsDrawer />
        </div>
      </ProjectProvider>
    </MotionProvider>
  );
}
