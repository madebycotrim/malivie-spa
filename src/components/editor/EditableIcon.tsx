import React, { useState } from 'react';
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
}

export const EditableIcon: React.FC<EditableIconProps> = ({
  id,
  defaultIcon,
  className = 'w-4 h-4',
  size,
  style,
  wrapperClassName = '',
  fallbackComponent: Fallback,
}) => {
  const { isEditorActive, getIcon, updateIcon, resetIcon, isIconModified } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtém o nome do ícone salvo no localStorage ou usa o padrão
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
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`relative inline-flex items-center justify-center rounded-lg p-0.5 transition-all cursor-pointer ring-1 ring-dashed ring-[#D4AF37]/80 hover:ring-2 hover:ring-[#D4AF37] hover:bg-[#D4AF37]/20 group/icon-edit ${
          modified ? 'bg-[#D4AF37]/15 ring-[#D4AF37]' : ''
        } ${wrapperClassName}`}
        title={`Clique para alterar este ícone (atual: ${iconName})`}
      >
        <IconComponent className={`${className} transition-transform group-hover/icon-edit:scale-110`} size={size} style={style} />
        
        {/* Indicador de edição sutil no hover */}
        <span className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/icon-edit:opacity-100 transition-opacity bg-[#121C16] text-[#D4AF37] rounded-full p-0.5 border border-[#D4AF37]/50 shadow-sm pointer-events-none">
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
