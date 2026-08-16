
import React from "react";
import Seo from '../Seo.jsx';
import Proof from "../Landingpage/jsx/Proof.jsx";
export default function ProofPage(){
    return(
        <>
        <Seo
            title="Case Studies & Proof of Work | Ondrivo"
            description="See the projects, success stories, and case studies that demonstrate Ondrivo's digital design and software expertise."
            keywords="case studies, proof of work, software projects, digital portfolio, business results"
            url="https://ondrivo.co.ke/proofs"
        />
        <Proof variant="full" />
        </>
    )
}