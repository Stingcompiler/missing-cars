import React from 'react';
import { Search, FileCheck, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { icon: Search, title: "1. ابحث عن سيارتك", desc: "تصفح القوائم أو ابحث برقم الشاصي للعثور على سيارة مطابقة." },
    { icon: FileCheck, title: "2. قدم طلب استلام", desc: "ارفع صورة من شهادة البحث أو إثبات الملكية لفتح تذكرة مطالبة." },
    { icon: MapPin, title: "3. استلم الموقع", desc: "بعد تحقق الإدارة من صحة المستندات، سيظهر لك موقع السيارة الدقيق." }
  ];

  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">كيف يعمل الموقع؟</h2>
        <p className="text-slate-600">ثلاث خطوات بسيطة وآمنة لاستعادة سيارتك</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-primary-50 text-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <step.icon size={32} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
          ))}
      </div>
    </section>
  );
};

export default HowItWorks;