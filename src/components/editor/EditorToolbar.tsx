import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, RotateCcw, CheckCircle2, LogOut, KeyRound } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ConfirmPopover } from './ConfirmPopover';
import { ChangePasswordModal } from './ChangePasswordModal';

export const EditorToolbar: React.FC = () => {
  const {
    isEditorActive,
    logoutEditor,
    modifiedCount,
    resetAll,
    setChangePasswordModalOpen,
  } = useEditor();

  const [confirmReset, setConfirmReset] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isEditorActive) return null;

  return (
    <>
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

            <div className="h-4 w-[1px] bg-[#F3EFE6]/15 hidden md:block" />

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
              {/* Botão Alterar Senha */}
              <button
                type="button"
                onClick={() => setChangePasswordModalOpen(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 text-[#E4D5B7] border border-[#D4AF37]/30 hover:border-[#D4AF37]"
                title="Alterar senha segura no Cloudflare D1"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Senha</span>
              </button>

              {/* Botão Reset */}
              {modifiedCount > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setConfirmReset((prev) => !prev)}
                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 text-red-300 border border-red-500/30"
                    title="Restaurar todos os padrões"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Restaurar</span>
                  </button>

                  <ConfirmPopover
                    isOpen={confirmReset}
                    onConfirm={() => {
                      resetAll();
                      setConfirmReset(false);
                    }}
                    onCancel={() => setConfirmReset(false)}
                    message="Deseja restaurar tudo?"
                    position="top"
                  />
                </div>
              )}

              {/* Fechar Modo Editor com Popover de Confirmação e Logout Seguro */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm((prev) => !prev)}
                  className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer ml-1"
                  title="Sair do Modo Editor"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>

                <ConfirmPopover
                  isOpen={showExitConfirm}
                  onConfirm={() => {
                    setShowExitConfirm(false);
                    logoutEditor();
                  }}
                  onCancel={() => setShowExitConfirm(false)}
                  message="Deseja sair?"
                  position="top"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ChangePasswordModal />
    </>
  );
};
