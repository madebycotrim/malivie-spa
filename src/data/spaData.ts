import { BusinessInfo, FAQItem, ReviewItem, RitualStep, ServiceItem } from '../types';

import acupunturaImg from '../assets/images/acupuntura.webp';
import daySpaChaImg from '../assets/images/day-spa-cha.webp';
import headSpaTerapeutaImg from '../assets/images/head-spa-terapeuta-acolhimento.webp';
import headSpaDetalheImg from '../assets/images/head-spa-detalhe.webp';
import headSpaJatosImg from '../assets/images/head-spa-jatos-agua.webp';
import headSpaArcoDouradoImg from '../assets/images/head-spa-arco-dourado.webp';
import pedrasQuentesImg from '../assets/images/pedras-quentes.webp';
import spaDosPesImg from '../assets/images/spa-dos-pes.webp';
import ritualBoasVindasImg from '../assets/images/ritual-boas-vindas.webp';
import malivieBandejaReflexaoImg from '../assets/images/malivie-bandeja-reflexao.webp';
import malivieRoupaoChinelosImg from '../assets/images/malivie-roupao-chinelos.webp';
import giftCardImg from '../assets/images/malivie-gift-card-instagram.webp';

export const AVAILABLE_SERVICE_IMAGES = [
  headSpaTerapeutaImg,
  headSpaDetalheImg,
  headSpaArcoDouradoImg,
  headSpaJatosImg,
  pedrasQuentesImg,
  spaDosPesImg,
  daySpaChaImg,
  ritualBoasVindasImg,
  malivieBandejaReflexaoImg,
  malivieRoupaoChinelosImg,
  giftCardImg,
  acupunturaImg,
];

export const SPA_BUSINESS_DATA: BusinessInfo = {
  name: 'Maliviê SPA',
  slogan: 'Experiências de bem-estar, relaxamento e autocuidado.',
  address: {
    street: '3ª Avenida, 1124 - lote 1208-A, Loja 3',
    neighborhood: 'Núcleo Bandeirante',
    city: 'Brasília',
    state: 'DF',
    postalCode: '71720-565',
    fullFormatted: 'Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565',
  },
  schedule: {
    monday: 'Fechado',
    tuesdayToSaturday: 'De 08h às 19h',
    sunday: 'De 08h às 13h',
  },
  social: {
    instagram: 'https://www.instagram.com/maliviespa/',
    instagramHandle: '@maliviespa',
    linktree: 'https://linktr.ee/malivie',
    facebook: 'https://www.facebook.com/maliviespa/',
    tiktok: 'https://www.tiktok.com/@maliviespa',
    tiktokHandle: '@maliviespa',
  },
  whatsapp: {
    phoneNumber: '5561999569214',
    formattedDisplay: '(61) 99956-9214',
    defaultUrl: `https://wa.me/5561999569214?text=${encodeURIComponent('Olá! Vim pelo site do Maliviê SPA e gostaria de agendar um horário.')}`,
    heroUrl: `https://wa.me/5561999569214?text=${encodeURIComponent('Olá! Conheci o Maliviê SPA pelo site e gostaria de agendar uma experiência de desaceleração. Quais são os próximos horários disponíveis?')}`,
    headSpaUrl: `https://wa.me/5561999569214?text=${encodeURIComponent('Olá! Gostaria de agendar o Head SPA no Maliviê SPA. Poderia me enviar os horários disponíveis?')}`,
    navUrl: `https://wa.me/5561999569214?text=${encodeURIComponent('Olá! Gostaria de agendar um horário no Maliviê SPA. Poderia me informar os dias e horários livres?')}`,
    receptionUrl: `https://wa.me/5561999569214?text=${encodeURIComponent('Olá! Gostaria de falar com a recepção do Maliviê SPA para tirar dúvidas e agendar um atendimento.')}`,
    formatServiceUrl: (serviceName: string) => {
      const encoded = encodeURIComponent(`Olá! Gostaria de agendar o ritual: ${serviceName} no Maliviê SPA.`);
      return `https://wa.me/5561999569214?text=${encoded}`;
    },
    giftCardUrl: (type?: string) => {
      const text = type 
        ? `Olá! Gostaria de adquirir o Gift Card Maliviê para presentear (${type}) com autocuidado!`
        : 'Olá! Gostaria de adquirir o Gift Card Maliviê para presentear alguém especial com autocuidado!';
      return `https://wa.me/5561999569214?text=${encodeURIComponent(text)}`;
    },
    pricingInquiryUrl: (serviceName?: string) => {
      const text = serviceName
        ? `Olá! Gostaria de consultar os valores e horários disponíveis para o ritual: ${serviceName} no Maliviê SPA.`
        : 'Olá! Gostaria de receber o cardápio completo de serviços e valores do Maliviê SPA.';
      return `https://wa.me/5561999569214?text=${encodeURIComponent(text)}`;
    },
    createCustomUrl: (message: string) => {
      return `https://wa.me/5561999569214?text=${encodeURIComponent(message)}`;
    },
  },
  rating: {
    score: 5.0,
    totalReviews: 117,
    platform: 'Google Avaliações',
  }
};

export const GOOGLE_REVIEW_TAGS = [
  { label: 'Cozy Place', count: 18 },
  { label: 'Massage Therapist', count: 8 },
  { label: 'Fairy Hands', count: 3 },
  { label: 'Foot Spa', count: 2 },
];

export const GOOGLE_REVIEWS_URLS = {
  viewAll: 'https://www.google.com/maps?cid=14092199924203547612',
  writeReview: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565')}`,
  mapsProfile: 'https://www.google.com/maps?cid=14092199924203547612'
};

export const OFFICIAL_COPIES = {
  // A. Cabeçalho & Hero Section
  title: "Maliviê SPA",
  slogan: "Experiências de bem-estar, relaxamento e autocuidado.",
  locationSubtitle: "Núcleo Bandeirante, Brasília",
  googleRatingBadge: "5.0 Avaliação no Google",
  ctaButton: "Agendar um horário!",

  // B. Seção de Boas-Vindas & Acolhimento
  welcome: "Mais do que um atendimento, uma experiência. 🌿 No Maliviê, acreditamos que o autocuidado é uma necessidade, não um luxo.",
  arrival: "Aqui, você é recebido(a) com calma. 🌿 Um momento de pausa já na sua chegada.",
  welcomeDetail: "Aqui, cada detalhe é pensado para proporcionar conforto, presença e momentos que permanecem na memória.",

  // C. Manifesto do Desaceleramento (Seção Institucional)
  manifestoMain: "No Maliviê, acreditamos que o autocuidado é uma necessidade, não um luxo. Criamos experiências que unem relaxamento, bem-estar e acolhimento para que cada pessoa encontre uma pausa em meio à rotina. Seja através de uma massagem, um Head Spa ou um ritual completo, nosso propósito é cuidar de você de forma única e personalizada.",
  manifestoSecondary: "Aqui, cada detalhe é pensado para proporcionar conforto, presença e momentos que permanecem na memória. Desacelere da rotina e permita-se um momento de cuidado único.",

  // D. Seção Carro-Chefe – Head Spa Oriental
  headSpaTitle: "Head SPA",
  headSpaQuote: "O ruído da água correndo, a textura da espuma suave e o ritmo desacelerado dos movimentos na cabeça. Quando a mente desacelera, o corpo inteiro responde. Inspirado nos rituais orientais, combina relaxamento profundo, produtos asiáticos e ozonioterapia para cuidar do couro cabeludo e dos fios.",
  headSpaSubtitle: "Saúde capilar, relaxamento profundo e bem-estar em uma experiência única.",

  // E. Seção Massagens Relaxantes
  massagensTitle: "Relaxamento & Terapias",
  pedrasQuentesQuote: "A combinação da massagem com pedras aquecidas ajuda a aliviar tensões musculares e proporcionar um relaxamento ainda mais profundo.",

  // F. Seção Rituais de Day SPA
  daySpaTitle: "Rituais de Day SPA",
  daySpaQuote: "Experiências completas de bem-estar com degustação da temporada. Disponível para até 5 pessoas simultaneamente.",
  daySpaSazonal: "Encontre a opção ideal para o seu momento de renovação e celebração.",

  // G. Seção Planos de Horas & Sessões
  planosHorasTitle: "Planos de Sessões & Horas",

  // H. Seção Gift Card (Voucher Presente)
  giftCardTitle: "PRESENTEIE COM BEM-ESTAR",
  giftCardOfficial: "**Presenteie com autocuidado:** Nossos vouchers-presente podem ser personalizados para qualquer serviço, ritual ou plano disponível no catálogo. Entrega digital imediata ou voucher físico para retirada no Maliviê · Validade de 60 dias após a emissão.",
  giftCardMicroCopy: "Voucher físico (retirada no local) ou digital · Validade de 60 dias após a emissão.",
  giftCardTagline: "Mais do que um presente, um momento para ser lembrado.",
  giftCardSubTagline: "Surpreenda alguém especial com uma experiência do Maliviê SPA.",
  giftCardHook: "Poucos sabem dar o presente certo.",
  giftCardForWhom: "O Gift Card do Maliviê é pra quem conhece alguém que cuida de todo mundo e esquece de cuidar de si mesma.",
  giftCardPersonaAmiga: "Aquela amiga que tá exausta mas não para.",
  giftCardPersonaMae: "A mãe resolve tudo e nunca pede nada.",
  giftCardPersonaMulher: "A mulher que você mais admira e que merece muito mais do que mais uma coisa pra guardar em casa.",
  giftCardExperience: "Com o Gift Card do Maliviê, você não dá um presente. Você dá um momento inteiro de bem-estar. Uma experiência que ela vai sentir, guardar na memória e associar ao seu nome para sempre.",
  giftCardChoice: "Ela escolhe o dia. Ela escolhe a experiência. Você fica sendo a pessoa que entendeu o que ela realmente precisava.",
};

