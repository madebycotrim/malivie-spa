import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pencil, Check, RotateCcw, AlertCircle, EyeOff } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface EditableTextProps {
  id: string;
  defaultText?: string;
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote';
  className?: string;
  multiline?: boolean;
  darkBorder?: boolean;
}

// Extrai texto puro ou converte tags JSX existentes (strong, em) em sintaxe markdown
export function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props && props.children) {
      if (children.type === 'strong' || children.type === 'b') {
        return `**${extractTextFromChildren(props.children)}**`;
      }
      if (children.type === 'em' || children.type === 'i') {
        return `*${extractTextFromChildren(props.children)}*`;
      }
      return extractTextFromChildren(props.children);
    }
  }
  return '';
}

// Converte **texto** em negrito e *texto* em itálico de forma reativa
export function renderFormattedText(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') return content;
  if (!content.includes('**') && !content.includes('*')) return content;

  // Separa por *** (negrito + itálico), ** (negrito) e * (itálico)
  const tokens = content.split(/(\*\*\*[\s\S]*?\*\*\*|\*\*[\s\S]*?\*\*|\*[^*\n]+?\*)/g);
  return tokens.map((token, i) => {
    if (!token) return null;
    if (token.startsWith('***') && token.endsWith('***') && token.length >= 6) {
      return (
        <strong key={i} className="font-bold italic">
          {token.slice(3, -3)}
        </strong>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2 && !token.startsWith('**')) {
      return (
        <span key={i} className="italic">
          {token.slice(1, -1)}
        </span>
      );
    }
    return token;
  });
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  defaultText,
  children,
  as: Tag = 'span',
  className = '',
  multiline,
  darkBorder,
}) => {
  const { isEditorActive, getText, updateText, resetText, isModified } = useEditor();
  const textRef = useRef<HTMLElement>(null);

  // Extrai o texto base caso venha de children ou defaultText
  const baseText = defaultText !== undefined 
    ? defaultText 
    : extractTextFromChildren(children);

  const currentText = getText(id, baseText);
  const modified = isModified(id);

  const [isEditing, setIsEditing] = useState(false);
  const [showSavedBadge, setShowSavedBadge] = useState(false);
  const [showErrorBadge, setShowErrorBadge] = useState(false);
  const [isOnGold, setIsOnGold] = useState(Boolean(darkBorder));

  // Detecta automaticamente se o elemento está sobre card ou badge dourado/amarelo
  useEffect(() => {
    if (darkBorder) {
      setIsOnGold(true);
      return;
    }
    if (!textRef.current) return;
    const checkGoldBg = () => {
      let curr: HTMLElement | null = textRef.current;
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

  // Decide comportamento padrão de multiline
  const isMulti = multiline !== undefined 
    ? multiline 
    : ['p', 'div', 'blockquote'].includes(Tag);

  // Sincroniza o conteúdo do ref quando o valor mudar externamente ou ao entrar em edição
  useEffect(() => {
    if (textRef.current && isEditing) {
      textRef.current.innerText = currentText;
    }
  }, [currentText, isEditing]);

  const handleStartEdit = (e?: React.MouseEvent) => {
    if (!isEditorActive || isEditing) return;
    if (e) {
      e.stopPropagation();
    }
    setIsEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.innerText = currentText;
        textRef.current.focus();
        // Coloca o cursor no final do texto
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 10);
  };

  const handleFinishEdit = useCallback(() => {
    if (!isEditing) return;
    setIsEditing(false);

    if (textRef.current) {
      const newContent = textRef.current.innerText.trim();
      if (newContent !== currentText) {
        updateText(id, newContent).then((success) => {
          if (success) {
            setShowSavedBadge(true);
            setTimeout(() => setShowSavedBadge(false), 2000);
          } else {
            // Desfaz alteração imediatamente se falhar na Cloudflare
            if (textRef.current) {
              textRef.current.innerText = currentText;
            }
            setShowErrorBadge(true);
            setTimeout(() => setShowErrorBadge(false), 3000);
          }
        });
      }
    }
  }, [isEditing, currentText, id, updateText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (textRef.current) {
        textRef.current.innerText = currentText;
      }
      setIsEditing(false);
    } else if (e.key === 'Enter' && !isMulti) {
      e.preventDefault();
      handleFinishEdit();
      textRef.current?.blur();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      // Atalho rápido Ctrl+B para envolver seleção em ** **
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText) {
          const replacement = selectedText.startsWith('**') && selectedText.endsWith('**')
            ? selectedText.slice(2, -2)
            : `**${selectedText}**`;
          range.deleteContents();
          range.insertNode(document.createTextNode(replacement));
        } else {
          const node = document.createTextNode('****');
          range.insertNode(node);
          range.setStart(node, 2);
          range.setEnd(node, 2);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      // Atalho rápido Ctrl+I para envolver seleção em * *
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText) {
          const replacement = selectedText.startsWith('*') && selectedText.endsWith('*') && !selectedText.startsWith('**')
            ? selectedText.slice(1, -1)
            : `*${selectedText}*`;
          range.deleteContents();
          range.insertNode(document.createTextNode(replacement));
        } else {
          const node = document.createTextNode('**');
          range.insertNode(node);
          range.setStart(node, 1);
          range.setEnd(node, 1);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetText(id);
    if (textRef.current) {
      textRef.current.innerText = baseText;
    }
  };

  const isEmpty = !currentText || currentText.trim().length === 0;

  // 1. Modo Visitante (Modo Editor NÃO ativo):
  // Se o texto estiver vazio, OCULTA completamente o elemento da página
  if (!isEditorActive) {
    if (isEmpty) {
      return null;
    }
    return <Tag className={className}>{renderFormattedText(currentText)}</Tag>;
  }

  // 2. Modo Editor ATIVO e elemento VAZIO (fora de edição direta):
  // Exibe indicador visual demarcando que existe um campo ali para o editor adicionar texto
  if (!isEditing && isEmpty) {
    return (
      <span className="relative inline-flex items-center group/editor max-w-full align-middle my-0.5">
        <Tag
          ref={textRef as any}
          onClick={(e) => {
            e.stopPropagation();
            handleStartEdit(e);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans cursor-pointer transition-all border border-dashed border-[#D4AF37]/70 bg-[#121C16]/90 hover:bg-[#D4AF37]/20 hover:border-[#F6E05E] text-[#D4AF37] ${className}`}
          title="Texto vazio/oculto no site público. Clique para adicionar conteúdo ou restaurar."
        >
          <EyeOff className="w-3.5 h-3.5 text-[#D4AF37]/80 shrink-0" />
          <span className="italic opacity-85 font-normal text-[11px] font-sans">
            [Texto oculto — clique para editar]
          </span>
        </Tag>

        {/* Botões de Ação do Editor no Hover */}
        <span className="absolute -top-3.5 -right-3.5 z-30 flex items-center gap-1 opacity-0 group-hover/editor:opacity-100 transition-opacity duration-200 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartEdit();
            }}
            className="p-1 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md hover:bg-[#D4AF37] hover:text-[#121C16] transition-all transform hover:scale-110 cursor-pointer"
            title="Editar texto"
          >
            <Pencil className="w-3 h-3" />
          </button>

          {modified && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full bg-[#18251E] text-[#94A595] border border-[#94A595]/40 shadow-md hover:bg-red-900/80 hover:text-red-200 transition-all transform hover:scale-110 cursor-pointer"
              title="Restaurar texto original"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </span>

        {/* Feedback animado quando salvo com sucesso */}
        {showSavedBadge && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 bg-[#18251E] text-emerald-400 border border-emerald-500/60 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in zoom-in duration-200 pointer-events-none whitespace-nowrap">
            <Check className="w-3 h-3 text-emerald-400" />
            Salvo!
          </span>
        )}
      </span>
    );
  }

  // 3. Modo Editor ATIVO (com texto ou em edição direta):
  return (
    <span className="relative inline-block group/editor max-w-full align-middle">
      <Tag
        ref={textRef as any}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit(e);
        }}
        onBlur={handleFinishEdit}
        onKeyDown={handleKeyDown}
        className={`cursor-pointer transition-all duration-150 ${isEditing ? 'min-w-[60px] inline-block' : ''} ${className} ${
          isEditing
            ? isOnGold
              ? 'outline-2 outline-solid outline-[#705312] bg-[#121C16]/95 text-white rounded px-1.5 py-0.5 shadow-[0_0_20px_rgba(112,83,18,0.5)] z-20'
              : 'outline-2 outline-solid outline-[#D4AF37] bg-[#121C16]/90 text-white rounded px-1.5 py-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] z-20'
            : isOnGold
            ? 'border border-dashed border-[#705312] hover:border-[#59420E] hover:bg-[#705312]/15 rounded px-1 py-0.5'
            : 'border border-dashed border-[#D4AF37] hover:border-[#F6E05E] hover:bg-[#D4AF37]/20 rounded px-1 py-0.5'
        } ${modified ? (isOnGold ? 'border-b-2 border-b-[#705312]' : 'border-b-2 border-b-[#D4AF37]') : ''}`}
        title="Clique para editar este texto (Use **texto** ou Ctrl+B para negrito)"
      >
        {isEditing ? currentText : renderFormattedText(currentText || baseText)}
      </Tag>

      {/* Botões de Ação do Editor no Hover */}
      {!isEditing && (
        <span className="absolute -top-3.5 -right-3.5 z-30 flex items-center gap-1 opacity-0 group-hover/editor:opacity-100 transition-opacity duration-200 pointer-events-auto">
          {/* Botão de Lápis */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartEdit();
            }}
            className="p-1 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md hover:bg-[#D4AF37] hover:text-[#121C16] transition-all transform hover:scale-110 cursor-pointer"
            title="Editar texto"
          >
            <Pencil className="w-3 h-3" />
          </button>

          {/* Botão de Reverter caso tenha sido modificado */}
          {modified && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full bg-[#18251E] text-[#94A595] border border-[#94A595]/40 shadow-md hover:bg-red-900/80 hover:text-red-200 transition-all transform hover:scale-110 cursor-pointer"
              title="Restaurar texto original"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </span>
      )}

      {/* Feedback animado quando salvo com sucesso no Cloudflare */}
      {showSavedBadge && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 bg-[#18251E] text-emerald-400 border border-emerald-500/60 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in zoom-in duration-200 pointer-events-none whitespace-nowrap">
          <Check className="w-3 h-3 text-emerald-400" />
          Salvo!
        </span>
      )}

      {/* Feedback animado quando erro no Cloudflare */}
      {showErrorBadge && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 bg-red-950/90 text-rose-300 border border-red-500/60 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in zoom-in duration-200 pointer-events-none whitespace-nowrap">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          Erro ao salvar (desfeito)!
        </span>
      )}
    </span>
  );
};
