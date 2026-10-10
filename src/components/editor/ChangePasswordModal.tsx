import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, X, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const ChangePasswordModal: React.FC = () => {
  const { isChangePasswordModalOpen, setChangePasswordModalOpen, changePassword } = useEditor();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChangePasswordModalOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(false);
      setLoading(false);
      const timer = setTimeout(() => {
        currentInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isChangePasswordModalOpen]);

  useEffect(() => {
    if (!isChangePasswordModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        setChangePasswordModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChangePasswordModalOpen, setChangePasswordModalOpen, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!currentPassword.trim()) {
      setError('Informe a senha atual');
      return;
    }

    if (newPassword.length < 8) {
      setError('A nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não confere');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setChangePasswordModalOpen(false);
      }, 1800);
    } else {
      setError(result.error || 'Erro ao atualizar a senha');
    }
  };

  if (!isChangePasswordModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#121C16] border border-[#D4AF37]/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-[#F3EFE6]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-[#16221B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-medium text-[#F3EFE6]">
                  Alterar Senha do Editor
                </h3>
                <p className="text-[11px] text-[#A3B1A4]">
                  Criptografia segura com salt no Cloudflare D1
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChangePasswordModalOpen(false)}
              disabled={loading}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#A3B1A4] hover:text-[#F3EFE6] hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center justify-center text-center gap-2 text-emerald-300"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                <p className="font-medium text-sm">Senha alterada com sucesso!</p>
                <p className="text-xs text-[#A3B1A4]">
                  Gravada de forma criptografada no banco de dados D1.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Senha Atual */}
                <div>
                  <label className="block text-xs font-medium text-[#E4D5B7] mb-1.5">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      ref={currentInputRef}
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite a senha atual"
                      disabled={loading}
                      required
                      className="w-full bg-[#0A120E] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#F3EFE6] placeholder-[#5A6E5D] focus:outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3B1A4] hover:text-[#F3EFE6] cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div>
                  <label className="block text-xs font-medium text-[#E4D5B7] mb-1.5">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo de 8 caracteres"
                      disabled={loading}
                      required
                      minLength={8}
                      className="w-full bg-[#0A120E] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#F3EFE6] placeholder-[#5A6E5D] focus:outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3B1A4] hover:text-[#F3EFE6] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                  <label className="block text-xs font-medium text-[#E4D5B7] mb-1.5">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    disabled={loading}
                    required
                    minLength={8}
                    className="w-full bg-[#0A120E] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-[#F3EFE6] placeholder-[#5A6E5D] focus:outline-none transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setChangePasswordModalOpen(false)}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#A3B1A4] hover:text-[#F3EFE6] hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#DFBD47] hover:to-[#C5A333] text-[#121C16] font-semibold text-xs rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{loading ? 'Salvando...' : 'Atualizar Senha'}</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
