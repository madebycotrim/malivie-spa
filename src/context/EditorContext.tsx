import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ServiceItem, FAQItem, ServiceCategory } from '../types';
import { SERVICES_LIST, FAQ_ITEMS, AVAILABLE_SERVICE_IMAGES } from '../data/spaData';
import { fetchD1Overrides, saveD1Override, deleteD1Override } from '../services/d1ContentService';
import { verifyRemotePassword, changeRemotePassword, getStoredAuthToken, logoutRemoteSession } from '../services/authService';

export type D1SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface EditorContextType {
  isEditorActive: boolean;
  toggleEditor: () => void;
  setEditorActive: (active: boolean) => void;
  logoutEditor: () => Promise<void>;
  overrides: Record<string, string>;
  getText: (id: string, defaultText: string) => string;
  updateText: (id: string, newText: string) => Promise<boolean>;
  resetText: (id: string) => void;
  resetAll: () => void;
  isModified: (id: string) => boolean;
  modifiedCount: number;

  // Sincronização Cloudflare D1
  isD1Connected: boolean;
  syncStatus: D1SyncStatus;

  // Autenticação & Modal de Senha
  isPasswordModalOpen: boolean;
  setPasswordModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setChangePasswordModalOpen: (open: boolean) => void;
  requestOpenEditor: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;

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

// Chaves legadas para purga preventiva de dados do navegador
const LEGACY_STORAGE_KEYS = [
  'malivie_auth_session_token',
  'malivie_editor_content_v2',
  'malivie_editor_images_v1',
  'malivie_editor_icons_v1',
  'malivie_editor_services_v3',
  'malivie_editor_faqs_v2',
  'malivie_content_overrides',
  'malivie_spa_services',
  'malivie_spa_faqs',
  'malivie_spa_image_overrides',
  'malivie_spa_icon_overrides',
  'malivie_head_spa_details_v2',
];

function purgeLegacyClientStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('[EditorContext] Falha ao purgar armazenamento legado:', e);
  }
}

