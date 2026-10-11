import React from 'react';
import { Helmet } from 'react-helmet-async';
export const SEOHead: React.FC = () => {
  return (
    <Helmet>
      <title>Maliviê SPA | Head SPA Coreano e Day SPA em Brasília</title>
      <link rel="canonical" href="https://maliviespa.pages.dev/" />
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
      <meta property="og:image" content="https://maliviespa.pages.dev/og-malivie.webp" />
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
      <meta property="twitter:image" content="https://maliviespa.pages.dev/og-malivie.webp" />
    </Helmet>
  );
};
