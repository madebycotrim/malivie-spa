import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ServiceItem, FAQItem, ServiceCategory } from '../types';
import { SERVICES_LIST, FAQ_ITEMS, AVAILABLE_SERVICE_IMAGES } from '../data/spaData';

interface EditorContextType {
  isEditorActive: boolean;
  toggleEditor: () => void;
  setEditorActive: (active: boolean) => void;
  overrides: Record<string, string>;
  getText: (id: string, defaultText: string) => string;
  updateText: (id: string, newText: string) => void;
  resetText: (id: string) => void;
  resetAll: () => void;
  isModified: (id: string) => boolean;
  modifiedCount: number;
  isExportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  // Autenticação & Modal de Senha
  isPasswordModalOpen: boolean;
  setPasswordModalOpen: (open: boolean) => void;
  requestOpenEditor: () => void;
  verifyPassword: (password: string) => Promise<boolean>;

  // Gerenciamento de Cards / Rituais
  services: ServiceItem[];
  addService: (category?: ServiceCategory) => ServiceItem;
  removeService: (serviceId: string) => void;
  cycleServiceImage: (serviceId: string) => void;
  updateServiceImage: (serviceId: string, newImageUrl: string) => void;
  toggleServicePopular: (serviceId: string) => void;
  updateServiceCategory: (serviceId: string, category: ServiceCategory, categoryLabel?: string) => void;
  moveService: (serviceId: string, direction: 'left' | 'right' | 'up' | 'down', currentListIds?: string[]) => void;
  resetServices: () => void;
  isServicesModified: boolean;

  // Imagens Customizadas do Site (Upload do Computador)
  imageOverrides: Record<string, string>;
  getImage: (id: string, defaultImage: string) => string;
  updateImage: (id: string, newImageUrl: string) => void;
  resetImage: (id: string) => void;
  isImageModified: (id: string) => boolean;

  // Ícones Customizados do Site (Biblioteca de Ícones)
  iconOverrides: Record<string, string>;
  getIcon: (id: string, defaultIconName: string) => string;
  updateIcon: (id: string, newIconName: string) => void;
  resetIcon: (id: string) => void;
  isIconModified: (id: string) => boolean;

  // Gerenciamento de FAQ / Perguntas
  faqs: FAQItem[];
  addFaq: (category?: 'head-spa' | 'preparacao' | 'geral') => FAQItem;
  removeFaq: (faqId: string) => void;
  moveFaq: (faqId: string, direction: 'up' | 'down') => void;
  resetFaqs: () => void;
  isFaqsModified: boolean;
}

const STORAGE_KEY_OVERRIDES = 'malivie_editor_content_v2';
const STORAGE_KEY_IMAGES = 'malivie_editor_images_v1';
const STORAGE_KEY_ICONS = 'malivie_editor_icons_v1';
const STORAGE_KEY_SERVICES = 'malivie_editor_services_v2';
const STORAGE_KEY_FAQS = 'malivie_editor_faqs_v2';

// Hash SHA-256 para senha (malivie2026 e malivie)
const ALLOWED_PASSWORD_HASHES = [
  '310e80fa581bdac98cf605736d90d153803324268e06e27d664e0f4d79fd6d26', // malivie2026
  'a50935b35b9e994984fe6b6d9694130aefc053f66a8dd8f29180a854c64fd602', // malivie
];

