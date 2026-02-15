import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, FileCheck, ShieldAlert, Lock, ArrowRight, Share2, CheckCircle2, Car } from 'lucide-react';
import ApiInstance from '../api/Api'; // Using your existing API instance

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await ApiInstance.get(`api/cars/${id}/`);
        setCar(response.data);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">جاري تحميل تفاصيل السيارة...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <ShieldAlert size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">عذراً، السيارة غير موجودة</h2>
        <p className="text-slate-500 mb-6">قد يكون تم حذف الإعلان أو أن الرابط غير صحيح.</p>
        <Link to="/search" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">العودة للبحث</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'found': return <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-1"><CheckCircle2 size={16} /> موجودة</span>;
      case 'claimed': return <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-1"><FileCheck size={16} /> جاري التحقق</span>;
      case 'delivered': return <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-1"><Car size={16} /> تم التسليم</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full font-bold text-sm">أرشيف</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/search" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold group">
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>العودة لنتائج البحث</span>
          </Link>
          <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-medium text-sm">
            <Share2 size={16} />
            مشاركة التقرير
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Right Column: Visuals & Main Data */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-3 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 mb-4">
                <img
                  src={car.images?.[activeImage]?.image || "https://via.placeholder.com/800x450?text=No+Image"}
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                  <ShieldAlert size={14} />
                  حماية الخصوصية: تم حذف بيانات الموقع من الصورة
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide">
                {car.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img.image} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">{car.brand} {car.model}</h1>
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(car.created_at).toLocaleDateString('ar-EG')}</span>
                    <span className="flex items-center gap-1"><MapPin size={16} /> {car.location_public.split('،')[0]}</span>
                  </div>
                </div>
                {getStatusBadge(car.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <DetailItem label="سنة الصنع" value={car.year} />
                <DetailItem label="اللون" value={car.color} />
                <DetailItem label="رقم اللوحة" value={car.plate_number || 'غير موجود'} isMono />
                <DetailItem label="رقم الشاصي (جزئي)" value={car.chassis_number} isMono />
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-900 mb-3">وصف الحالة والمعاينة</h3>
                <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed">
                  {car.public_description || "لا توجد ملاحظات إضافية مسجلة لهذه السيارة."}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Column: Side Actions */}
          <div className="space-y-6">

            {/* Protected Location Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative group">
              <div className="h-64 relative">
                <img
                  src="https://media.wired.com/photos/59269cd37034dc5f91dec261/master/pass/GoogleMapTA.jpg"
                  alt="Map" className="w-full h-full object-cover blur-md opacity-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="bg-white/10 p-4 rounded-full backdrop-blur-xl mb-4 text-blue-400 border border-white/20">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">الموقع الدقيق محمي</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">يتم عرض الموقع فقط للمالك بعد التأكد من شهادة البحث</p>
                  <div className="bg-blue-600/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30">
                    {car.location_public}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Claim Action Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50">
              <h3 className="text-xl font-bold text-slate-900 mb-3">هل هذه سيارتك؟</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">بإمكانك استلام موقع السيارة فوراً بعد رفع مستندات الملكية (صورة من شهادة البحث) للمراجعة.</p>

              <Link to={`/claimRequest?car_id=${car.id}&subject=claim`} className="block w-full bg-blue-600 text-white text-center font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                بدء إجراءات الاستلام
              </Link>

              <div className="mt-6 flex items-center justify-center gap-6 border-t pt-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">المراجعة</p>
                  <p className="text-sm font-bold text-slate-700">24 ساعة</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">الرسوم</p>
                  <p className="text-sm font-bold text-green-600">مجاناً</p>
                </div>
              </div>
            </div>

            {/* Security Alert */}
            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex gap-4">
              <ShieldAlert className="text-amber-600 shrink-0" size={24} />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                <span className="font-bold block mb-1">تنبيه أمني هام:</span>
                لا تقم أبداً بدفع مبالغ مالية لأي شخص يدعي أنه وجد سيارتك عبر الهاتف. منصة بشريات السودان مجانية بالكامل ولا تطلب عمولات مقابل استرداد الممتلكات.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean details
const DetailItem = ({ label, value, isMono }) => (
  <div>
    <span className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</span>
    <span className={`block font-bold text-slate-800 text-lg ${isMono ? 'font-mono tracking-wider' : ''}`}>
      {value || '-'}
    </span>
  </div>
);

export default CarDetailPage;