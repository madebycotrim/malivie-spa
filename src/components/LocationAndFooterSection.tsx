import React from 'react';
import {
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { trackWhatsAppClick } from '../services/analytics';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './editor/EditableText';
import { PasswordModal } from './editor/PasswordModal';

export const LocationAndFooterSection: React.FC = () => {
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

  const exactStoreAddress = '3ª Avenida, 1124 - Lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, CEP: 71720-565';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565'
  )}`;

  return (
    <footer id="localizacao" className="relative bg-[#0E1611] text-[#F3EFE6] pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden border-t border-[#F3EFE6]/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Grid Principal de 4 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 pb-12 sm:pb-16 items-start">
          
          {/* ========================================================================= */}
          {/* COLUNA 1: IDENTIDADE DA MARCA & RECONHECIMENTO GOOGLE                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative inline-flex flex-col items-start">
              <button
                id="footer-editor-logo"
                type="button"
                onClick={handleLogoTripleClick}
                className={`group flex items-center focus:outline-none transition-all duration-300 cursor-pointer p-1 -m-1 rounded-2xl ${
                  logoPulse ? 'scale-110 ring-2 ring-[#D4AF37] bg-[#D4AF37]/20' : ''
                } ${
                  isPasswordModalOpen || isEditorActive
                    ? 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : ''
                }`}
                title="Maliviê SPA - Toque 3x para modo editor"
              >
                <img
                  src="/logo-malivie-white.webp"
                  alt="Maliviê SPA"
                  width={140}
                  height={56}
                  className="h-10 sm:h-12 w-auto object-contain opacity-95 group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                />
              </button>
              <PasswordModal />

              <span className="text-[10px] tracking-[0.28em] uppercase font-sans font-semibold text-[#D4AF37] mt-1.5 pl-0.5">
                <EditableText
                  id="footer.brandSubtitle"
                  defaultText="SPA BOTÂNICO • BRASÍLIA"
                  as="span"
                >
                  SPA BOTÂNICO • BRASÍLIA
                </EditableText>
              </span>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#D4AF37] pt-1">
              <EditableText
                id="footer.sloganQuote"
                defaultText='"O lugar ideal para renovar suas energias!"'
                as="span"
              >
                "O lugar ideal para renovar suas energias!"
              </EditableText>
            </p>

            <p className="text-xs text-[#F3EFE6]/75 font-sans leading-relaxed max-w-sm">
              <EditableText
                id="footer.description"
                defaultText="Mais do que um atendimento, uma experiência única de acolhimento, autocuidado e renovação de energias no coração do Núcleo Bandeirante."
                as="span"
              >
                Mais do que um atendimento, uma experiência única de acolhimento, autocuidado e renovação de energias no coração do Núcleo Bandeirante.
              </EditableText>
            </p>

            {/* Avaliação Google em Pill Refinada */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10 text-xs font-sans shadow-2xs">
                <div className="flex items-center text-[#FBBC04] gap-0.5 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="font-bold text-[#F3EFE6]">
                  <EditableText id="footer.googleRating" defaultText="5.0" as="span">
                    5.0
                  </EditableText>
                </span>
                <span className="text-[#F3EFE6]/30">•</span>
                <span className="text-[#F3EFE6]/75">
                  <EditableText id="footer.googleRatingLabel" defaultText="Avaliação Máxima Google" as="span">
                    Avaliação Máxima Google
                  </EditableText>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA 2: HORÁRIOS OFICIAIS                                               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-[17px] text-[#F3EFE6] font-normal tracking-wide">
                <EditableText id="footer.scheduleTitle" defaultText="Horários Oficiais" as="span">
                  Horários Oficiais
                </EditableText>
              </h3>
            </div>

            <div className="text-[13px] font-sans">
              <div className="flex items-center justify-between pb-2 pt-1 border-b border-[#F3EFE6]/10">
                <span className="text-[#D8D3C8]">
                  <EditableText id="footer.schedule.monday.label" defaultText="Segunda-feira:" as="span">
                    Segunda-feira:
                  </EditableText>
                </span>
                <span className="text-[#E8A87C] font-normal">
                  <EditableText id="footer.schedule.monday.value" defaultText="Fechado" as="span">
                    Fechado
                  </EditableText>
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 pt-2 border-b border-[#F3EFE6]/10">
                <span className="text-[#D8D3C8]">
                  <EditableText id="footer.schedule.tueSat.label" defaultText="Terça a Sábado:" as="span">
                    Terça a Sábado:
                  </EditableText>
                </span>
                <span className="text-white font-semibold">
                  <EditableText id="footer.schedule.tueSat.value" defaultText="08h às 20h" as="span">
                    08h às 20h
                  </EditableText>
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 pt-2 border-b border-[#F3EFE6]/10">
                <span className="text-[#D8D3C8]">
                  <EditableText id="footer.schedule.sun.label" defaultText="Domingo:" as="span">
                    Domingo:
                  </EditableText>
                </span>
                <span className="text-white font-semibold">
                  <EditableText id="footer.schedule.sun.value" defaultText="08h às 13h" as="span">
                    08h às 13h
                  </EditableText>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#7A8B7B] font-sans italic pt-2.5">
              <EditableText
                id="footer.appointmentNotice"
                defaultText="Atendimentos mediante agendamento prévio."
                as="span"
              >
                Atendimentos mediante agendamento prévio.
              </EditableText>
            </p>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA 3: LOCALIZAÇÃO & CONTATO                                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-3 min-w-[310px]">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-[17px] text-[#F3EFE6] font-normal tracking-wide">
                <EditableText id="footer.locationTitle" defaultText="Localização" as="span">
                  Localização
                </EditableText>
              </h3>
            </div>

            <p className="text-[13px] text-[#D8D3C8] font-sans leading-relaxed">
              <EditableText
                id="footer.exactAddress"
                defaultText="3ª Avenida, 1124 - Lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, CEP: 71720-565"
                as="span"
              >
                3ª Avenida, 1124 - Lote 1208-A, Loja 3 - Núcleo<br className="hidden sm:inline" /> Bandeirante, Brasília - DF, CEP: 71720-565
              </EditableText>
            </p>

            <div className="pt-2 pb-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-[#D4AF37] hover:text-[#E5C158] transition-colors group cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>
                  <EditableText id="footer.mapsRouteLabel" defaultText="Abrir rota no Google Maps" as="span">
                    Abrir rota no Google Maps
                  </EditableText>
                </span>
              </a>
            </div>

            <div className="pt-0.5">
              <span className="text-[11px] text-[#8A9C8D] font-sans block mb-1">
                <EditableText id="footer.whatsappLabel" defaultText="WhatsApp de Reservas:" as="span">
                  WhatsApp de Reservas:
                </EditableText>
              </span>
              <a
                href={SPA_BUSINESS_DATA.whatsapp.defaultUrl}
                onClick={() => trackWhatsAppClick('rodape_recepcao')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] font-bold text-white hover:text-[#25D366] transition-colors group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-105 transition-transform" />
                <span className="tracking-tight">
                  <EditableText id="footer.whatsappNumber" defaultText="(61) 99956-9214" as="span">
                    (61) 99956-9214
                  </EditableText>
                </span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA 4: CONECTE-SE (REDES SOCIAIS & LINKS)                              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-serif text-base text-[#F3EFE6] font-normal tracking-wide">
              <EditableText id="footer.connectTitle" defaultText="Conecte-se" as="span">
                Conecte-se
              </EditableText>
            </h3>

            <div className="space-y-2.5">
              <a
                href={SPA_BUSINESS_DATA.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-2xl bg-[#18251E] hover:bg-[#203127] border border-[#F3EFE6]/15 hover:border-[#D4AF37]/50 text-xs text-[#F3EFE6] flex items-center gap-2.5 transition-all duration-300 shadow-2xs group cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="font-sans text-xs">
                  <EditableText id="footer.instagramHandle" defaultText="@maliviespa" as="span">
                    @maliviespa
                  </EditableText>
                </span>
              </a>

              <a
                href={SPA_BUSINESS_DATA.social.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-2xl bg-[#18251E] hover:bg-[#203127] border border-[#F3EFE6]/15 hover:border-[#D4AF37]/50 text-xs text-[#F3EFE6] flex items-center gap-2.5 transition-all duration-300 shadow-2xs group cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#7A8B7B] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                <span className="font-sans text-xs">
                  <EditableText id="footer.linktreeLabel" defaultText="Linktree Oficial" as="span">
                    Linktree Oficial
                  </EditableText>
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* SUB-RODAPÉ: COPYRIGHT & CRÉDITOS                                          */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-[#F3EFE6]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F3EFE6]/60">
          <p>
            <EditableText
              id="footer.copyrightText"
              defaultText={`© ${new Date().getFullYear()} Maliviê SPA. Todos os direitos reservados.`}
              as="span"
            >
              © {new Date().getFullYear()} Maliviê SPA. Todos os direitos reservados.
            </EditableText>
          </p>

          <p className="text-[11px] text-[#F3EFE6]/75">
            <EditableText id="footer.craftedPrefix" defaultText="Criado com excelência para" as="span">
              Criado com excelência para
            </EditableText>{' '}
            <span className="text-[#D4AF37] font-medium">
              <EditableText id="footer.craftedBrand" defaultText="Maliviê SPA • Brasília DF" as="span">
                Maliviê SPA • Brasília DF
              </EditableText>
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default LocationAndFooterSection;
