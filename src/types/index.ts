export type ServiceCategory = 
  | 'todos' 
  | 'head-spa' 
  | 'massagens' 
  | 'pedras-quentes'
  | 'spa-pes'
  | 'acupuntura'
  | 'day-spa' 
  | 'planos-horas';

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
  includedItems: string[];
  ritualSteps?: string[];
  therapists: string[];
  whatsappMessage: string;
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
  avatarUrl?: string;
  isLocalGuide?: boolean;
  localGuideDetails?: string;
  tags?: string[];
  photos?: string[];
  likesCount?: number;
  ownerReply?: {
    author: string;
    date: string;
    text: string;
  };
  treatmentExperienced?: string;
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
    formatServiceUrl: (serviceName: string) => string;
    giftCardUrl: (type?: string) => string;
  };
  rating: {
    score: number;
    totalReviews: number;
    platform: string;
  };
}
