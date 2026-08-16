
import React from 'react';
import Seo from '../Seo.jsx';
import Services from '../Landingpage/jsx/Services.jsx';
export default function ServicePage(){
    return(
        <>
        <Seo
            title="Our Services | Ondrivo"
            description="Explore Ondrivo services including website design, custom software, SEO, performance optimization, and digital growth solutions."
            keywords="website design, custom software, SEO, performance optimization, business website, digital growth"
            url="https://ondrivo.co.ke/services"
        />
        <Services variant="full" />
        </>
    )
}