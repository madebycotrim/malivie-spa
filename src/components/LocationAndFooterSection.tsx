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
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './SocialIcons';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { isAbertoAgora } from '../utils/businessHours';
import { trackWhatsAppClick } from '../services/analytics';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { EditableIcon } from './editor/EditableIcon';
import { PasswordModal } from './editor/PasswordModal';
import logoMalivieWhite from '../assets/images/logo-malivie-white.webp';
import fachadaImg from '../assets/images/malivie-fachada-oficial.webp';

export const LocationAndFooterSection: React.FC = () => {
  const abertoAgora = isAbertoAgora();
  const { toggleEditor, requestOpenEditor, isEditorActive, isPasswordModalOpen } = useEditor();
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [logoPulse, setLogoPulse] = React.useState(false);

  const handleLogoTripleClick = () => {
    clickCountRef.current += 1;
    setLogoPulse(true);
    setTimeout(() => setLogoPulse(false), 300);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (isEditorActive) {
        toggleEditor();
      } else {
        requestOpenEditor();
      }
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  };

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
    <footer id="localizacao" className="relative bg-[#121C16] text-[#F3EFE6] pt-28 pb-28 md:pb-16 overflow-hidden border-t border-[#F3EFE6]/10">
      {/* Botanical ambient gradient aura com respiração suave */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#7A8B7B]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Compass className="w-3.5 h-3.5 text-[#7A8B7B]" />
            <EditableText id="location.badge" defaultText="Visite Nosso Santuário" as="span">
              Visite Nosso Santuário
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            <EditableText id="location.title" defaultText="Localização & Horários" as="span">
              Localização & <span className="italic font-normal text-[#D4AF37]">Horários</span>
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/70 font-sans max-w-xl mx-auto leading-relaxed"
          >
            <EditableText
              id="location.description"
              defaultText="Fácil acesso e conveniência no coração do Núcleo Bandeirante, com tranquilidade e discrição garantidas."
              as="span"
            >
              Fácil acesso e conveniência no coração do Núcleo Bandeirante, com tranquilidade e discrição garantidas.
            </EditableText>
          </motion.p>
        </div>

        {/* 3-Column Luxury Matrix: Real Facade, Interactive Map, Address & Official Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch mb-16">
          {/* Card 1: Authentic Spa Facade Photo */}
          <div className="lg:col-span-4 rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F3EFE6]/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <EditableText
                  id="location.facade.header"
                  defaultText="Fachada & Espaço Físico"
                  as="span"
                  className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]"
                >
                  Fachada & Espaço Físico
                </EditableText>
              </div>
              <EditableText
                id="location.facade.tag"
                defaultText="Loja 3 • Térreo"
                as="span"
                className="text-[11px] text-[#7A8B7B] font-mono font-medium"
              >
                Loja 3 • Térreo
              </EditableText>
            </div>

            {/* Photo Viewport - Fills full card height down to bottom padding, showing sidewalk and cutting off parking lot */}
            <div className="relative w-full flex-1 min-h-[320px] rounded-2xl overflow-hidden bg-[#0D1410] border border-[#F3EFE6]/15 shadow-inner group">
              <EditableImage
                id="location.facade"
                defaultImage={fachadaImg}
                alt="Fachada do Maliviê SPA no Núcleo Bandeirante, Brasília"
                prefix="fachada"
                style={{ objectPosition: 'center 60%' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20 pointer-events-none" />
              
              {/* Floating Pill on top-left */}
              <div
                className="absolute top-3 left-3 z-30 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121C16]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-sans font-semibold text-[#F3EFE6] shadow-lg">
                  <EditableIcon id="location.facadeBadge.icon" defaultIcon="MapPin" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <EditableText id="location.facadeBadge" defaultText="Fachada do Maliviê SPA" as="span">
                    Fachada do Maliviê SPA
                  </EditableText>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Real Interactive Google Map */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden hover:border-[#D4AF37]/30 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F3EFE6]/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8B7B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <EditableText
                  id="location.map.header"
                  defaultText="Google Maps Interativo"
                  as="span"
                  className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]"
                >
                  Google Maps Interativo
                </EditableText>
              </div>
              <EditableText
                id="location.map.tag"
                defaultText="Brasília • DF"
                as="span"
                className="text-[11px] text-[#7A8B7B] font-mono font-medium"
              >
                Brasília • DF
              </EditableText>
            </div>

            {/* Real Interactive Google Maps Viewport matching exact start of Facade */}
            <div className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#0D1410] border border-[#F3EFE6]/15 shadow-inner group">
              <iframe
                title="Google Maps Interativo - Maliviê SPA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.285497217522!2d-47.96985782390618!3d-15.872212384777598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2fec33e25ea5%3A0xc3918d2ad9f06bdc!2sMalivi%C3%AA%20SPA!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-[1.02]"
              />

              {/* Floating Address Tag Pill */}
              <div
                className="absolute top-3 left-3 z-30 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121C16]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-sans font-semibold text-[#F3EFE6] shadow-lg">
                  <EditableIcon id="location.mapBadge.icon" defaultIcon="MapPin" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <EditableText id="location.mapBadge" defaultText="Maliviê SPA • 3ª Avenida, 1124 - Lote 1208-A, Loja 3" as="span">
                    Maliviê SPA • 3ª Avenida, 1124 - Lote 1208-A, Loja 3
                  </EditableText>
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
                <EditableIcon id="location.map.mapsBtn.icon" defaultIcon="Navigation" className="w-3.5 h-3.5 text-[#7A8B7B] group-hover:text-[#D4AF37] transition-colors" />
                <EditableText id="location.map.mapsBtn" defaultText="Abrir no Maps" as="span">
                  Abrir no Maps
                </EditableText>
                <ExternalLink className="w-3 h-3 text-[#F3EFE6]/65" />
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#121C16] hover:bg-[#1E2D24] text-[11px] font-medium text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#7A8B7B]/50 transition-all shadow-sm group"
              >
                <EditableIcon id="location.map.wazeBtn.icon" defaultIcon="Navigation" className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#7A8B7B] transition-colors" />
                <EditableText id="location.map.wazeBtn" defaultText="Traçar no Waze" as="span">
                  Traçar no Waze
                </EditableText>
                <ExternalLink className="w-3 h-3 text-[#F3EFE6]/65" />
              </a>
            </div>
          </div>

          {/* Column 3: 2 Separate Cards (Top & Bottom) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5 h-full">
            {/* Card Top: Endereço Físico */}
            <div className="rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden hover:border-[#D4AF37]/30 transition-all flex-[0.75]">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#F3EFE6]/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                  </span>
                  <EditableText
                    id="location.address.header"
                    defaultText="Endereço Físico"
                    as="span"
                    className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]"
                  >
                    Endereço Físico
                  </EditableText>
                </div>
                <EditableText
                  id="location.address.cityTag"
                  defaultText="Brasília • DF"
                  as="span"
                  className="text-[11px] text-[#7A8B7B] font-mono font-medium"
                >
                  Brasília • DF
                </EditableText>
              </div>

              {/* Body Content */}
              <div className="space-y-1 py-1">
                <EditableText
                  id="location.address.street"
                  defaultText={SPA_BUSINESS_DATA.address.street}
                  as="p"
                  className="font-serif text-base sm:text-lg text-[#F3EFE6] font-light leading-snug"
                >
                  {SPA_BUSINESS_DATA.address.street}
                </EditableText>
                <div className="text-xs text-[#F3EFE6]/70 font-sans leading-relaxed">
                  <EditableText
                    id="location.address.neighborhood"
                    defaultText={`${SPA_BUSINESS_DATA.address.neighborhood}, ${SPA_BUSINESS_DATA.address.city} - ${SPA_BUSINESS_DATA.address.state}`}
                    as="p"
                  >
                    {`${SPA_BUSINESS_DATA.address.neighborhood}, ${SPA_BUSINESS_DATA.address.city} - ${SPA_BUSINESS_DATA.address.state}`}
                  </EditableText>
                  <EditableText
                    id="location.address.cep"
                    defaultText={`CEP: ${SPA_BUSINESS_DATA.address.postalCode}`}
                    as="p"
                  >
                    {`CEP: ${SPA_BUSINESS_DATA.address.postalCode}`}
                  </EditableText>
                </div>
              </div>

              {/* Footer Highlight */}
              <div className="pt-2 border-t border-[#F3EFE6]/10 mt-1 flex items-center">
                <EditableText
                  id="location.address.parking"
                  defaultText="Estacionamento amplo e gratuito em frente à loja."
                  as="span"
                  className="text-[11px] text-[#D4AF37] font-sans"
                >
                  Estacionamento amplo e gratuito em frente à loja.
                </EditableText>
              </div>
            </div>

            {/* Card Bottom: Horários de Funcionamento */}
            <div className="rounded-3xl bg-[#18251E] border border-[#F3EFE6]/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden hover:border-[#D4AF37]/30 transition-all flex-[1.25]">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#F3EFE6]/10">
                <div className="flex items-center gap-2">
                  <EditableIcon id="location.schedule.header.icon" defaultIcon="Clock" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <EditableText
                    id="location.schedule.header"
                    defaultText="Horário de Funcionamento"
                    as="span"
                    className="text-xs font-semibold uppercase tracking-wider text-[#F3EFE6]"
                  >
                    Horário de Funcionamento
                  </EditableText>
                </div>
                {abertoAgora ? (
                  <span className="text-[10px] uppercase font-sans font-bold text-[#7A8B7B] px-2.5 py-0.5 rounded-full bg-[#7A8B7B]/15 border border-[#7A8B7B]/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B] animate-pulse" />
                    <EditableText id="location.schedule.openNowBadge" defaultText="Aberto agora" as="span">
                      Aberto agora
                    </EditableText>
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-sans font-medium text-[#F3EFE6]/60 px-2.5 py-0.5 rounded-full bg-[#121C16] border border-[#F3EFE6]/10">
                    <EditableText id="location.schedule.closedNowBadge" defaultText="Fechado agora" as="span">
                      Fechado agora
                    </EditableText>
                  </span>
                )}
              </div>

              {/* Schedule Rows */}
              <div className="space-y-2 py-1">
                {/* Segunda-feira */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#121C16]/50 border border-[#F3EFE6]/5 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F3EFE6]/25" />
                    <EditableText
                      id="location.schedule.monday.label"
                      defaultText="Segunda-feira"
                      as="span"
                      className="text-xs text-[#F3EFE6]/70 font-medium"
                    >
                      Segunda-feira
                    </EditableText>
                  </div>
                  <EditableText
                    id="location.schedule.monday.hours"
                    defaultText={SPA_BUSINESS_DATA.schedule.monday}
                    as="span"
                    className="text-[11px] font-sans font-medium text-[#F3EFE6]/40 px-2.5 py-0.5 rounded-full bg-[#121C16] border border-[#F3EFE6]/10"
                  >
                    {SPA_BUSINESS_DATA.schedule.monday}
                  </EditableText>
                </div>

                {/* Terça a Sábado */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#121C16]/75 border border-[#7A8B7B]/20 hover:border-[#7A8B7B]/35 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B]" />
                    <EditableText
                      id="location.schedule.tueSat.label"
                      defaultText="Terça a Sábado"
                      as="span"
                      className="text-xs text-[#F3EFE6] font-medium"
                    >
                      Terça a Sábado
                    </EditableText>
                  </div>
                  <EditableText
                    id="location.schedule.tueSat.hours"
                    defaultText={SPA_BUSINESS_DATA.schedule.tuesdayToSaturday.replace(/^De\s+/i, '')}
                    as="span"
                    className="text-[11px] font-sans font-semibold text-[#A3B899] px-2.5 py-0.5 rounded-full bg-[#7A8B7B]/15 border border-[#7A8B7B]/30 tracking-wide"
                  >
                    {SPA_BUSINESS_DATA.schedule.tuesdayToSaturday.replace(/^De\s+/i, '')}
                  </EditableText>
                </div>

                {/* Domingo */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#121C16]/75 border border-[#D4AF37]/20 hover:border-[#D4AF37]/35 transition-all shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <EditableText
                      id="location.schedule.sunday.label"
                      defaultText="Domingo"
                      as="span"
                      className="text-xs text-[#F3EFE6] font-medium"
                    >
                      Domingo
                    </EditableText>
                  </div>
                  <EditableText
                    id="location.schedule.sunday.hours"
                    defaultText={SPA_BUSINESS_DATA.schedule.sunday.replace(/^De\s+/i, '')}
                    as="span"
                    className="text-[11px] font-sans font-semibold text-[#D4AF37] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 tracking-wide"
                  >
                    {SPA_BUSINESS_DATA.schedule.sunday.replace(/^De\s+/i, '')}
                  </EditableText>
                </div>
              </div>

              {/* Footer Highlight: Aviso sobre feriados */}
              <div className="pt-2.5 border-t border-[#F3EFE6]/10 mt-1 flex items-center">
                <EditableText
                  id="location.schedule.holidayNotice"
                  defaultText="* Os horários podem sofrer alterações em feriados."
                  as="span"
                  className="text-[11px] text-[#D4AF37] font-sans whitespace-nowrap"
                >
                  * Os horários podem sofrer alterações em feriados.
                </EditableText>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Official Channels Showcase */}
        <div className="py-14 border-t border-b border-[#F3EFE6]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-6 px-1">
            <div className="flex items-center gap-2">
              <EditableIcon id="location.channels.icon" defaultIcon="Sparkles" className="w-3.5 h-3.5 text-[#D4AF37]" />
              <EditableText
                id="location.channels.title"
                defaultText="Canais Oficiais & Redes Sociais"
                as="span"
                className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#F3EFE6]/90"
              >
                Canais Oficiais & Redes Sociais
              </EditableText>
            </div>
            <EditableText
              id="location.channels.subtitle"
              defaultText="Conecte-se com o santuário e acompanhe nossos rituais diários"
              as="span"
              className="text-xs font-serif italic text-[#7A8B7B]"
            >
              Conecte-se com o santuário e acompanhe nossos rituais diários
            </EditableText>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                id: 'instagram',
                name: 'Instagram',
                handle: SPA_BUSINESS_DATA.social.instagramHandle,
                desc: 'Fotos, rituais e bastidores de autocuidado',
                href: SPA_BUSINESS_DATA.social.instagram,
                icon: <InstagramIcon className="w-5 h-5" />,
                badge: null,
                highlight: false,
                onClick: undefined,
              },
              {
                id: 'whatsapp',
                name: 'WhatsApp Oficial',
                handle: SPA_BUSINESS_DATA.whatsapp.formattedDisplay,
                desc: abertoAgora ? 'Atendimento e recepção direta' : 'Mensagens 24h • Retorno no expediente',
                href: SPA_BUSINESS_DATA.whatsapp.defaultUrl,
                icon: <MessageCircle className="w-5 h-5 text-[#D4AF37]" />,
                badge: abertoAgora ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A8B7B]/15 border border-[#7A8B7B]/30 text-[10px] text-[#F3EFE6] font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B] animate-pulse" />
                    <span>Atendimento agora</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#18251E] border border-[#F3EFE6]/15 text-[10px] text-[#F3EFE6]/70 font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
                    <span>Mensagens 24h</span>
                  </div>
                ),
                highlight: true,
                onClick: () => trackWhatsAppClick('rodape_canais'),
              },
            ].map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                onClick={channel.onClick}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative p-6 sm:p-7 rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group flex flex-col justify-between overflow-hidden cursor-pointer ${
                  channel.highlight
                    ? 'bg-gradient-to-br from-[#1C2C22] to-[#121C16] border-[#7A8B7B]/40 hover:border-[#D4AF37]/80 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5),_0_0_25px_rgba(122,139,123,0.2)]'
                    : 'bg-gradient-to-br from-[#18251E] to-[#121C16] border-[#F3EFE6]/10 hover:border-[#D4AF37]/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5),_0_0_20px_rgba(212,175,55,0.1)]'
                }`}
              >
                <span
                  className={`absolute inset-0 w-full h-full bg-gradient-to-r -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none ${
                    channel.highlight ? 'from-transparent via-[#D4AF37]/10 to-transparent' : 'from-transparent via-white/5 to-transparent'
                  }`}
                />

                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                      channel.highlight
                        ? 'bg-[#7A8B7B]/20 border-[#7A8B7B]/50 text-[#D4AF37]'
                        : 'bg-[#1F3026] border-[#7A8B7B]/30 text-[#7A8B7B] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {channel.icon}
                  </div>
                  {channel.badge ? (
                    channel.badge
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-[#F3EFE6]/60 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  )}
                </div>

                <div>
                  <span
                    className={`text-[10px] uppercase font-sans tracking-[0.2em] font-semibold block mb-1 ${
                      channel.highlight ? 'text-[#D4AF37]' : 'text-[#7A8B7B]'
                    }`}
                  >
                    {channel.name}
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl text-[#F3EFE6] group-hover:text-[#D4AF37] transition-colors leading-snug font-normal">
                    {channel.handle}
                  </h4>
                  <p className="text-xs text-[#F3EFE6]/65 font-sans mt-1">
                    {channel.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Secondary Channels in Discrete 1-Line Row */}
          <div className="mt-5 pt-4 border-t border-[#F3EFE6]/5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F3EFE6]/55">
            <span className="text-[11px] font-sans">
              Outros canais oficiais:
            </span>
            <div className="flex items-center gap-4">
              <a
                href={SPA_BUSINESS_DATA.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-[#F3EFE6]/50 group-hover:text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Facebook</span>
              </a>
              <span className="text-[#F3EFE6]/20">•</span>
              <a
                href={SPA_BUSINESS_DATA.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 group"
              >
                <TikTokIcon className="w-3.5 h-3.5 text-[#F3EFE6]/50 group-hover:text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3EFE6]/65">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1">
            <div className="relative inline-flex items-center">
              <button
                id="footer-editor-logo"
                type="button"
                onClick={handleLogoTripleClick}
                className={`focus:outline-none transition-all duration-300 cursor-pointer p-1 rounded-xl ${
                  logoPulse ? 'scale-125 ring-2 ring-[#D4AF37] bg-[#D4AF37]/25' : 'hover:scale-105'
                } ${
                  isPasswordModalOpen || isEditorActive
                    ? 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : ''
                }`}
                title="Maliviê SPA (Clique 3 vezes para ativar/desativar o Modo Editor de Textos)"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={logoMalivieWhite}
                  alt="Maliviê SPA"
                  className="h-7 w-auto object-contain opacity-90"
                />
              </button>

              {/* Balãozinho compacto de senha estilo popover com indicador */}
              <PasswordModal />
            </div>
            <span className="text-[#F3EFE6]/30">•</span>
            <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
            <span className="text-[#F3EFE6]/30">•</span>
            <span className="text-[11px] text-[#F3EFE6]/45 inline-flex items-center gap-1.5">
              <span>crafted with care</span>
              <span className="text-[#D4AF37]/40">•</span>
              <a
                href="https://github.com/madebycotrim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors font-medium hover:underline underline-offset-2"
              >
                madebycotrim
              </a>
            </span>
          </div>

          <p className="font-serif italic text-sm text-[#D4AF37]/90 text-center">
            "
            <EditableText
              id="footer.slogan"
              defaultText={SPA_BUSINESS_DATA.slogan}
              as="span"
            >
              {SPA_BUSINESS_DATA.slogan}
            </EditableText>
            "
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-[#F3EFE6]/70 hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer"
          >
            <EditableText id="footer.backToTop" defaultText="Voltar ao topo" as="span">
              Voltar ao topo
            </EditableText>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