export const HEAD_SPA_STEPS: RitualStep[] = [
  {
    number: "01",
    title: "Análise do Couro Cabeludo & Aromaterapia Personalizada",
    subtitle: "Diagnóstico Capilar & Despertar Olfativo",
    description: "Iniciamos com uma avaliação minuciosa das necessidades do seu couro cabeludo e fios, aliada à inalação de sinergias botânicas puras com óleos essenciais que tranquilizam a mente imediatamente.",
    details: [
      "Diagnóstico com microcâmera dermatológica capilar",
      "Escolha intuitiva da sinergia aromaterapêutica (lavanda, alecrim e bergamota)",
      "Respiração guiada com toalhas aquecidas e infusões herbais"
    ],
    sensoryNote: "Notas de lavanda búlgara e cedro sob calor aconchegante."
  },
  {
    number: "02",
    title: "Higienização Profunda & Aplicação de Espuma Densa",
    subtitle: "Dermo-Purificação com Espuma Aveludada",
    description: "Aplicação de espumas botânicas biocompatíveis com textura de nuvem, desobstruindo os folículos pilosos e removendo resíduos acumulados sem agredir a barreira natural de hidratação.",
    details: [
      "Banho de espuma quente com extratos de aloe vera e calêndula",
      "Esfoliação scalp peeling suave com esferas de jojoba",
      "Estímulo tátil relaxante em toda a extensão capilar"
    ],
    sensoryNote: "Toque suave de espuma macia e fragrância verde fresca."
  },
  {
    number: "03",
    title: "Duchas Hídricas Circulares ASMR & Massagem Craniana",
    subtitle: "O Famoso Arco Hídrico do Head Spa Coreano",
    description: "O momento mais aguardado: o arco de água termal morna flui continuamente sobre o couro cabeludo, acompanhado de manobras de acupressão nos pontos motores da cabeça, nuca e têmporas.",
    details: [
      "Cascata contínua do arco hídrico circular com temperatura terapêutica controlada",
      "Massagem craniana profunda para alívio de enxaqueca, bruxismo e tensão cervical",
      "Estímulo sonoro ASMR natural de água corrente que induz ao estado meditativo alfa"
    ],
    sensoryNote: "Som hipnótico de água corrente e sensação de leveza absoluta."
  },
  {
    number: "04",
    title: "Selagem Terapêutica & Reconstrução Capilar",
    subtitle: "Nutrição Celular & Brilho Espelhado",
    description: "Finalização com vapor de ozônio ativado e máscara de nutrição profunda, selando as cutículas e restaurando a vitalidade, flexibilidade e brilho espelhado da raiz às pontas.",
    details: [
      "Máscara reconstrutora rica em aminoácidos e manteiga de murumuru",
      "Vapor de ozônio purificante que potencializa a absorção de nutrientes",
      "Leave-in protetor térmico botânico com secagem delicada e alinhamento"
    ],
    sensoryNote: "Cabelos profundamente sedosos e mente em paz plena."
  }
];

