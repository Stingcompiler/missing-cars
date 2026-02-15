import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Target, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Hero Section */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-6">من نحن؟</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            "مفقودات السودان" هي مبادرة وطنية تهدف إلى أتمتة عملية البحث عن السيارات المفقودة،
            وربط أصحاب الحقوق بممتلكاتهم عبر تقنية آمنة وموثوقة.
          </p>
        </motion.div>

        {/* القيم والمميزات */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">الأمان أولاً</h3>
            <p className="text-slate-600">
            .  لا نقوم بنشر مواقع السيارات للعامة. نحن نستخدم تقنية "التشفير الجغرافي" ولا نكشف الموقع إلا بعد التحقق اليدوي من وثائق الملكية.
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">دقة البيانات</h3>
            <p className="text-slate-600">
              نعتمد في البحث على رقم الشاصي (VIN) باعتباره البصمة الوراثية للسيارة، مما يقلل من نسبة الخطأ وتشابه المواصفات.
            </p>
          </motion.div>
        </div>

        {/* الرسالة والرؤية */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="text-primary-400" size={32} />
              <h2 className="text-2xl font-bold">رسالتنا المجتمعية</h2>
            </div>
            <p className="text-slate-300 leading-loose text-lg">
              نحن لا نمثل جهة شرطية أو حكومية، بل نحن متطوعون تقنيون نسعى لسد الفجوة بين من وجد سيارة مهملة وبين من يبحث عنها بقلب محروق. هدفنا هو إعادة البسمة للأسر السودانية وحفظ الأموال.
            </p>
          </div>
          {/* زخرفة خلفية */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;
