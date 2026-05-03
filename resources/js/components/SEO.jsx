import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image, 
    url, 
    type = 'website',
    structuredData,
    template = true
}) => {
    const siteName = 'myTicket';
    const fullTitle = (title && template) ? `${title} | ${siteName}` : (title || siteName);
    const defaultDescription = 'Book tickets for the best concerts, movies, and stand-up shows. Easy, fast, and secure.';
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || 'tickets, concerts, movies, stand-up, events, booking';
    const metaImage = image || '/logo.png';
    const metaUrl = url || window.location.href;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            <meta property="og:type" content={type} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteName} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={metaUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            <link rel="canonical" href={metaUrl} />

            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
