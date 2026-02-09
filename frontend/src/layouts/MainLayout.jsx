import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col bg-slate-50 font-sans ${lang === 'ar' ? 'font-tajawal' : ''}`}>
      <Navbar lang={lang} setLang={setLang} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default MainLayout;