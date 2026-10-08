import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  Navigation,
  Compass,
  ArrowUp,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './SocialIcons';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import logoMalivieWhite from '../assets/images/logo-malivie-white.webp';
import fachadaImg from '../assets/images/malivie-fachada-oficial.webp';

export const LocationAndFooterSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exactStoreAddress = 'Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    exactStoreAddress
  )}`;

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    exactStoreAddress
  )}`;

  return (
    <footer id="localizacao" className="relative bg-[#121C16] text-[#F3EFE6] pt-28 pb-16 overflow-hidden border-t border-[#F3EFE6]/10">
      {/* Botanical ambient gradient aura */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#7A8B7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Compass className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Visite Nosso Santuário
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight">
            Localização & <span className="italic font-normal text-[#D4AF37]">Horários</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/70 font-sans max-w-xl mx-auto leading-relaxed">
            Fácil acesso e conveniência no coração do Núcleo Bandeirante, com tranquilidade e discrição garantidas.
          </p>
        </div>

        {/* 3-Column Luxury Matrix: Real Facade, Interactive Map, Address & Official Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch mb-16">
          {/* Card 1: Authentic Spa Facade Photo */}
          <div className="lg:col-span-4 rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]">
                  Fachada & Espaço Físico
                </span>
              </div>
              <span className="text-[11px] text-[#7A8B7B] font-mono font-medium">
                Loja 3 • Térreo
              </span>
            </div>

            {/* Photo Viewport - Fills full card height down to bottom padding, showing sidewalk and cutting off parking lot */}
            <div className="relative w-full flex-1 min-h-[320px] rounded-2xl overflow-hidden bg-[#0D1410] border border-[#F3EFE6]/15 shadow-inner group">
              <img
                src={fachadaImg}
                alt="Fachada oficial do Maliviê SPA no Núcleo Bandeirante, Brasília"
                style={{ objectPosition: 'center 60%' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20 pointer-events-none" />
              
              {/* Floating Pill on top-left */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121C16]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-sans font-semibold text-[#F3EFE6] shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Fachada do Maliviê SPA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Real Interactive Google Map */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden hover:border-[#D4AF37]/30 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8B7B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]">
                  Google Maps Interativo
                </span>
              </div>
              <span className="text-[11px] text-[#7A8B7B] font-mono font-medium">
                Brasília • DF
              </span>
            </div>

            {/* Real Interactive Google Maps Viewport matching exact start of Facade */}
            <div className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#0D1410] border border-[#F3EFE6]/15 shadow-inner group">
              <iframe
                title="Google Maps Interativo - Maliviê SPA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.285497217522!2d-47.96985782390618!3d-15.872212384777598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3a91bca7f781%3A0xb3bc87e59f427f7f!2sMalivi%C3%AA%20SPA%20-%203%C2%AA%20Avenida%2C%201124%20-%20lote%201208-A%2C%20Loja%203%20-%20N%C3%BAcleo%20Bandeirante%2C%20Bras%C3%ADlia%20-%20DF!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.02]"
              />

              {/* Floating Address Tag Pill */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121C16]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-sans font-semibold text-[#F3EFE6] shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Maliviê SPA • 3ª Avenida, 1124 - Lote 1208-A, Loja 3</span>
                </div>
              </div> 
            </div>

            {/* Map Interactive Quick Actions */}
            <div className="mt-3.5 flex items-center justify-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#121C16] hover:bg-[#1E2D24] text-[11px] font-medium text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#D4AF37]/50 transition-all shadow-sm group"
              >
                <Navigation className="w-3.5 h-3.5 text-[#7A8B7B] group-hover:text-[#D4AF37] transition-colors" />
                <span>Abrir no Maps</span>
                <ExternalLink className="w-3 h-3 text-[#F3EFE6]/50" />
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#121C16] hover:bg-[#1E2D24] text-[11px] font-medium text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#7A8B7B]/50 transition-all shadow-sm group"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#7A8B7B] transition-colors" />
                <span>Traçar no Waze</span>
                <ExternalLink className="w-3 h-3 text-[#F3EFE6]/50" />
              </a>
            </div>
          </div>

          {/* Column 3: 2 Separate Cards (Top & Bottom) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5 h-full">
            {/* Card Top: Endereço Físico Oficial */}
            <div className="rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden hover:border-[#D4AF37]/30 transition-all flex-1">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#F3EFE6]/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]">
                    Endereço Físico
                  </span>
                </div>
                <span className="text-[11px] text-[#7A8B7B] font-mono font-medium">
                  Brasília • DF
                </span>
              </div>

              {/* Body Content */}
              <div className="space-y-1.5 py-2">
                <p className="font-serif text-lg sm:text-xl text-[#F3EFE6] font-light leading-snug">
                  {SPA_BUSINESS_DATA.address.street}
                </p>
                <p className="text-xs text-[#F3EFE6]/70 font-sans leading-relaxed">
                  {SPA_BUSINESS_DATA.address.neighborhood}, {SPA_BUSINESS_DATA.address.city} - {SPA_BUSINESS_DATA.address.state}
                  <br />
                  CEP: {SPA_BUSINESS_DATA.address.postalCode}
                </p>
              </div>

              {/* Footer Highlight */}
              <div className="pt-2.5 border-t border-[#F3EFE6]/10 mt-1 flex items-center justify-between">
                <span className="text-[11px] text-[#D4AF37] font-sans flex items-center gap-1.5">
                  <span>Estacionamento amplo e gratuito em frente à clínica</span>
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#7A8B7B] hover:text-[#D4AF37] transition-colors"
                >
                  <span>No mapa</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Card Bottom: Horários de Funcionamento & Agendamento */}
            <div className="rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden hover:border-[#D4AF37]/30 transition-all flex-[1.3]">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#F3EFE6]/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]">
                    Horários de Funcionamento
                  </span>
                </div>
                <span className="text-[10px] uppercase font-sans font-bold text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#D4AF37]/15">
                  Oficial
                </span>
              </div>

              {/* Schedule Rows */}
              <div className="space-y-2 py-1.5">
                <div className="flex items-center justify-between py-1 border-b border-[#F3EFE6]/5 text-xs">
                  <span className="text-[#F3EFE6]/80 font-medium">Segunda-feira</span>
                  <span className="text-[#D3B8AA] font-serif italic text-xs px-2.5 py-0.5 rounded bg-[#D3B8AA]/10">
                    {SPA_BUSINESS_DATA.schedule.monday}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F3EFE6]/5 text-xs">
                  <span className="text-[#F3EFE6] font-medium">Terça a Sábado</span>
                  <span className="text-[#7A8B7B] font-bold font-sans text-xs px-2.5 py-0.5 rounded bg-[#7A8B7B]/15">
                    {SPA_BUSINESS_DATA.schedule.tuesdayToSaturday}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-xs">
                  <span className="text-[#F3EFE6] font-medium">Domingo</span>
                  <span className="text-[#D4AF37] font-bold font-sans text-xs px-2.5 py-0.5 rounded bg-[#D4AF37]/15">
                    {SPA_BUSINESS_DATA.schedule.sunday}
                  </span>
                </div>
              </div>

              {/* Footer with CTA Button */}
              <div className="pt-2.5 border-t border-[#F3EFE6]/10 mt-1 flex flex-col gap-2">
                <span className="text-[11px] text-[#F3EFE6]/70 text-center">
                  Dúvidas ou agendamento? Fale com a recepção
                </span>
                <a
                  href={SPA_BUSINESS_DATA.social.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#7A8B7B] hover:bg-[#687969] text-[#121C16] text-xs font-bold transition-all shadow-md group"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#121C16]" />
                  <span>Agendar um horário!</span>
                  <ExternalLink className="w-3 h-3 text-[#121C16]/70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links Matrix */}
        <div className="py-12 border-t border-b border-[#F3EFE6]/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href={SPA_BUSINESS_DATA.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#18251E]/60 hover:bg-[#18251E] border border-[#F3EFE6]/5 hover:border-[#D4AF37]/30 transition-all text-xs font-medium text-[#F3EFE6]/80 hover:text-[#D4AF37] group"
          >
            <InstagramIcon className="w-4 h-4 text-[#7A8B7B] group-hover:text-[#D4AF37]" />
            <span>{SPA_BUSINESS_DATA.social.instagramHandle}</span>
          </a>

          <a
            href={SPA_BUSINESS_DATA.social.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#18251E]/60 hover:bg-[#18251E] border border-[#F3EFE6]/5 hover:border-[#D4AF37]/30 transition-all text-xs font-medium text-[#F3EFE6]/80 hover:text-[#D4AF37] group"
          >
            <ExternalLink className="w-4 h-4 text-[#7A8B7B] group-hover:text-[#D4AF37]" />
            <span>Linktree Oficial</span>
          </a>

          <a
            href={SPA_BUSINESS_DATA.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#18251E]/60 hover:bg-[#18251E] border border-[#F3EFE6]/5 hover:border-[#D4AF37]/30 transition-all text-xs font-medium text-[#F3EFE6]/80 hover:text-[#D4AF37] group"
          >
            <FacebookIcon className="w-4 h-4 text-[#7A8B7B] group-hover:text-[#D4AF37]" />
            <span>Facebook Maliviê</span>
          </a>

          <a
            href={SPA_BUSINESS_DATA.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#18251E]/60 hover:bg-[#18251E] border border-[#F3EFE6]/5 hover:border-[#D4AF37]/30 transition-all text-xs font-medium text-[#F3EFE6]/80 hover:text-[#D4AF37] group"
          >
            <TikTokIcon className="w-4 h-4 text-[#7A8B7B] group-hover:text-[#D4AF37]" />
            <span>TikTok {SPA_BUSINESS_DATA.social.tiktokHandle}</span>
          </a>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3EFE6]/50">
          <div className="flex items-center gap-3">
            <img
              src={logoMalivieWhite}
              alt="Maliviê SPA"
              className="h-7 w-auto object-contain opacity-90"
            />
            <span>•</span>
            <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
          </div>

          <p className="font-serif italic text-sm text-[#D4AF37]/90 text-center">
            "{SPA_BUSINESS_DATA.slogan}"
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-[#F3EFE6]/70 hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
