import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const PasswordModal: React.FC = () => {
  const { isPasswordModalOpen, setPasswordModalOpen, verifyPassword } = useEditor();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPasswordModalOpen) {
      setPassword('');
      setError(false);
      setLoading(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isPasswordModalOpen]);

  // Fechar ao clicar fora ou ao pressionar a tecla Escape
  useEffect(() => {
    if (!isPasswordModalOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Ignora clique no próprio botão da logo
        const logoButton = document.getElementById('footer-editor-logo');
        if (logoButton && logoButton.contains(e.target as Node)) {
          return;
        }
        setPasswordModalOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPasswordModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPasswordModalOpen, setPasswordModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError(false);

    const success = await verifyPassword(password);
    setLoading(false);

    if (!success) {
      setError(true);
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    }
  };

  return (
    <AnimatePresence>
      {isPasswordModalOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.92, y: 6 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: error ? [-6, 6, -4, 4, -2, 2, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.92, y: 6 }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 z-[9999]"
        >
          {/* Mensagem flutuante de erro se a senha estiver incorreta */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
            >
              <span className="text-[11px] font-sans font-semibold text-white bg-rose-600 px-2.5 py-0.5 rounded-full shadow-md">
                Senha incorreta (padrão: malivie2026)
              </span>
            </motion.div>
          )}

          {/* Balãozinho no estilo exato da referência (branco, arredondado, sombra suave e indicador de seta) */}
          <form
            onSubmit={handleSubmit}
            className="bg-white text-[#2C2C2C] rounded-2xl py-2 px-3.5 shadow-2xl border border-gray-200/90 flex items-center gap-2.5 whitespace-nowrap relative"
          >
            {/* Ícone e label */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className="w-5 h-5 rounded-full bg-[#121C16] text-[#D4AF37] flex items-center justify-center">
                <Lock className="w-2.5 h-2.5" />
              </span>
              <span className="text-xs font-sans font-medium text-gray-700">
                Senha:
              </span>
            </div>

            {/* Input de Senha */}
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="malivie2026"
                className={`w-28 sm:w-32 px-2.5 py-1 pr-6 text-xs font-sans rounded-lg transition-all focus:outline-none ${
                  error
                    ? 'bg-rose-50 border border-rose-300 text-rose-900 placeholder-rose-300 ring-2 ring-rose-400/20'
                    : 'bg-gray-100/90 border border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30'
                }`}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Botão Não / Cancelar */}
            <button
              type="button"
              onClick={() => setPasswordModalOpen(false)}
              className="text-xs font-sans text-gray-500 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {/* Botão Sim / Entrar (estilo pílula suave da referência) */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="text-xs font-sans font-bold text-[#8C6C0A] bg-[#FAF3DC] hover:bg-[#F3E5B8] active:scale-95 disabled:opacity-40 px-3.5 py-1 rounded-full transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Entrar'}
            </button>

            {/* Seta indicador estilo balão apontando para a logo abaixo */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 sm:left-9 sm:translate-x-0 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-200/90" />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
