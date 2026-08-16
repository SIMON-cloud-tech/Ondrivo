import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Landingpage/jsx/Navbar.jsx';
import Footer from '../Landingpage/jsx/Footer.jsx';
import Chatbot from '../Landingpage/jsx/chatbot.jsx';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="public-main">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </>
  );
};

export default PublicLayout;