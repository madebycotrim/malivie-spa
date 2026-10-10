import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ICON_REGISTRY } from './iconRegistry';
import { IconPickerModal } from './IconPickerModal';

export interface EditableIconProps {
  id: string;
  defaultIcon: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  fallbackComponent?: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  darkBorder?: boolean;
}

export const EditableIcon: React.FC<EditableIconProps> = ({
  id,
  defaultIcon,
  className = 'w-4 h-4',
  size,
  style,
  wrapperClassName = '',
  fallbackComponent: Fallback,
  darkBorder,
}) => {
  const { isEditorActive, getIcon, updateIcon, resetIcon, isIconModified } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [isOnGold, setIsOnGold] = useState(Boolean(darkBorder));

  // Detecta automaticamente se o ícone está sobre card ou badge dourado/amarelo
  useEffect(() => {
    if (darkBorder) {
      setIsOnGold(true);
      return;
    }
    if (!iconRef.current) return;
    const checkGoldBg = () => {
      let curr: HTMLElement | null = iconRef.current;
      while (curr && curr !== document.body) {
        const cls = curr.className || '';
        if (typeof cls === 'string' && (cls.includes('#D4AF37') || cls.includes('amber') || cls.includes('yellow') || cls.includes('bg-gold'))) {
          setIsOnGold(true);
          return;
        }
        try {
          const bg = window.getComputedStyle(curr).backgroundColor;
          if (
            bg.includes('212, 175, 55') ||
            bg.includes('212, 175') ||
            bg.includes('234, 179, 8') ||
            bg.includes('245, 158, 11') ||
            bg.includes('217, 119, 6')
          ) {
            setIsOnGold(true);
            return;
          }
        } catch {
          // ignore
        }
        curr = curr.parentElement;
      }
      setIsOnGold(false);
    };
    checkGoldBg();
  }, [isEditorActive, darkBorder]);

  // Obtém o nome do ícone configurado ou usa o padrão
  const iconName = getIcon(id, defaultIcon);
  const modified = isIconModified(id);

  // Busca o componente do ícone no registro
  const iconDef = ICON_REGISTRY[iconName] || ICON_REGISTRY[defaultIcon];
  const IconComponent = iconDef ? iconDef.component : Fallback || ICON_REGISTRY.Sparkles.component;

  if (!isEditorActive) {
    return <IconComponent className={className} size={size} style={style} />;
  }

  return (
    <>
      <span
        ref={iconRef}
        data-editable-icon="true"
        data-editor-ui="true"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`editor-ui relative inline-flex items-center justify-center rounded-lg p-0.5 transition-all cursor-pointer ring-1 ring-dashed ${
          isOnGold
            ? 'ring-[#705312] hover:ring-2 hover:ring-[#705312] hover:bg-[#705312]/15'
            : 'ring-[#D4AF37] hover:ring-2 hover:ring-[#D4AF37] hover:bg-[#D4AF37]/20'
        } group/icon-edit z-20 ${
          modified ? (isOnGold ? 'bg-[#705312]/15 ring-[#705312]' : 'bg-[#D4AF37]/15 ring-[#D4AF37]') : ''
        } ${wrapperClassName}`}
        title={`Clique para alterar este ícone (atual: ${iconName})`}
      >
        <IconComponent className={`${className} transition-transform group-hover/icon-edit:scale-110 pointer-events-none`} size={size} style={style} />
        
        {/* Indicador de edição sutil no hover */}
        <span className={`absolute -top-1.5 -right-1.5 opacity-0 group-hover/icon-edit:opacity-100 transition-opacity ${
          isOnGold ? 'bg-black text-[#D4AF37] border border-black' : 'bg-[#121C16] text-[#D4AF37] border border-[#D4AF37]/50'
        } rounded-full p-0.5 shadow-sm pointer-events-none`}>
          <Pencil className="w-2 h-2" />
        </span>
      </span>

      {/* Modal de seleção de ícone */}
      {isModalOpen && (
        <IconPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          iconId={id}
          currentIconName={iconName}
          defaultIconName={defaultIcon}
          onSelectIcon={(newIcon) => updateIcon(id, newIcon)}
          onResetIcon={() => resetIcon(id)}
          isModified={modified}
        />
      )}
    </>
  );
};
