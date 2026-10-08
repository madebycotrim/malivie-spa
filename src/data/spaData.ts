import { BusinessInfo, ReviewItem, RitualStep, ServiceItem } from '../types';

import acupunturaImg from '../assets/images/acupuntura.webp';
import daySpaChaImg from '../assets/images/day-spa-cha.webp';
import headSpaTerapeutaImg from '../assets/images/head-spa-terapeuta-acolhimento.webp';
import headSpaDetalheImg from '../assets/images/head-spa-detalhe.webp';
import pedrasQuentesImg from '../assets/images/pedras-quentes.webp';
import spaDosPesImg from '../assets/images/spa-dos-pes.webp';
import malivieBandejaImg from '../assets/images/malivie-bandeja-reflexao.webp';
import ritualBoasVindasImg from '../assets/images/ritual-boas-vindas.webp';
import malivieRoupaoImg from '../assets/images/malivie-roupao-chinelos.webp';

export const SPA_BUSINESS_DATA: BusinessInfo = {
  name: 'Maliviê SPA',
  slogan: 'O lugar ideal para renovar suas energias!',
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
    tuesdayToSaturday: 'De 08h às 20h',
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
    defaultUrl: 'https://wa.me/5561999569214?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20Malivi%C3%AA%20SPA%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio',
    formatServiceUrl: (serviceName: string) => {
      const encoded = encodeURIComponent(`Olá! Gostaria de agendar o procedimento: ${serviceName}`);
      return `https://wa.me/5561999569214?text=${encoded}`;
    },
    giftCardUrl: (type?: string) => {
      const text = type 
        ? `Olá! Gostaria de adquirir o Gift Card Maliviê (${type}) para presentear com autocuidado!`
        : 'Olá! Gostaria de adquirir o Gift Card Maliviê para presentear com autocuidado!';
      return `https://wa.me/5561999569214?text=${encodeURIComponent(text)}`;
    }
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
  viewAll: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565')}`,
  writeReview: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Maliviê SPA, 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565')}`,
};

