export type ServiceCategory = 
  | 'todos' 
  | 'head-spa' 
  | 'relaxamento' 
  | 'terapias' 
  | 'corporal-facial' 
  | 'spa-pes' 
  | 'day-spa' 
  | 'especiais' 
  | 'planos-horas' 
  | 'complementos'
  | 'massagens' 
  | 'pedras-quentes'
  | 'acupuntura';

export interface PriceOption {
  duration?: string;
  price: string;
  originalPrice?: string;
  note?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  tagline: string;
  category: ServiceCategory;
  categoryLabel: string;
  duration: string;
  description: string;
  longDescription: string;
  image: string;
  popular?: boolean;
  featured?: boolean;
  badge?: string;
  price?: string;
  priceOptions?: PriceOption[];
  courtesyNote?: string;
  includedItems: string[];
  ritualSteps?: string[];
  therapists: string[];
  whatsappMessage: string;
  priceHint?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'head-spa' | 'preparacao' | 'geral' | 'politicas' | 'planos';
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  highlight: string;
  avatarInitials: string;
  isLocalGuide?: boolean;
  localGuideDetails?: string;
  tags?: string[];
  likesCount?: number;
}

export interface RitualStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  sensoryNote: string;
}

export interface BusinessInfo {
  name: string;
  slogan: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    fullFormatted: string;
  };
  schedule: {
    monday: string;
    tuesdayToSaturday: string;
    sunday: string;
  };
  social: {
    instagram: string;
    instagramHandle: string;
    linktree: string;
    facebook: string;
    tiktok: string;
    tiktokHandle: string;
  };
  whatsapp: {
    phoneNumber: string;
    formattedDisplay?: string;
    defaultUrl: string;
    heroUrl: string;
    headSpaUrl: string;
    navUrl: string;
    receptionUrl: string;
    formatServiceUrl: (serviceName: string) => string;
    giftCardUrl: (type?: string) => string;
    pricingInquiryUrl?: (serviceName?: string) => string;
    createCustomUrl?: (message: string) => string;
  };
  rating: {
    score: number;
    totalReviews: number;
    platform: string;
  };
}
