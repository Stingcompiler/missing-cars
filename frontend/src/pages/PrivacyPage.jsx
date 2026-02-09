import React from 'react';
import { motion } from 'framer-motion';
import { Lock, FileCheck, EyeOff } from 'lucide-react';

const PrivacyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen bg-white py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <motion.div {...fadeInUp} className="border-b border-slate-100 pb-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">سياسة الخصوصية</h1>
          <p className="text-slate-500">آخر تحديث: يناير 2026</p>
        </motion.div>

        <div className="space-y-12">
          
          <motion.section {...fadeInUp} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <Lock className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold">1. البيانات التي نجمعها</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              نحن نجمع البيانات الضرورية فقط لغرض التعرف على المركبة:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 bg-slate-50 p-6 rounded-xl">
              <li>صور السيارة (نقوم تلقائياً بمسح البيانات الوصفية EXIF مثل الموقع الجغرافي من الصور).</li>
              <li>رقم الشاصي (VIN) ورقم اللوحة والموديل.</li>
              <li>الموقع الجغرافي للسيارة (يتم تشفيره وحفظه في خوادم آمنة ولا يظهر للعلن).</li>
              <li>معلومات التواصل الخاصة بالمبلغ (تبقى سرية لدى الإدارة).</li>
            </ul>
          </motion.section>

          <motion.section {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <EyeOff className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold">2. حماية الموقع الجغرافي</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              تعتبر سلامة المركبة أولويتنا القصوى. لذلك، <strong>لا يتم عرض الخريطة الدقيقة أو الإحداثيات</strong> لأي زائر للموقع. يتم مشاركة الموقع فقط مع المالك الحقيقي بعد إثبات الملكية بمستندات رسمية (شهادة بحث).
            </p>
          </motion.section>

          <motion.section {...fadeInUp} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <FileCheck className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold">3. مشاركة البيانات</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              نحن لا نبيع بياناتك لأي طرف ثالث. قد نشارك المعلومات فقط مع:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
              <li>الجهات الأمنية والشرطية في حال وجود طلب رسمي.</li>
              <li>مالك السيارة بعد التحقق من هويته.</li>
            </ul>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;


