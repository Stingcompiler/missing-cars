import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, FileText, Users } from 'lucide-react';

const MobileNav = () => {
  // تعريف الروابط الأساسية للوصول السريع
  const navItems = [
    { name: 'الرئيسية', path: '/adminPageSuction/dashboard', icon: LayoutDashboard },
    { name: 'السيارات', path: '/adminPageSuction/cars', icon: CarFront },
    { name: 'الطلبات', path: '/adminPageSuction/claims', icon: FileText },
    { name: 'الأعضاء', path: '/adminPageSuction/users', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-2 pb-safe z-[60] shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300
              ${isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            {({ isActive }) => (
              <>
                {/* خلفية خفيفة للأيقونة النشطة */}
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-50 scale-110' : 'bg-transparent'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                {/* اسم الصفحة */}
                <span className={`text-[10px] font-bold transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-70'}`}>
                  {item.name}
                </span>

                {/* مؤشر النقطة للأيقونة النشطة */}
                {isActive && (
                  <span className="absolute -top-1 w-1 h-1 bg-primary-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;