export const OFFICIAL_COPIES = {
  // A. Cabeçalho & Hero Section
  title: "Maliviê SPA",
  slogan: "O lugar ideal para renovar suas energias!",
  locationSubtitle: "Núcleo Bandeirante, Brasília",
  googleRatingBadge: "⭐ 5.0 Avaliação no Google",
  ctaButton: "Agendar um horário!",

  // B. Seção de Boas-Vindas & Acolhimento
  welcome: "Sejam bem-vindos ao Maliviê. 🌿 Um espaço criado para você desacelerar e se reconectar com você.",
  arrival: "Aqui, você é recebido(a) com calma. 🌿 Um momento de pausa já na sua chegada.",
  welcomeDetail: "Aqui, cada detalhe foi pensado para acalmar o corpo e silenciar a mente.",

  // C. Manifesto do Desaceleramento (Seção Institucional)
  manifestoMain: "✨ Feche os olhos por um instante… Você chega, desacelera, deixa as preocupações do lado de fora e, pelas próximas horas, só existe uma prioridade: você. 🤍🌿 No Maliviê, cada detalhe é pensado para que o seu momento de autocuidado comece antes mesmo da primeira massagem.",
  manifestoSecondary: "Sabe aquele lembrete de que a vida não precisa ser uma corrida o tempo todo? Permita-se desacelerar da rotina agitada e se dedicar um momento de cuidado único.",

  // D. Seção Carro-Chefe – Head Spa Coreano
  headSpaTitle: "Head SPA",
  headSpaQuote: "🎧 O ruído da água correndo, a textura da espuma suave e o ritmo desacelerado dos movimentos na cabeça. Quando a mente desacelera, o corpo inteiro responde. Você sabia que o Head Spa combina estímulos sensoriais e massagem capilar profunda para aliviar a tensão do dia a dia? Permita-se essa pausa relaxante.",
  headSpaSubtitle: "O Head Spa do Maliviê foi criado para proporcionar muito mais do que cuidado capilar: é um momento de presença, relaxamento e bem-estar.",

  // E. Seção Massagens Relaxantes
  massagensTitle: "Massagens Relaxantes",
  pedrasQuentesQuote: "A massagem com pedras quentes entra devagar e vai desfazendo os nós da tensão. Se você também está precisando desacelerar, talvez esse seja o seu sinal.",

  // F. Seção Rituais de Day SPA & Sazonais
  daySpaTitle: "Rituais de Day SPA",
  daySpaQuote: "Reservar um tempo pra você também é uma forma de cuidado. Permita-se viver cada minuto desse cuidado!",
  daySpaSazonal: "A primavera é o convite perfeito para renovar as energias, desacelerar da rotina agitada e se dedicar um momento de cuidado único.",

  // G. Seção Planos de Horas & Serviços Especializados
  planosHorasTitle: "Planos de Horas",

  // H. Seção Gift Card
  giftCardTitle: "GIFT CARD MALIVIÊ",
  giftCardOfficial: "Presenteie com autocuidado. Voucher físico (com embalagem e dedicatória) ou digital · Validade de 30 dias. O lugar ideal para renovar suas energias.",
  giftCardMicroCopy: "Voucher físico (com embalagem e dedicatória) ou digital · Validade de 30 dias.",
  giftCardTagline: "O presente que não ocupa espaço na prateleira, mas sim no coração.",
  giftCardSubTagline: "Transforme uma data especial em uma memória sensorial inesquecível.",
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
  {
    id: 'head-spa-coreano',
    name: 'Head Spa Coreano Signature',
    tagline: 'O ritual hídrico mais desejado de Brasília',
    category: 'head-spa',
    categoryLabel: 'Head Spa',
    duration: '80 min',
    description: 'Imersão no arco de água contínuo com espuma aveludada, massagem craniana descompressiva e reconstrução capilar profunda.',
    longDescription: 'Nossa experiência carro-chefe inspirada nos rituais tradicionais de bem-estar da Coreia e Japão. Uma verdadeira jornada sensorial que combina diagnóstico capilar, banho de espuma densa, massagem craniana profunda e o hipnótico arco de hidroterapia com água morna. Alivia dores de cabeça, bruxismo, estresse acumulado e devolve a saúde máxima aos cabelos.',
    image: headSpaTerapeutaImg,
    popular: true,
    featured: true,
    includedItems: [
      'Welcome Drink artesanal & Escalda-pés de boas-vindas',
      'Diagnóstico de couro cabeludo com microcâmera',
      'Ducha hídrica com arco circular ASMR',
      'Massagem craniana, nuca e trapézio',
      'Nutrição intensiva com vapor de ozônio',
      'Secagem suave e chá herbal digestivo ao final'
    ],
    ritualSteps: [
      'Aromaterapia e respiração guiada',
      'Esfoliação suave e espuma desintoxicante',
      'Hidroterapia circular morna com acupressão',
      'Selagem das cutículas e finalização'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Head Spa Coreano Signature'
  },
  {
    id: 'head-spa-express',
    name: 'Head Spa Revitalizante Express',
    tagline: 'Pausa rápida e revigorante para dias intensos',
    category: 'head-spa',
    categoryLabel: 'Head Spa',
    duration: '50 min',
    description: 'Higienização profunda dos folículos, cascata de água termal morna e massagem na nuca para quem tem pouco tempo e precisa renovar o foco.',
    longDescription: 'Desenvolvido especialmente para uma pausa estratégica no meio da rotina. Focado na descompressão craniana imediata e oxigenação capilar através de manobras relaxantes e do fluxo contínuo de água relaxante.',
    image: headSpaDetalheImg,
    includedItems: [
      'Aromaterapia de boas-vindas',
      'Espuma cremosa desintoxicante',
      'Arco hídrico ASMR com massagem craniana',
      'Máscara condicionante de hidratação rápida',
      'Secagem natural e chá especial'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Head Spa Revitalizante Express'
  },
  {
    id: 'massagem-pedras-quentes',
    name: 'Massagem Relaxante com Pedras Quentes',
    tagline: 'Descompressão muscular profunda e calor terapêutico',
    category: 'pedras-quentes',
    categoryLabel: 'Pedras Quentes',
    duration: '70 min',
    description: 'A massagem com pedras quentes entra devagar e vai desfazendo os nós da tensão. Se você também está precisando desacelerar, talvez esse seja o seu sinal.',
    longDescription: 'A massagem com pedras quentes entra devagar e vai desfazendo os nós da tensão. Se você também está precisando desacelerar, talvez esse seja o seu sinal. O encontro perfeito entre a termoterapia e a massagem corporal relaxante, penetrando profundamente nos músculos para proporcionar uma sensação inigualável de derreter na maca.',
    image: pedrasQuentesImg,
    popular: true,
    includedItems: [
      'Escalda-pés com sais minerais e óleos botânicos',
      'Aplicação de óleos nobres 100% vegetais aquecidos',
      'Manobras com pedras vulcânicas em pontos estratégicos de tensão',
      'Trabalho focado em costas, pernas e trapézio',
      'Chá herbal revigorante na sala de descanso'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Massagem Relaxante com Pedras Quentes'
  },
  {
    id: 'massagem-malivie-signature',
    name: 'Massagem Maliviê Harmonia & Aromas',
    tagline: 'Toque fluido, alongamentos suaves e drenagem relaxante',
    category: 'massagens',
    categoryLabel: 'Massagens Relaxantes',
    duration: '60 min',
    description: 'Sinergia de toques relaxantes, deslizamentos rítmicos e pressão modulada para acalmar o sistema nervoso simpático e eliminar o cansaço.',
    longDescription: 'Criada para quem busca desconectar do ritmo frenético da cidade. Manobras contínuas e acolhedoras sob a luz âmbar de 3000K, ajustadas à sensibilidade de cada corpo para liberar endorfinas e renovar a sensação de vitalidade.',
    image: pedrasQuentesImg,
    includedItems: [
      'Welcome Drink artesanal de infusão botânica',
      'Personalização de óleos essenciais conforme a queixa do dia',
      'Manobras miofasciais e drenantes em corpo inteiro',
      'Toalhas quentes e compressas herbais aromáticas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Massagem Maliviê Harmonia & Aromas'
  },
  {
    id: 'day-spa-renovacao',
    name: 'Day SPA Renovação & Harmonia',
    tagline: 'Imersão completa de 3 horas de puro autocuidado',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day SPA',
    duration: '180 min',
    description: 'Nosso ritual de longa duração mais exclusivo: Welcome drink em cristal, escalda-pés, Head Spa completo, massagem com pedras e ritual do chá.',
    longDescription: 'Uma experiência de transformação para desacelerar o tempo. Inicia com a calorosa recepção Maliviê, avança pelo ritual hídrico do Head Spa Coreano, seguido de massagem corporal relaxante com pedras quentes, spa dos pés e é coroada com o cerimonial do chá e delicadezas artesanais.',
    image: daySpaChaImg,
    popular: true,
    featured: true,
    includedItems: [
      'Taça de Welcome Drink artesanal em cristal trabalhado',
      'Escalda-pés com pétalas, ervas medicinais e sais relaxantes',
      'Head Spa Coreano Signature completo (80 min)',
      'Massagem Relaxante com Pedras Quentes (60 min)',
      'Spa dos pés com esfoliação e hidratação profunda',
      'Ritual do chá servido com castanhas e acompanhamentos finos',
      'Roupão felpudo e chinelos aveludados durante toda a estadia'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day SPA Renovação & Harmonia'
  },
  {
    id: 'day-spa-express-pausa',
    name: 'Day SPA Momento Pausa & Serenidade',
    tagline: 'Duas horas dedicadas a reconectar corpo e mente',
    category: 'day-spa',
    categoryLabel: 'Rituais de Day SPA',
    duration: '120 min',
    description: 'Combinação refinada de Massagem Relaxante Corporal de 60 minutos com Head Spa Revitalizante e experiência degustação de chás.',
    longDescription: 'O equilíbrio sob medida entre cuidado corporal e cranial. Perfeito para comemorações especiais, aniversários ou um presente inesquecível para si mesmo.',
    image: daySpaChaImg,
    includedItems: [
      'Escalda-pés aromático em bacia de madeira nobre',
      'Massagem corporal com óleos aquecidos de semente de uva e lavanda',
      'Head Spa com cascata hídrica e higienização profunda',
      'Momento do chá calmante'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Day SPA Momento Pausa & Serenidade'
  },
  {
    id: 'plano-horas-essencial',
    name: 'Plano de Horas • Bem-Estar Recorrente',
    tagline: 'Horas acumulativas com flexibilidade e prioridade na agenda',
    category: 'planos-horas',
    categoryLabel: 'Planos de Horas',
    duration: 'Pacotes de 5h ou 10h',
    description: 'Modalidade inteligente de horas para você desfrutar de qualquer procedimento do menu ao longo do mês com condições especiais.',
    longDescription: 'Para quem entende que autocuidado não é luxo eventual, mas um hábito essencial de saúde e equilíbrio. O Plano de Horas permite fracionar seu tempo entre Head Spa, massagens corporais e spa dos pés, com atendimento preferencial com as terapeutas Andressa e Luciana.',
    image: daySpaChaImg,
    includedItems: [
      'Horas flexíveis utilizáveis em qualquer procedimento do cardápio',
      'Validade estendida e possibilidade de compartilhar com uma pessoa querida',
      'Agendamento prioritário em dias e horários nobres',
      'Mimos de recepção e ritual do chá inclusos em todas as sessões'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Plano de Horas Bem-Estar Recorrente'
  },
  {
    id: 'spa-dos-pes-esfoliacao',
    name: 'Spa dos Pés com Esfoliação & Hidratação',
    tagline: 'Cuidado profundo para as extremidades que sustentam o seu dia',
    category: 'spa-pes',
    categoryLabel: 'Spa dos Pés',
    duration: '45 min',
    description: 'Escalda-pés terapêutico com óleos essenciais, esfoliação nutritiva com microgrãos de damasco, máscara hidratante e reflexologia podal.',
    longDescription: 'Os pés carregam todas as tensões do nosso cotidiano. Esse ritual restaura a maciez da pele, alivia inchaços e sensações de peso nas pernas e estimula os pontos reflexos de todo o organismo com toques precisos.',
    image: spaDosPesImg,
    includedItems: [
      'Imersão morna com sais do Himalaia e alecrim',
      'Esfoliação mecânica com grãos botânicos hidratantes',
      'Envelopamento aquecido com manteiga de karité',
      'Massagem relaxante nos pés e panturrilhas'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Spa dos Pés com Esfoliação & Hidratação'
  },
  {
    id: 'acupuntura-terapeutica',
    name: 'Acupuntura Tradicional & Reequilíbrio',
    tagline: 'Medicina Integrativa para ansiedade, dores e insônia',
    category: 'acupuntura',
    categoryLabel: 'Acupuntura',
    duration: '60 min',
    description: 'Aplicação sutil de agulhas estéreis ultrafinas em meridianos corporais para restabelecer o fluxo de energia vital e modular dores crônicas.',
    longDescription: 'Uma abordagem holística baseada nos princípios milenares da Medicina Tradicional Chinesa. Indicada para regulação da ansiedade, tratamento de enxaquecas recorrentes, melhora da qualidade do sono e alívio de contraturas musculares.',
    image: acupunturaImg,
    includedItems: [
      'Avaliação energética dos meridianos',
      'Agulhas estéreis descartáveis de altíssima precisão e conforto',
      'Moxabustão suave ou eletroacupuntura quando indicada',
      'Sala silenciosa com aromaterapia e cromoterapia aconchegante'
    ],
    therapists: ['Andressa', 'Luciana'],
    whatsappMessage: 'Acupuntura Tradicional & Reequilíbrio'
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
    photos: [malivieBandejaImg, ritualBoasVindasImg],
    ownerReply: {
      author: 'Maliviê SPA (proprietário)',
      date: '7 meses atrás',
      text: 'Ficamos muito felizes que tenha gostado, Millena! Sempre que precisar de um momento de calma e renovação, estaremos de portas abertas 🤍🌿'
    },
    treatmentExperienced: 'Head Spa & Bem-Estar'
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
    photos: [pedrasQuentesImg],
    ownerReply: {
      author: 'Maliviê SPA (proprietário)',
      date: '1 mês atrás',
      text: 'Gratidão imensa pelo carinho, Luciana! A massoterapeuta Luciana e toda a nossa equipe cuidam de cada minuto com muito afeto 🌿'
    },
    treatmentExperienced: 'Massagem Relaxante com Pedras Quentes'
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
    photos: [headSpaDetalheImg],
    ownerReply: {
      author: 'Maliviê SPA (proprietário)',
      date: '2 meses atrás',
      text: 'Que alegria ler seu relato, Fernanda! O Head Spa foi desenhado exatamente para silenciar a mente e desacelerar a rotina 🤍'
    },
    treatmentExperienced: 'Head Spa Coreano Signature'
  },
  {
    id: 'rev-insta-1',
    author: 'Nathiele Saúde',
    location: '@nathielesaude • Instagram',
    rating: 5.0,
    date: 'Verificado',
    localGuideDetails: '@nathielesaude · Cliente Verificada',
    tags: ['cozy place', 'foot spa'],
    comment: 'Lugar de paz! O acolhimento no Maliviê faz a gente esquecer a correria da semana logo no primeiro minuto. Cuidado excepcional com cada detalhe e massagem que renova a alma.',
    highlight: 'Lugar de paz! Cuidado excepcional com cada detalhe e massagem que renova a alma.',
    avatarInitials: 'NS',
    likesCount: 6,
    photos: [malivieRoupaoImg],
    treatmentExperienced: 'Head Spa & Rituais'
  },
  {
    id: 'rev-2',
    author: 'Camila Fernandes Ribeiro',
    location: 'Núcleo Bandeirante, DF',
    rating: 5.0,
    date: 'Há 2 semanas',
    localGuideDetails: 'Cliente Google · 8 avaliações',
    tags: ['cozy place', 'fairy hands'],
    comment: 'Lugar impecável! Sala com iluminação âmbar tão gostosa, toalhas sempre aquecidas e as terapeutas têm mãos de fada. O ritual do chá ao final com biscoitinhos foi a cereja do bolo. Recomendo de olhos fechados!',
    highlight: 'Mãos de fada e ambiente impecável. Recomendo de olhos fechados!',
    avatarInitials: 'CR',
    likesCount: 4,
    treatmentExperienced: 'Massagem Relaxante com Pedras Quentes'
  },
  {
    id: 'rev-4',
    author: 'Rodrigo M. Albuquerque',
    location: 'Park Way / Brasília',
    rating: 5.0,
    date: 'Há 1 mês',
    isLocalGuide: true,
    localGuideDetails: 'Local Guide · 42 avaliações',
    tags: ['foot spa', 'cozy place'],
    comment: 'Sofria com tensão cervical crônica por causa do computador. A combinação do Head Spa com o Spa dos Pés e acupuntura aliviou minha dor de cabeça no mesmo dia. Ambiente discreto, cheiroso e com estacionamento fácil no Bandeirante. Nota 10.',
    highlight: 'Aliviou minha dor de cabeça no mesmo dia. Ambiente super discreto e impecável.',
    avatarInitials: 'RA',
    likesCount: 3,
    treatmentExperienced: 'Head Spa & Acupuntura'
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
