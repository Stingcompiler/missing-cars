import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/UseAuthFunc';
 // Adjust path as needed

const AdminLogin = () => {
  const { login, isLoading, error } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // We just call login. The Context handles the API request and redirection.
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200 mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">دخول الإدارة</h1>
            <p className="text-slate-500 text-sm mt-2">استخدم اسم المستخدم أو البريد الإلكتروني</p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold mb-6"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 mr-2 uppercase">الهوية الرقمية</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition-all text-sm text-slate-800" 
                  placeholder="اسم المستخدم" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 mr-2 uppercase">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition-all font-mono text-sm text-slate-800" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg 
                ${isLoading 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/20'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>جاري التحقق...</span>
                </>
              ) : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-slate-400 text-xs">نظام بشريات السودان &copy; 2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;