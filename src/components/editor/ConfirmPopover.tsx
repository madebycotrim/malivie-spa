import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConfirmPopoverProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  align?: 'right' | 'left' | 'center';
  position?: 'top' | 'bottom';
  className?: string;
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message = 'Deseja excluir?',
  confirmText = 'Sim',
  cancelText = 'Não',
  align = 'right',
  position = 'bottom',
  className = '',
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-[100] bg-white text-[#2C2C2C] rounded-2xl py-2 px-3.5 shadow-2xl border border-gray-200 flex items-center gap-3 whitespace-nowrap select-none ${
            position === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
          } ${
            align === 'right'
              ? 'right-0'
              : align === 'left'
              ? 'left-0'
              : 'left-1/2 -translate-x-1/2'
          } ${className}`}
        >
          <span className="text-xs font-sans font-medium text-gray-700">{message}</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="text-xs font-sans text-gray-500 hover:text-gray-900 px-2 py-0.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="text-xs font-sans font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            {confirmText}
          </button>

          {/* Seta indicadora apontando para o botão acionador */}
          <div
            className={`absolute w-3 h-3 bg-white rotate-45 border-gray-200 pointer-events-none ${
              position === 'top'
                ? '-bottom-1.5 border-b border-r'
                : '-top-1.5 border-t border-l'
            } ${
              align === 'right'
                ? 'right-2.5'
                : align === 'left'
                ? 'left-2.5'
                : 'left-1/2 -translate-x-1/2'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
