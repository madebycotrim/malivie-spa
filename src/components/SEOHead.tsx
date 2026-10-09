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
    image: 'https://maliviespa.com.br/og-malivie.webp',
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
      <title>Maliviê SPA | Head SPA Coreano e Day SPA em Brasília</title>
      <link rel="canonical" href="https://maliviespa.com.br/" />
      <meta
        name="description"
        content="Head SPA Coreano, massagens relaxantes e Day SPA no Núcleo Bandeirante, Brasília. Desacelere e renove suas energias no Maliviê SPA. Agende seu horário!"
      />
      <meta
        name="keywords"
        content="Head Spa Brasília, Massagem Núcleo Bandeirante, Day Spa DF, Gift Card Spa Brasília, Maliviê SPA, Massagem Relaxante DF, Acupuntura Brasília, Spa DF"
      />
      <meta name="author" content="Maliviê SPA" />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content="Maliviê SPA" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:title" content="Maliviê SPA | Head SPA Coreano e Day SPA em Brasília" />
      <meta
        property="og:description"
        content="Sua pausa de desaceleração e reconexão no Núcleo Bandeirante, Brasília. Head Spa Coreano, Rituais Day SPA, Gift Cards e experiências sensoriais."
      />
      <meta property="og:image" content="https://maliviespa.com.br/og-malivie.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Maliviê SPA — Head SPA Coreano e Rituais de Bem-Estar no Núcleo Bandeirante, Brasília" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Maliviê SPA | Head SPA Coreano e Day SPA em Brasília" />
      <meta
        name="twitter:description"
        content="Sua pausa de desaceleração e reconexão no Núcleo Bandeirante, Brasília. Head Spa Coreano, Rituais Day SPA e experiências sensoriais."
      />
      <meta name="twitter:image" content="https://maliviespa.com.br/og-malivie.webp" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};
