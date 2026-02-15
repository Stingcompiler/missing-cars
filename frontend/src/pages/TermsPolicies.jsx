import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Gavel } from 'lucide-react';

const TermsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">

        <motion.div {...fadeInUp} className="mb-10 text-center">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">شروط الاستخدام</h1>
          <p className="text-slate-500">يرجى قراءة هذه الشروط بعناية قبل استخدام المنصة</p>
        </motion.div>

        <div className="space-y-10">

          {/* إخلاء المسؤولية */}
          <motion.section {...fadeInUp} className="bg-red-50 p-6 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 mb-3 text-red-700">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-bold">1. إخلاء المسؤولية</h2>
            </div>
            <p className="text-red-800/80 text-sm leading-relaxed">
              منصة "مفقودات السودان" هي وسيط تقني للمعلومات فقط. نحن لا نضمن دقة المعلومات المدخلة من قبل المستخدمين، ولا نتحمل أي مسؤولية قانونية أو مالية عن أي اتفاقات تتم خارج المنصة أو عن حالة السيارات المعثور عليها.
            </p>
          </motion.section>

          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <CheckCircle2 className="text-slate-400" size={24} />
              <h2 className="text-lg font-bold">2. ضوابط الاستخدام</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3">
                <span className="font-bold text-slate-900">•</span>
                يمنع استخدام المنصة لأغراض الابتزاز أو التشهير.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-slate-900">•</span>
                يجب أن تكون الصور المرفوعة حقيقية وحديثة وغير معدلة رقمياً.
              </li>

            </ul>
          </motion.section>

          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <Gavel className="text-slate-400" size={24} />
              <h2 className="text-lg font-bold">3. الملكية الفكرية</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              جميع حقوق التصميم والبرمجة وقاعدة البيانات محفوظة لمنصة بشريات السودان. يمنع نسخ المحتوى أو استخدام "Web Scraping" لسحب البيانات دون إذن كتابي.
            </p>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;