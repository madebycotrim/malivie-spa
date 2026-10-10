import React from 'react';
import { useLenis } from './hooks/useLenis';
import { SEOHead } from './components/SEOHead';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ManifestoSection } from './components/ManifestoSection';
import { HeadSpaSection } from './components/HeadSpaSection';
import { ServicesMenuSection } from './components/ServicesMenuSection';
import { ReviewsSection } from './components/ReviewsSection';
import { GiftCardSection } from './components/GiftCardSection';
import { FAQSection } from './components/FAQSection';
import { LocationAndFooterSection } from './components/LocationAndFooterSection';
import { MobileActionDock } from './components/MobileActionDock';
import { EditorProvider } from './context/EditorContext';
import { Toaster } from 'sonner';

const EditorToolbar = React.lazy(() =>
  import('./components/editor/EditorToolbar').then((m) => ({ default: m.EditorToolbar }))
);
const AudioEqualizer = React.lazy(() =>
  import('./components/AudioEqualizer').then((m) => ({ default: m.AudioEqualizer }))
);

function App() {
  // Initialize Lenis smooth inertia scroll
  useLenis();

  return (
    <EditorProvider>
      <div className="min-h-screen bg-[#121C16] text-[#F3EFE6] selection:bg-[#7A8B7B] selection:text-[#121C16] relative overflow-x-hidden font-sans">
        {/* Editor Floating Toolbar */}
        <React.Suspense fallback={null}>
          <EditorToolbar />
        </React.Suspense>

        {/* SEO & Structured Data */}
        <SEOHead />

        {/* Adaptive Header / Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="relative">
          {/* SEÇÃO 1: HERO SECTION (Imersão Sensorial Botânica) */}
          <HeroSection />

          {/* SEÇÃO 2: O MANIFESTO DO DESACELERAMENTO & RITUAL DE BOAS-VINDAS */}
          <ManifestoSection />

          {/* SEÇÃO 3: DESTAQUE CARRO-CHEFE – HEAD SPA COREANO */}
          <HeadSpaSection />

          {/* SEÇÃO 4: MENU INTERATIVO DE RITUAIS TERAPÊUTICOS */}
          <ServicesMenuSection />

          {/* SEÇÃO 5: PROVA SOCIAL & RECONHECIMENTO (5.0 ESTRELAS) */}
          <ReviewsSection />

          {/* SEÇÃO 6: GIFT CARD & PRESENTES DE AUTOCUIDADO */}
          <GiftCardSection />

          {/* SEÇÃO 7: PERGUNTAS FREQUENTES & PREPARO PARA A VISITA */}
          <FAQSection />

          {/* SEÇÃO 8: LOCALIZAÇÃO, HORÁRIOS & RODAPÉ PREMIUM */}
          <LocationAndFooterSection />
        </main>

        {/* Floating ASMR Audio Equalizer (Desktop & Tablet) */}
        <React.Suspense fallback={null}>
          <AudioEqualizer />
        </React.Suspense>

        {/* Sticky Mobile Action Dock (Fixed Bottom-0 on Mobile) */}
        <MobileActionDock />

        {/* Sonner Toasts (Micro-interações Emil Kowalski) */}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#121C16',
              color: '#F3EFE6',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              borderRadius: '16px',
              fontFamily: 'inherit',
            },
          }}
        />
      </div>
    </EditorProvider>
  );
}

export default App;
