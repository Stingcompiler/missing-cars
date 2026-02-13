import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, FileText, CheckCircle2, AlertCircle, UploadCloud, X, File } from 'lucide-react';
import ApiInstance from '../api/Api';

const ClaimRequestPage = () => {
  const [searchParams] = useSearchParams();
  const carIdFromUrl = searchParams.get('car_id');
  const subjectFromUrl = searchParams.get('subject'); // 'claim' or 'contact'

  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    claimant_name: '',
    claimant_contact: '',
    car: carIdFromUrl || '',
    proof_files: null,
    message: ''
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, proof_files: file }));
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview('document'); // Icon placeholder for PDF/DOC
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, proof_files: null }));
    setFilePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.car) {
      console.error("Missing Car ID");
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');
    const data = new FormData();

    // Append text fields
    data.append('claimant_name', formData.claimant_name.trim());
    data.append('claimant_contact', formData.claimant_contact.trim());
    data.append('car', formData.car);

    if (formData.message) {
      data.append('admin_notes', formData.message);
    }

    // Append the file
    if (formData.proof_files) {
      data.append('proof_files', formData.proof_files);
    }

    try {
      // --- THE FIX IS HERE ---
      const response = await ApiInstance.post('api/claims/', data, {
        headers: {
          // forcing this to "multipart/form-data" allows the browser to
          // append the crucial 'boundary' parameter automatically.
          'Content-Type': 'multipart/form-data',
        }
      });
      // -----------------------

      setFormStatus('success');
    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Django Error Detail:", error.response.data);
      }
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4" dir="rtl">
      <div className="container mx-auto max-w-5xl">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            {subjectFromUrl === 'claim' ? 'تقديم طلب استرداد' : 'تواصل مع فريق العمل'}
          </h1>
          <p className="text-slate-500 text-lg">
            {subjectFromUrl === 'claim'
              ? 'أرفق المستندات الثبوتية اللازمة لتمكيننا من التحقق من ملكية السيارة.'
              : 'نحن هنا للإجابة على تساؤلاتكم ومساعدتكم في أي وقت.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Right Panel: Guide & Info */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone size={20} className="text-blue-600" /> تواصل مباشر
              </h3>
              <div className="space-y-4">
                <ContactMethod icon={<MessageCircle size={20} />} title="واتساب" value="+249 90929451" color="green" link="https://wa.me/249900000000" />
                <ContactMethod icon={<Mail size={20} />} title="إيميل" value="musabsting277@gmail.com" color="blue" />
              </div>
            </div>

            {subjectFromUrl === 'claim' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-blue-400" /> تنبيهات هامة
                  </h3>
                  <ul className="text-sm space-y-4 opacity-80">
                    <li className="flex gap-2"><span>•</span> تأكد من وضوح صورة شهادة البحث.</li>
                    <li className="flex gap-2"><span>•</span> الملفات المقبولة: JPG, PNG, PDF, DOC.</li>
                    <li className="flex gap-2"><span>•</span> الحد الأقصى لحجم الملف هو 5 ميجابايت.</li>
                  </ul>
                </div>
                <FileText className="absolute -bottom-4 -left-4 text-white/5" size={120} />
              </motion.div>
            )}
          </div>

          {/* Left Panel: The Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 h-full">
              {formStatus === 'success' ? (
                <SuccessState onReset={() => setFormStatus('idle')} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formStatus === 'error' && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 animate-shake">
                      <AlertCircle size={20} /> فشل الإرسال، يرجى التحقق من البيانات والمحاولة مرة أخرى.
                    </div>
                  )}

                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 mr-2">الاسم بالكامل</label>
                      <input name="claimant_name" required onChange={handleInputChange} placeholder="الاسم رباعي كما في الهوية" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 mr-2">رقم التواصل (واتساب)</label>
                      <input name="claimant_contact" required placeholder="+249..." onChange={handleInputChange} dir="ltr" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-right" />
                    </div>
                  </div>

                  {subjectFromUrl === 'claim' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 mr-2">أرفق شهادة البحث أو توكيل الملكية</label>
                      {!formData.proof_files ? (
                        <div className="relative group">
                          <input type="file" required accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="w-full py-10 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 group-hover:border-blue-500 group-hover:bg-blue-100/50 flex flex-col items-center justify-center transition-all">
                            <UploadCloud className="text-blue-500 mb-2" size={32} />
                            <span className="text-sm text-blue-700 font-bold">اسحب الملف هنا أو اضغط للرفع</span>
                            <span className="text-[10px] text-blue-400 mt-1 uppercase">Images, PDF, DOC</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center">
                            {filePreview === 'document' ? <File className="text-blue-500" size={24} /> : <img src={filePreview} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{formData.proof_files.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase">{(formData.proof_files.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button onClick={removeFile} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 mr-2">محتوى الرسالة</label>
                      <textarea name="message" onChange={handleInputChange} rows="4" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none" placeholder="اشرح لنا كيف يمكننا مساعدتك..."></textarea>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {formStatus === 'sending' ? 'جاري معالجة الطلب...' : (
                      <>
                        <span>إرسال المعلومات</span>
                        <Send size={20} className="rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-components
const ContactMethod = ({ icon, title, value, color, link }) => {
  // تحديد الألوان بناءً على النص لتجنب مشاكل Tailwind مع الفئات الديناميكية
  const colorClasses = color === 'green'
    ? 'bg-green-50 text-green-600 group-hover:bg-green-600'
    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600';

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-2xl transition-all">
      <div className={`p-3 rounded-xl shadow-sm transition-all group-hover:text-white ${colorClasses}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</span>
        <span className="font-bold text-slate-800">{value}</span>
      </div>
    </a>
  );
};

const SuccessState = ({ onReset }) => (
  <div className="py-10 text-center">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
      <CheckCircle2 size={48} />
    </motion.div>
    <h3 className="text-3xl font-black text-slate-900 mb-3">تم إرسال طلبك بنجاح!</h3>
    <p className="text-slate-500 leading-relaxed mb-10 max-w-sm mx-auto font-medium text-lg">
      لقد استلمنا مستنداتك وسيقوم فريقنا بمراجعتها والتواصل معك في أقرب وقت ممكن.
    </p>
    <button onClick={onReset} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
      إغلاق
    </button>
  </div>
);

export default ClaimRequestPage;