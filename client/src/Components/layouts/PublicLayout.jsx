import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Landingpage/jsx/Navbar.jsx';
import Footer from '../Landingpage/jsx/Footer.jsx';
import Chatbot from '../Landingpage/jsx/chatbot.jsx';
import CookieConsent from '../Landingpage/jsx/CookieConsent.jsx';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="public-main">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
      <CookieConsent />
    </>
  );
};

export default PublicLayout;