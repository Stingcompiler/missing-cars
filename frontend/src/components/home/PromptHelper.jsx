import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PromptHelper = () => {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState('');
  const [suggestion, setSuggestion] = useState(null);

  const handleAnalyzeText = () => {
    if (!promptText.trim()) return;

    // Regex for Year (4 digits starting with 19 or 20)
    const yearMatch = promptText.match(/\b(19|20)\d{2}\b/);
    
    // Regex for Chassis (Alpha-numeric, usually long)
    const chassisMatch = promptText.match(/[A-Za-z0-9]{8,17}/);
    
    // Keywords logic: remove the year and chassis from the original text,
    // then clean up punctuation and return whatever is left (brand, model, color)
    let keywords = promptText
      .replace(yearMatch ? yearMatch[0] : '', '')
      .replace(chassisMatch ? chassisMatch[0] : '', '')
      .replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ' ') // Remove non-Arabic/English letters
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out very small connecting words
      .join(' ');

    setSuggestion({
      year: yearMatch ? yearMatch[0] : '',
      chassis: chassisMatch ? chassisMatch[0] : '',
      keywords: keywords
    });
  };

  const executeSearch = () => {
    if (!suggestion) return;
    
    // Combine everything into one search query 'q' 
    // This allows the Results page to filter against all fields at once
    const combinedQuery = `${suggestion.keywords} ${suggestion.year} ${suggestion.chassis}`.trim();
    
    navigate(`/results?q=${encodeURIComponent(combinedQuery)}`);
  };

  return (
    <section className="bg-slate-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
         <div className="flex items-center gap-2 mb-6">
           <Sparkles className="text-primary-600" />
           <h2 className="text-2xl font-bold text-slate-900">مساعد البحث الذكي</h2>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <p className="text-slate-600 mb-4 text-sm">
             صف السيارة كما تتذكرها (مثلاً: تويوتا حمراء 2020) وسنقوم باستخراج البيانات آلياً.
           </p>
           
           <textarea 
             value={promptText}
             onChange={(e) => setPromptText(e.target.value)}
             placeholder="مثال: عربية تويوتا كورولا لونها أبيض موديل 2015 ورقم الشاصي بدايته JTD..."
             className="w-full h-32 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary-500 outline-none resize-none mb-4"
           ></textarea>
           
           <div className="flex justify-between items-center">
              <button onClick={handleAnalyzeText} className="bg-primary-50 text-primary-700 font-bold hover:bg-primary-100 px-6 py-3 rounded-xl transition-colors text-sm">
                تحليل النص واستخراج البيانات
              </button>
              
              {suggestion && (
                  <button onClick={executeSearch} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                    <span>بدء البحث بالنتائج</span>
                    <ArrowLeft size={16} />
                  </button>
              )}
           </div>

           {suggestion && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-6 overflow-hidden"
            >
             <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                <div className="bg-white p-3 rounded-lg border border-primary-100">
                  <span className="text-xs text-slate-400 block mb-1">السنة المتوقعة</span>
                  <span className="font-bold text-slate-900">{suggestion.year || 'غير محدد'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-primary-100">
                  <span className="text-xs text-slate-400 block mb-1">رقم الشاصي</span>
                  <span className="font-bold text-slate-900 break-all">{suggestion.chassis || 'غير محدد'}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-primary-100">
                  <span className="text-xs text-slate-400 block mb-1">المواصفات (ماركة/لون)</span>
                  <span className="font-bold text-slate-900">{suggestion.keywords || 'غير محدد'}</span>
                </div>
             </div>
             </motion.div>
           )}
         </div>
      </div>
    </section>
  );
};

export default PromptHelper;