export const SERVICES_LIST: ServiceItem[] = [
  // 1. RELAXAMENTO
  {
    id: 'massagem-relaxante-classica',
    name: 'Massagem Relaxante Clássica',
    tagline: 'Movimentos suaves e contínuos para alívio do estresse',
    category: 'relaxamento',
    categoryLabel: 'Relaxamento',
    duration: "50' ou 80' min",
    price: 'A partir de R$ 219,00',
    priceOptions: [
      { duration: "50' min", price: 'R$ 219,00' },
      { duration: "80' min", price: 'R$ 299,00' }
    ],
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Movimentos suaves e contínuos que ajudam a aliviar o estresse, relaxar o corpo e proporcionar uma profunda sensação de bem-estar.',
    longDescription: 'Uma experiência clássica e profundamente acolhedora de desaceleração. Manobras rítmicas e contínuas que atuam no sistema nervoso simpático, dissolvendo a ansiedade e restabelecendo o fluxo harmônico do organismo sob iluminação âmbar relaxante.',
    image: pedrasQuentesImg,
    popular: true,
    featured: true,
    badge: 'Mais Procurado',
    includedItems: [
      'Aromaterapia inclusa com óleos essenciais botânicos puros',
      'Escalda-pés de boas-vindas cortesia para clientes com antecedência*',
      'Toalhas aquecidas e ambiente com iluminação âmbar (3000K)',
      'Cerimonial do chá e mimos na sala de descanso'
    ],
    ritualSteps: [
      'Escalda-pés aromático com óleos essenciais',
      'Manobras contínuas de deslizamento e amassamento',
      'Descompressão de ombros, costas e membros',
      'Ritual do chá relaxante de despedida'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Massagem Relaxante Clássica',
    priceHint: '50 min: R$ 219,00 · 80 min: R$ 299,00',
  },
  {
    id: 'massagem-pedras-quentes',
    name: 'Massagem com Pedras Quentes',
    tagline: 'Termoterapia vulcânica e relaxamento muscular profundo',
    category: 'relaxamento',
    categoryLabel: 'Relaxamento',
    duration: "50' ou 80' min",
    price: 'A partir de R$ 239,00',
    priceOptions: [
      { duration: "50' min", price: 'R$ 239,00' },
      { duration: "80' min", price: 'R$ 319,00' }
    ],
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'A combinação da massagem com pedras aquecidas ajuda a aliviar tensões musculares e proporcionar um relaxamento ainda mais profundo.',
    longDescription: 'A massagem com pedras quentes entra devagar e vai desfazendo os nós da tensão. O calor das pedras vulcânicas penetra profundamente nas camadas musculares, aliviando o cansaço acumulado e proporcionando a sensação inigualável de derreter na maca.',
    image: pedrasQuentesImg,
    popular: true,
    featured: true,
    badge: 'Termoterapia',
    includedItems: [
      'Aromaterapia botânica personalizada inclusa',
      'Escalda-pés de boas-vindas cortesia para chegada com antecedência*',
      'Aplicação de pedras vulcânicas aquecidas em pontos estratégicos de tensão',
      'Óleos 100% vegetais aquecidos e ritual do chá final'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Massagem com Pedras Quentes',
    priceHint: '50 min: R$ 239,00 · 80 min: R$ 319,00',
  },

  // 2. RELAXAMENTO EXPRESS
  {
    id: 'express-pernas-pes',
    name: 'Relax Express • Pernas e Pés Cansados',
    tagline: 'Alívio da sensação de peso e leveza imediata',
    category: 'relaxamento',
    categoryLabel: 'Relaxamento Express',
    duration: "25' min",
    price: 'R$ 129,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Alivia a sensação de peso e promove leveza para pernas e pés cansados pela rotina diária.',
    longDescription: 'Pausa rápida e revigorante focada em desobstruir a circulação e aliviar o cansaço acumulado nas extremidades inferiores. Perfeita para quem passa muito tempo em pé, pratica atividades físicas ou enfrenta dias intensos.',
    image: spaDosPesImg,
    includedItems: [
      'Aromaterapia descompressiva inclusa',
      'Escalda-pés de boas-vindas cortesia (com antecedência)*',
      'Massagem drenante e revigorante nas panturrilhas e pés',
      'Chá calmante ao término'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Relax Express Pernas e Pés Cansados',
    priceHint: "25' min · R$ 129,00",
  },
  {
    id: 'express-cabeca-pescoco-colo',
    name: 'Relax Express • Cabeça, Pescoço e Colo',
    tagline: 'Ideal para tensão, estresse e dores de cabeça',
    category: 'relaxamento',
    categoryLabel: 'Relaxamento Express',
    duration: "25' min",
    price: 'R$ 129,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Ideal para quem sofre com tensão cervical, estresse acumulado e dores de cabeça.',
    longDescription: 'Foco exclusivo na liberação do trapézio, nuca, têmporas e couro cabeludo. Dissolve contraturas e restaura a clareza mental em uma pausa estratégica de 25 minutos.',
    image: headSpaDetalheImg,
    includedItems: [
      'Aromaterapia com lavanda e alecrim',
      'Escalda-pés de boas-vindas cortesia (com antecedência)*',
      'Acupressão e manobras cranianas na nuca e ombros',
      'Chá artesanal quentinho'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Relax Express Cabeça, Pescoço e Colo',
    priceHint: "25' min · R$ 129,00",
  },
  {
    id: 'express-costas-bracos',
    name: 'Relax Express • Costas e Braços',
    tagline: 'Alívio das tensões musculares causadas pela rotina',
    category: 'relaxamento',
    categoryLabel: 'Relaxamento Express',
    duration: "25' min",
    price: 'R$ 129,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Ideal para aliviar tensões musculares dorsais e nos membros superiores causadas pela postura e rotina de trabalho.',
    longDescription: 'Trabalho focado nas escápulas, coluna torácica e lombar. Promove descompressão muscular instantânea para renovar as energias durante uma pausa no meio do dia.',
    image: malivieBandejaReflexaoImg,
    includedItems: [
      'Aromaterapia personalizada inclusa',
      'Escalda-pés de boas-vindas cortesia (com antecedência)*',
      'Descompressão miofascial localizada em costas e braços',
      'Chá digestivo'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Relax Express Costas e Braços',
    priceHint: "25' min · R$ 129,00",
  },

  // 3. TERAPIAS CORPORAIS
  {
    id: 'massagem-terapeutica',
    name: 'Massagem Terapêutica',
    tagline: 'Técnica direcionada ao alívio muscular e mobilidade',
    category: 'terapias',
    categoryLabel: 'Terapias Corporais',
    duration: "50' ou 80' min",
    price: 'A partir de R$ 219,00',
    priceOptions: [
      { duration: "50' min", price: 'R$ 219,00' },
      { duration: "80' min", price: 'R$ 299,00' }
    ],
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Técnica direcionada às áreas de maior tensão, promovendo alívio muscular, melhora da mobilidade e bem-estar físico.',
    longDescription: 'Aplicação de manobras mais profundas e precisas onde seu corpo mais pede socorro. Alivia pontos de gatilho miofasciais, rigidez postural e sobrecargas articulares com máxima maestria e acolhimento.',
    image: pedrasQuentesImg,
    popular: true,
    includedItems: [
      'Aromaterapia terapêutica inclusa',
      'Escalda-pés de boas-vindas cortesia (com antecedência)*',
      'Manobras de liberação miofascial e pressão modulada',
      'Toalhas aquecidas e chá revigorante'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Massagem Terapêutica',
    priceHint: '50 min: R$ 219,00 · 80 min: R$ 299,00',
  },
  {
    id: 'metodo-gestante',
    name: 'Método Gestante',
    tagline: 'Cuidado personalizado e seguro para cada fase da gestação',
    category: 'terapias',
    categoryLabel: 'Terapias Corporais',
    duration: "50' ou 80' min",
    price: 'A partir de R$ 219,00',
    priceOptions: [
      { duration: "50' min", price: 'R$ 219,00' },
      { duration: "80' min", price: 'R$ 299,00' }
    ],
    badge: 'Especial Gestantes',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Experiência desenvolvida especialmente para gestantes, combinando técnicas de relaxamento, drenagem e cuidados personalizados conforme cada fase.',
    longDescription: 'Posicionamento acolhedor com almofadas especiais para conforto absoluto da mamãe e do bebê. Estimula a redução de edemas e inchaços nas pernas, alivia tensões lombares e acolhe com toda segurança e carinho.',
    image: malivieRoupaoChinelosImg,
    includedItems: [
      'Posicionamento confortável e seguro com apoios anatômicos',
      'Escalda-pés de boas-vindas cortesia (com antecedência)*',
      'Drenagem suave e manobras relaxantes adaptadas',
      'Óleos 100% seguros e neutros para gestação'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Método Gestante',
    priceHint: '50 min: R$ 219,00 · 80 min: R$ 299,00',
  },
  {
    id: 'protocolo-anti-dor',
    name: 'Protocolo Anti-Dor Maliviê',
    tagline: 'Combinação terapêutica personalizada para dores e tensões',
    category: 'terapias',
    categoryLabel: 'Terapias Corporais',
    duration: "80' min",
    price: 'R$ 369,00',
    badge: 'Protocolo Avançado',
    popular: true,
    featured: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Combina diferentes técnicas terapêuticas para auxiliar no alívio de dores musculares, tensões e limitações de movimento.',
    longDescription: 'Atendimento personalizado de acordo com as necessidades de cada cliente. Pode incluir Massagem Terapêutica, Liberação Miofascial, Ventosaterapia, Alongamentos e técnicas complementares conforme avaliação individual. Indicado para dores musculares recorrentes, tensão cervical e lombar, sobrecarga física, limitação de movimento e recuperação muscular.',
    image: ritualBoasVindasImg,
    includedItems: [
      'Massagem Terapêutica & Liberação Miofascial profunda',
      'Ventosaterapia para descompressão tecidual',
      'Alongamentos passivos e técnicas complementares',
      'Aromaterapia e escalda-pés de boas-vindas cortesia*'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Protocolo Anti-Dor Maliviê',
    priceHint: "80' min · R$ 369,00",
  },

  // 4. BEM-ESTAR CORPORAL
  {
    id: 'drene-modele',
    name: 'Drene Modele Assinatura Maliviê',
    tagline: 'Drenagem e modelagem corporal para leveza e definição',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Corporal',
    duration: "50' ou 80' min",
    price: 'A partir de R$ 219,00',
    priceOptions: [
      { duration: "50' min", price: 'R$ 219,00' },
      { duration: "80' min", price: 'R$ 299,00' }
    ],
    badge: 'Assinatura Maliviê',
    popular: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Protocolo exclusivo que une drenagem e modelagem corporal para promover leveza, redução de inchaço e definição do contorno.',
    longDescription: 'Combina manobras vigorosas de modelagem com o ritmo drenante que ativa os linfonodos. Elimina a retenção hídrica, traz sensação imediata de desinchaço e esculpe as curvas corporais com delicadeza e eficiência.',
    image: malivieBandejaReflexaoImg,
    includedItems: [
      'Drenagem linfática manual e modelagem assinatura',
      'Cosmecêuticos dermocosméticos de alta performance',
      'Aromaterapia e escalda-pés cortesia (com antecedência)*',
      'Chá drenante especial ao término'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Drene Modele Assinatura Maliviê',
    priceHint: '50 min: R$ 219,00 · 80 min: R$ 299,00',
  },
  {
    id: 'esfoliacao-corporal',
    name: 'Esfoliação Corporal Renovadora',
    tagline: 'Renovação celular suave, maciez sedosa e luminosidade',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Corporal',
    duration: "30' min",
    price: 'R$ 109,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Renova a pele através da remoção suave das células mortas, promovendo maciez e luminosidade imediata.',
    longDescription: 'Remove impurezas e estimula a microcirculação periférica com esfoliantes botânicos nutritivos, deixando a pele incrivelmente aveludada e pronta para receber hidratações profundas.',
    image: malivieBandejaReflexaoImg,
    includedItems: [
      'Esfoliante botânico com microgrãos naturais nutritivos',
      'Toalhas aquecidas aromáticas',
      'Finalização com loção hidratante perfumada',
      'Aromaterapia e chá de acolhimento'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Esfoliação Corporal Renovadora',
    priceHint: "30' min · R$ 109,00",
  },
  {
    id: 'spa-banho-gold',
    name: 'Spa Banho Gold',
    tagline: 'Experiência completa com clareamento de pelos e perfumaria',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Corporal',
    duration: "90' min",
    price: 'R$ 279,00',
    badge: 'Pele Dourada',
    popular: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Experiência completa com clareamento dos pelos, esfoliação corporal, hidratação profunda e perfumaria fina.',
    longDescription: 'O verdadeiro ritual de deusa. Clareamento delicado e sem pinicar dos pelos corporais (banho de lua nobre), seguido de esfoliação aromática completa, nutrição intensa e bruma de perfumaria sensorial que deixa o corpo luminoso e perfumado o dia todo.',
    image: daySpaChaImg,
    includedItems: [
      'Clareamento dos pelos com proteção cutânea nutritiva',
      'Esfoliação corporal completa com enxágue relaxante',
      'Hidratação profunda e perfumaria exclusiva Maliviê',
      'Aromaterapia e escalda-pés cortesia*'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Spa Banho Gold',
    priceHint: "90' min · R$ 279,00",
  },

  // 5. BEM-ESTAR FACIAL
  {
    id: 'drenagem-facial',
    name: 'Drenagem Facial Revitalizante',
    tagline: 'Redução de inchaço e luminosidade imediata',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Facial',
    duration: "25' min",
    price: 'R$ 99,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Reduz o inchaço, melhora a circulação e promove uma aparência mais leve e revitalizada para a pele do rosto.',
    longDescription: 'Toques sutis e precisos ao longo das cadeias linfáticas do rosto, olhos e pescoço. Drena bolsas perioculares, desinflama o contorno facial e estimula o viço natural da pele.',
    image: headSpaDetalheImg,
    includedItems: [
      'Higienização suave com tônico botânico',
      'Drenagem linfática manual facial e pescoço',
      'Massagem descompressiva de mandíbula e olhos',
      'Bruma termal refrescante'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Drenagem Facial',
    priceHint: "25' min · R$ 99,00",
  },
  {
    id: 'revitalizacao-facial',
    name: 'Revitalização Facial',
    tagline: 'Nutrição essencial para uma pele iluminada e saudável',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Facial',
    duration: "35' min",
    price: 'R$ 149,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Cuidados essenciais para uma pele mais saudável, hidratada e iluminada com ativos botânicos.',
    longDescription: 'Tratamento nutritivo com máscara facial rica em antioxidantes, ativos calmantes e massagem lifting delicada. Restaura a barreira protetora da pele após dias exaustivos ou exposição climática.',
    image: headSpaTerapeutaImg,
    includedItems: [
      'Limpeza superficial e tonificação botânica',
      'Aplicação de máscara hidro-nutritiva iluminadora',
      'Massagem lifting sensorial facial',
      'Finalização com sérum antioxidante e protetor'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Revitalização Facial',
    priceHint: "35' min · R$ 149,00",
  },
  {
    id: 'limpeza-de-pele',
    name: 'Limpeza de Pele Profunda',
    tagline: 'Cuidado facial completo com tecnologias e relaxamento',
    category: 'corporal-facial',
    categoryLabel: 'Bem-Estar Facial',
    duration: "90' min",
    price: 'R$ 239,00',
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés de boas-vindas cortesia*',
    description: 'Cuidado facial completo que une limpeza profunda, tecnologias e relaxamento para uma pele saudável e revitalizada.',
    longDescription: 'Higienização, emoliência morna, extração delicada de cravos e comedões, aplicação de alta frequência antisséptica e máscara calmante regeneradora sob toques relaxantes.',
    image: headSpaDetalheImg,
    includedItems: [
      'Higienização profunda, esfoliação suave e emoliência',
      'Extração minuciosa e sem agressão à pele',
      'Tecnologia antisséptica/alta frequência purificante',
      'Máscara calmante refrescante e massagem facial'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Limpeza de Pele Profunda',
    priceHint: "90' min · R$ 239,00",
  },

  // 6. HEAD SPA
  {
    id: 'head-spa-essencial',
    name: 'Head Spa Essencial',
    tagline: 'Tradição oriental, produtos asiáticos e ozonioterapia capilar',
    category: 'head-spa',
    categoryLabel: 'Head Spa',
    duration: "45' min",
    price: 'R$ 239,00',
    badge: 'Ritual Oriental',
    popular: true,
    featured: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés cortesia • Adicione Spa dos Pés por 50%',
    description: 'Inspirado nos rituais orientais, combina relaxamento profundo, produtos asiáticos e ozonioterapia para cuidar do couro cabeludo e dos fios.',
    longDescription: 'O autêntico ritual capilar oriental que desacelera a mente. Cascata contínua do arco hídrico com água termal morna, espuma densa desintoxicante, vapor de ozônio purificante e massagem no couro cabeludo, nuca e têmporas. Finalizado com secagem suave.',
    image: headSpaTerapeutaImg,
    includedItems: [
      'Aromaterapia e diagnóstico do couro cabeludo',
      'Espuma densa purificante e cascata do arco hídrico ASMR',
      'Vapor de ozônio e nutrição capilar profunda com produtos asiáticos',
      'Secagem delicada dos fios inclusa ao final',
      'Condição especial: Adicione o Spa dos Pés por 50% do valor!'
    ],
    ritualSteps: [
      'Diagnóstico capilar e aromaterapia olfativa',
      'Espuma densa e esfoliação suave do couro cabeludo',
      'Arco hídrico circular com água termal morna e massagem craniana',
      'Ozonioterapia capilar, nutrição e secagem finalizadora'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Head Spa Essencial',
    priceHint: "45' min · R$ 239,00",
  },
  {
    id: 'head-spa-harmonia',
    name: 'Head Spa Harmonia',
    tagline: 'Head Spa oriental completo combinado com revitalização facial',
    category: 'head-spa',
    categoryLabel: 'Head Spa',
    duration: "80' min",
    price: 'R$ 349,00',
    badge: 'Capilar + Facial',
    popular: true,
    featured: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés cortesia • Adicione Spa dos Pés por 50%',
    description: 'Todos os benefícios do Head Spa Essencial combinados a uma revitalização facial profunda para harmonia total de corpo e mente.',
    longDescription: 'Uma sincronia sublime entre a mente, os fios e a pele do rosto. Enquanto o couro cabeludo recebe a hidroterapia relaxante do arco hídrico com ozônio, seu rosto é agraciado com máscara hidro-nutritiva e massagem facial anti-estresse.',
    image: headSpaArcoDouradoImg,
    includedItems: [
      'Todos os passos do Head Spa Essencial com arco hídrico',
      'Revitalização facial completa com máscara iluminadora',
      'Massagem craniana, facial, nuca e trapézio',
      'Secagem dos fios e degustação de chá relaxante',
      'Condição especial: Adicione o Spa dos Pés por 50% do valor!'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Head Spa Harmonia',
    priceHint: "80' min · R$ 349,00",
  },
  {
    id: 'head-spa-plenitude',
    name: 'Head Spa Plenitude',
    tagline: 'Head Spa, facial, esfoliação corporal e pedras quentes',
    category: 'head-spa',
    categoryLabel: 'Head Spa',
    duration: "160' min",
    price: 'R$ 577,00',
    badge: 'Experiência Suprema',
    popular: true,
    featured: true,
    courtesyNote: 'Aromaterapia Inclusa • Escalda-pés cortesia • Adicione Spa dos Pés por 50%',
    description: 'Head Spa, revitalização facial, esfoliação corporal e massagem com pedras quentes em um único ritual magistral de 160 minutos.',
    longDescription: 'O ápice da desaceleração no Maliviê SPA. Uma imersão sensorial de quase 3 horas que renova você da cabeça aos pés. Começa com esfoliação corporal renovadora, avança pela termoterapia profunda das pedras quentes, revitalização facial e culmina no sublime arco hídrico do Head Spa oriental.',
    image: headSpaJatosImg,
    includedItems: [
      'Head Spa completo com hidroterapia e produtos asiáticos',
      'Revitalização Facial com máscara antioxidante',
      'Massagem relaxante profunda com pedras quentes',
      'Esfoliação corporal renovadora',
      'Secagem dos fios e cerimonial do chá nobre',
      'Condição especial: Adicione o Spa dos Pés por 50% do valor!'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Head Spa Plenitude',
    priceHint: "160' min · R$ 577,00",
  },

  // 7. SPA DOS PÉS
  {
    id: 'spa-dos-pes-calmante',
    name: 'Spa dos Pés Calmante',
    tagline: 'Imersão aromática morna, esfoliação, reflexologia e chá com biscoitos',
    category: 'spa-pes',
    categoryLabel: 'Spa dos Pés',
    duration: "30' min",
    price: 'R$ 159,00',
    courtesyNote: 'Aromaterapia Inclusa',
    description: 'Uma experiência acolhedora que une imersão aromática dos pés em água morna com sais, esfoliação, reflexologia podal e massagem para aliviar o cansaço dos pés e panturrilhas, acompanhada de chá e biscoitos.',
    longDescription: 'Seus pés sustentam todo o seu dia. Esse momento acolhedor alivia a fadiga das pernas, amacia a pele e envia sinais de puro relaxamento para todo o organismo através dos pontos reflexológicos.',
    image: spaDosPesImg,
    popular: true,
    includedItems: [
      'Imersão aromática em água morna enriquecida com sais minerais',
      'Esfoliação podal com grãos botânicos hidratantes',
      'Reflexologia podal e massagem relaxante nas panturrilhas',
      'Acompanhado de chá quentinho e biscoitos artesanais'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Spa dos Pés Calmante',
    priceHint: "30' min · R$ 159,00",
  },
  {
    id: 'spa-dos-pes-ritual',
    name: 'Spa dos Pés Ritual Completo',
    tagline: 'Todos os benefícios do Calmante somados ao cuidado com as mãos',
    category: 'spa-pes',
    categoryLabel: 'Spa dos Pés',
    duration: "50' min",
    price: 'R$ 239,00',
    badge: 'Pés & Mãos',
    courtesyNote: 'Aromaterapia Inclusa',
    description: 'Todos os benefícios do Spa dos Pés Calmante, acrescidos de cuidados especiais para as mãos, para uma experiência completa de bem-estar.',
    longDescription: 'Cuidado integrado para as extremidades que mais trabalham. Imersão dos pés, esfoliação, reflexologia, e massagem hidratante relaxante para mãos e braços, acompanhada de chá e delícias.',
    image: spaDosPesImg,
    includedItems: [
      'Imersão aromática com sais e ervas relaxantes',
      'Esfoliação e reflexologia podal profunda',
      'Cuidados especiais e massagem nutritiva para as mãos',
      'Degustação de chá artesanal com biscoitos'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Spa dos Pés Ritual Completo',
    priceHint: "50' min · R$ 239,00",
  },

  // 8. RITUAIS DE DAY SPA
  {
    id: 'day-spa-ambar',
    name: 'Day Spa • Ritual Âmbar',
    tagline: 'Spa dos Pés Calmante + Massagem Express à sua escolha',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day Spa',
    duration: '55 min',
    price: 'Individual: R$ 249,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 249,00' },
      { duration: 'Pessoa Adicional', price: '+R$ 199,00' }
    ],
    courtesyNote: 'Aromaterapia Inclusa • Degustação da temporada • Até 5 pessoas',
    description: '1. Spa dos Pés Calmante • 2. Massagem Express (à escolha). Todos os rituais incluem aromaterapia e degustação da temporada. Disponível para até 5 pessoas simultaneamente.',
    longDescription: 'Uma pausa sob medida para quem precisa recarregar o ânimo. Combina a acolhida do Spa dos Pés com 25 minutos de massagem express focada na sua principal necessidade (pernas/pés, costas/braços ou cabeça/colo).',
    image: daySpaChaImg,
    includedItems: [
      '1. Spa dos Pés Calmante completo',
      '2. Massagem Express personalizada (à escolha)',
      'Degustação da temporada inclusa',
      'Disponível para até 5 pessoas simultaneamente'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day Spa Ritual Âmbar',
    priceHint: 'Individual: R$ 249,00 · Pessoa adicional: +R$ 199,00',
  },
  {
    id: 'day-spa-safira',
    name: 'Day Spa • Ritual Safira',
    tagline: 'Spa dos Pés Calmante + Massagem Relaxante Clássica',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day Spa',
    duration: '80 min',
    price: 'Individual: R$ 339,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 339,00' },
      { duration: 'Pessoa Adicional', price: '+R$ 269,00' }
    ],
    courtesyNote: 'Aromaterapia Inclusa • Degustação da temporada • Até 5 pessoas',
    description: '1. Spa dos Pés Calmante • 2. Massagem Relaxante Clássica de corpo inteiro. Todos os rituais incluem aromaterapia e degustação da temporada. Disponível para até 5 pessoas simultaneamente.',
    longDescription: 'A harmonia perfeita entre o alívio das extremidades e a tranquilidade de uma massagem corporal relaxante completa. Ideal para desconectar do estresse e revigorar os sentidos.',
    image: daySpaChaImg,
    popular: true,
    includedItems: [
      '1. Spa dos Pés Calmante com reflexologia',
      '2. Massagem Relaxante Clássica de corpo inteiro',
      'Aromaterapia com sinergias botânicas e toalhas quentes',
      'Degustação da temporada e atendimento de até 5 pessoas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day Spa Ritual Safira',
    priceHint: 'Individual: R$ 339,00 · Pessoa adicional: +R$ 269,00',
  },
  {
    id: 'day-spa-esmeralda',
    name: 'Day Spa • Ritual Esmeralda',
    tagline: 'Spa dos Pés + Pedras Quentes + Massagem Craniana',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day Spa',
    duration: '105 min',
    price: 'Individual: R$ 479,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 479,00' },
      { duration: 'Pessoa Adicional', price: '+R$ 369,00' }
    ],
    badge: 'Mais Desejado',
    popular: true,
    featured: true,
    courtesyNote: 'Aromaterapia Inclusa • Degustação da temporada • Até 5 pessoas',
    description: '1. Spa dos Pés Calmante • 2. Massagem relaxante com Pedras Quentes • 3. Massagem Craniana. Todos os rituais incluem aromaterapia e degustação da temporada. Disponível para até 5 pessoas simultaneamente.',
    longDescription: 'Quase duas horas de imersão revigorante. O calor das pedras vulcânicas derrete a tensão muscular das costas e pernas, enquanto a massagem craniana desativa a mente hiperativa.',
    image: pedrasQuentesImg,
    includedItems: [
      '1. Spa dos Pés Calmante com sais e reflexologia',
      '2. Massagem relaxante profunda com pedras quentes',
      '3. Massagem craniana e cervical descompressiva',
      'Degustação da temporada e aromaterapia inclusas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day Spa Ritual Esmeralda',
    priceHint: 'Individual: R$ 479,00 · Pessoa adicional: +R$ 369,00',
  },
  {
    id: 'day-spa-citrino',
    name: 'Day Spa • Ritual Citrino',
    tagline: 'Esfoliação, Spa dos Pés Detox, Drene Modele, Facial e Soda Italiana',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day Spa',
    duration: '145 min',
    price: 'Individual: R$ 569,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 569,00' },
      { duration: 'Pessoa Adicional', price: '+R$ 449,00' }
    ],
    badge: 'Renovação & Leveza',
    courtesyNote: 'Degustação: Soda italiana com taça de frutas • Até 5 pessoas',
    description: '1. Esfoliação Corporal • 2. Spa dos Pés Detox • 3. Drene Modele Assinatura Maliviê • 4. Revitalização Facial + Drenagem Facial. Degustação de soda italiana com taça de frutas. Sugestão: Combine com nosso Spa Banho Gold.',
    longDescription: 'Um ritual completo de renovação estética e sensorial. Remove toxinas corporais, estimula o sistema linfático e devolve o viço radiante à pele do rosto e corpo, acompanhado de soda italiana refrescante.',
    image: ritualBoasVindasImg,
    includedItems: [
      '1. Esfoliação Corporal com grãos nutritivos',
      '2. Spa dos Pés Detox purificante',
      '3. Drene Modele Assinatura Maliviê',
      '4. Revitalização Facial + Drenagem Facial',
      'Degustação especial de soda italiana com taça de frutas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day Spa Ritual Citrino',
    priceHint: 'Individual: R$ 569,00 · Pessoa adicional: +R$ 449,00',
  },
  {
    id: 'day-spa-diamante',
    name: 'Day Spa • Ritual Diamante',
    tagline: 'O ritual máximo: Pedras 80’, Craniana, Imersão e Espumante com Fondue',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day Spa',
    duration: '180 min',
    price: 'Individual: R$ 749,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 749,00' },
      { duration: 'Pessoa Adicional', price: '+R$ 639,00' }
    ],
    badge: 'Experiência Diamante',
    popular: true,
    featured: true,
    courtesyNote: 'Degustação: Espumante com fondue de chocolate e frutas • Até 5 pessoas',
    description: '1. Esfoliação Corporal • 2. Spa dos Pés Premium • 3. Massagem Relaxante com Pedras 80’ • 4. Massagem Craniana • 5. Banho de Imersão Terapêutico. Degustação de espumante com fondue de chocolate e frutas.',
    longDescription: 'Três horas da mais pura e inesquecível celebração do autocuidado. Uma jornada sensorial que reúne todos os mimos do Maliviê e culmina em um banho de banheira aquecido com taça de espumante e fondue de chocolate com frutas selecionadas.',
    image: daySpaChaImg,
    includedItems: [
      '1. Esfoliação Corporal renovadora',
      '2. Spa dos Pés Premium com cuidados especiais',
      '3. Massagem Relaxante com Pedras Quentes (80 min)',
      '4. Massagem Craniana descompressiva',
      '5. Banho de Imersão Terapêutico aquecido',
      'Degustação de espumante com fondue de chocolate e frutas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day Spa Ritual Diamante',
    priceHint: 'Individual: R$ 749,00 · Pessoa adicional: +R$ 639,00',
  },

  // 9. RITUAIS ESPECIAIS (OCASIÕES MARCANTES)
  {
    id: 'ritual-dois-coracoes',
    name: 'Ritual Dois Corações • Day Spa Casal',
    tagline: 'Relaxamento e conexão profunda para celebrar o amor',
    category: 'especiais',
    categoryLabel: 'Rituais Especiais',
    duration: '110 min',
    price: 'R$ 749,00 o casal',
    badge: 'Experiência a Dois',
    popular: true,
    featured: true,
    courtesyNote: 'Degustação: Vinho com chocolates finos',
    description: 'Momentos de relaxamento e conexão para celebrar o amor: Spa dos Pés para o casal • Massagem à escolha (50 min) • Banho de Imersão Romântico • Degustação de vinho com chocolates.',
    longDescription: 'Uma pausa mágica a dois. Desfrutem lado a lado de escalda-pés relaxante, massagem corporal privativa e um brinde apaixonado em banheira de imersão com vinho e chocolates refinados.',
    image: daySpaChaImg,
    includedItems: [
      'Spa dos Pés acolhedor para o casal',
      'Massagem corporal à escolha de 50 minutos para cada',
      'Banho de Imersão Romântico aquecido com sais aromáticos',
      'Degustação de vinho fino com seleção de chocolates'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Ritual Dois Corações Casal',
    priceHint: '110 min · R$ 749,00 o casal',
  },
  {
    id: 'kids-spa',
    name: 'Kids Spa • Experiência Infantil',
    tagline: 'Relaxamento e diversão desenvolvido especialmente para crianças',
    category: 'especiais',
    categoryLabel: 'Rituais Especiais',
    duration: '70 min',
    price: 'Individual: R$ 249,00',
    priceOptions: [
      { duration: 'Individual', price: 'R$ 249,00' },
      { duration: 'Criança Adicional', price: '+R$ 229,00' }
    ],
    badge: 'Infantil & Afeto',
    courtesyNote: 'Degustação especial personalizada',
    description: 'Spa dos Pés Divertido • Massagem Relaxante Kids • Máscara Facial hipoalergênica • Degustação especial personalizada.',
    longDescription: 'Um momento de relaxamento e encanto com todo o carinho e delicadeza. Procedimentos adaptados com cosméticos 100% infantis e hipoalergênicos para uma tarde inesquecível de diversão e bem-estar.',
    image: malivieBandejaReflexaoImg,
    includedItems: [
      'Spa dos Pés Divertido com borbulhas e cores suaves',
      'Massagem Relaxante Kids com toques leves e gentis',
      'Máscara facial hidratante hipoalergênica',
      'Degustação personalizada com suquinhos e guloseimas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Kids Spa',
    priceHint: 'Individual: R$ 249,00 · Criança adicional: +R$ 229,00',
  },
  {
    id: 'ritual-aniversario',
    name: 'Ritual de Aniversário',
    tagline: 'Celebre seu novo ciclo com bolo, espumante e Head Spa',
    category: 'especiais',
    categoryLabel: 'Rituais Especiais',
    duration: '155 min',
    price: 'De R$ 789 por R$ 649,00',
    priceOptions: [
      { duration: '155 min', price: 'R$ 649,00', originalPrice: 'R$ 789,00' }
    ],
    badge: 'Desconto Especial',
    popular: true,
    featured: true,
    courtesyNote: 'Degustação: Mini bolo de aniversário e espumante • Foto Polaroid de recordação',
    description: 'Celebre seu dia com uma experiência criada especialmente para você: Spa dos Pés • Massagem à escolha (50 min) • Head Spa Coreano • Banho de Imersão • Foto Polaroid • Mini bolo de aniversário e espumante.',
    longDescription: 'O melhor presente para o seu aniversário. Mais de duas horas e meia dedicadas a você: massagem, arco de água do Head Spa, banho de imersão terapêutico, com direito a soprar a velinha com mini bolo, brindar espumante e levar uma foto polaroid para a vida.',
    image: headSpaTerapeutaImg,
    includedItems: [
      'Spa dos Pés aromático de boas-vindas',
      'Massagem à escolha de 50 minutos',
      'Head Spa Coreano completo com hidroterapia',
      'Banho de Imersão Terapêutico aquecido',
      'Foto instantânea Polaroid para guardar de recordação',
      'Degustação com mini bolo de aniversário e taça de espumante'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Ritual de Aniversário',
    priceHint: '155 min · De R$ 789 por R$ 649,00',
  },
  {
    id: 'ritual-perola-noiva',
    name: 'Ritual Pérola • Dia da Noiva',
    tagline: 'A preparação mais completa e sublime para o seu grande dia',
    category: 'especiais',
    categoryLabel: 'Rituais Especiais',
    duration: '310 min',
    price: 'R$ 957,00',
    badge: 'Dia da Noiva',
    popular: true,
    featured: true,
    courtesyNote: 'Degustação: Espumante e fondue de chocolate com frutas selecionadas',
    description: 'Uma experiência completa de cuidado e preparação para o seu grande dia: Esfoliação Corporal Natural • Spa dos Pés • Massagem à escolha (50 min) • Head Spa Coreano • Revitalização Facial • Spa Banho Gold • Banho de Imersão • Espumante e fondue.',
    longDescription: 'Mais de 5 horas de puro encanto e cuidado integral. A noiva chega e deixa toda a ansiedade dos preparativos lá fora. Cuidados capilares, banho gold, massagem, banheira e alta gastronomia para entrar radiante e serena no altar.',
    image: daySpaChaImg,
    includedItems: [
      'Esfoliação Corporal Natural e Spa Banho Gold',
      'Spa dos Pés e Massagem corporal relaxante (50 min)',
      'Head Spa Coreano com cascata e ozonioterapia',
      'Revitalização Facial para viço e preparação da pele',
      'Banho de Imersão Terapêutico aquecido',
      'Degustação de espumante e fondue de chocolate com frutas selecionadas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Ritual Pérola Dia da Noiva',
    priceHint: '310 min · R$ 957,00',
  },

  // 10. PLANOS DE SESSÕES & HORAS
  {
    id: 'planos-sessoes',
    name: 'Planos de Sessões de Bem-Estar',
    tagline: 'Mantenha seu bem-estar em dia com o melhor custo-benefício',
    category: 'planos-horas',
    categoryLabel: 'Planos de Sessões',
    duration: '50 min por sessão',
    price: 'A partir de R$ 749,00',
    priceOptions: [
      { duration: '4 sessões (50 min)', price: 'R$ 749,00', note: 'R$ 187,25 por sessão' },
      { duration: '8 sessões (50 min)', price: 'R$ 1.399,00', note: 'R$ 174,87 por sessão' },
      { duration: '12 sessões (50 min)', price: 'R$ 1.599,00', note: '⭐ R$ 133,25 por sessão (Melhor Custo-benefício)' }
    ],
    badge: '⭐ Melhor Custo-benefício',
    popular: true,
    featured: true,
    courtesyNote: 'Validade de 90 dias após a contratação • 4 técnicas à escolha',
    description: 'Escolha a técnica que melhor atende às suas necessidades: Drene Modele Assinatura Maliviê, Massagem Relaxante, Massagem Terapêutica ou Massagem com Pedras (50 min por sessão). Válido por 90 dias.',
    longDescription: 'Para quem entende que o autocuidado é um compromisso regular com a saúde física e mental. As sessões podem ser distribuídas entre as principais técnicas do cardápio e agendadas com prioridade ao longo de até 90 dias.',
    image: malivieRoupaoChinelosImg,
    includedItems: [
      'Técnicas: Drene Modele, Relaxante, Terapêutica ou Pedras Quentes',
      '50 minutos dedicados por sessão',
      'Validade estendida de 90 dias após a contratação',
      'Prioridade de agendamento e mimos de recepção'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Planos de Sessões de Bem-Estar',
    priceHint: '4 sessões R$ 749 · 8 sessões R$ 1.399 · 12 sessões R$ 1.599',
  },
  {
    id: 'planos-horas',
    name: 'Planos de Horas • Total Liberdade',
    tagline: 'Utilize suas horas em qualquer serviço do catálogo em até 4x',
    category: 'planos-horas',
    categoryLabel: 'Planos de Horas',
    duration: '4h, 8h ou 12h acumulativas',
    price: 'A partir de R$ 799,00 (2x R$ 399,50)',
    priceOptions: [
      { duration: '4 Horas', price: 'R$ 799,00', note: '2x de R$ 399,50 (R$ 199,75/h)' },
      { duration: '8 Horas', price: 'R$ 1.489,00', note: '3x de R$ 496,33 (R$ 186,15/h)' },
      { duration: '12 Horas', price: 'R$ 1.949,00', note: '4x de R$ 487,25 (R$ 162,40/h)' }
    ],
    badge: 'Parcelamento sem Juros',
    popular: true,
    courtesyNote: 'Crédito flexível para qualquer procedimento do catálogo',
    description: 'Mais liberdade para viver o bem-estar do seu jeito. Utilize seu crédito de horas em qualquer serviço do catálogo e monte sua jornada personalizada. Parcelamento em até 4x.',
    longDescription: 'A forma mais inteligente e flexível de viver o Maliviê. Você adquire um banco de horas com tarifa hora promocional e vai consumindo nos procedimentos que desejar no momento: Head Spa, massagens corporais ou Day Spa.',
    image: daySpaChaImg,
    includedItems: [
      'Crédito flexível de horas para qualquer serviço do catálogo',
      'Opções de 4h, 8h e 12h com parcelamento em até 4x sem juros',
      'Pode fracionar entre Head Spa, Day Spa e Massagens',
      'Atendimento prioritário com as terapeutas Andressa e Luciana'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Planos de Horas Total Liberdade',
    priceHint: '4h: R$ 799 · 8h: R$ 1.489 · 12h: R$ 1.949',
  },

  // 11. COMPLEMENTOS
  {
    id: 'banho-imersao-terapeutico',
    name: 'Banho de Imersão Terapêutico',
    tagline: 'Relaxamento em água aquecida, sais aromáticos e brinde de espumante',
    category: 'complementos',
    categoryLabel: 'Complementos',
    duration: "30' min",
    price: 'R$ 129,00 (por pessoa)',
    courtesyNote: 'Aromaterapia inclusa • Brinde de espumante',
    description: 'Um momento de relaxamento em água aquecida, com sais de banho, aromaterapia e um brinde de espumante para acompanhar.',
    longDescription: 'Imersão revigorante em banheira aquecida individual enriquecida com sais minerais e óleos botânicos. Perfeito para desacelerar o corpo e brindar com espumante em atmosfera de absoluta tranquilidade.',
    image: daySpaChaImg,
    includedItems: [
      'Banheira aquecida com sais aromáticos relaxantes',
      'Aromaterapia botânica com óleos essenciais puros',
      'Brinde de espumante gelado',
      'Toalhas aquecidas e roupão confortável'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Banho de Imersão Terapêutico',
    priceHint: "30' min · R$ 129,00 (por pessoa)",
  },
  {
    id: 'pindas-aromaticas',
    name: 'Pindas Aromáticas',
    tagline: 'Bolsas aquecidas com ervas aplicadas durante a massagem',
    category: 'complementos',
    categoryLabel: 'Complementos',
    duration: 'Durante a massagem',
    price: '+R$ 49,00',
    courtesyNote: 'Técnica complementar para qualquer massagem',
    description: 'Bolsas aquecidas com ervas aromáticas aplicadas durante a massagem para promover conforto, relaxamento e bem-estar.',
    longDescription: 'Técnica oriental milenar com saquinhos de algodão aquecidos repletos de ervas medicinais aromáticas e especiarias. Pressionadas suavemente ao longo do corpo, aliviam pontos de tensão e aquecem a musculatura.',
    image: malivieBandejaReflexaoImg,
    includedItems: [
      'Bolsas aquecidas de ervas aromáticas medicinais',
      'Aplicação harmonizada com manobras de massagem',
      'Alívio térmico e aromático profundo',
      'Compatível com qualquer massagem do menu'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Pindas Aromáticas (Complemento)',
    priceHint: '+R$ 49,00 durante a massagem',
  },
  {
    id: 'ventosaterapia',
    name: 'Ventosaterapia',
    tagline: 'Descompressão tecidual e alívio localizado de tensões',
    category: 'complementos',
    categoryLabel: 'Complementos',
    duration: "25' min",
    price: 'R$ 79,00',
    courtesyNote: 'Técnica complementar para alívio muscular',
    description: 'Técnica complementar que auxilia no alívio das tensões musculares e potencializa os benefícios da massagem.',
    longDescription: 'Aplicação de campânulas de sucção que promovem a oxigenação dos tecidos musculares, liberam fáscias e desfazem nós de tensão causados pelo estresse e pela rotina postural.',
    image: ritualBoasVindasImg,
    includedItems: [
      'Descompressão a vácuo em áreas de tensão e contratura',
      'Estímulo da circulação e oxigenação celular',
      'Potencializa o efeito relaxante ou terapêutico',
      'Toalhas aquecidas e acolhimento personalizado'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Ventosaterapia (Complemento)',
    priceHint: "25' min · R$ 79,00",
  }
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    id: 'rev-google-millena',
    author: 'millenavv',
    location: 'Núcleo Bandeirante, Brasília',
    rating: 5.0,
    date: '7 meses atrás',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 12 avaliações · 7 fotos',
    tags: ['cozy place', 'massage therapist'],
    comment: 'O spa é realmente incrível em todos os detalhes! Amo experiências de bem-estar e estou super feliz por ter encontrado um espaço tao fantástico bem pertinho de casa. As meninas são super atenciosas e simpáticas, o atendimento é super acolhedor e o ambiente é perfeito para relaxar. Voltarei com certeza!',
    highlight: 'O spa é realmente incrível em todos os detalhes! Um espaço tão fantástico bem pertinho de casa.',
    avatarInitials: 'MV',
    likesCount: 3,
  },
  {
    id: 'rev-google-luciana',
    author: 'Luciana M. Valença',
    location: 'Brasília, DF',
    rating: 5.0,
    date: '1 mês atrás',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 28 avaliações',
    tags: ['massage therapist', 'fairy hands', 'cozy place'],
    comment: 'Atendimento impecável! Fui atendida pela massoterapeuta Luciana e que profissional espetacular. Toalhas aquecidas, aroma botânico delicioso e a sensação literal de derreter na maca. O cuidado é sentido em cada detalhe.',
    highlight: 'Sensação literal de derreter na maca. O cuidado da Luciana é incomparável!',
    avatarInitials: 'LM',
    likesCount: 5,
  },
  {
    id: 'rev-google-fidelidade',
    author: 'Carla Vasconcelos',
    location: 'Brasília, DF',
    rating: 5.0,
    date: 'há 3 meses',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 14 avaliações',
    tags: ['massage therapist', 'fairy hands', 'cozy place'],
    comment: 'O atendimento também é perfeito! A massoterapeuta Luciana, que me atendeu foi perfeita! Eu amei tuuudo! O lugar é incrível, atendimento impecável. Andressa foi maravilhosa em todos os procedimentos e eu quase derreti na maca. A única parte ruim é ter que ir embora. Kkkk Head spa maravilhoso! Massagem relaxante perfeita, esfoliação e spa dos pés também. Virei cliente fiel. Recomendo demais.',
    highlight: 'Andressa foi maravilhosa em todos os procedimentos e quase derreti na maca. Virei cliente fiel!',
    avatarInitials: 'CV',
    likesCount: 8,
  },
  {
    id: 'rev-google-andressa',
    author: 'Fernanda Costa',
    location: 'Águas Claras / Brasília',
    rating: 5.0,
    date: '2 meses atrás',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 19 avaliações · 4 fotos',
    tags: ['fairy hands', 'cozy place'],
    comment: 'A Andressa é simplesmente maravilhosa em todos os procedimentos! Fiz o Head Spa Coreano com cascata de água e saí em outro estado de espírito. O barulho da água correndo e a massagem capilar profunda aliviam qualquer cansaço da mente.',
    highlight: 'A Andressa é simplesmente maravilhosa! O Head Spa Coreano é uma imersão sensorial única.',
    avatarInitials: 'FC',
    likesCount: 4,
  },
  {
    id: 'rev-google-cantinho-paz',
    author: 'Renata Silveira',
    location: 'Núcleo Bandeirante, DF',
    rating: 5.0,
    date: 'há 4 meses',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 9 avaliações',
    tags: ['cozy place', 'foot spa'],
    comment: 'O cuidado das atendentes é feito com muito carinho, a experiência é maravilhosa, o ambiente é muito agradável. Um cantinho de paz escondido no Núcleo Bandeirante. Recomendo demais e já vou marcar a próxima!',
    highlight: 'Um cantinho de paz escondido no Núcleo Bandeirante. Cuidado feito com muito carinho!',
    avatarInitials: 'RS',
    likesCount: 6,
  },
  {
    id: 'rev-google-sensorial',
    author: 'Patrícia Duarte',
    location: 'Brasília, DF',
    rating: 5.0,
    date: 'há 5 meses',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 22 avaliações',
    tags: ['cozy place', 'massage therapist'],
    comment: 'Super recomendo, o ambiente é lindo, acolhedor e calmante. A combinação de luz baixa, aromaterapia e cromoterapia faz a gente esquecer qualquer estresse acumulado. As terapeutas têm um cuidado ímpar do início ao fim.',
    highlight: 'Ambiente lindo, acolhedor e calmante. Luz baixa e aromaterapia que silenciam a mente.',
    avatarInitials: 'PD',
    likesCount: 5,
  },
  {
    id: 'rev-google-camila',
    author: 'Camila Fernandes Ribeiro',
    location: 'Núcleo Bandeirante, DF',
    rating: 5.0,
    date: 'há 2 semanas',
    tags: ['cozy place', 'fairy hands'],
    comment: 'Lugar impecável! Sala com iluminação âmbar tão gostosa, toalhas sempre aquecidas e as terapeutas têm mãos de fada. Fiz a massagem com pedras quentes e o ritual do chá ao final com biscoitinhos foi a cereja do bolo. Recomendo de olhos fechados!',
    highlight: 'Mãos de fada e ambiente impecável. Recomendo de olhos fechados!',
    avatarInitials: 'CR',
    likesCount: 5,
  },
  {
    id: 'rev-google-rodrigo',
    author: 'Rodrigo M. Albuquerque',
    location: 'Park Way / Brasília',
    rating: 5.0,
    date: 'há 1 mês',
    tags: ['foot spa', 'cozy place'],
    comment: 'Sofria com tensão cervical crônica por causa do trabalho no computador. A combinação do Head Spa com o Spa dos Pés e acupuntura aliviou minha dor de cabeça no mesmo dia. Ambiente super discreto, cheiroso e com estacionamento fácil no Bandeirante. Nota 10.',
    highlight: 'Aliviou minha dor de cabeça no mesmo dia. Ambiente super discreto e impecável.',
    avatarInitials: 'RA',
    likesCount: 4,
  },
  {
    id: 'rev-google-amanda',
    author: 'Amanda Beatriz Ferreira',
    location: 'Guará / Brasília, DF',
    rating: 5.0,
    date: 'há 3 semanas',
    tags: ['fairy hands', 'cozy place'],
    comment: 'O Head Spa Coreano com cascata de água é simplesmente divino! A massagem capilar profunda e o barulhinho de água corrente me fizeram relaxar de um jeito que há muito tempo eu não conseguia. A Andressa é super atenciosa e delicada.',
    highlight: 'O Head Spa Coreano é simplesmente divino! Relaxamento que há muito tempo eu não conseguia.',
    avatarInitials: 'AF',
    likesCount: 6,
  },
  {
    id: 'rev-google-mariana',
    author: 'Mariana Lemos Santos',
    location: 'Asa Sul, Brasília',
    rating: 5.0,
    date: 'há 2 meses',
    tags: ['cozy place', 'massage therapist'],
    comment: 'Fiz o Day Spa de 3 horas com minha mãe para comemorar o aniversário dela e foi inesquecível! Desde a recepção com a taça de boas-vindas até o escalda-pés e a massagem com pedras quentes. O cuidado e o carinho com que fomos tratadas não tem preço.',
    highlight: 'Fiz o Day Spa de 3 horas com minha mãe e foi inesquecível! Cuidado e carinho sem preço.',
    avatarInitials: 'ML',
    likesCount: 7,
  },
  {
    id: 'rev-google-juliana',
    author: 'Juliana Sampaio',
    location: 'Águas Claras, DF',
    rating: 5.0,
    date: 'há 3 meses',
    tags: ['fairy hands', 'cozy place'],
    comment: 'Ambiente aconchegante, cheirinho maravilhoso assim que você entra e atendimento nota mil da Luciana. Fiz a massagem com pedras quentes e saí leve, sem nenhuma dor nas costas. Super recomendo a experiência!',
    highlight: 'Ambiente aconchegante e atendimento nota mil da Luciana. Saí leve e sem dores!',
    avatarInitials: 'JS',
    likesCount: 4,
  },
  {
    id: 'rev-google-gabriel',
    author: 'Gabriel Pires',
    location: 'Sudoeste / Brasília',
    rating: 5.0,
    date: 'há 4 meses',
    tags: ['massage therapist', 'cozy place'],
    comment: 'Espaço excelente e atendimento de primeira. Fiz massagem relaxante e head spa para aliviar o estresse acumulado da semana. Lugar silencioso, muito limpo e profissionais de altíssimo nível. Já virei cliente fixo.',
    highlight: 'Lugar silencioso, muito limpo e profissionais de altíssimo nível. Já virei cliente fixo.',
    avatarInitials: 'GP',
    likesCount: 5,
  }
];

export const WELCOME_RITUAL_STEPS = [
  {
    title: 'Boas-Vindas & Welcome Drink',
    description: 'Ao atravessar a porta, você é recebido(a) com uma infusão botânica artesanal servida em taça de cristal trabalhada, trazendo calma imediata.',
    icon: 'drink'
  },
  {
    title: 'Descalçar das Preocupações',
    description: 'Chinelos macios aveludados e roupões felpudos substituem seus sapatos e roupas do dia a dia, iniciando a transição para o descanso.',
    icon: 'slippers'
  },
  {
    title: 'Escalda-Pés Terapêutico',
    description: 'Imersão dos pés em água morna enriquecida com sal grosso, folhas de alecrim fresco e óleos essenciais em bacia de madeira nobre.',
    icon: 'feet'
  },
  {
    title: 'Iluminação & Som Terapêutico',
    description: 'Luzes indiretas aquecidas a 3000K, aromas botânicos de sálvia e lavanda e o murmúrio suave de água corrente preparam o corpo para relaxar.',
    icon: 'light'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-agendamento-antecedencia',
    category: 'preparacao',
    question: 'Como funciona o agendamento prévio e qual a recomendação de chegada?',
    answer: 'Todos os atendimentos no Maliviê SPA são realizados mediante agendamento prévio para garantir a exclusividade da sala e o atendimento 1:1. Recomendamos chegar com 10 minutos de antecedência ao horário agendado: clientes que chegam com antecedência aproveitam nosso ritual de boas-vindas com Escalda-Pés aromático de cortesia!',
  },
  {
    id: 'faq-cancelamento-regras',
    category: 'politicas',
    question: 'Qual a política oficial para cancelamentos e remarcações?',
    answer: 'Cancelamentos e remarcações devem ser solicitados com, no mínimo, 12 horas de antecedência pelo nosso WhatsApp oficial. Caso o aviso não seja realizado com essa antecedência mínima de 12 horas, o horário será considerado como sessão realizada.',
  },
  {
    id: 'faq-validade-planos-vouchers',
    category: 'planos',
    question: 'Qual é o prazo de validade dos Planos de Sessões e dos Vouchers-Presente?',
    answer: 'Os Planos de Sessões (pacotes de 4, 8 ou 12 sessões de 50 min) possuem validade de 90 dias após a contratação. Já os nossos Vouchers-Presente (Gift Cards físicos ou digitais) possuem validade de 60 dias a partir da data de emissão, podendo ser personalizados para qualquer serviço, ritual ou plano do catálogo.',
  },
  {
    id: 'faq-atendimento-simultaneo',
    category: 'geral',
    question: 'É possível realizar Day Spa em grupo ou atendimento simultâneo?',
    answer: 'Sim! Nossos Rituais de Day Spa e experiências estão disponíveis para até 5 pessoas simultaneamente mediante consulta prévia de disponibilidade na agenda. É uma vivência incrível para comemorações entre amigas, mães e filhas, casais e momentos marcantes.',
  },
  {
    id: 'faq-head-spa-beneficio-pes',
    category: 'head-spa',
    question: 'Posso combinar o Head Spa com o Spa dos Pés? Há algum benefício?',
    answer: 'Sim! Oferecemos uma condição exclusiva: ao agendar qualquer experiência de Head Spa (Essencial de 45 min, Harmonia de 80 min ou Plenitude de 160 min), você pode adicionar o Spa dos Pés por apenas 50% do valor, tornando seu momento de desaceleração ainda mais especial.',
  },
  {
    id: 'faq-quimica',
    category: 'head-spa',
    question: 'Quem tem química, coloração, luzes ou progressiva pode fazer o Head Spa?',
    answer: 'Sim, com segurança total! Nossos cosmecêuticos e tônicos capilares são fórmulas botânicas suaves, biocompatíveis e livres de sulfatos agressivos ou petrolatos. Além disso, todas as modalidades do Head Spa já incluem secagem delicada dos fios com protetor térmico ao final, para que você saia pronta e com os cabelos impecáveis.',
  },
  {
    id: 'faq-gestantes-metodo',
    category: 'geral',
    question: 'Gestantes podem realizar atendimentos no Maliviê SPA?',
    answer: 'Com certeza! Dispomos do "Método Gestante", desenvolvido especialmente para essa fase tão sublime. Ele combina técnicas de relaxamento, drenagem suave e cuidados personalizados com posicionamento anatômico confortável e óleos 100% seguros.',
  },
  {
    id: 'faq-pagamento-parcelamento',
    category: 'planos',
    question: 'Quais são as condições de pagamento e opções de parcelamento?',
    answer: 'Aceitamos Pix, cartões de crédito, débito e dinheiro. Nossos Planos de Horas contam com condições especiais de parcelamento sem juros: o plano de 4 Horas pode ser pago em 2x de R$ 399,50; o de 8 Horas em 3x de R$ 496,33; e o de 12 Horas em 4x de R$ 487,25. Consulte nossa equipe para condições nos demais rituais.',
  },
  {
    id: 'faq-o-que-levar',
    category: 'preparacao',
    question: 'Preciso levar algo no dia do meu atendimento (roupão, toalha, secador)?',
    answer: 'Não precisa se preocupar com nada! O Maliviê providencia toda a estrutura de acolhimento: roupões felpudos aconchegantes, chinelos aveludados, toalhas aquecidas, secador e cosméticos para retoque. Você também desfruta de aromaterapia inclusa e cerimonial do chá com degustação ao término.',
  },
  {
    id: 'faq-como-escolher',
    category: 'geral',
    question: 'Não sei qual ritual escolher. Como decidir o melhor para o meu momento?',
    answer: 'Nosso Guia de Escolha ajuda a encontrar a opção ideal: para desacelerar e relaxar a mente, opte pela Massagem Relaxante ou Head Spa; para dores musculares e tensões, recomendamos Terapias Corporais ou o Protocolo Anti-Dor; para cuidados estéticos, a Drene Modele ou Spa Banho Gold; e para datas marcantes, nossos Rituais de Day Spa e Rituais Especiais (Casal, Aniversário, Noiva). Fale conosco pelo WhatsApp!',
  },
];
