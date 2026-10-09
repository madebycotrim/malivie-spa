import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { trackWhatsAppClick } from '../services/analytics';
import logoMalivieWhite from '../assets/images/logo-malivie-white.webp';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Links essenciais e limpos, removendo os botões desnecessários
  const navLinks = [
    { label: 'Head Spa', href: '#head-spa' },
    { label: 'Rituais', href: '#menu-rituais' },
    { label: 'Avaliações', href: '#depoimentos' },
    { label: 'Gift Card', href: '#gift-card' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header estático no topo (absolute, sem acompanhar o scroll da página) */}
      <header className="absolute top-0 left-0 right-0 z-50 py-6 sm:py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Official Brand Logo */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, '#root')}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Maliviê SPA - Página Inicial"
          >
            <img
              src={logoMalivieWhite}
              alt="Maliviê SPA Logotipo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
            />
          </a>

          {/* Desktop Navigation Links (Apenas os essenciais) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-[0.18em] font-medium text-[#F3EFE6]/80 hover:text-[#D4AF37] transition-colors duration-300 relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions & Official CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={SPA_BUSINESS_DATA.whatsapp.navUrl}
              onClick={() => trackWhatsAppClick('navbar')}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-[#121C16] bg-[#7A8B7B] hover:bg-[#94A595] transition-all duration-300 shadow-[0_4px_20px_rgba(122,139,123,0.35)] hover:shadow-[0_6px_25px_rgba(122,139,123,0.5)] group overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <MessageCircle className="w-3.5 h-3.5 text-[#121C16] relative z-10" />
              <span className="relative z-10 font-semibold">Agendar um horário!</span>
            </a>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#F3EFE6] hover:bg-[#18251E] transition-colors focus:outline-none cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#121C16]/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-12 px-6 md:hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3EFE6]/10 pb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#7A8B7B] font-sans font-semibold">
                  Navegação
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="text-lg font-serif text-[#F3EFE6] hover:text-[#D4AF37] transition-colors flex items-center justify-between py-1"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#7A8B7B]" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#F3EFE6]/10">
              <a
                href={SPA_BUSINESS_DATA.whatsapp.navUrl}
                onClick={() => trackWhatsAppClick('navbar_mobile')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#7A8B7B] text-[#121C16] font-semibold text-sm tracking-wide shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Agendar um horário!</span>
              </a>

              <div className="text-center pt-2">
                <p className="text-xs text-[#F3EFE6]/60">
                  {SPA_BUSINESS_DATA.address.street} • {SPA_BUSINESS_DATA.address.neighborhood}
                </p>
                <p className="text-[11px] text-[#7A8B7B] mt-1">
                  ⭐ 5.0 Avaliação no Google
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
