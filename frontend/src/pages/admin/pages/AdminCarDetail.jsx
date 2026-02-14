import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Edit3, Trash2, MapPin, Shield, Eye, EyeOff,
  Car as CarIcon, Calendar, Hash, Palette, Globe, Lock, Save, X, Image as ImageIcon, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import ApiInstance from '../../../api/Api';
import EditCarModal from '../components/EditCarModal';

const AdminCarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carData, setCarData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEncryptedLocation, setShowEncryptedLocation] = useState(false);

  // دالة لإصلاح مسار الصورة (تغيير الـ localhost حسب إعداداتك)
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // قم بتغيير المنفذ 8000 ليتوافق مع منفذ Django الخاص بك
    const baseUrl = '';
    return `${baseUrl}${url}`;
  };

  const fetchCarDetails = async () => {
    try {
      setIsLoading(true);
      const response = await ApiInstance.get(`api/cars/${id}/`);
      setCarData(response.data);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل بيانات السيارة.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      try {
        await ApiInstance.delete(`api/cars/${id}/`);
        navigate('/adminPageSuction/cars', { replace: true });
      } catch (err) {
        alert("فشل الحذف.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-900 mb-4" size={40} />
        <p className="text-slate-500 font-bold">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !carData) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-6">
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">{error}</h2>
          <button onClick={() => navigate(-1)} className="bg-red-600 text-white px-6 py-2 rounded-xl">العودة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">

      {/* --- Top Bar: Responsive Layout --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
          <ArrowRight size={20} /> العودة للقائمة
        </button>

        <div className="flex w-full md:w-auto gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 md:flex-none justify-center bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-100 flex items-center gap-2"
          >
            <Trash2 size={20} /> <span className="md:hidden">حذف</span>
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex-[2] md:flex-none justify-center bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg"
          >
            <Edit3 size={18} /> تعديل البيانات
          </button>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Right Columns (Info & Images) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Specifications Card */}
          <div className="bg-white p-5 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute left-[-20px] top-[-20px] opacity-[0.03] pointer-events-none text-slate-900 hidden sm:block">
              <CarIcon size={180} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 relative z-10">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize">{carData.brand} {carData.model}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-slate-400 font-mono text-sm">ID: #{id}</span>
                  <StatusBadge status={carData.status} type="car" />
                </div>
              </div>
            </div>

            {/* Grid for Info: 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
              <InfoItem icon={Calendar} label="السنة" value={carData.year} />
              <InfoItem icon={Hash} label="اللوحة" value={carData.plate_number} isMono />
              <InfoItem icon={Palette} label="اللون" value={carData.color} />
              <InfoItem icon={Shield} label="الشاصي" value={carData.chassis_number} isMono />
            </div>
          </div>

          {/* 2. Responsive Image Gallery */}
          <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ImageIcon size={16} className="text-blue-500" /> صور السيارة ({carData.images?.length || 0})
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
              {carData.images?.map((imgObj) => (
                <div key={imgObj.id} className="relative w-64 h-40 sm:w-72 sm:h-48 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm snap-center">
                  <img
                    src={formatImageUrl(imgObj.image)}
                    alt="car"
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
                  />
                </div>
              ))}
              {(!carData.images || carData.images.length === 0) && (
                <div className="w-full py-12 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  لا توجد صور متوفرة.
                </div>
              )}
            </div>
          </div>

          {/* 3. Description Section */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Globe size={16} className="text-blue-500" /> الوصف العام
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {carData.public_description || 'لا يوجد وصف مضاف لهذه السيارة.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar (Full width on mobile, 1/3 on desktop) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-blue-400" /> موقع السيارة
            </h3>

            <div className="space-y-6">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">الموقع العام:</span>
                <p className="text-slate-100 text-sm mt-1">{carData.location_public}</p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-400 text-[10px] uppercase font-bold flex items-center gap-1">
                    <Lock size={12} /> العنوان الدقيق (مشفر):
                  </span>
                  <button
                    onClick={() => setShowEncryptedLocation(!showEncryptedLocation)}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                  >
                    {showEncryptedLocation ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 ${!showEncryptedLocation ? 'blur-md select-none opacity-20' : 'opacity-100'}`}>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {carData.location_encrypted}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">سجل النظام</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">تاريخ الإضافة</span>
                <span className="text-slate-700 font-bold">{new Date(carData.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">رقم المسؤول</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">#{carData.created_by}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCarModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={carData}
        onSave={fetchCarDetails}
      />
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, isMono }) => (
  <div className="flex flex-col gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
    <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1 tracking-tight">
      <Icon size={12} className="text-slate-300" /> {label}
    </span>
    <span className={`text-slate-900 font-bold text-sm sm:text-base truncate ${isMono ? 'font-mono' : ''}`}>
      {value || '---'}
    </span>
  </div>
);

export default AdminCarDetail;