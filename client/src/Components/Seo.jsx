import { Helmet } from 'react-helmet-async';

const defaultImage = 'https://ondrivo.onrender.com/logo.svg';

const Seo = ({
  title,
  description,
  keywords,
  image = defaultImage,
  url = 'https://ondrivo.onrender.com',
  type = 'website',
}) => {
  // ── Branded Titles with High-Value Keywords ──
  const pageTitle = title 
    ? `${title} | Ondrivo — Industrial Software & Engineering Solutions` 
    : 'Ondrivo | Industrial Software Built to Last | Process Engineering Kenya';

  // ── Rich Descriptions with Keyword Density ──
  const pageDescription =
    description ||
    'Ondrivo is an industrial process and systems engineering firm in Kenya, specializing in Laboratory Information Management Systems (LIMS), Process Optimization Dashboards, and custom industrial software for manufacturing plants, chemical laboratories, and process industries. We combine chemistry expertise with software engineering to deliver solutions that last.';

  // ── Default Keywords (if not provided) ──
  const defaultKeywords = [
    'industrial software Kenya',
    'laboratory information management systems',
    'LIMS Kenya',
    'process optimization dashboards',
    'industrial process engineering',
    'chemistry software solutions',
    'manufacturing plant software',
    'quality control software Kenya',
    'laboratory management system Nairobi',
    'chemical plant monitoring software',
    'industrial automation Kenya',
    'process monitoring dashboards',
    'custom industrial software',
    'engineering software solutions Kenya',
    'industrial chemistry software',
    'LIMS for laboratories',
    'process engineering Kenya',
    'manufacturing execution systems',
    'industrial data analytics',
    'plant optimization software',
    'laboratory automation Kenya',
    'quality assurance software',
    'industrial IoT solutions',
    'chemical engineering software',
    'process control systems Kenya',
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