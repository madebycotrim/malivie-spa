import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SPA_BUSINESS_DATA } from '../data/spaData';

export const SEOHead: React.FC = () => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'DaySpa',
    name: SPA_BUSINESS_DATA.name,
    slogan: SPA_BUSINESS_DATA.slogan,
    url: 'https://maliviespa.com.br',
    telephone: '+5561999569214',
    priceRange: '$$',
    image: 'https://maliviespa.com.br/assets/images/head-spa-claro.webp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3ª Avenida, 1124 - lote 1208-A, Loja 3',
      addressLocality: 'Núcleo Bandeirante',
      addressRegion: 'DF',
      postalCode: '71720-565',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -15.8697,
      longitude: -47.9689,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '13:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '128',
      bestRating: '5.0',
      worstRating: '1.0',
    },
    sameAs: [
      SPA_BUSINESS_DATA.social.instagram,
      SPA_BUSINESS_DATA.social.linktree,
      SPA_BUSINESS_DATA.social.facebook,
      SPA_BUSINESS_DATA.social.tiktok,
    ],
  };

  return (
    <Helmet>
      <title>Maliviê SPA | O lugar ideal para renovar suas energias! • Núcleo Bandeirante, Brasília</title>
      <meta
        name="description"
        content="Maliviê SPA — O lugar ideal para renovar suas energias! 3ª Avenida, 1124 - lote 1208-A, Loja 3 - Núcleo Bandeirante, Brasília - DF, 71720-565. Head SPA, Massagens Relaxantes e Rituais de Day SPA."
      />
      <meta
        name="keywords"
        content="Head Spa Brasília, Massagem Núcleo Bandeirante, Day Spa DF, Gift Card Spa Brasília, Maliviê SPA, Massagem Relaxante DF, Acupuntura Brasília"
      />
      <meta name="author" content="Maliviê SPA" />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Maliviê SPA | O lugar ideal para renovar suas energias!" />
      <meta
        property="og:description"
        content="Sua pausa de desaceleração e reconexão no Núcleo Bandeirante, Brasília. Head Spa Coreano, hidroterapia, massagens relaxantes e gift cards."
      />
      <meta property="og:image" content="/assets/images/hero-head-spa.webp" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};