// Limpeza preventiva imediata
purgeLegacyClientStorage();

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
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isD1Connected, setIsD1Connected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<D1SyncStatus>('idle');

  // 1. Text Overrides (estritamente em memória e sincronizado com Cloudflare D1)
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  // 2. Services List (em memória)
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);

  // 3. FAQ Items (em memória)
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_ITEMS);

  // 4. Image Overrides (em memória)
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  // 5. Icon Overrides (em memória)
  const [iconOverrides, setIconOverrides] = useState<Record<string, string>>({});

  // Inicialização e sincronização exclusiva com Cloudflare D1
  useEffect(() => {
    let isMounted = true;
    purgeLegacyClientStorage();

    const syncRemoteOverrides = async () => {
      try {
        const remote = await fetchD1Overrides();
        if (!isMounted) return;
        if (remote && Object.keys(remote).length > 0) {
          // Sincroniza dados estruturais do CMS se presentes no D1
          if (remote['cms.services']) {
            try {
              const parsed = JSON.parse(remote['cms.services']);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setServices(parsed);
              }
            } catch (e) {
              console.warn('[EditorContext] Falha ao processar cms.services:', e);
            }
          }
          if (remote['cms.faqs']) {
            try {
              const parsed = JSON.parse(remote['cms.faqs']);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setFaqs(parsed);
              }
            } catch (e) {
              console.warn('[EditorContext] Falha ao processar cms.faqs:', e);
            }
          }
          if (remote['cms.images']) {
            try {
              const parsed = JSON.parse(remote['cms.images']);
              if (parsed && typeof parsed === 'object') {
                setImageOverrides(parsed);
              }
            } catch (e) {
              console.warn('[EditorContext] Falha ao processar cms.images:', e);
            }
          }
          if (remote['cms.icons']) {
            try {
              const parsed = JSON.parse(remote['cms.icons']);
              if (parsed && typeof parsed === 'object') {
                setIconOverrides(parsed);
              }
            } catch (e) {
              console.warn('[EditorContext] Falha ao processar cms.icons:', e);
            }
          }

          // Filtra chaves estruturais para manter overrides de texto limpos
          const textOverrides: Record<string, string> = {};
          for (const [k, v] of Object.entries(remote)) {
            if (!k.startsWith('cms.')) {
              textOverrides[k] = v;
            }
          }

          setOverrides((prev) => ({ ...prev, ...textOverrides }));
          setIsD1Connected(true);
          setSyncStatus('synced');
        } else if (remote !== null) {
          setIsD1Connected(true);
          setSyncStatus('idle');
        }
      } catch (err) {
        console.warn('[EditorContext] Falha ao carregar textos do D1:', err);
      }
    };
    syncRemoteOverrides();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autenticação por Senha
  const requestOpenEditor = useCallback(() => {
    if (isEditorActive) {
      return;
    }
    const token = getStoredAuthToken();
    if (token) {
      setIsEditorActive(true);
      playZenChime('activate');
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
      // Validação estrita no Cloudflare D1
      const isRemoteValid = await verifyRemotePassword(password);
      if (isRemoteValid) {
        setIsEditorActive(true);
        setPasswordModalOpen(false);
        playZenChime('activate');
        return true;
      }
    } catch (e) {
      console.error('[EditorContext] Erro ao verificar senha:', e);
    }
    return false;
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await changeRemotePassword(currentPassword, newPassword);
        if (result.success) {
          playZenChime('save');
        }
        return result;
      } catch (err: unknown) {
        console.error('[EditorContext] Erro ao alterar senha:', err);
        return { success: false, error: 'Falha na comunicação com o servidor' };
      }
    },
    []
  );

  const toggleEditor = useCallback(() => {
    if (!isEditorActive) {
      const token = getStoredAuthToken();
      if (!token) {
        requestOpenEditor();
        return;
      }
    }
    setIsEditorActive((prev) => {
      const next = !prev;
      playZenChime(next ? 'activate' : 'deactivate');
      return next;
    });
  }, [isEditorActive, requestOpenEditor]);

  const setEditorActive = useCallback(
    (active: boolean) => {
      if (active) {
        const token = getStoredAuthToken();
        if (!token) {
          requestOpenEditor();
          return;
        }
      }
      setIsEditorActive(active);
      playZenChime(active ? 'activate' : 'deactivate');
    },
    [requestOpenEditor]
  );

  const logoutEditor = useCallback(async () => {
    try {
      await logoutRemoteSession();
    } finally {
      setIsEditorActive(false);
      playZenChime('deactivate');
    }
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
    async (id: string, newText: string): Promise<boolean> => {
      const previousValue = overrides[id];

      // Aplica alteração inicialmente em memória
      setOverrides((prev) => ({ ...prev, [id]: newText }));

      // Ativa status de sincronização
      setSyncStatus('syncing');

      try {
        const ok = await saveD1Override(id, newText);
        if (ok) {
          setIsD1Connected(true);
          setSyncStatus('synced');
          playZenChime('save');
          setTimeout(() => {
            setSyncStatus((current) => (current === 'synced' ? 'idle' : current));
          }, 2500);
          return true;
        } else {
          throw new Error('Falha ao persistir no Cloudflare D1');
        }
      } catch (err: unknown) {
        console.warn(`[EditorContext] Erro ao sincronizar ${id} no D1:`, err);

        // Desfaz a alteração imediatamente: reverte para previousValue
        setOverrides((prev) => {
          const reverted = { ...prev };
          if (previousValue !== undefined) {
            reverted[id] = previousValue;
          } else {
            delete reverted[id];
          }
          return reverted;
        });

        setSyncStatus('error');
        playZenChime('deactivate');

        // Se a sessão expirou ou não está autorizada, solicita login novamente
        if (!getStoredAuthToken()) {
          setIsEditorActive(false);
          setPasswordModalOpen(true);
        }

        setTimeout(() => {
          setSyncStatus((current) => (current === 'error' ? 'idle' : current));
        }, 3500);
        return false;
      }
    },
    [overrides]
  );

  const resetText = useCallback(
    (id: string) => {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      // Remove override no Cloudflare D1
      setSyncStatus('syncing');
      deleteD1Override(id)
        .then((ok) => {
          if (ok) setSyncStatus('synced');
        })
        .catch((err) => {
          console.warn(`[EditorContext] Erro ao deletar ${id} no D1:`, err);
        });
    },
    []
  );

  // Sincronização de campos estruturais do CMS no D1
  const syncCmsToD1 = useCallback((key: 'cms.services' | 'cms.faqs' | 'cms.images' | 'cms.icons', data: unknown) => {
    const token = getStoredAuthToken();
    if (token) {
      saveD1Override(key, JSON.stringify(data)).catch((e) => {
        console.warn(`[EditorContext] Falha ao sincronizar ${key} no D1:`, e);
      });
    }
  }, []);

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
      syncCmsToD1('cms.images', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

  const resetImage = useCallback((id: string) => {
    setImageOverrides((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      syncCmsToD1('cms.images', next);
      return next;
    });
    playZenChime('deactivate');
  }, [syncCmsToD1]);

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
      syncCmsToD1('cms.icons', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

  const resetIcon = useCallback((id: string) => {
    setIconOverrides((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      syncCmsToD1('cms.icons', next);
      return next;
    });
    playZenChime('deactivate');
  }, [syncCmsToD1]);

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
      syncCmsToD1('cms.services', next);
      return next;
    });

    playZenChime('save');
    return newService;
  }, [syncCmsToD1]);

  const removeService = useCallback((serviceId: string) => {
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== serviceId);
      syncCmsToD1('cms.services', next);
      return next;
    });
    playZenChime('deactivate');
  }, [syncCmsToD1]);

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
      syncCmsToD1('cms.services', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

  const updateServiceImage = useCallback((serviceId: string, newImageUrl: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          image: newImageUrl,
        };
      });
      syncCmsToD1('cms.services', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

  const toggleServicePopular = useCallback((serviceId: string) => {
    setServices((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          popular: !s.popular,
        };
      });
      syncCmsToD1('cms.services', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

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
      syncCmsToD1('cms.services', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

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

        syncCmsToD1('cms.services', next);
        return next;
      });
      playZenChime('save');
    },
    [syncCmsToD1]
  );

  const resetServices = useCallback(() => {
    setServices(SERVICES_LIST);
    deleteD1Override('cms.services').catch(() => {});
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
      syncCmsToD1('cms.faqs', next);
      return next;
    });

    playZenChime('save');
    return newFaq;
  }, [syncCmsToD1]);

  const removeFaq = useCallback((faqId: string) => {
    setFaqs((prev) => {
      const next = prev.filter((f) => f.id !== faqId);
      syncCmsToD1('cms.faqs', next);
      return next;
    });
    playZenChime('deactivate');
  }, [syncCmsToD1]);

  const moveFaq = useCallback((faqId: string, direction: 'up' | 'down') => {
    setFaqs((prev) => {
      const index = prev.findIndex((f) => f.id === faqId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

      syncCmsToD1('cms.faqs', next);
      return next;
    });
    playZenChime('save');
  }, [syncCmsToD1]);

  const resetFaqs = useCallback(() => {
    setFaqs(FAQ_ITEMS);
    deleteD1Override('cms.faqs').catch(() => {});
    playZenChime('deactivate');
  }, []);

  const resetAll = useCallback(() => {
    const idsToDelete = Object.keys(overrides);
    setOverrides({});
    setImageOverrides({});
    setIconOverrides({});
    setServices(SERVICES_LIST);
    setFaqs(FAQ_ITEMS);
    playZenChime('deactivate');

    const allIdsToDelete = [...idsToDelete, 'cms.services', 'cms.faqs', 'cms.images', 'cms.icons'];
    setSyncStatus('syncing');
    Promise.all(allIdsToDelete.map((id) => deleteD1Override(id)))
      .then(() => setSyncStatus('synced'))
      .catch((err) => {
        console.warn('[EditorContext] Erro ao resetar itens no Cloudflare D1:', err);
        setSyncStatus('error');
      });
  }, [overrides]);

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
        logoutEditor,
        overrides,
        getText,
        updateText,
        resetText,
        resetAll,
        isModified,
        modifiedCount,
        isD1Connected,
        syncStatus,
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
        isPasswordModalOpen,
        setPasswordModalOpen,
        isChangePasswordModalOpen,
        setChangePasswordModalOpen,
        requestOpenEditor,
        verifyPassword,
        changePassword,
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
