// Home.jsx
import React from 'react';
import Seo from '../Seo.jsx';
import Hero from '../Landingpage/jsx/Hero.jsx';
import Proof from '../Landingpage/jsx/Proof.jsx';
import Process from '../Landingpage/jsx/Process.jsx';
import Services from '../Landingpage/jsx/Services.jsx';
import Contact from '../Landingpage/jsx/Contact.jsx';

function Home(){
  return(
    <>
      <Seo
        title="Ondrivo | Industrial Software Built to Last"
        description="Ondrivo delivers Laboratory Information Management Systems, Process Optimization Dashboards, and custom industrial software for laboratories, manufacturing plants, and process industries in Kenya."
        keywords="industrial software Kenya, LIMS, process dashboards, manufacturing software, laboratory management, industrial engineering"
        url="https://ondrivo.onrender.com/"
      />
      <Hero />
      <Proof variant="light" />
      <Process />
      <Services variant="light" />
      <Contact variant="light" />
    </>
  )
}
export default Home;