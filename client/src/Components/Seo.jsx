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
  const pageTitle = title || 'Ondrivo | Websites Built to Last';
  const pageDescription =
    description ||
    'Ondrivo builds modern websites, software products, and digital experiences that help businesses grow.';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default Seo;
