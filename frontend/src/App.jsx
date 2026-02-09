import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// المخططات (Layouts)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './pages/admin/layout/AdminLayout';

// الصفحات العامة
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SearchResults from './pages/SearchResults';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPolicies';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import CarDetailPage from './pages/CarDetail';
import NotFound from './pages/NotFound';

// صفحات الأدمن
import DashboardHome from './pages/admin/pages/DashboardHome';
import AdminCarsList from './pages/admin/pages/CarsList';
import AdminCarDetail from './pages/admin/pages/AdminCarDetail';
import ClaimsList from './pages/admin/pages/ClaimsList';
import UsersList from './pages/admin/pages/UsersList';
import AdminLogin from './pages/admin/pages/AdminLogin';
import { AuthProvider } from './pages/admin/auth/Autherization';
import ProtectedRoute from './routes/ProtectedRoutes';
import ClaimRequestPage from './pages/ClaimRequest';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- 1. المسارات العامة --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="claimRequest" element={<ClaimRequestPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="cars/:id" element={<CarDetailPage />} />
        </Route>

        {/* --- 2. مسارات لوحة التحكم (التصحيح هنا) --- */}
        {/* ProtectedRoute لا يأخذ أطفالاً بداخله، بل يحيط بهم كأب في الراوتر */}
        <Route element={<ProtectedRoute />}>
          <Route path="/adminPageSuction" element={<AdminLayout />}>
            {/* التوجيه التلقائي */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* المسارات الفرعية (لاحظ إزالة /admin من البداية لأنها نسبية) */}
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="cars" element={<AdminCarsList />} />
            <Route path="cars/:id" element={<AdminCarDetail />} />
            <Route path="claims" element={<ClaimsList />} />
            <Route path="users" element={<UsersList />} />
          </Route>
        </Route>

        {/* صفحة تسجيل الدخول (خارج الحماية) */}
        <Route path="/admadminlogin" element={<AdminLogin />} />

        {/* صفحة 404: تأكد أنها في النهاية */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;