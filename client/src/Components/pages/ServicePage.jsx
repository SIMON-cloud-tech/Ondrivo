// ServicePage.jsx
import React from 'react';
import Seo from '../Seo.jsx';
import Services from '../Landingpage/jsx/Services.jsx';

export default function ServicePage(){
    return(
        <>
        <Seo
            title="Industrial Software Services | Ondrivo"
            description="Ondrivo offers Laboratory Information Management Systems, Process Optimization Dashboards, and custom industrial software for laboratories, manufacturing plants, and process industries in Kenya."
            keywords="LIMS, process dashboards, custom industrial software, laboratory management, manufacturing software, industrial engineering Kenya"
            url="https://ondrivo.onrender.com/services"
        />
        <Services variant="full" />
        </>
    )
}