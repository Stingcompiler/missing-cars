import React from 'react';
import { Trophy, CheckCircle2, Star, Quote } from 'lucide-react';

const SuccessStories = ({cars}) => {
 
 



  return (
    <section id="success-stories" className="bg-white py-20" dir="rtl">
      <div className="container mx-auto px-4">
        {/* رأس القسم */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">قصص نجاح استعادة السيارات</h2>
          <p className="text-slate-500 max-w-2xl">
            نحن فخورون بمساعدة المواطنين في استعادة ممتلكاتهم. إليكم بعض الحالات التي تمت بنجاح عبر المنصة.
          </p>
        </div>

        {/* شبكة القصص */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars?.map((item) => (
            <div 
              key={item.id} 
              className="relative bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group"
            >
              {/* أيقونة اقتباس جمالية */}
              <Quote className="absolute top-6 left-6 text-slate-200 group-hover:text-primary-100 transition-colors" size={48} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-success/10 text-success p-1 rounded-full">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold text-success">{item.status}</span>
                  <span className="text-slate-300 mx-1">•</span>
                  <span className="text-xs text-slate-400 font-medium">{
                  new Date(item.updated_at).toLocaleDateString()}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.year}</h3>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.brand}</h3>
                
                <p className="text-slate-600 leading-relaxed mb-6 italic">
                  "{item.public_description}"
                </p>

               {/*
                               <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs text-slate-400 mr-2 font-medium">(تقييم صاحب السيارة)</span>
                </div>
               */}
              </div>
            </div>
          ))}
        </div>

        {/* إحصائية سريعة أسفل القسم */}
        <div className="mt-16 flex justify-center">
            <div className="bg-primary-600  px-8 py-4 rounded-2xl shadow-lg shadow-primary-200 flex items-center gap-4">
                <div className="text-3xl font-bold">{cars?.length}</div>
                <div className="text-sm leading-tight opacity-90">
                    سيارة تم استعادتها <br /> بنجاح هذا الشهر
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;