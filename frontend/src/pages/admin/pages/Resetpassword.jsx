import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import ApiInstance from '../api/ApiInstance'; // استخدام الملف الذي صححناه

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);

  // معالجة إرسال طلب استعادة كلمة المرور
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // API Path: /api/password_reset/
      await ApiInstance.post('/api/password_reset/', { email });
      setStep(2);
    } catch (err) {
      setError('البريد الإلكتروني غير مسجل في قاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {/* المرحلة الأولى: إدخال البريد */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                    <KeyRound size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">نسيت كلمة المرور؟</h2>
                  <p className="text-slate-500 text-sm mt-2">أدخل بريدك الإلكتروني المسجل لإرسال تعليمات إعادة التعيين.</p>
                </div>

                <form onSubmit={handleRequestReset} className="space-y-5">
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="admin@example.com"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs font-bold mr-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
                  
                  <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "إرسال رابط الاستعادة"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* المرحلة الثانية: كلمة المرور الجديدة */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl mb-4">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">تعيين كلمة جديدة</h2>
                  <p className="text-slate-500 text-sm mt-2">يرجى اختيار كلمة مرور قوية لم تستخدمها من قبل.</p>
                </div>

                <form className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPass ? "text" : "password"} required
                      className="w-full pr-12 pl-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                      placeholder="كلمة المرور الجديدة"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button type="button" onClick={() => setStep(3)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    تحديث كلمة المرور
                  </button>
                </form>
              </motion.div>
            )}

            {/* المرحلة الثالثة: النجاح */}
            {step === 3 && (
              <motion.div key="step3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4">
                <CheckCircle2 className="text-green-500 mx-auto mb-6" size={80} />
                <h2 className="text-2xl font-bold text-slate-900">تم التغيير بنجاح!</h2>
                <p className="text-slate-500 mt-2 mb-8">يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
                <button 
                   onClick={() => window.location.href = '/admin/login'}
                   className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                >
                  الذهاب لصفحة الدخول
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== 3 && (
            <div className="mt-8 text-center">
              <button onClick={() => window.history.back()} className="text-slate-400 text-sm hover:text-slate-900 flex items-center justify-center gap-2 mx-auto font-medium">
                <ArrowRight size={16} /> العودة للخلف
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;