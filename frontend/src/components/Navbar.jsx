import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShieldCheck, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/mscarslogo.png';
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Logic to handle search when pressing "Enter"
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      navigate(`/results?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Reset search bar
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'خدماتنا', path: '/#services' },
    { name: 'قصص النجاح', path: '/#success-stories' },
    { name: 'الأسئلة الشائعة', path: '/#faq' },
    { name: 'عن الموقع', path: '/about' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm" dir="rtl">
      <div className="container mx-auto px-4 py-3 md:py-0">

        <div className="flex items-center justify-between h-14 md:h-20 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="">
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <span className="font-bold text-lg md:text-2xl text-slate-900 tracking-tight">
              منصه ستينج للسيارات المفقودة
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex gap-6 text-[15px] font-medium text-slate-600">
              {navLinks.map((link) => (
                <a key={link.path} href={link.path} className="hover:text-blue-600 transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <Link to="/contact" className="text-slate-500 hover:text-blue-600 transition-colors">
              <MessageCircle size={22} />
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/contact" className="p-2 text-slate-500">
              <MessageCircle size={22} />
            </Link>
            {/* FIXED: Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-800 bg-slate-50 rounded-lg hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <div className="pb-3 md:pb-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[400px] lg:p-0">
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="ابحث برقم الشاصي أو اللوحة..."
              className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm"
            />
            <Search className="absolute right-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-xl text-slate-900">القائمة</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700 font-bold text-lg hover:text-blue-600 flex items-center justify-between"
                  >
                    {link.name}
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                  </a>
                ))}
                <div className="h-px bg-slate-100 my-4"></div>
                {/*

                <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-bold">
                  <User size={20} />
                  <span>لوحة الإدارة</span>
                </Link>*/}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;