import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Pencil, Check, AlertCircle } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface HoveredTarget {
  element: HTMLElement;
  rect: DOMRect;
  id: string;
  originalText: string;
}

export const GlobalTextEditorOverlay: React.FC = () => {
  const { isEditorActive, updateText, overrides } = useEditor();
  const [hovered, setHovered] = useState<HoveredTarget | null>(null);
  const [activeEditingEl, setActiveEditingEl] = useState<HTMLElement | null>(null);
  const [savedBadge, setSavedBadge] = useState<{ x: number; y: number; type: 'success' | 'error' } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Gera uma chave única e estável para qualquer elemento no DOM
  const getElementKey = useCallback((el: HTMLElement): string => {
    // 1. Se tem id explícito do EditableText
    if (el.getAttribute('data-editable-id')) {
      return el.getAttribute('data-editable-id')!;
    }
    if (el.id && !el.id.startsWith('__')) {
      return `dom.#${el.id}`;
    }

    // 2. Se está dentro de um container com data-service-id ou similar
    const parentContainer = el.closest('[data-service-id], [data-faq-id], [data-step-id], [data-review-id], section, article, nav, footer');
    const containerId = parentContainer?.id || parentContainer?.getAttribute('data-service-id') || parentContainer?.tagName.toLowerCase() || 'body';

    // 3. Pega uma assinatura baseada no conteúdo e na tag
    const rawText = el.innerText || el.textContent || '';
    const cleanSnippet = rawText.trim().replace(/\s+/g, ' ').slice(0, 30);
    const tag = el.tagName.toLowerCase();

    return `dom.${containerId}.${tag}[${cleanSnippet}]`;
  }, []);

  // Monitora o movimento do mouse para identificar elementos de texto
  useEffect(() => {
    if (!isEditorActive) {
      setHovered(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      // Se já estiver editando um elemento, não troca o hover
      if (activeEditingEl) return;

      const target = e.target as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      // Ignora elementos da UI do editor, ícones e imagens editáveis
      if (
        target.closest('.editor-ui') ||
        target.closest('[data-editor-ui]') ||
        target.closest('[data-editable-icon]') ||
        target.closest('.group\\/icon-edit') ||
        target.closest('[data-editable-image]') ||
        target.closest('.group\\/image-edit') ||
        target.closest('#icon-picker-modal')
      ) {
        setHovered(null);
        return;
      }

      // Ignora elementos que já são gerenciados pelo EditableText (eles já têm seu próprio hover e lápis)
      if (target.closest('.group\\/editor') || target.getAttribute('contenteditable') === 'true') {
        setHovered(null);
        return;
      }

      // Verifica se o elemento tem texto relevante e não é mídia/container gigante
      const tag = target.tagName.toLowerCase();
      const validTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'button', 'li', 'dt', 'dd', 'blockquote', 'label', 'b', 'strong', 'em', 'small', 'cite'];
      
      const hasDirectText = Array.from(target.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && (node.textContent || '').trim().length > 0
      );

      if (validTags.includes(tag) || hasDirectText) {
        const text = target.innerText?.trim() || '';
        // Evita containers vazios ou gigantes
        if (text.length > 0 && text.length < 500) {
          const rect = target.getBoundingClientRect();
          if (rect.width > 10 && rect.height > 10) {
            setHovered({
              element: target,
              rect,
              id: getElementKey(target),
              originalText: text,
            });
            return;
          }
        }
      }

      setHovered(null);
    };

    const handleScrollOrResize = () => {
      if (hovered && !activeEditingEl) {
        const rect = hovered.element.getBoundingClientRect();
        setHovered((prev) => (prev ? { ...prev, rect } : null));
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isEditorActive, activeEditingEl, getElementKey, hovered]);

  // Aplica overrides salvos no DOM para elementos nativos
  useEffect(() => {
    if (!overrides || Object.keys(overrides).length === 0) return;

    // Varre as chaves dom. e aplica nos elementos
    Object.entries(overrides).forEach(([key, newText]) => {
      if (key.startsWith('dom.')) {
        try {
          // Extrai o snippet de busca
          const match = key.match(/\[(.*?)\]$/);
          if (match && match[1]) {
            const originalSnippet = match[1];
            // Procura elementos que contenham esse snippet ou comecem com ele
            const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li, dt, dd, blockquote');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              if (el.closest('.editor-ui') || el.closest('.group\\/editor')) continue;
              const currentContent = (el.innerText || '').trim().replace(/\s+/g, ' ');
              if (currentContent.startsWith(originalSnippet) || currentContent === originalSnippet) {
                el.innerText = newText;
                break;
              }
            }
          }
        } catch {
          // Ignora erros de busca no DOM
        }
      }
    });
  }, [overrides]);

  // Inicia a edição no elemento
  const startEditingElement = (el: HTMLElement, id: string) => {
    setActiveEditingEl(el);
    setHovered(null);

    // Salva o texto inicial
    const initialText = el.innerText;
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-original-text', initialText);
    el.classList.add('global-editing-active');

    // Foca e posiciona cursor
    setTimeout(() => {
      el.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 10);

    const handleBlur = () => {
      el.removeAttribute('contenteditable');
      el.classList.remove('global-editing-active');
      setActiveEditingEl(null);

      const updatedText = el.innerText.trim();
      if (updatedText && updatedText !== initialText) {
        updateText(id, updatedText).then((success) => {
          const rect = el.getBoundingClientRect();
          if (success) {
            setSavedBadge({ x: rect.left + rect.width / 2, y: rect.top - 10, type: 'success' });
            setTimeout(() => setSavedBadge(null), 2000);
          } else {
            // Reverte imediatamente o texto no DOM
            el.innerText = initialText;
            setSavedBadge({ x: rect.left + rect.width / 2, y: rect.top - 10, type: 'error' });
            setTimeout(() => setSavedBadge(null), 3000);
          }
        });
      } else if (!updatedText) {
        el.innerText = initialText;
      }

      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeyDown);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        el.innerText = initialText;
        el.blur();
      } else if (e.key === 'Enter' && !['p', 'div', 'blockquote'].includes(el.tagName.toLowerCase())) {
        e.preventDefault();
        el.blur();
      }
    };

    el.addEventListener('blur', handleBlur);
    el.addEventListener('keydown', handleKeyDown);
  };

  // Intercepta cliques gerais quando o editor está ativo
  useEffect(() => {
    if (!isEditorActive) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !(target instanceof HTMLElement)) return;

      // Se clicou na UI do editor, ícone editável, imagem editável ou modal, deixa o componente lidar
      if (
        target.closest('.editor-ui') ||
        target.closest('[data-editor-ui]') ||
        target.closest('[data-editable-icon]') ||
        target.closest('.group\\/icon-edit') ||
        target.closest('[data-editable-image]') ||
        target.closest('.group\\/image-edit') ||
        target.closest('#icon-picker-modal')
      ) {
        return;
      }

      // Se clicou em um EditableText gerenciado pelo componente React, deixa o componente lidar
      if (target.closest('.group\\/editor')) return;

      // Se clicou em um link ou botão contendo texto, previne a ação de redirecionar para podermos editar
      const clickableParent = target.closest('a, button');
      if (
        clickableParent &&
        !clickableParent.closest('.editor-ui') &&
        !clickableParent.closest('[data-editor-ui]') &&
        !target.closest('[data-editable-icon]') &&
        !target.closest('.group\\/icon-edit')
      ) {
        e.preventDefault();
        e.stopPropagation();

        const textEl = (target.childNodes.length === 1 && target.nodeType === Node.ELEMENT_NODE) ? target : (clickableParent as HTMLElement);
        const key = getElementKey(textEl);
        startEditingElement(textEl, key);
        return;
      }

      // Se clicou em qualquer elemento com texto
      const tag = target.tagName.toLowerCase();
      const isTextTag = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'li', 'dt', 'dd', 'blockquote'].includes(tag);
      if (isTextTag && !target.isContentEditable) {
        const text = target.innerText?.trim();
        if (text && text.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          const key = getElementKey(target);
          startEditingElement(target, key);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [isEditorActive, getElementKey]);

  if (!isEditorActive) return null;

  return (
    <div ref={overlayRef} className="editor-ui pointer-events-none fixed inset-0 z-[99995]">
      {/* Moldura flutuante ao redor do elemento em hover */}
      {hovered && !activeEditingEl && (() => {
        let isGold = false;
        let curr: HTMLElement | null = hovered.element;
        while (curr && curr !== document.body) {
          const cls = curr.className || '';
          if (typeof cls === 'string' && (cls.includes('#D4AF37') || cls.includes('amber') || cls.includes('yellow') || cls.includes('bg-gold'))) {
            isGold = true;
            break;
          }
          try {
            const bg = window.getComputedStyle(curr).backgroundColor;
            if (
              bg.includes('212, 175, 55') ||
              bg.includes('212, 175') ||
              bg.includes('234, 179, 8') ||
              bg.includes('245, 158, 11')
            ) {
              isGold = true;
              break;
            }
          } catch {
            // ignore
          }
          curr = curr.parentElement;
        }

        return (
          <div
            style={{
              position: 'fixed',
              top: hovered.rect.top - 2,
              left: hovered.rect.left - 2,
              width: hovered.rect.width + 4,
              height: hovered.rect.height + 4,
            }}
            className={`border-2 border-dashed ${
              isGold
                ? 'border-[#705312] bg-[#705312]/15 shadow-[0_0_15px_rgba(112,83,18,0.35)]'
                : 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
            } rounded pointer-events-none transition-all duration-75`}
          >
            {/* Botão de Lápis Flutuante */}
            <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              startEditingElement(hovered.element, hovered.id);
            }}
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
            }}
            className="pointer-events-auto p-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/60 shadow-lg hover:bg-[#D4AF37] hover:text-[#121C16] transition-all transform hover:scale-115 cursor-pointer flex items-center gap-1"
            title="Clique para editar este texto"
          >
            <Pencil className="w-3 h-3" />
          </button>
          </div>
        );
      })()}

      {/* Badge Flutuante de Salvo ou Erro */}
      {savedBadge && (
        <div
          style={{
            position: 'fixed',
            left: savedBadge.x,
            top: savedBadge.y,
            transform: 'translate(-50%, -100%)',
          }}
          className={`text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full shadow-2xl flex items-center gap-1 pointer-events-none animate-in fade-in zoom-in duration-200 z-[9999] ${
            savedBadge.type === 'success'
              ? 'bg-[#18251E] text-emerald-400 border border-emerald-500/80'
              : 'bg-red-950/95 text-rose-300 border border-red-500/80'
          }`}
        >
          {savedBadge.type === 'success' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salvo!</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Erro ao salvar (desfeito)!</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
