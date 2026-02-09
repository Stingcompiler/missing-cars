import React, { useState, useEffect } from 'react';
import { Car, FileCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';

import { useNavigate } from 'react-router-dom';
import ApiInstance from '../../../api/Api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCars: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    recentClaims: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // جلب البيانات بالتوازي لسرعة الأداء
      const [carsRes, claimsRes] = await Promise.all([
        ApiInstance.get('api/cars/'),
        ApiInstance.get('api/claims/')
      ]);

      const allClaims = claimsRes.data;

      setStats({
        totalCars: carsRes.data.length,
        pendingClaims: allClaims.filter(c => c.status === 'pending').length,
        approvedClaims: allClaims.filter(c => c.status === 'approved').length,
        recentClaims: allClaims.slice(0, 5) // عرض آخر 5 طلبات فقط
      });
    } catch (err) {
      console.error("خطأ في جلب بيانات لوحة التحكم:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <span className="font-bold">جاري تحديث البيانات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ترويسة الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">نظرة عامة</h1>
          <p className="text-slate-500 text-xs sm:text-sm">ملخص مباشر لنشاط المنصة.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all w-full sm:w-auto text-center"
        >
          تحديث الآن
        </button>
      </div>

      {/* شبكة الإحصائيات (Dynamic Stats Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="إجمالي السيارات"
          value={stats.totalCars}
          icon={Car}
          color="bg-blue-50 text-blue-600"
          trend="المسجلة حالياً"
          trendDirection="neutral"
        />
        <StatsCard
          title="طلبات معلقة"
          value={stats.pendingClaims}
          icon={AlertCircle}
          color="bg-orange-50 text-orange-600"
          trend="تحتاج مراجعة فورية"
          trendDirection={stats.pendingClaims > 0 ? "up" : "neutral"}
        />
        <StatsCard
          title="طلبات مكتملة"
          value={stats.approvedClaims}
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
          trend="تم تسليمها لأصحابها"
          trendDirection="up"
        />
        <StatsCard
          title="الطلبات الكلية"
          value={stats.recentClaims.length}
          icon={FileCheck}
          color="bg-purple-50 text-purple-600"
          trend="منذ انطلاق المنصة"
          trendDirection="up"
        />
      </div>

      {/* جدول النشاط الأخير (Real Data Table) */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden border-b-4 border-b-blue-500">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-bold text-base md:text-lg text-slate-800">آخر طلبات الاستلام</h3>
          <button
            onClick={() => navigate('/adminPageSuction/claims')}
            className="text-blue-600 text-xs sm:text-sm font-bold hover:underline"
          >
            عرض كافة الطلبات
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-3">
          {stats.recentClaims.length > 0 ? (
            stats.recentClaims.map((claim) => (
              <div key={claim.id} className="bg-slate-50 rounded-xl p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{claim.claimant_name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{claim.claimant_contact}</span>
                  </div>
                  <StatusBadge status={claim.status} type="claim" />
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-slate-600 font-medium">{claim.car_details?.brand || 'غير محدد'}</span>
                  </div>
                  <span className="text-slate-400">{new Date(claim.created_at).toLocaleDateString('ar-EG')}</span>
                </div>

                {/* Action */}
                <button
                  onClick={() => navigate(`/adminPageSuction/claims?id=${claim.id}`)}
                  className="w-full bg-slate-900 text-white text-[10px] px-4 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm"
                >
                  مراجعة الملف
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <FileCheck size={32} className="opacity-10" />
              <p className="text-sm">لا توجد طلبات مسجلة حتى الآن</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50/50 text-slate-500 italic">
              <tr>
                <th className="p-4 font-bold">مقدم الطلب</th>
                <th className="p-4 font-bold">السيارة المعنية</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentClaims.length > 0 ? (
                stats.recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{claim.claimant_name}</span>
                        <span className="text-[10px] text-slate-400">{claim.claimant_contact}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-slate-600 font-medium">{claim.car_details?.brand || 'غير محدد'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(claim.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={claim.status} type="claim" />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/adminPageSuction/claims?id=${claim.id}`)}
                        className="bg-slate-900 text-white text-[10px] px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm"
                      >
                        مراجعة الملف
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileCheck size={40} className="opacity-10" />
                      <p>لا توجد طلبات مسجلة حتى الآن</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;