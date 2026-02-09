import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuthFunc';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // 3. أثناء التحقق من السيرفر، لا تفعل شيئاً (أو اعرض سبينر)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 4. الآن فقط إذا انتهى التحميل ولم نجد مستخدم، نتوجه للـ login
  return user ? <Outlet /> : <Navigate to="/admadminlogin" replace />;
};

export default ProtectedRoute