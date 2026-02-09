import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2, Car, MapPin, Shield, Palette, Loader2, AlertCircle } from 'lucide-react';
import ApiInstance from '../../../api/Api';

const EditCarModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // حالة لحفظ الخطأ وعرضه في HTML
  
  const [formData, setFormData] = useState({
    status: '', brand: '', model: '', chassis_number: '',
    plate_number: '', year: '', color: '', public_description: '',
    location_public: '', location_encrypted: '',
  });
  
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        status: initialData.status || 'found',
        brand: initialData.brand || '',
        model: initialData.model || '',
        chassis_number: initialData.chassis_number || '',
        plate_number: initialData.plate_number || '',
        year: initialData.year || '',
        color: initialData.color || '',
        public_description: initialData.public_description || '',
        location_public: initialData.location_public || '',
        location_encrypted: initialData.location_encrypted || '',
      });
      setNewImages([]);
      setErrorMessage(null);
    }
  }, [initialData, isOpen]);

  // دالة تصحيح رابط الصورة
  const fixImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // إذا كان الرابط يبدأ بـ /media/ أو /car_images/
    const baseUrl = "http://localhost:8000"; // تأكد من مطابقة منفذ السيرفر
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if(errorMessage) setErrorMessage(null); // مسح الخطأ عند الكتابة
  };

  const handleDeleteImage = async (imageId) => {
    setIsDeletingImage(imageId);
    setErrorMessage(null);
    try {
      await ApiInstance.delete(`api/cars/${initialData.id}/delete-image/${imageId}/`);
      onSave(); // تحديث البيانات
    } catch (err) {
      setErrorMessage("عذراً، تعذر حذف الصورة من السيرفر.");
    } finally {
      setIsDeletingImage(null);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const data = new FormData();
    
    // 1. إضافة الحقول النصية
    Object.keys(formData).forEach(key => {
      // نرسل القيمة فقط إذا كانت موجودة
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    // 2. إضافة الصور الجديدة (هنا يكمن حل المشكلة)
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        // نستخدم نفس الاسم 'uploaded_images' لكل ملف
        // Django سيقوم بتجميعهم في QueryDict كـ list
        data.append('uploaded_images', file);
      });
    }

    try {
      // نستخدم PATCH للتحديث الجزئي
      await ApiInstance.patch(`api/cars/${initialData.id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      onSave(); // تحديث البيانات في الصفحة الأب
      onClose();
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      
      // عرض رسالة الخطأ القادمة من السيرفر بشكل منسق
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        // إذا كان الخطأ متعلق بالصور نعرصه بوضوح
        if (serverError.uploaded_images) {
          setErrorMessage(`خطأ في الصور: ${serverError.uploaded_images}`);
        } else {
          setErrorMessage(Object.values(serverError).flat().join(' | '));
        }
      } else {
        setErrorMessage("حدث خطأ غير متوقع أثناء الحفظ.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Car size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">تعديل #{initialData.id}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        {/* Error Message Box - HTML Element */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-right" dir="rtl">
          
          {/* Inputs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">الحالة</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-slate-900">
                  <option value="found">موجودة</option>
                  <option value="claimed">تم التبليغ</option>
                  <option value="delivered">تم التسليم</option>
                </select>
             </div>
             <InputGroup label="الماركة" name="brand" value={formData.brand} onChange={handleChange} icon={Car} />
             <InputGroup label="الموديل" name="model" value={formData.model} onChange={handleChange} />
             <InputGroup label="اللون" name="color" value={formData.color} onChange={handleChange} icon={Palette} />
          </div>

          {/* Current Images Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase">الصور الحالية</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {initialData.images?.map((img) => (
                <div key={img.id} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={fixImageUrl(img.image)} className="w-full h-full object-cover" alt="car" />
                  <button 
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 left-1 p-1.5 bg-red-600 text-white rounded-lg hover:scale-110 transition-transform"
                  >
                    {isDeletingImage === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-all cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" // تحديد الصور فقط
                onChange={(e) => {
                    if (e.target.files) {
                    setNewImages(Array.from(e.target.files));
                    }
                }} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              <Upload className="text-slate-400 mx-auto mb-2" size={24} />
              <span className="text-sm text-slate-600 block">اضغط لرفع صور إضافية</span>
              {newImages.length > 0 && <span className="text-xs text-blue-600 font-bold mt-1 block">تم اختيار {newImages.length} صور</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputGroup label="الموقع العام" name="location_public" value={formData.location_public} onChange={handleChange} icon={MapPin} />
             <InputGroup label="الموقع الدقيق" name="location_encrypted" value={formData.location_encrypted} onChange={handleChange} icon={Shield} className="text-red-600" />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 sticky bottom-0 bg-white border-t border-slate-50 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200">إلغاء</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              تحديث البيانات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon: Icon, className, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
      {Icon && <Icon size={10} />} {label}
    </label>
    <input 
      {...props}
      className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900 text-sm font-bold ${className}`} 
    />
  </div>
);

export default EditCarModal;