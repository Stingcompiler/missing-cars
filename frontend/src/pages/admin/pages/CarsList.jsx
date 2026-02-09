import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit2, Car as CarIcon, Calendar, Hash, Clock, Trash2, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AddCarModal from '../components/AddCarModal'
import ApiInstance from '../../../api/Api';

const CarsList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [carsList, setCarsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // حالة رسالة النجاح

  const fetchCarList = async () => {
    setIsLoading(true);
    try {
      const response = await ApiInstance.get('api/cars/');
      setCarsList(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      setError("فشل تحميل قائمة السيارات.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarList();
  }, []);


  const handleDeleteCar = async (carId) => {
  const url = `api/cars/${carId}/`;
  console.log("Attempting to delete at:", url); // تأكد من أن الـ ID يظهر بشكل صحيح
  try {
    const res = await ApiInstance.delete(url);
    console.log("Response:", res);
    setSuccessMessage("تم حذف السيارة بنجاح");
    setTimeout(() => setSuccessMessage(null), 3000);
    setCarsList(prev => prev.filter(car => car.id !== carId));
    
    
  } catch (err) {
    // 4. فحص الخطأ بدقة
    console.error("Delete Action Failed:", err.response);
    
    if (err.response?.status === 403) {
      setError("خطأ 403: حسابك لا يملك صلاحية مسؤول (is_admin)");
    } else {
      setError(err.response?.data?.detail || "حدث خطأ غير متوقع أثناء الحذف");
    }
  } 
  
};


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0" dir="rtl">
      
      {/* رسائل التنبيه (HTML Elements) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-md space-y-2">
        {successMessage && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="font-bold text-sm">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)}><X size={18} /></button>
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-bold text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)}><X size={18} /></button>
          </div>
        )}
      </div>

      {/* الرأس */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة السيارات</h1>
          <p className="text-slate-500 font-medium font-mono text-sm leading-none mt-1">Total: {carsList.length} Cars</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Plus size={20} />
          <span>إضافة سيارة جديدة</span>
        </button>
      </div>

      {/* نظام البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carsList.map((car) => (
          <div key={car.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col justify-between group overflow-hidden relative">
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 overflow-hidden border border-slate-50 flex-shrink-0">
                    {car.images?.length > 0 ? (
                      <img src={car.images[0].image} className="w-full h-full object-cover" alt="car" />
                    ) : (
                      <CarIcon className="w-full h-full p-4 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xl leading-tight">
                      {car.brand}
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase">{car.model}</p>
                  </div>
                </div>
                <StatusBadge status={car.status} type="car" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-4 rounded-3xl flex flex-col justify-center gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">سنة الصنع</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-900" />
                    <span className="text-sm font-black text-slate-900">{car.year}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl flex flex-col justify-center gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">رقم اللوحة</span>
                  <span className="text-sm font-black text-slate-900 font-mono tracking-widest">{car.plate_number}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold px-1">
                <Clock size={14} />
                <span>تاريخ التسجيل: {formatDate(car.created_at)}</span>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 mt-8 pt-6 border-t border-slate-50">
              <Link 
                to={`/adminPageSuction/cars/${car.id}`} 
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                <Eye size={18} />
                <span className="text-xs">التفاصيل</span>
              </Link>
              
              <button 
                onClick={() => handleDeleteCar(car.id)}
                disabled={deletingId === car.id}
                className="w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {deletingId === car.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddCarModal
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={fetchCarList} 
      />
    </div>
  );
};

export default CarsList;