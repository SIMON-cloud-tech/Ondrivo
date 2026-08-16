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
        title="Ondrivo | Websites, Apps & Digital Growth Solutions"
        description="Ondrivo builds high-performing websites, software products, and digital experiences for businesses ready to grow."
        keywords="Ondrivo, web development, custom software, digital growth, business websites, Kenya web design"
        url="https://ondrivo.co.ke/"
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