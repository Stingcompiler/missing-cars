import React from 'react';

const FAQ = () => {
  const faqData = [
    {
      q: "هل تظهرون موقع السيارة فوراً لكل الزوار؟",
      a: "لا، حفاظاً على أمان السيارة ومنعاً لوصول الأشخاص غير المخولين، لا نكشف عن الموقع الدقيق أو الإحداثيات إلا بعد أن يرسل المالك صورة إثبات الملكية وتتم مراجعتها من قبل الإدارة."
    },
    {
      q: "ما هي المستندات المطلوبة كإثبات ملكية؟",
      a: "نقبل صورة واضحة من شهادة البحث (رخصة المركبة)، أو أورنيك الجمارك، أو توكيل بيع رسمي، بشرط أن تتطابق البيانات مع رقم الشاصي المسجل لدينا."
    },
    {
      q: "كيف تضمنون عدم استخدام صوري الشخصية؟",
      a: "نقوم تلقائياً بحذف بيانات الموقع (EXIF) من الصور المرفوعة، كما نضع علامة مائية (Watermark) على الصور لمنع سرقتها واستخدامها في مواقع أخرى."
    },
    {
      q: "وجدت سيارتي في الموقع، ماذا أفعل الآن؟",
      a: "اضغط على زر 'طلب الموقع' في صفحة تفاصيل السيارة، وارفع المستندات المطلوبة. ستقوم الإدارة بمراجعة الطلب خلال أقل من 24 ساعة وإرسال الموقع لك عبر الواتساب أو البريد."
    },
    {
      q: "سيارتي مفقودة ولكنها غير مدرجة في الموقع، كيف أبلغ عنها؟",
      a: "يمكنك التواصل معنا مباشرة عبر أيقونات التواصل في الفوتر (واتساب/تليجرام) وتزويدنا ببيانات السيارة، وسنقوم بتسجيل بلاغ يدوي والبحث عنها في قاعدة بياناتنا غير المنشورة."
    }
  ];

  return (
    <section id="faq" className="container mx-auto px-4 max-w-3xl mb-12" dir="rtl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">الأسئلة الشائعة</h2>
        <p className="text-slate-500">كل ما تحتاج معرفته عن كيفية حماية سيارتك واستعادتها</p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, i) => (
          <details 
            key={i} 
            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-primary-200"
          >
            <summary className="flex justify-between items-center p-6 font-bold text-slate-800 list-none transition-colors group-open:bg-slate-50">
              <span className="text-lg">{item.q}</span>
              <span className="text-primary-600 transition-transform duration-300 group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <div className="p-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/30">
              {item.a}
            </div>
          </details>
        ))}
      </div>
      
      {/* رسالة إضافية أسفل الأسئلة */}
      <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
        <p className="text-blue-800 font-medium">
          لديك سؤال آخر؟ تواصل مع الدعم الفني مباشرة عبر 
          <a href="#" className="underline font-bold mx-1 hover:text-blue-600">واتساب الإدارة</a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;