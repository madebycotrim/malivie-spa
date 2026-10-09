import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ICON_REGISTRY, ICON_CATEGORIES } from './iconRegistry';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIconName: string;
  defaultIconName: string;
  onSelectIcon: (iconName: string) => void;
  onResetIcon: () => void;
  isModified: boolean;
  iconId: string;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  currentIconName,
  defaultIconName,
  onSelectIcon,
  onResetIcon,
  isModified,
  iconId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRootRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Bloqueia scroll nativo da página inteira no body e html
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 2. Interrompe animações de inércia do Lenis
    window.__lenis?.stop();

    setSearchTerm('');
    setSelectedCategory('all');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    const rootEl = modalRootRef.current;
    if (!rootEl) return;

    // 3. Interceptador com captura no modal: garante que NENHUM evento de scroll do mouse chegue ao Lenis ou ao site de fundo
    const handleWheelCapture = (e: WheelEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const target = e.target as HTMLElement | null;
      const isOverCategories = target && categoriesRef.current?.contains(target);

      if (isOverCategories && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (categoriesRef.current) {
          categoriesRef.current.scrollLeft += e.deltaX;
        }
      } else if (gridContainerRef.current) {
        gridContainerRef.current.scrollTop += e.deltaY;
      }
    };

    rootEl.addEventListener('wheel', handleWheelCapture, { passive: false, capture: true });

    return () => {
      rootEl.removeEventListener('wheel', handleWheelCapture, { capture: true });
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.__lenis?.start();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredIcons = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return Object.values(ICON_REGISTRY).filter((icon) => {
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!term) return true;

      const matchesName = icon.name.toLowerCase().includes(term);
      const matchesLabel = icon.label.toLowerCase().includes(term);
      const matchesTags = icon.tags.some((tag) => tag.toLowerCase().includes(term));

      return matchesName || matchesLabel || matchesTags;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const CurrentComponent = ICON_REGISTRY[currentIconName]?.component || Sparkles;

  const modalContent = (
    <AnimatePresence>
      <div
        ref={modalRootRef}
        id="icon-picker-modal"
        data-lenis-prevent
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none"
        onClick={onClose}
        style={{
          zIndex: 999999,
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
        }}
      >
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#18251E] text-[#F3EFE6] rounded-3xl border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden max-h-[90vh]"
          style={{
            zIndex: 1000000,
            overscrollBehavior: 'contain',
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F3EFE6]/10 flex items-center justify-between bg-[#141F19]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#121C16] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <CurrentComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl text-[#F3EFE6] font-normal leading-tight">
                    Escolher Novo Ícone
                  </h3>
                  {isModified && (
                    <span className="text-[10px] font-sans font-semibold uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                      Personalizado
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7A8B7B] font-sans">
                  Ícone atual: <strong className="text-[#F3EFE6]">{currentIconName}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#121C16] hover:bg-[#1E2D24] text-[#F3EFE6]/70 hover:text-[#D4AF37] border border-[#F3EFE6]/10 transition-colors cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Categories */}
          <div className="p-4 border-b border-[#F3EFE6]/10 space-y-3 bg-[#16221B]/50">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A8B7B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ícone por nome ou tema (ex: presente, flor, estrela, água, spa, waze, coração)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#121C16] border border-[#F3EFE6]/15 hover:border-[#D4AF37]/40 focus:border-[#D4AF37] text-xs text-[#F3EFE6] placeholder-[#F3EFE6]/40 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F3EFE6]/50 hover:text-[#F3EFE6] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div
              ref={categoriesRef}
              data-lenis-prevent
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs"
              style={{ overscrollBehavior: 'contain' }}
            >
              {ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-[#D4AF37] text-[#121C16] font-semibold shadow-sm'
                      : 'bg-[#121C16] text-[#F3EFE6]/70 hover:text-[#F3EFE6] hover:bg-[#1E2D24] border border-[#F3EFE6]/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Grid */}
          <div
            ref={gridContainerRef}
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 max-h-[380px] min-h-[220px] scrollbar-thin select-none"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            {filteredIcons.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#7A8B7B] space-y-2">
                <Search className="w-8 h-8 text-[#7A8B7B]/40 mx-auto mb-2" />
                <p>Nenhum ícone encontrado para "{searchTerm}".</p>
                <p className="text-[11px] text-[#F3EFE6]/50">Tente buscar por termos como "spa", "presente", "estrela" ou limpe a busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                {filteredIcons.map((item) => {
                  const IconComp = item.component;
                  const isSelected = item.name === currentIconName;
                  const isDefault = item.name === defaultIconName;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onSelectIcon(item.name);
                        onClose();
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md scale-105'
                          : 'bg-[#121C16]/70 hover:bg-[#1E2D24] border-[#F3EFE6]/10 hover:border-[#D4AF37]/50 hover:scale-105'
                      }`}
                      title={`${item.label} (${item.name})`}
                    >
                      <IconComp
                        className={`w-6 h-6 transition-all duration-200 ${
                          isSelected
                            ? 'text-[#D4AF37] scale-110'
                            : 'text-[#F3EFE6]/80 group-hover:text-[#D4AF37]'
                        }`}
                      />
                      <span className="text-[10px] text-[#F3EFE6]/65 group-hover:text-[#F3EFE6] truncate max-w-full mt-1.5 font-sans leading-tight text-center">
                        {item.name}
                      </span>

                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#121C16] flex items-center justify-center text-[10px] shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {isDefault && !isSelected && (
                        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#7A8B7B]" title="Ícone original padrão" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#F3EFE6]/10 bg-[#141F19]/80 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-[#7A8B7B] font-sans">
              Mostrando <strong className="text-[#F3EFE6]">{filteredIcons.length}</strong> de {Object.keys(ICON_REGISTRY).length} ícones
            </div>

            <div className="flex items-center gap-2">
              {isModified && (
                <button
                  type="button"
                  onClick={() => {
                    onResetIcon();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121C16] hover:bg-[#1E2D24] text-[11px] font-sans font-medium text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all cursor-pointer"
                  title="Voltar para o ícone padrão original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Original ({defaultIconName})</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-[#121C16] hover:bg-[#1E2D24] text-[11px] font-sans font-medium text-[#F3EFE6]/80 hover:text-[#F3EFE6] border border-[#F3EFE6]/15 transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
