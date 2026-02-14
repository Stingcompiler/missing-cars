import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Loader2, FileText, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiInstance from '../../../api/Api';
import { useAuth } from '../../../hooks/UseAuthFunc';
const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // حالات الإشعارات
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  // مفتاح التخزين المحلي لآخر وقت تم فيه فتح الإشعارات
  const LAST_SEEN_KEY = 'admin_notifications_last_seen';

  // الحصول على آخر وقت تم فيه مشاهدة الإشعارات
  const getLastSeenTime = () => {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    return stored ? new Date(stored) : new Date(0); // إذا لم يوجد، نعيد تاريخ قديم جداً
  };

  // حساب الوقت النسبي (منذ كم من الوقت)
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  // جلب الإشعارات الجديدة فقط (الطلبات الأحدث من آخر زيارة)
  const fetchNotifications = async () => {
    try {
      const res = await ApiInstance.get('api/claims/');
      const allClaims = res.data;
      const lastSeen = getLastSeenTime();

      // فلترة الطلبات الجديدة فقط (التي تم إنشاؤها بعد آخر مشاهدة)
      const newClaims = allClaims.filter(claim => {
        const claimDate = new Date(claim.created_at);
        return claimDate > lastSeen;
      });

      setNotifications(newClaims);
    } catch (err) {
      console.error("خطأ في جلب الإشعارات:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // عند فتح قائمة الإشعارات، نحدث آخر وقت مشاهدة
  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.length > 0) {
      // عند فتح القائمة، نحفظ الوقت الحالي كآخر مشاهدة
      localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    }
  };

  // عند إغلاق القائمة، نمسح الإشعارات المعروضة
  const handleCloseNotifications = () => {
    setShowNotifications(false);
    // نحدث آخر وقت مشاهدة ونمسح الإشعارات
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    setNotifications([]);
  };

  const handleLogout = async () => {
    if (!window.confirm("هل أنت متأكد من تسجيل الخروج؟")) return;
    setIsLoggingOut(true);
    try {
      await ApiInstance.post('api/logout/');
      navigate('/admadminlogin');
    } catch (err) {
      console.log("Logout Error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // عند النقر على إشعار
  const handleNotificationClick = (claimId) => {
    // حفظ الوقت الحالي كآخر مشاهدة
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    setShowNotifications(false);
    setNotifications([]);
    navigate(`/adminPageSuction/claims?id=${claimId}`);
  };

  return (
    <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 hidden sm:block">مرحباً، المشرف العام 👋</h2>
        <h2 className="text-lg font-bold text-slate-800 sm:hidden">لوحة التحكم 👋</h2>
      </div>

      <div className="flex items-center gap-4">

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={handleOpenNotifications}
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* قائمة الإشعارات المنسدلة */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={handleCloseNotifications}></div>
                <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <span className="font-bold text-slate-800 text-sm">إشعارات جديدة</span>
                    <button onClick={handleCloseNotifications}><X size={16} className="text-slate-400" /></button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item.id)}
                          className="p-4 border-b border-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors flex items-start gap-3 text-right"
                        >
                          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                            <FileText size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-900">طلب استرداد جديد</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">قام {item.claimant_name} بإرسال مستندات للمراجعة</p>
                            <div className="flex items-center gap-1 mt-2 text-[9px] text-slate-400">
                              <Clock size={10} />
                              <span>{getRelativeTime(item.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Bell size={32} className="opacity-20" />
                        <p className="text-xs">لا توجد إشعارات جديدة</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { navigate('/adminPageSuction/claims'); setShowNotifications(false); }}
                    className="w-full py-3 text-center text-xs font-bold text-blue-600 bg-blue-50/30 hover:bg-blue-50 transition-colors"
                  >
                    عرض جميع الطلبات
                  </button>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button & User Info */}
        <div className="flex items-center gap-3 border-r border-slate-200 pr-4 mr-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold text-sm"
          >
            {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            <span className="hidden md:inline">خروج</span>
          </button>

          <div className="text-right hidden sm:block">
            <span className="block text-sm font-bold text-slate-900"> {user?.username}</span>
            <span className="block text-xs text-slate-500">Super Admin</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

// ملاحظة: تأكد من تعريف AnimatePresence من framer-motion إذا كنت تستخدمها
import { AnimatePresence } from 'framer-motion';

export default Topbar;