export async function computeSha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Web Audio API sintetizador de som zen suave
const playZenChime = (type: 'activate' | 'deactivate' | 'save') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'activate') {
      const freqs = [528, 792];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.04, ctx.currentTime + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.45);
      });
    } else if (type === 'deactivate') {
      const freqs = [792, 528];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.03, ctx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.1);
        osc.stop(ctx.currentTime + index * 0.1 + 0.4);
      });
    } else if (type === 'save') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    }
  } catch {
    // Silencia qualquer restrição de autoplay
  }
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  // 1. Text Overrides
  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OVERRIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Falha ao ler overrides do localStorage:', e);
    }
    return {};
  });

  // 2. Services List
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Falha ao ler services do localStorage:', e);
    }
    return SERVICES_LIST;
  });

  // 3. FAQ Items
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Falha ao ler faqs do localStorage:', e);
    }
    return FAQ_ITEMS;
  });

  // 4. Image Overrides (Manifesto, Head Spa, Gift Card, Fachada, etc.)
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IMAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Falha ao ler imageOverrides do localStorage:', e);
    }
    return {};
  });

  // 5. Icon Overrides (Biblioteca de Ícones Lucide)
  const [iconOverrides, setIconOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ICONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Falha ao ler iconOverrides do localStorage:', e);
    }
    return {};
  });

  // Autenticação por Senha
  const requestOpenEditor = useCallback(() => {
    if (isEditorActive) {
      // Se já está ativo, permite alternar ou manter
      return;
    }
    setPasswordModalOpen(true);
    setTimeout(() => {
      const footerLogo = document.getElementById('footer-editor-logo');
      if (footerLogo) {
        footerLogo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }, [isEditorActive]);

  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const hash = await computeSha256(password.trim());
      const envHash = import.meta.env.VITE_EDITOR_PASSWORD_HASH;
      const isMatch = ALLOWED_PASSWORD_HASHES.includes(hash) || (envHash && hash === envHash);

      if (isMatch) {
        setIsEditorActive(true);
        setPasswordModalOpen(false);
        playZenChime('activate');
        return true;
      }
    } catch (e) {
      console.error('Erro ao verificar senha:', e);
    }
    return false;
  }, []);

  const toggleEditor = useCallback(() => {
    setIsEditorActive((prev) => {
      const next = !prev;
      playZenChime(next ? 'activate' : 'deactivate');
      return next;
    });
  }, []);

  const setEditorActive = useCallback((active: boolean) => {
    setIsEditorActive(active);
    playZenChime(active ? 'activate' : 'deactivate');
  }, []);

  const getText = useCallback(
    (id: string, defaultText: string) => {
      if (overrides[id] !== undefined) {
        return overrides[id];
      }
      return defaultText;
    },
    [overrides]
  );

  const updateText = useCallback(
    (id: string, newText: string) => {
      setOverrides((prev) => {
        const next = { ...prev, [id]: newText };
        try {
          localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(next));
        } catch (e) {
          console.warn('Falha ao gravar overrides no localStorage:', e);
        }
        return next;
      });
      playZenChime('save');
    },
    []
  );

  const resetText = useCallback(
    (id: string) => {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[id];
        try {
          localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(next));
        } catch (e) {
          console.warn('Falha ao gravar overrides no localStorage:', e);
        }
        return next;
      });
    },
    []
  );

  // Imagens Customizadas do Site
  const getImage = useCallback(
    (id: string, defaultImage: string) => {
      if (imageOverrides[id] !== undefined) {
        return imageOverrides[id];
      }
      return defaultImage;
    },
    [imageOverrides]
  );

  const updateImage = useCallback((id: string, newImageUrl: string) => {
    setImageOverrides((prev) => {
      const next = { ...prev, [id]: newImageUrl };
      try {
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao salvar imageOverrides no localStorage:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const resetImage = useCallback((id: string) => {
    setImageOverrides((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao resetar imageOverrides no localStorage:', e);
      }
      return next;
    });
    playZenChime('deactivate');
  }, []);

  const isImageModified = useCallback(
    (id: string) => id in imageOverrides,
    [imageOverrides]
  );

  // Ícones Customizados do Site
  const getIcon = useCallback(
    (id: string, defaultIconName: string) => {
      if (iconOverrides[id] !== undefined) {
        return iconOverrides[id];
      }
      return defaultIconName;
    },
    [iconOverrides]
  );

  const updateIcon = useCallback((id: string, newIconName: string) => {
    setIconOverrides((prev) => {
      const next = { ...prev, [id]: newIconName };
      try {
        localStorage.setItem(STORAGE_KEY_ICONS, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao salvar iconOverrides no localStorage:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const resetIcon = useCallback((id: string) => {
    setIconOverrides((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(STORAGE_KEY_ICONS, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao resetar iconOverrides no localStorage:', e);
      }
      return next;
    });
    playZenChime('deactivate');
  }, []);

  const isIconModified = useCallback(
    (id: string) => id in iconOverrides,
    [iconOverrides]
  );

  // Cards / Services CRUD & Reordenação
  const addService = useCallback((targetCategory: ServiceCategory = 'head-spa') => {
    const timestamp = Date.now();
    const newId = `custom-ritual-${timestamp}`;

    const categoryLabels: Record<ServiceCategory, string> = {
      'todos': 'Head Spa',
      'head-spa': 'Head Spa',
      'relaxamento': 'Relaxamento',
      'terapias': 'Terapias Corporais',
      'corporal-facial': 'Corporal & Facial',
      'spa-pes': 'Spa dos Pés',
      'day-spa': 'Rituais de Day Spa',
      'especiais': 'Rituais Especiais',
      'planos-horas': 'Planos de Horas & Sessões',
      'complementos': 'Complementos',
      'massagens': 'Massagens Relaxantes',
      'pedras-quentes': 'Pedras Quentes',
      'acupuntura': 'Acupuntura',
    };

    const actualCategory = targetCategory === 'todos' ? 'head-spa' : targetCategory;
    const catLabel = categoryLabels[actualCategory] || 'Ritual Exclusivo';

    const newService: ServiceItem = {
      id: newId,
      name: 'Novo Ritual Exclusivo',
      tagline: 'Personalize o subtítulo deste ritual',
      category: actualCategory,
      categoryLabel: catLabel,
      duration: '60 min',
      description: 'Descreva a experiência sensorial e o toque das terapeutas. Use **negrito** para destacar benefícios.',
      longDescription: 'Descrição completa e detalhada deste ritual no Maliviê SPA.',
      image: AVAILABLE_SERVICE_IMAGES[0] || '',
      popular: false,
      includedItems: [
        'Welcome Drink artesanal & Escalda-pés de boas-vindas',
        'Atendimento humanizado exclusivo',
      ],
      therapists: ['Andressa', 'Luciana'],
      whatsappMessage: 'Gostaria de agendar o Novo Ritual Exclusivo',
      priceHint: 'Sob consulta · Atendimento exclusivo',
    };

    setServices((prev) => {
      const next = [newService, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao persistir novo serviço:', e);
      }
      return next;
    });

    playZenChime('save');
    return newService;
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== serviceId);
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao persistir remoção de serviço:', e);
      }
      return next;
    });
    playZenChime('deactivate');
  }, []);

  const cycleServiceImage = useCallback((serviceId: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        const currentIndex = AVAILABLE_SERVICE_IMAGES.indexOf(s.image);
        const nextIndex = (currentIndex + 1) % AVAILABLE_SERVICE_IMAGES.length;
        return {
          ...s,
          image: AVAILABLE_SERVICE_IMAGES[nextIndex],
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao alternar imagem:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const updateServiceImage = useCallback((serviceId: string, newImageUrl: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          image: newImageUrl,
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao atualizar imagem do serviço:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const toggleServicePopular = useCallback((serviceId: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          popular: !s.popular,
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao alternar destaque:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const updateServiceCategory = useCallback((serviceId: string, category: ServiceCategory, categoryLabel?: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          category,
          categoryLabel: categoryLabel || s.categoryLabel,
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao atualizar categoria do serviço:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const moveService = useCallback(
    (serviceId: string, direction: 'left' | 'right' | 'up' | 'down', currentListIds?: string[]) => {
      setServices((prev) => {
        const listToUse = currentListIds && currentListIds.length > 0 ? currentListIds : prev.map((s) => s.id);
        const currentIdx = listToUse.indexOf(serviceId);
        if (currentIdx === -1) return prev;

        let targetIdx = currentIdx;
        if (direction === 'left') targetIdx = currentIdx - 1;
        else if (direction === 'right') targetIdx = currentIdx + 1;
        else if (direction === 'up') targetIdx = currentIdx - 3; // Em grid 3-coluna, sobe uma linha
        else if (direction === 'down') targetIdx = currentIdx + 3; // Em grid 3-coluna, desce uma linha

        if (targetIdx < 0) targetIdx = 0;
        if (targetIdx >= listToUse.length) targetIdx = listToUse.length - 1;
        if (targetIdx === currentIdx) return prev;

        const targetId = listToUse[targetIdx];
        const prevCurrentIdx = prev.findIndex((s) => s.id === serviceId);
        const prevTargetIdx = prev.findIndex((s) => s.id === targetId);

        if (prevCurrentIdx === -1 || prevTargetIdx === -1) return prev;

        const next = [...prev];
        const [movedItem] = next.splice(prevCurrentIdx, 1);
        next.splice(prevTargetIdx, 0, movedItem);

        try {
          localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(next));
        } catch (e) {
          console.warn('Falha ao salvar nova ordem dos serviços:', e);
        }
        return next;
      });
      playZenChime('save');
    },
    []
  );

  const resetServices = useCallback(() => {
    setServices(SERVICES_LIST);
    try {
      localStorage.removeItem(STORAGE_KEY_SERVICES);
    } catch {}
    playZenChime('deactivate');
  }, []);

  // FAQs CRUD & Reordenação
  const addFaq = useCallback((category: 'head-spa' | 'preparacao' | 'geral' = 'geral') => {
    const timestamp = Date.now();
    const newId = `custom-faq-${timestamp}`;

    const newFaq: FAQItem = {
      id: newId,
      category,
      question: 'Nova pergunta frequente sobre o atendimento?',
      answer: 'Digite a resposta aqui. Você pode usar **texto em negrito** e *itálico* livremente para destacar informações.',
    };

    setFaqs((prev) => {
      const next = [...prev, newFaq];
      try {
        localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao persistir novo FAQ:', e);
      }
      return next;
    });

    playZenChime('save');
    return newFaq;
  }, []);

  const removeFaq = useCallback((faqId: string) => {
    setFaqs((prev) => {
      const next = prev.filter((f) => f.id !== faqId);
      try {
        localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao persistir remoção de FAQ:', e);
      }
      return next;
    });
    playZenChime('deactivate');
  }, []);

  const moveFaq = useCallback((faqId: string, direction: 'up' | 'down') => {
    setFaqs((prev) => {
      const index = prev.findIndex((f) => f.id === faqId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

      try {
        localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(next));
      } catch (e) {
        console.warn('Falha ao salvar nova ordem dos FAQs:', e);
      }
      return next;
    });
    playZenChime('save');
  }, []);

  const resetFaqs = useCallback(() => {
    setFaqs(FAQ_ITEMS);
    try {
      localStorage.removeItem(STORAGE_KEY_FAQS);
    } catch {}
    playZenChime('deactivate');
  }, []);

  const resetAll = useCallback(() => {
    setOverrides({});
    setImageOverrides({});
    setIconOverrides({});
    setServices(SERVICES_LIST);
    setFaqs(FAQ_ITEMS);
    try {
      localStorage.removeItem(STORAGE_KEY_OVERRIDES);
      localStorage.removeItem(STORAGE_KEY_IMAGES);
      localStorage.removeItem(STORAGE_KEY_ICONS);
      localStorage.removeItem(STORAGE_KEY_SERVICES);
      localStorage.removeItem(STORAGE_KEY_FAQS);
    } catch {
      // Ignora falhas de remoção
    }
    playZenChime('deactivate');
  }, []);

  const isModified = useCallback(
    (id: string) => {
      return overrides[id] !== undefined;
    },
    [overrides]
  );

  const isServicesModified = useMemo(() => {
    if (services.length !== SERVICES_LIST.length) return true;
    return services.some(
      (s, idx) =>
        s.id !== SERVICES_LIST[idx]?.id ||
        s.category !== SERVICES_LIST[idx]?.category ||
        s.categoryLabel !== SERVICES_LIST[idx]?.categoryLabel ||
        s.popular !== SERVICES_LIST[idx]?.popular ||
        s.image !== SERVICES_LIST[idx]?.image
    );
  }, [services]);

  const isFaqsModified = useMemo(() => {
    if (faqs.length !== FAQ_ITEMS.length) return true;
    return faqs.some((f, idx) => f.id !== FAQ_ITEMS[idx]?.id);
  }, [faqs]);

  const modifiedCount = useMemo(() => {
    let count = Object.keys(overrides).length + Object.keys(imageOverrides).length + Object.keys(iconOverrides).length;
    if (isServicesModified) {
      count += Math.abs(services.length - SERVICES_LIST.length) || 1;
    }
    if (isFaqsModified) {
      count += Math.abs(faqs.length - FAQ_ITEMS.length) || 1;
    }
    return count;
  }, [overrides, imageOverrides, iconOverrides, isServicesModified, isFaqsModified, services.length, faqs.length]);

  // Atalho de teclado: Alt + E para solicitar senha / ativar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (isEditorActive) {
          toggleEditor();
        } else {
          requestOpenEditor();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorActive, toggleEditor, requestOpenEditor]);

  return (
    <EditorContext.Provider
      value={{
        isEditorActive,
        toggleEditor,
        setEditorActive,
        overrides,
        getText,
        updateText,
        resetText,
        resetAll,
        isModified,
        modifiedCount,
        imageOverrides,
        getImage,
        updateImage,
        resetImage,
        isImageModified,
        iconOverrides,
        getIcon,
        updateIcon,
        resetIcon,
        isIconModified,
        isExportModalOpen,
        setExportModalOpen,
        isPasswordModalOpen,
        setPasswordModalOpen,
        requestOpenEditor,
        verifyPassword,
        services,
        addService,
        removeService,
        cycleServiceImage,
        updateServiceImage,
        toggleServicePopular,
        updateServiceCategory,
        moveService,
        resetServices,
        isServicesModified,
        faqs,
        addFaq,
        removeFaq,
        moveFaq,
        resetFaqs,
        isFaqsModified,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor deve ser usado dentro de um EditorProvider');
  }
  return context;
};
