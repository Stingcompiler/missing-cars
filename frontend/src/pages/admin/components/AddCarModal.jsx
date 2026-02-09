import React, { useState } from 'react';
import { X, Upload, Car, MapPin, ShieldCheck, FileText } from 'lucide-react';
import ApiInstance from '../../../api/Api';

const AddCarModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: 'found',
    brand: '',
    model: '',
    chassis_number: '',
    plate_number: '',
    year: new Date().getFullYear(),
    color: '',
    public_description: '',
    location_public: '',
    location_encrypted: '',
    images: [] // لتخزين الملفات محلياً قبل الإرسال
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();

    // 1. إضافة جميع الحقول النصية والرقمية
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        data.append(key, formData[key]);
      }
    });

    // 2. إضافة الصور تحت المفتاح 'uploaded_images' كما يتوقع السيريالايزر
    formData.images.forEach((file) => {
      data.append('uploaded_images', file);
    });

    try {
      await ApiInstance.post('api/cars/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(); 
      onClose();   
      // إعادة ضبط النموذج بعد النجاح
      setFormData({
        status: 'found', brand: '', model: '', chassis_number: '', 
        plate_number: '', year: 2024, color: '', public_description: '',
        location_public: '', location_encrypted: '', images: []
      });
    } catch (err) {
      console.error("Response Error:", err.response?.data);
      alert("فشل في حفظ البيانات. يرجى التحقق من المدخلات.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Car size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">إضافة سيارة جديدة للنظام</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto text-right space-y-8" dir="rtl">
          
          {/* Section 1: Basic Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
              <Car size={18} className="text-blue-500" />
              <h3>المعلومات الأساسية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">الحالة</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none">
                  <option value="found">تم العثور عليها (Found)</option>
                  <option value="stolen">مسروقة (Stolen)</option>
                  <option value="claimed">تم التبليغ عنها (Claimed)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">الماركة</label>
                <input name="brand" required value={formData.brand} onChange={handleChange} placeholder="مثال: Toyota" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">الموديل</label>
                <input name="model" required value={formData.model} onChange={handleChange} placeholder="مثال: Corolla" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">سنة الصنع</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">رقم اللوحة</label>
                <input name="plate_number" value={formData.plate_number} onChange={handleChange} placeholder="مثال: أ ب ج 123" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">رقم الشاسيه</label>
                <input name="chassis_number" value={formData.chassis_number} onChange={handleChange} placeholder="رقم الهيكل" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 mr-1">اللون</label>
                <input name="color" value={formData.color} onChange={handleChange} placeholder="مثال: أبيض لؤلؤي" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Locations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
              <MapPin size={18} className="text-red-500" />
              <h3>بيانات الموقع</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1 text-red-500 flex items-center gap-1">
                  <ShieldCheck size={12}/> الموقع الدقيق (مشفّر للأدمن فقط)
                </label>
                <input name="location_encrypted" value={formData.location_encrypted} onChange={handleChange} placeholder="العنوان بالتفصيل" className="w-full p-3 bg-red-50/30 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-100 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 mr-1">الموقع العام (للجمهور)</label>
                <input name="location_public" value={formData.location_public} onChange={handleChange} placeholder="الحي أو المدينة" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </div>
          </section>

          {/* Section 3: Description & Images */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
              <FileText size={18} className="text-amber-500" />
              <h3>الوصف والصور</h3>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-1">وصف عام للسيارة</label>
              <textarea name="public_description" rows="3" value={formData.public_description} onChange={handleChange} placeholder="أضف أي تفاصيل تميز السيارة..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none resize-none"></textarea>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 mr-1">صور السيارة</label>
              <div className="relative group cursor-pointer">
                <input 
                  type="file" name="images" multiple accept="image/*" onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="border-2 border-dashed border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all rounded-2xl p-8 flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-full group-hover:text-blue-500 group-hover:bg-white transition-all">
                    <Upload size={24} />
                  </div>
                  <span className="text-sm font-medium text-slate-500">اضغط لرفع الصور أو اسحبها هنا</span>
                  <span className="text-xs text-slate-400">يمكنك اختيار أكثر من صورة (JPG, PNG)</span>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg font-bold border border-blue-100">
                      صورة {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-white">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>حفظ السيارة في القاعدة</span>
                </>
              )}
            </button>
            <button 
              type="button" onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;