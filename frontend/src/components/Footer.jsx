// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Send, Mail, CheckCircle2, Terminal, Code, Cpu, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-8 mt-auto" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* العمود 1: عن الموقع */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="bg-primary-600 text-white p-1 rounded-md">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">بشريات السودان </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              منصة وطنية لتوثيق السيارات المفقودة. نلتزم بأعلى معايير الخصوصية، ولا يتم الكشف عن المواقع إلا لأصحاب الشأن بعد التحقق.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
               <span className="flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                 <CheckCircle2 size={12} className="text-success" /> EXIF محذوف
               </span>
               <span className="flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                 <CheckCircle2 size={12} className="text-success" /> فحص يدوي
               </span>
            </div>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div>
            <h4 className="text-slate-900 font-bold mb-5">الوصول السريع</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">الرئيسية</Link></li>
              <li><Link to="/#services" className="hover:text-primary-600 transition-colors">خدماتنا</Link></li>
              <li><Link to="/about" className="hover:text-primary-600 transition-colors">عن الموقع</Link></li>
              <li><Link to="/#success-stories" className="hover:text-primary-600 transition-colors">قصص النجاح</Link></li>
            </ul>
          </div>

          {/* العمود 3: التواصل */}
          <div>
            <h4 className="text-slate-900 font-bold mb-5">قنوات التواصل</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="flex items-center gap-3 group">
                <div className="bg-green-50 p-2 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <MessageCircle size={18} />
                </div>
                <span>واتساب الإدارة</span>
              </a>
              <a href="#" className="flex items-center gap-3 group">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Send size={18} />
                </div>
                <span>قناة التليجرام</span>
              </a>
            </div>
          </div>

          {/* العمود 4: روابط قانونية */}
          <div>
            <h4 className="text-slate-900 font-bold mb-5">القانون والدعم</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600 transition-colors">شروط الاستخدام</Link></li>
                {/*
                
                              <li><Link to="/report" className="text-red-500 hover:font-bold transition-all">التبليغ عن مخالفة</Link></li>*/}
            </ul>
          </div>

        </div>

        {/* الشريط السفلي */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-slate-400">
          <p>© {new Date().getFullYear()} بشريات السودان. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              صنع  في <span className="text-red-500">🇸🇩</span> السودان
            </span>
            <span className="hidden md:inline text-slate-200">|</span>

        {/* Developer Credit Line */}
        <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-full border border-gray-100 transition-all hover:shadow-sm">
          <span className="text-sm font-medium text-gray-500">تم تطويره </span>
         
          <span className="text-sm font-medium text-gray-500">بواسطة</span>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
             <Code2 size={14} className="text-indigo-600" />
             <span className="text-sm font-black text-gray-800 tracking-tight">MusabstingDev</span>
          </div>
        </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;