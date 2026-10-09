import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, Star, Plus, Trash2, Image as ImageIcon, MessageCircle, ArrowLeft, ArrowUp, ArrowDown, Upload, Loader2, ChevronDown } from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { ServiceDrawer } from './ServiceDrawer';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';
import { useEditor } from '../context/EditorContext';

type MenuCollectionKey = 'todos' | 'head-spa' | 'massagens-corporais' | 'day-spa';

export const ServicesMenuSection: React.FC = () => {
  const {
    services,
    addService,
    removeService,
    cycleServiceImage,
    updateServiceImage,
    toggleServicePopular,
    updateServiceCategory,
    moveService,
    getText,
    isEditorActive,
  } = useEditor();

  const [selectedCollection, setSelectedCollection] = useState<MenuCollectionKey>('todos');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadSuccessId, setUploadSuccessId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<{ serviceId: string; oldImage: string } | null>(null);

  const handleTriggerUpload = (serviceId: string, currentImage: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    uploadTargetRef.current = { serviceId, oldImage: currentImage };
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = uploadTargetRef.current;
    if (!file || !target) return;

    setUploadingId(target.serviceId);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // 1. Atualização instantânea para o usuário ver de imediato
      updateServiceImage(target.serviceId, dataUrl);

      // 2. Envia para salvar fisicamente em src/assets/images e excluir a anterior
      try {
        const res = await fetch('/api/upload-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: target.serviceId,
            dataUrl,
            oldImage: target.oldImage,
          }),
        });

        const data = await res.json();
        if (data.success && data.imageUrl) {
          updateServiceImage(target.serviceId, `${data.imageUrl}?t=${Date.now()}`);
          setUploadSuccessId(target.serviceId);
          setTimeout(() => setUploadSuccessId(null), 3000);
        }
      } catch (err) {
        console.error('Erro ao salvar imagem em assets:', err);
      } finally {
        setUploadingId(null);
        uploadTargetRef.current = null;
      }
    };
    reader.readAsDataURL(file);
  };

  type MenuCollectionKey =
    | 'todos'
    | 'head-spa'
    | 'relaxamento'
    | 'terapias'
    | 'corporal-facial'
    | 'spa-pes'
    | 'day-spa'
    | 'planos';

  const DEFAULT_CATEGORY_LABELS: Record<MenuCollectionKey, string> = {
    'todos': 'Todos os Rituais',
    'head-spa': 'Head SPA',
    'relaxamento': 'Relaxamento & Express',
    'terapias': 'Terapias Corporais',
    'corporal-facial': 'Corporal & Facial',
    'spa-pes': 'Spa dos Pés',
    'day-spa': 'Day SPA & Especiais',
    'planos': 'Planos & Horas',
  };

  const cleanCategoryName = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const collections: { key: MenuCollectionKey; label: string; defaultLabel: string }[] = [
    {
      key: 'todos',
      label: cleanCategoryName(getText('services.tab.todos', DEFAULT_CATEGORY_LABELS['todos'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['todos'],
    },
    {
      key: 'head-spa',
      label: cleanCategoryName(getText('services.tab.head-spa', DEFAULT_CATEGORY_LABELS['head-spa'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['head-spa'],
    },
    {
      key: 'relaxamento',
      label: cleanCategoryName(getText('services.tab.relaxamento', DEFAULT_CATEGORY_LABELS['relaxamento'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['relaxamento'],
    },
    {
      key: 'terapias',
      label: cleanCategoryName(getText('services.tab.terapias', DEFAULT_CATEGORY_LABELS['terapias'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['terapias'],
    },
    {
      key: 'corporal-facial',
      label: cleanCategoryName(getText('services.tab.corporal-facial', DEFAULT_CATEGORY_LABELS['corporal-facial'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['corporal-facial'],
    },
    {
      key: 'spa-pes',
      label: cleanCategoryName(getText('services.tab.spa-pes', DEFAULT_CATEGORY_LABELS['spa-pes'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['spa-pes'],
    },
    {
      key: 'day-spa',
      label: cleanCategoryName(getText('services.tab.day-spa', DEFAULT_CATEGORY_LABELS['day-spa'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['day-spa'],
    },
    {
      key: 'planos',
      label: cleanCategoryName(getText('services.tab.planos', DEFAULT_CATEGORY_LABELS['planos'])),
      defaultLabel: DEFAULT_CATEGORY_LABELS['planos'],
    },
  ];

  const categoryOptions = [
    { key: 'head-spa' as const, label: 'Head SPA' },
    { key: 'relaxamento' as const, label: 'Relaxamento' },
    { key: 'terapias' as const, label: 'Terapias Corporais' },
    { key: 'corporal-facial' as const, label: 'Corporal & Facial' },
    { key: 'spa-pes' as const, label: 'Spa dos Pés' },
    { key: 'day-spa' as const, label: 'Day SPA' },
    { key: 'especiais' as const, label: 'Rituais Especiais' },
    { key: 'planos-horas' as const, label: 'Planos de Horas & Sessões' },
    { key: 'complementos' as const, label: 'Complementos' },
  ];

  const normalizeCategory = (cat: string): MenuCollectionKey => {
    if (cat === 'head-spa') return 'head-spa';
    if (cat === 'relaxamento' || cat === 'massagens' || cat === 'pedras-quentes') return 'relaxamento';
    if (cat === 'terapias' || cat === 'acupuntura') return 'terapias';
    if (cat === 'corporal-facial') return 'corporal-facial';
    if (cat === 'spa-pes') return 'spa-pes';
    if (cat === 'day-spa' || cat === 'especiais') return 'day-spa';
    if (cat === 'planos-horas' || cat === 'planos' || cat === 'complementos') return 'planos';
    return 'relaxamento';
  };

  const getCategoryLabel = (cat: string): string => {
    const key = normalizeCategory(cat);
    return DEFAULT_CATEGORY_LABELS[key] || 'Ritual';
  };

  const filteredServices = services.filter((item) => {
    if (selectedCollection === 'todos') return true;
    return normalizeCategory(item.category) === selectedCollection;
  });

  const handleCategorySelect = (serviceId: string, newCategoryKey: ServiceCategory) => {
    const newLabel = getCategoryLabel(newCategoryKey);
    updateServiceCategory(serviceId, newCategoryKey, newLabel);
  };

  const handleOpenDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  const handleCreateService = () => {
    let targetCat: ServiceCategory = 'head-spa';
    if (selectedCollection === 'relaxamento') targetCat = 'relaxamento';
    else if (selectedCollection === 'terapias') targetCat = 'terapias';
    else if (selectedCollection === 'corporal-facial') targetCat = 'corporal-facial';
    else if (selectedCollection === 'spa-pes') targetCat = 'spa-pes';
    else if (selectedCollection === 'day-spa') targetCat = 'day-spa';
    else if (selectedCollection === 'planos') targetCat = 'planos-horas';
    addService(targetCat);
  };

  const handleDeleteService = (id: string) => {
    if (confirmDeleteId === id) {
      removeService(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === id ? null : prev));
      }, 3500);
    }
  };

  return (
    <section id="menu-rituais" className="relative py-28 sm:py-36 bg-[#FBF9F6] text-[#2C2C2C] overflow-hidden">
      {/* Decorative Subtle Ambient Blobs */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-[#F0EAE1] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#D3B8AA]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EAE1] text-[#7A8B7B] border border-[#7A8B7B]/20 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <EditableIcon id="menu.badge.icon" defaultIcon="Sparkles" className="w-3.5 h-3.5 text-[#D4AF37]" />
            <EditableText id="menu.badge" defaultText="Cardápio de Experiências" as="span">
              Cardápio de Experiências
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C2C2C] font-light leading-tight"
          >
            <EditableText id="menu.title" defaultText="Menu de Rituais & Cuidados" as="span">
              Menu de <span className="italic font-normal text-[#7A8B7B]">Rituais & Cuidados</span>
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-sm sm:text-base text-[#555555] font-sans max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText
              id="menu.description"
              defaultText="Sessões individuais em salas privativas com acústica acolhedora, Welcome Drink artesanal em cristal e atendimento exclusivo pelas terapeutas Andressa e Luciana."
              as="span"
            >
              Sessões individuais em salas privativas com acústica acolhedora, Welcome Drink artesanal em cristal e atendimento exclusivo pelas terapeutas Andressa e Luciana.
            </EditableText>
          </motion.p>
        </div>

        {/* Cohesive Collections Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-12 px-2">
          {collections.map((cat) => {
            const isActive = selectedCollection === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCollection(cat.key)}
                className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#121C16] text-[#F3EFE6] shadow-[0_4px_20px_rgba(18,28,22,0.25)]'
                    : 'bg-[#F0EAE1] hover:bg-[#E8E0D5] text-[#2C2C2C]/80 border border-transparent hover:border-[#7A8B7B]/30'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/50 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                )}
                <EditableText
                  id={`services.tab.${cat.key}`}
                  defaultText={cat.defaultLabel}
                  as="span"
                >
                  {cat.label}
                </EditableText>
              </button>
            );
          })}

        </div>

        {/* Services Grid with Full Card Affordance */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.article
                layout
                key={service.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetails(service)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDetails(service);
                  }
                }}
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.5, ease: EASE_ORGANIC }}
                className={`group relative rounded-3xl bg-[#F0EAE1]/75 hover:bg-[#F0EAE1] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(18,28,22,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#7A8B7B]/40 ${
                  service.popular || service.badge
                    ? 'border border-[#D4AF37]/50 shadow-[0_8px_25px_rgba(212,175,55,0.08)]'
                    : 'border border-[#E8E0D5] hover:border-[#7A8B7B]/50'
                }`}
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#18251E]">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={service.image}
                    alt={service.name}
                    onClick={(e) => {
                      if (isEditorActive) {
                        e.stopPropagation();
                        handleTriggerUpload(service.id, service.image, e);
                      }
                    }}
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
                      isEditorActive ? 'cursor-pointer hover:brightness-95' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121C16]/60 via-transparent to-transparent pointer-events-none" />

                  {/* Feedback visual durante salvamento em assets */}
                  {uploadingId === service.id && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-35 backdrop-blur-sm pointer-events-auto">
                      <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin mb-1.5" />
                      <span className="text-xs text-[#F3EFE6] font-sans font-medium">
                        Salvando na pasta assets...
                      </span>
                    </div>
                  )}

                  {/* Feedback visual de sucesso */}
                  {uploadSuccessId === service.id && (
                    <div className="absolute inset-0 bg-[#121C16]/90 flex items-center justify-center z-35 pointer-events-none">
                      <div className="px-3.5 py-1.5 rounded-full bg-emerald-600/95 text-white text-xs font-sans font-semibold shadow-lg animate-pulse">
                        ✓ Salva em assets & anterior excluída!
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div
                    className="absolute top-3 left-3 flex items-center gap-2 z-25 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditorActive ? (
                      <div className="relative inline-flex items-center group/cat-select">
                        <select
                          value={service.category}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleCategorySelect(
                              service.id,
                              e.target.value as ServiceCategory
                            );
                          }}
                          className="appearance-none bg-[#121C16]/95 hover:bg-[#1C2C22] text-[10px] uppercase font-sans tracking-widest text-[#F3EFE6] font-semibold border border-[#D4AF37]/80 rounded-full pl-3 pr-7 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37] shadow-lg transition-all"
                          title="Clique para escolher a categoria deste card"
                        >
                          {categoryOptions.map((opt) => (
                            <option
                              key={opt.key}
                              value={opt.key}
                              className="bg-[#121C16] text-[#F3EFE6] py-1 font-sans"
                            >
                              {opt.label.toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#D4AF37] absolute right-2.5 pointer-events-none group-hover/cat-select:scale-110 transition-transform" />
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#121C16]/85 backdrop-blur-md text-[10px] uppercase font-sans tracking-widest text-[#F3EFE6] font-semibold border border-white/10">
                        {service.categoryLabel || getCategoryLabel(service.category)}
                      </span>
                    )}

                    {service.badge ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37] text-[10px] uppercase font-sans tracking-widest text-[#121C16] font-bold shadow-md">
                        {service.badge}
                      </span>
                    ) : service.popular ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37] text-[10px] uppercase font-sans tracking-widest text-[#121C16] font-bold shadow-md">
                        <Star className="w-2.5 h-2.5 fill-[#121C16]" />
                        Destaque
                      </span>
                    ) : null}
                  </div>

                  {/* Ações do Card no Modo Editor */}
                  {isEditorActive && (
                    <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5 pointer-events-auto">
                      {/* Botões Principais: Destaque, Carregar Foto do PC e Excluir */}
                      <div className="flex items-center gap-1.5">
                        {/* Alternar Destaque */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleServicePopular(service.id);
                          }}
                          className={`p-1.5 rounded-full border shadow-md transition-all cursor-pointer hover:scale-110 ${
                            service.popular
                              ? 'bg-[#D4AF37] text-[#121C16] border-[#D4AF37]'
                              : 'bg-[#121C16]/85 text-white/70 hover:text-[#D4AF37] border-white/20'
                          }`}
                          title={service.popular ? 'Remover dos destaques' : 'Marcar como destaque'}
                        >
                          <Star className={`w-3.5 h-3.5 ${service.popular ? 'fill-[#121C16]' : ''}`} />
                        </button>

                        {/* Carregar Foto do Computador (Salva em assets e exclui a anterior) */}
                        <button
                          type="button"
                          onClick={(e) => handleTriggerUpload(service.id, service.image, e)}
                          className="p-1.5 rounded-full bg-[#121C16]/85 hover:bg-[#121C16] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md transition-all hover:scale-110 cursor-pointer"
                          title="Carregar nova foto do computador (salva na pasta assets e exclui a anterior)"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>

                        {/* Excluir Card */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteService(service.id);
                          }}
                          className={`p-1.5 rounded-full border shadow-md transition-all cursor-pointer ${
                            confirmDeleteId === service.id
                              ? 'bg-red-600 text-white border-red-400 animate-pulse'
                              : 'bg-[#121C16]/85 hover:bg-red-950 text-[#94A595] hover:text-red-200 border-white/20 hover:border-red-500/50'
                          }`}
                          title={confirmDeleteId === service.id ? 'Clique novamente para CONFIRMAR a exclusão' : 'Remover este ritual'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Setinhas de Direção / Reordenação (Abaixo dos botões principais) */}
                      <div className="flex items-center gap-0.5 bg-[#121C16]/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-[#D4AF37]/40 shadow-md">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(service.id, 'left', filteredServices.map((s) => s.id));
                          }}
                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all cursor-pointer"
                          title="Mover para o lado esquerdo"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(service.id, 'right', filteredServices.map((s) => s.id));
                          }}
                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all cursor-pointer"
                          title="Mover para o lado direito"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(service.id, 'up', filteredServices.map((s) => s.id));
                          }}
                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all cursor-pointer"
                          title="Mover para cima (linha anterior)"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(service.id, 'down', filteredServices.map((s) => s.id));
                          }}
                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all cursor-pointer"
                          title="Mover para baixo (próxima linha)"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Duration Pill */}
                  <div
                    className="absolute bottom-3 right-3 z-30 pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121C16]/85 backdrop-blur-md text-xs text-[#D4AF37] border border-[#D4AF37]/30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EditableIcon id={`service.${service.id}.duration.icon`} defaultIcon="Clock" className="w-3.5 h-3.5" />
                    <EditableText id={`service.${service.id}.duration`} defaultText={service.duration} as="span">
                      {service.duration}
                    </EditableText>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#121C16] transition-colors leading-snug">
                      <EditableText id={`service.${service.id}.name`} defaultText={service.name} as="span">
                        {service.name}
                      </EditableText>
                    </h3>
                    <p className="text-xs font-sans text-[#7A8B7B] font-medium tracking-wide mt-1 line-clamp-1">
                      <EditableText id={`service.${service.id}.tagline`} defaultText={service.tagline} as="span">
                        {service.tagline}
                      </EditableText>
                    </p>

                    {/* Bloco Refinado de Investimento */}
                    {service.priceOptions && service.priceOptions.length > 0 ? (
                      <div className="pt-2.5">
                        {service.priceOptions.length === 1 ? (
                          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 border border-[#E8E0D5] shadow-2xs">
                            <span className="text-[11px] font-sans font-semibold text-[#7A8B7B] uppercase tracking-wider">
                              {service.priceOptions[0].duration || 'Sessão'}
                            </span>
                            <span className="font-serif text-base font-bold text-[#121C16]">
                              {service.priceOptions[0].price}
                            </span>
                          </div>
                        ) : service.priceOptions.length === 2 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {service.priceOptions.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-white/90 border border-[#E8E0D5] text-center shadow-2xs group-hover:border-[#7A8B7B]/40 transition-colors"
                              >
                                <span className="text-[10px] uppercase tracking-wider font-sans font-semibold text-[#7A8B7B]">
                                  {opt.duration}
                                </span>
                                <span className="font-serif text-sm font-bold text-[#121C16] leading-tight mt-0.5">
                                  {opt.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {service.priceOptions.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border text-center shadow-2xs transition-colors ${
                                  oIdx === service.priceOptions!.length - 1
                                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50'
                                    : 'bg-white/90 border-[#E8E0D5]'
                                }`}
                              >
                                <span className="text-[9.5px] uppercase tracking-tight font-sans font-semibold text-[#7A8B7B] truncate w-full">
                                  {opt.duration}
                                </span>
                                <span className="font-serif text-xs font-bold text-[#121C16] leading-tight mt-0.5">
                                  {opt.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : service.price ? (
                      <div className="pt-2.5">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 border border-[#E8E0D5] shadow-2xs">
                          <span className="text-[11px] font-sans font-semibold text-[#7A8B7B] uppercase tracking-wider">
                            Investimento
                          </span>
                          <span className="font-serif text-base font-bold text-[#121C16]">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Cortesia / Mimos Oficiais */}
                    {service.courtesyNote && (
                      <div className="flex items-start gap-1.5 text-[11px] font-sans text-[#6B7C6C] font-medium pt-2 leading-tight">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{service.courtesyNote}</span>
                      </div>
                    )}

                    <div className="mt-2.5">
                      <EditableText
                        id={`service.${service.id}.description`}
                        defaultText={service.description}
                        as="p"
                        className="font-sans text-xs text-[#555555] line-clamp-2 leading-relaxed min-h-[2rem]"
                      >
                        {service.description}
                      </EditableText>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-3.5 border-t border-[#E8E0D5] flex items-center justify-between gap-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#121C16] group-hover:text-[#7A8B7B] transition-colors">
                      <EditableText id="menu.card.btn" defaultText="Conhecer Ritual" as="span">
                        Conhecer Ritual
                      </EditableText>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform duration-300" />
                    </span>

                    <a
                      href={SPA_BUSINESS_DATA.whatsapp.formatServiceUrl(service.name)}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackWhatsAppClick('servico_card', service.name);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#18251E] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#121C16] text-xs font-sans font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-103 active:scale-97 flex-shrink-0 group/wpp cursor-pointer"
                      title={`Agendar ${service.name} direto no WhatsApp`}
                      aria-label={`Agendar ${service.name} direto no WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37] group-hover/wpp:text-[#121C16] transition-colors" />
                      <span>Agendar</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Card de Adicionar Novo Ritual no Modo Editor */}
            {isEditorActive && (
              <motion.div
                layout
                onClick={handleCreateService}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-3xl border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-white/40 hover:bg-[#D4AF37]/5 min-h-[460px] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-[#121C16] flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-md mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#121C16] transition-colors leading-snug">
                  Adicionar Novo Ritual
                </h4>
                <p className="font-sans text-xs text-[#7A8B7B] mt-2 max-w-[240px] leading-relaxed">
                  Crie uma nova experiência para o cardápio. Imagem, título, duração e textos totalmente editáveis.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18251E] text-[#D4AF37] text-xs font-sans font-semibold uppercase tracking-wider group-hover:bg-[#D4AF37] group-hover:text-[#18251E] transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  Criar Card
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Concierge Banner de Transparência de Investimento & Acolhimento */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#F0EAE1] via-[#EFE8DF] to-[#E8E0D5] border border-[#D3B8AA]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_35px_rgba(18,28,22,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#7A8B7B]/30 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#7A8B7B]">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <EditableText id="services.conciergeBadge" defaultText="Atendimento Concierge & Valores" as="span">
                Atendimento Concierge & Valores
              </EditableText>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2C2C] font-light leading-snug">
              <EditableText id="services.conciergeTitle" defaultText="Tabela da Temporada & Agendamento Privativo" as="span">
                Tabela da Temporada & Agendamento Privativo
              </EditableText>
            </h3>
            <EditableText
              id="services.conciergeDesc"
              defaultText="Todas as sessões são privativas e já incluem taça de boas-vindas, toalhas aquecidas, roupão bordado e cerimonial do chá. Fale com a recepção para consultar horários livres e receber a tabela completa sem compromisso."
              as="p"
              className="text-xs sm:text-sm text-[#555555] font-sans max-w-xl leading-relaxed"
            >
              Todas as sessões são privativas e já incluem taça de boas-vindas, toalhas aquecidas, roupão bordado e cerimonial do chá. Fale com a recepção para consultar horários livres e receber a tabela completa sem compromisso.
            </EditableText>
          </div>

          <a
            href={SPA_BUSINESS_DATA.whatsapp.pricingInquiryUrl ? SPA_BUSINESS_DATA.whatsapp.pricingInquiryUrl() : SPA_BUSINESS_DATA.whatsapp.defaultUrl}
            onClick={() => trackWhatsAppClick('menu_tabela_valores')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 relative z-10 inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-full bg-[#121C16] hover:bg-[#1C2C22] text-[#F3EFE6] text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(18,28,22,0.25)] hover:shadow-[0_12px_30px_rgba(18,28,22,0.35)] hover:scale-[1.02] active:scale-98 group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <EditableText id="services.conciergeCta" defaultText="Consultar Tabela no WhatsApp" as="span">
              Consultar Tabela no WhatsApp
            </EditableText>
          </a>
        </div>
      </div>

      {/* Slide-Over Drawer Integration */}
      <ServiceDrawer
        service={selectedService}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Input oculto para carregar arquivo de imagem do computador */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );
};
