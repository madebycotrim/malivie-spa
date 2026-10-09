import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Download, RotateCcw, X, Sparkles, CheckCircle2, LogOut } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const EditorToolbar: React.FC = () => {
  const {
    isEditorActive,
    setEditorActive,
    modifiedCount,
    setExportModalOpen,
    resetAll,
  } = useEditor();

  const [confirmReset, setConfirmReset] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isEditorActive) return null;

  const handleReset = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-[9990] w-auto max-w-[95vw]"
      >
        <div className="bg-[#121C16]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-full px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 sm:gap-5 text-[#F3EFE6]">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
            </span>
            <div className="flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-sans font-bold tracking-wide text-[#D4AF37] uppercase whitespace-nowrap">
                Modo Editor
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-[#F3EFE6]/15 hidden sm:block" />

          {/* Contador de Alterações */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#F3EFE6]/75">
            {modifiedCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[#D4AF37] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {modifiedCount} {modifiedCount === 1 ? 'alteração' : 'alterações'}
              </span>
            ) : (
              <span className="text-[#7A8B7B]">Passe o mouse nos textos para editar</span>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#F3EFE6]/15" />

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            {/* Botão Exportar / Salvar */}
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#E7C85C] text-[#121C16] text-xs font-sans font-semibold transition-all transform hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
              title="Exportar alterações em código TypeScript ou JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#121C16]" />
              <span className="hidden sm:inline">Exportar / Copiar</span>
              <span className="sm:hidden">Exportar</span>
            </button>

            {/* Botão Reset */}
            {modifiedCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  confirmReset
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-red-300 border border-red-500/30'
                }`}
                title={confirmReset ? 'Clique novamente para confirmar' : 'Restaurar todos os padrões'}
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {confirmReset ? 'Confirmar Reset?' : 'Restaurar'}
                </span>
              </button>
            )}

            {/* Fechar Modo Editor com Popover de Confirmação */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExitConfirm((prev) => !prev)}
                className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer ml-1"
                title="Sair do Modo Editor"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {showExitConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    className="absolute right-0 bottom-full mb-2.5 z-50 bg-white text-[#2C2C2C] rounded-2xl py-2 px-3.5 shadow-2xl border border-gray-200 flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="text-xs font-sans font-medium text-gray-700">Deseja sair?</span>
                    <button
                      type="button"
                      onClick={() => setShowExitConfirm(false)}
                      className="text-xs font-sans text-gray-500 hover:text-gray-900 px-2 py-0.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowExitConfirm(false);
                        setEditorActive(false);
                      }}
                      className="text-xs font-sans font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-full transition-colors shadow-sm cursor-pointer"
                    >
                      Sim
                    </button>
                    {/* Seta indicador apontando para o botão */}
                    <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
