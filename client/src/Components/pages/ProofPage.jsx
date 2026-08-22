// ProofPage.jsx
import React from "react";
import Seo from '../Seo.jsx';
import Proof from "../Landingpage/jsx/Proof.jsx";

export default function ProofPage(){
    return(
        <>
        <Seo
            title="Case Studies | Industrial Software Projects | Ondrivo"
            description="Explore Ondrivo's industrial software case studies — LIMS implementations, process optimization dashboards, and custom engineering solutions for laboratories and manufacturing plants."
            keywords="case studies, industrial software projects, LIMS implementation, process optimization, engineering solutions, Ondrivo portfolio"
            url="https://ondrivo.onrender.com/proofs"
        />
        <Proof variant="full" />
        </>
    )
}