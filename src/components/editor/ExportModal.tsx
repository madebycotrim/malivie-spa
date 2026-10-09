import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Code, FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const ExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setExportModalOpen,
    overrides,
    imageOverrides,
    iconOverrides,
    resetAll,
    modifiedCount,
    services,
    faqs,
    isServicesModified,
    isFaqsModified,
  } = useEditor();

  const [activeTab, setActiveTab] = useState<'ts' | 'json' | 'list'>('ts');
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isExportModalOpen) return null;

  // Gera snippet TypeScript completo pronto para colar em src/data/spaData.ts
  const generateTypeScriptCode = () => {
    const parts: string[] = [];

    parts.push(`// Alterações feitas pelo Editor do Maliviê SPA\n// Arquivo de referência: src/data/spaData.ts`);

    if (Object.keys(overrides).length > 0) {
      const lines = Object.entries(overrides).map(
        ([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`
      );
      parts.push(`export const CUSTOM_TEXT_OVERRIDES = {\n${lines.join('\n')}\n};`);
    }

    if (imageOverrides && Object.keys(imageOverrides).length > 0) {
      const lines = Object.entries(imageOverrides).map(
        ([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`
      );
      parts.push(`export const CUSTOM_IMAGE_OVERRIDES = {\n${lines.join('\n')}\n};`);
    }

    if (iconOverrides && Object.keys(iconOverrides).length > 0) {
      const lines = Object.entries(iconOverrides).map(
        ([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`
      );
      parts.push(`export const CUSTOM_ICON_OVERRIDES = {\n${lines.join('\n')}\n};`);
    }

    if (isServicesModified) {
      parts.push(`// Lista de Rituais atualizada (adicione ou substitua SERVICES_LIST em src/data/spaData.ts):\nexport const UPDATED_SERVICES_LIST = ${JSON.stringify(services, null, 2)};`);
    }

    if (isFaqsModified) {
      parts.push(`// Lista de Perguntas (FAQ) atualizada (adicione ou substitua FAQ_ITEMS em src/data/spaData.ts):\nexport const UPDATED_FAQ_ITEMS = ${JSON.stringify(faqs, null, 2)};`);
    }

    return parts.join('\n\n');
  };

  const jsonString = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      overrides,
      imageOverrides,
      iconOverrides,
      services,
      faqs,
    },
    null,
    2
  );
  const tsCode = generateTypeScriptCode();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `malivie-textos-editados-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
      setExportModalOpen(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        style={{ zIndex: 999980 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#18251E] border border-[#D4AF37]/30 text-[#F3EFE6] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]"
          style={{ zIndex: 999981 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F3EFE6]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#F3EFE6]">
                  Exportar Textos Editados
                </h3>
                <p className="text-xs text-[#7A8B7B] font-sans mt-0.5">
                  {modifiedCount} {modifiedCount === 1 ? 'texto modificado' : 'textos modificados'} no navegador
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExportModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-[#F3EFE6]/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Abas */}
          <div className="flex items-center px-6 pt-4 gap-2 border-b border-[#F3EFE6]/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('ts')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'ts'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#F3EFE6]/60 hover:text-[#F3EFE6]'
              }`}
            >
              <Code className="w-4 h-4" />
              Código TypeScript (spaData.ts)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'json'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#F3EFE6]/60 hover:text-[#F3EFE6]'
              }`}
            >
              <FileText className="w-4 h-4" />
              JSON de Backup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`pb-3 px-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'list'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-[#F3EFE6]/60 hover:text-[#F3EFE6]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Ver Todas as Alterações ({modifiedCount})
            </button>
          </div>

          {/* Corpo do Conteúdo */}
          <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
            {modifiedCount === 0 ? (
              <div className="text-center py-12 text-[#F3EFE6]/50 font-sans">
                Nenhum texto foi modificado ainda.
                <p className="text-xs text-[#7A8B7B] mt-2">
                  Passe o mouse sobre os títulos e parágrafos do site e clique no lápis para alterar.
                </p>
              </div>
            ) : (
              <>
                {activeTab === 'ts' && (
                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-[#0D1410] border border-[#F3EFE6]/10 text-[#94A595] overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
                      {tsCode}
                    </pre>
                  </div>
                )}

                {activeTab === 'json' && (
                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-[#0D1410] border border-[#F3EFE6]/10 text-[#94A595] overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
                      {jsonString}
                    </pre>
                  </div>
                )}

                {activeTab === 'list' && (
                  <div className="space-y-4 font-sans">
                    {/* Resumo */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-[#0D1410] border border-[#F3EFE6]/10 text-center">
                        <span className="block text-xl font-serif text-[#D4AF37] font-semibold">
                          {Object.keys(overrides).length}
                        </span>
                        <span className="text-[11px] text-[#7A8B7B]">Textos alterados</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0D1410] border border-[#F3EFE6]/10 text-center">
                        <span className="block text-xl font-serif text-[#D4AF37] font-semibold">
                          {services.length}
                        </span>
                        <span className="text-[11px] text-[#7A8B7B]">Cards de Rituais</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0D1410] border border-[#F3EFE6]/10 text-center">
                        <span className="block text-xl font-serif text-[#D4AF37] font-semibold">
                          {faqs.length}
                        </span>
                        <span className="text-[11px] text-[#7A8B7B]">Perguntas no FAQ</span>
                      </div>
                    </div>

                    {/* Cards de Rituais */}
                    {isServicesModified && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] font-sans">
                          Cards de Rituais ({services.length})
                        </h4>
                        <div className="space-y-1.5">
                          {services.map((s) => (
                            <div key={s.id} className="p-2.5 rounded-lg bg-[#0D1410] border border-[#F3EFE6]/10 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-medium text-[#F3EFE6]">{s.name}</span>
                                <span className="text-[#7A8B7B] ml-2 text-[11px]">({s.duration} · {s.categoryLabel})</span>
                              </div>
                              {s.popular && (
                                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-semibold">
                                  Destaque
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perguntas no FAQ */}
                    {isFaqsModified && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] font-sans">
                          Perguntas no FAQ ({faqs.length})
                        </h4>
                        <div className="space-y-1.5">
                          {faqs.map((f) => (
                            <div key={f.id} className="p-2.5 rounded-lg bg-[#0D1410] border border-[#F3EFE6]/10 text-xs">
                              <span className="font-medium text-[#F3EFE6] block">{f.question}</span>
                              <span className="text-[#94A595] text-[11px] line-clamp-1 mt-0.5">{f.answer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Textos modificados */}
                    {Object.keys(overrides).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] font-sans">
                          Textos Customizados ({Object.keys(overrides).length})
                        </h4>
                        {Object.entries(overrides).map(([key, val]) => (
                          <div
                            key={key}
                            className="p-3 rounded-xl bg-[#0D1410] border border-[#F3EFE6]/10 flex flex-col gap-1.5"
                          >
                            <span className="font-mono text-[11px] text-[#D4AF37] font-semibold">
                              {key}
                            </span>
                            <p className="text-xs text-[#F3EFE6]/90 leading-relaxed bg-[#18251E] p-2 rounded-lg border border-[#F3EFE6]/5">
                              "{val}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer com Ações */}
          <div className="p-4 sm:p-6 bg-[#121C16] border-t border-[#F3EFE6]/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetAll}
              disabled={modifiedCount === 0}
              className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                confirmReset
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white/5 hover:bg-red-500/20 text-red-300 border border-red-500/30'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {confirmReset ? 'Confirmar Reset de Tudo?' : 'Restaurar Textos Originais'}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              {modifiedCount > 0 && activeTab === 'json' && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-full bg-[#1E2D24] hover:bg-[#2A3F32] text-[#F3EFE6] border border-[#7A8B7B]/30 text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#7A8B7B]" />
                  Baixar JSON
                </button>
              )}

              {modifiedCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleCopy(activeTab === 'ts' ? tsCode : jsonString)}
                  className="px-5 py-2 rounded-full bg-[#D4AF37] hover:bg-[#E7C85C] text-[#121C16] text-xs font-sans font-semibold transition-all transform hover:scale-[1.02] flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#121C16]" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#121C16]" />
                      Copiar {activeTab === 'ts' ? 'Código' : 'Conteúdo'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
