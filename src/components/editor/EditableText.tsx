import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pencil, Check, RotateCcw } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface EditableTextProps {
  id: string;
  defaultText?: string;
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote';
  className?: string;
  multiline?: boolean;
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
      if (newContent && newContent !== currentText) {
        updateText(id, newContent);
        setShowSavedBadge(true);
        setTimeout(() => setShowSavedBadge(false), 1500);
      } else if (!newContent) {
        // Se ficou vazio, restaura o texto anterior
        textRef.current.innerText = currentText;
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

  // Se o Modo Editor NÃO estiver ativo, renderiza com formatação Markdown transparente
  if (!isEditorActive) {
    return <Tag className={className}>{renderFormattedText(currentText || baseText)}</Tag>;
  }

  // Quando o Modo Editor está ATIVO:
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
        className={`cursor-pointer transition-all duration-150 ${className} ${
          isEditing
            ? 'outline-2 outline-solid outline-[#D4AF37] bg-[#121C16]/90 text-white rounded px-1.5 py-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] z-20'
            : 'border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 rounded px-1 py-0.5'
        } ${modified ? 'border-b-2 border-b-[#D4AF37]' : ''}`}
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

      {/* Feedback animado quando salvo */}
      {showSavedBadge && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/60 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in zoom-in duration-200 pointer-events-none whitespace-nowrap">
          <Check className="w-3 h-3 text-[#D4AF37]" />
          Salvo!
        </span>
      )}
    </span>
  );
};
