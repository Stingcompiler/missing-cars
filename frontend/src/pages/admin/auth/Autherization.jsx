import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiInstance from '../../../api/Api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
    // داخل AuthProvider

    // دالة التحقق من الجلسة عند بدء التشغيل
    useEffect(() => {
        const checkLoggedIn = async () => {
        try {
            // نطلب بيانات المستخدم. الكوكيز تُرسل تلقائياً بفضل withCredentials: true
            const res = await ApiInstance.get('api/user/me/');
            
            // إذا نجح الطلب، فهذا يعني أن الكوكي صالح والمستخدم موجود
            setUser(res.data);
        } catch (error) {
            // إذا فشل (401)، يعني الكوكي منتهي أو غير موجود
            setUser(null);
        } finally {
            setIsLoading(false);
        }
        };

        checkLoggedIn();
    }, []);
  // Function to handle Login
  const login = async (identifier, password) => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Send Credentials to Backend
      // Django's 'OverrideObtainToken' view should set the HttpOnly cookie in the response header
      const response = await ApiInstance.post('api/token/', {
        username: identifier, // Django defaults to 'username' usually
        password: password
      });

      // 2. Handle Success
      // Even with HttpOnly cookies, your API might return non-sensitive user info (like name/role) in the body
      const userData = response.data; 
      
      setUser(userData); 
      
      // 3. Navigate to Dashboard
      navigate('/adminPageSuction/dashboard', { replace: true });
      
      return true;

    } catch (err) {
      // 4. Handle Errors
      console.error("Login Error:", err);
      
      if (!err?.response) {
        setError('لا يوجد اتصال بالخادم. يرجى التحقق من الإنترنت.');
      } else if (err.response?.status === 401) {
        setError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      } else {
        setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Optional: Call logout endpoint to clear cookie on server
      // await api.post('api/logout/'); 
      setUser(null);
      navigate('/admadminlogin');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

