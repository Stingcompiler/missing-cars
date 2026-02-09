import React, { useState } from 'react';
import { Search, ShieldCheck, EyeOff, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = ({ cars, carsdelevered }) => {
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();

  // Redirect logic
  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      navigate(`/results?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Allow "Enter" key to trigger search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleHeroSearch();
    }
  };

  return (
    <section className="relative bg-slate-900 text-white py-20 px-4 rounded-3xl mx-4 mt-4 overflow-hidden shadow-2xl">
      {/* خلفية جمالية */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* شارات الثقة */}
        <div className="flex justify-center gap-4 text-xs font-medium text-slate-300 mb-4">
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"><ShieldCheck size={14} /> تحقق إداري</span>
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"><EyeOff size={14} /> الموقع مخفي</span>
          <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"><FileCheck size={14} /> سجل تدقيق</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          هل فقدت سيارتك؟ <br />
          <span className="text-primary-400">نساعدك في استعادتها بأمان.</span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">

          بشارة خير
          لحصر العربات المفقودة داخل وخارج ولاية الخرطوم نعمل ك تيم علي استرجاع العربات المفقودة لأصحابها


        </p>

        {/* شريط البحث الرئيسي */}
        <div className="bg-white p-2 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث برقم الشاصي (الأسرع)، الماركة، أو اللون..."
            className="flex-1 px-4 py-3 rounded-xl text-slate-900 outline-none focus:bg-slate-50 placeholder:text-slate-400"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHeroSearch}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            بحث الآن
          </motion.button>
        </div>

        <div className="pt-4 text-sm text-slate-400">
          <span>إحصائيات مباشرة: </span>
          <span className="text-white font-bold mx-1">{cars?.length}+ سيارة موثقة</span>
          <span> • </span>
          <span className="text-white font-bold mx-1">{carsdelevered?.length} استعادة ناجحة</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;