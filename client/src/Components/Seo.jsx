import { Helmet } from 'react-helmet-async';

const defaultImage = 'https://ondrivo.co.ke/logo.svg';

const Seo = ({
  title,
  description,
  keywords,
  image = defaultImage,
  url = 'https://ondrivo.co.ke',
  type = 'website',
}) => {
  // ── Branded Titles with High-Value Keywords ──
  const pageTitle = title 
    ? `${title} | Ondrivo — Software Development Company Kenya` 
    : 'Ondrivo | Websites Built to Last | Software Development Kenya';

  // ── Rich Descriptions with Keyword Density ──
  const pageDescription =
    description ||
    'Ondrivo is a leading software development company in Kenya, offering professional web design, custom software development, and full-stack web development services in Nairobi. We build modern, responsive websites and digital solutions that help businesses grow online.';

  // ── Default Keywords (if not provided) ──
  const defaultKeywords = [
    'software development Kenya',
    'web development Nairobi',
    'custom website design Kenya',
    'full-stack developer Nairobi',
    'professional web design Kenya',
    'affordable web development Kenya',
    'custom software solutions Nairobi',
    'responsive website design Kenya',
    'digital transformation Kenya',
    'business website development Nairobi',
    'best website development company in Nairobi',
    'professional web design and development Kenya',
    'custom e-commerce website development Nairobi',
    'affordable web development services in Kenya',
    'website design company near me Nairobi',
  ].join(', ');

  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* ── Primary Meta Tags ── */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* ── Open Graph (Facebook, LinkedIn, WhatsApp) ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Ondrivo" />
      <meta property="og:locale" content="en_KE" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ondrivo" />

      {/* ── Additional SEO Meta Tags ── */}
      <meta name="author" content="Ondrivo" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Nairobi" />
      <meta name="geo.position" content="-1.2921,36.8219" />
      <meta name="ICBM" content="-1.2921,36.8219" />
    </Helmet>
  );
};

export default Seo;