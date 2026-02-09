import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, FileText, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'نظرة عامة', path: '/adminPageSuction/dashboard', icon: LayoutDashboard },
    { name: 'إدارة السيارات', path: '/adminPageSuction/cars', icon: CarFront },
    { name: 'طلبات الاستلام', path: '/adminPageSuction/claims', icon: FileText },
    { name: 'المستخدمين', path: '/adminPageSuction/users', icon: Users },
   
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed right-0 top-0 z-50 flex flex-col hidden lg:flex">
      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="bg-primary-600 p-1.5 rounded-lg">
          <ShieldCheck size={20} />
        </div>
        <span className="font-bold text-lg tracking-wide">لوحة الإدارة</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
              ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
            `}
          >
            <link.icon size={20} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout
      
            <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-bold">تسجيل خروج</span>
        </button>
      </div>*/}

    </aside>
  );
};

export default Sidebar;