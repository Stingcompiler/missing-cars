import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import MobileNav from '../components/MobileNav';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  // حالة التحكم في فتح وإغلاق السايدبار في الموبايل
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* نمرر الحالة وفتح/إغلاق للسايدبار */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        {/* نمرر دالة التبديل للـ Topbar ليفتح السايدبار */}
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-4 md:p-8 flex-1 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <footer className="hidden lg:block p-6 text-center text-slate-400 text-sm">
          &copy; 2026 مفقودات السودان - الإدارة
        </footer>
      </div>

      {/* شريط التنقل السفلي للموبايل (اختياري مع السايدبار) */}
      <MobileNav />
    </div>
  );
};

export default AdminLayout;