import React from 'react';
import { WhatsAppIcon } from './SocialIcons';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';

export const MobileActionDock: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#121C16]/95 backdrop-blur-xl border-t border-[#F3EFE6]/15 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto">
        <a
          href={SPA_BUSINESS_DATA.whatsapp.navUrl}
          onClick={() => trackWhatsAppClick('dock_mobile')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar horário via WhatsApp"
          className="w-full min-h-[50px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#121C16] font-bold text-sm tracking-wide shadow-[0_8px_25px_rgba(212,175,55,0.35)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <EditableIcon id="dock.cta.icon" defaultIcon="WhatsApp" fallbackComponent={WhatsAppIcon} className="w-5 h-5 text-[#121C16]" />
          <EditableText id="dock.cta" defaultText="Agendar Horário no WhatsApp" as="span" className="font-bold">
            Agendar Horário no WhatsApp
          </EditableText>
        </a>
      </div>
    </div>
  );
};
