import React, { useRef, useState } from 'react';
import { Upload, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { getStoredAuthToken } from '../../services/authService';

interface EditableImageProps {
  id: string;
  defaultImage: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  containerClassName?: string;
  prefix?: string;
  title?: string;
  loading?: 'lazy' | 'eager';
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  defaultImage,
  alt,
  className = '',
  style,
  containerClassName = '',
  prefix = 'foto',
  title,
  loading = 'lazy',
}) => {
  const { isEditorActive, getImage, updateImage } = useEditor();
  const currentImage = getImage(id, defaultImage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleTriggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // Pré-visualização instantânea no estado
      updateImage(id, dataUrl);

      try {
        const token = getStoredAuthToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            assetId: id,
            dataUrl,
            oldImage: currentImage,
            prefix,
          }),
        });

        const data = await res.json();
        if (data.success && data.imageUrl) {
          updateImage(id, `${data.imageUrl}?t=${Date.now()}`);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      } catch (err) {
        console.error(`Falha ao salvar imagem [${id}] em assets:`, err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Se o Modo Editor NÃO estiver ativo, renderiza a imagem pura sem interferências
  if (!isEditorActive) {
    return (
      <img
        loading={loading}
        decoding="async"
        src={currentImage}
        alt={alt}
        className={className}
        style={style}
      />
    );
  }

  // Quando o Modo Editor está ATIVO:
  return (
    <div
      className={`relative group/editable-img w-full h-full overflow-hidden ${containerClassName}`}
    >
      <img
        loading={loading}
        decoding="async"
        src={currentImage}
        alt={alt}
        onClick={handleTriggerUpload}
        className={`${className} cursor-pointer transition-all duration-300 hover:brightness-95`}
        style={style}
        title="Clique na foto para carregar imagem do computador"
      />

      {/* Botão flutuante compacto e elegante no topo direito - nunca fica em cima de badges ou cards */}
      <button
        type="button"
        onClick={handleTriggerUpload}
        className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-[#121C16]/90 hover:bg-[#121C16] text-[#D4AF37] border border-[#D4AF37]/80 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-sans font-semibold backdrop-blur-md"
        title="Carregar nova foto do computador (salva em assets e exclui a anterior)"
      >
        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="hidden sm:inline">Trocar Foto</span>
      </button>

      {/* Indicador de carregamento salvando em assets */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm pointer-events-auto">
          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin mb-1.5" />
          <span className="text-xs text-[#F3EFE6] font-sans font-medium">
            Salvando na pasta assets...
          </span>
        </div>
      )}

      {/* Feedback de sucesso */}
      {uploadSuccess && (
        <div className="absolute inset-0 bg-[#121C16]/90 flex items-center justify-center z-30 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-600/95 text-white text-xs font-sans font-semibold shadow-lg animate-pulse">
            ✓ Salva em assets & anterior excluída!
          </div>
        </div>
      )}

      {/* Input oculto nativo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
