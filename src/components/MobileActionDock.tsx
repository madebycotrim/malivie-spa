import React, { useEffect, useState } from 'react';
import { Navigation, Volume2, VolumeX } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { asmrEngine } from '../services/soundEngine';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';

export const MobileActionDock: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = asmrEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAsmr = () => {
    asmrEngine.toggle();
  };

  const handleScrollToLocation = () => {
    const el = document.getElementById('localizacao');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#121C16]/95 backdrop-blur-xl border-t border-[#F3EFE6]/15 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Agendamento Direct Action Button */}
        <a
          href={SPA_BUSINESS_DATA.whatsapp.navUrl}
          onClick={() => trackWhatsAppClick('dock_mobile')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.4] flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#7A8B7B] text-[#121C16] font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <EditableIcon id="dock.cta.icon" defaultIcon="WhatsApp" fallbackComponent={WhatsAppIcon} className="w-4 h-4 text-[#121C16]" />
          <EditableText id="dock.cta" defaultText="Agendar um horário!" as="span" className="whitespace-nowrap">
            Agendar um horário!
          </EditableText>
        </a>

        {/* Como Chegar Shortcut */}
        <button
          type="button"
          onClick={handleScrollToLocation}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-full bg-[#18251E] text-[#F3EFE6] border border-[#F3EFE6]/15 text-xs font-medium active:scale-95 transition-transform"
        >
          <EditableIcon id="dock.directions.icon" defaultIcon="Navigation" className="w-3.5 h-3.5 text-[#D4AF37]" />
          <EditableText id="dock.directions" defaultText="Como Chegar" as="span">
            Como Chegar
          </EditableText>
        </button>

        {/* Som ASMR Toggle */}
        <button
          type="button"
          onClick={handleToggleAsmr}
          className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center ${
            isPlaying
              ? 'bg-[#18251E] border-[#7A8B7B] text-[#7A8B7B] shadow-[0_0_15px_rgba(122,139,123,0.4)] ring-1 ring-[#7A8B7B]'
              : 'bg-[#18251E] border-[#F3EFE6]/15 text-[#F3EFE6]/70'
          }`}
          aria-label={isPlaying ? 'Pausar áudio ASMR' : 'Ouvir áudio ASMR do Head Spa'}
          title={isPlaying ? 'Pausar som ASMR' : 'Ouvir som ASMR'}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-[#7A8B7B] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
