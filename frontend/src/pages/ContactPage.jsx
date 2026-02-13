import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, AlertCircle } from 'lucide-react';
import ApiInstance from '../api/Api'; // تأكد من صحة مسار ملف الـ Api

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: 'إبلاغ عن سيارة مفقودة',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // إرسال البيانات إلى الباك آند ليقوم بإرسالها إلى musabsting277@gmail.com
      await ApiInstance.post('api/contact/', formData);
      setFormStatus('success');
    } catch (error) {
      console.error("Error sending message:", error);
      setFormStatus('error');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl">

        <motion.div {...fadeInUp} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">تواصل معنا</h1>
          <p className="text-slate-500">
            لديك استفسار؟ وجدت سيارة وتريد الإبلاغ عنها يدوياً؟ نحن هنا للمساعدة.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          {/* قسم معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">بيانات الاتصال</h3>

              <div className="space-y-6">
                <a href="https://wa.me/249902929451" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-600 hover:text-green-600 transition-colors group">
                  <div className="bg-green-50 p-3 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">واتساب الإدارة (مباشر)</span>
                    <span dir="ltr">+249 902 929 451</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">رقم الهاتف</span>
                    <span dir="ltr">+249 902 929 451</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">البريد الإلكتروني</span>
                    <span>musabsting277@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">المقر الرئيسي</span>
                    <span>الخرطوم، السودان</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* نموذج التواصل */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">أرسل رسالة</h3>

            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} />
                </div>
                <h4 className="text-xl font-bold text-green-700">تم الإرسال بنجاح!</h4>
                <p className="text-slate-500 mt-2">شكراً لتواصلك معنا، سنرد عليك قريباً.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-6 text-slate-400 hover:text-slate-600 font-bold underline">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formStatus === 'error' && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100 mb-4">
                    <AlertCircle size={18} /> فشل الإرسال، يرجى المحاولة مرة أخرى.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
                  <input
                    name="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف / واتساب</label>
                  <input
                    name="contact"
                    required
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الموضوع</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="إبلاغ عن سيارة مفقودة">إبلاغ عن سيارة مفقودة</option>
                    <option value="مشكلة في الموقع">مشكلة في الموقع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="شراكة / تعاون">شراكة / تعاون</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {formStatus === 'sending' ? 'جاري الإرسال...' : (
                    <>
                      <span>إرسال الرسالة</span>
                      <Send size={18} className="rotate-180" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;