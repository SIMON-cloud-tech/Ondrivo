import React from 'react';
import Hero from '../Landingpage/jsx/Hero.jsx';
import Proof from '../Landingpage/jsx/Proof.jsx';
import Process from '../Landingpage/jsx/Process.jsx';
import Services from '../Landingpage/jsx/Services.jsx';
import Contact from '../Landingpage/jsx/Contact.jsx';

function Home(){
  return(
    <>
      <Hero />
      <Proof variant="light" />
      <Process />
      <Services variant="light" />
      <Contact variant="light" />
    </>
  )
}
export default Home;