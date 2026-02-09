import React, { useState, useEffect } from 'react';
import { Search, UserPlus, ShieldCheck, User as UserIcon, MoreVertical, Mail, Calendar, Trash2, Loader2, AlertCircle, X, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiInstance from '../../../api/Api';
import { useAuth } from '../../../hooks/UseAuthFunc';

// Role options
const ROLE_OPTIONS = [
  { value: 'admin', label: 'مشرف (Admin)', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'staff', label: 'موظف (Staff)', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'user', label: 'مستخدم عادي', color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

const UsersList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await ApiInstance.get('api/users/');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("فشل تحميل قائمة المستخدمين. تأكد من اتصالك وصلاحياتك.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User Logic - Only for admins
  const handleDeleteUser = async (id, username) => {
    if (username === 'super_admin') return;
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) return;

    try {
      await ApiInstance.delete(`api/users/${id}/`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert("حدث خطأ أثناء محاولة الحذف. قد لا تملك الصلاحيات الكافية.");
    }
  };

  // Add Staff Logic
  const handleAddStaff = async (staffData) => {
    try {
      const response = await ApiInstance.post('api/users/', staffData);
      setUsers([response.data, ...users]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Check if current user can delete
  const canDelete = currentUser?.is_admin || currentUser?.role === 'admin';

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && (user.is_admin || user.role === 'admin')) ||
      (roleFilter === 'staff' && user.role === 'staff') ||
      (roleFilter === 'user' && user.role === 'user' && !user.is_admin);

    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500">
      <Loader2 className="animate-spin text-primary-600" size={40} />
      <p>جاري تحميل قائمة المستخدمين...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
          <p className="text-slate-500 text-sm">التحكم في صلاحيات الوصول وإضافة موظفين جدد.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
        >
          <UserPlus size={18} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl p-4 md:p-5 text-white shadow-xl">
          <p className="text-slate-400 text-xs font-medium mb-1">الإجمالي</p>
          <p className="text-2xl md:text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-100">
          <p className="text-amber-600 text-xs font-medium mb-1">المشرفين</p>
          <p className="text-2xl md:text-3xl font-bold text-amber-700">{users.filter(u => u.is_admin || u.role === 'admin').length}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 md:p-5 border border-blue-100">
          <p className="text-blue-600 text-xs font-medium mb-1">الموظفين</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-700">{users.filter(u => u.role === 'staff').length}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200">
          <p className="text-slate-500 text-xs font-medium mb-1">المستخدمين</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-700">{users.filter(u => u.role === 'user' && !u.is_admin).length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم أو البريد أو اسم المستخدم..."
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 transition-all text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-pointer"
        >
          <option value="all">جميع الأدوار</option>
          <option value="admin">مشرف (Admin)</option>
          <option value="staff">موظف (Staff)</option>
          <option value="user">مستخدم عادي</option>
        </select>
      </div>

      {/* Users Table - Desktop */}
      <div className="bg-white md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
                <th className="p-5">المستخدم</th>
                <th className="p-5">البريد الإلكتروني</th>
                <th className="p-5">تاريخ الانضمام</th>
                <th className="p-5">الدور</th>
                <th className="p-5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <DesktopRow
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                    canDelete={canDelete}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {filteredUsers.map((user) => (
            <MobileCard
              key={user.id}
              user={user}
              onDelete={handleDeleteUser}
              canDelete={canDelete}
            />
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddStaffModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddStaff}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Desktop Row Component
const DesktopRow = ({ user, onDelete, canDelete }) => (
  <motion.tr
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="hover:bg-slate-50/30 transition-colors group"
  >
    <td className="p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.is_admin || user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
            user.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{user?.full_name || user?.username}</span>
          <span className="text-xs text-slate-400 font-mono">@{user?.username}</span>
        </div>
      </div>
    </td>
    <td className="p-5 text-sm text-slate-600">{user?.email}</td>
    <td className="p-5 text-sm text-slate-600">
      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('ar-EG') : '-'}
    </td>
    <td className="p-5">
      <RoleBadge role={user.role} isAdmin={user.is_admin} />
    </td>
    <td className="p-5">
      <div className="flex items-center justify-center gap-2">
        {canDelete && user.username !== 'super_admin' && (
          <button
            onClick={() => onDelete(user?.id, user?.username)}
            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </td>
  </motion.tr>
);

// Mobile Card Component
const MobileCard = ({ user, onDelete, canDelete }) => (
  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.is_admin || user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
            user.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm block">{user?.full_name || user?.username}</span>
          <span className="text-xs text-slate-400 font-mono">@{user?.username}</span>
        </div>
      </div>
      <RoleBadge role={user.role} isAdmin={user.is_admin} />
    </div>

    <div className="text-xs text-slate-500 space-y-1">
      <p>{user?.email}</p>
      <p>انضم: {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('ar-EG') : '-'}</p>
    </div>

    {canDelete && user.username !== 'super_admin' && (
      <button
        onClick={() => onDelete(user?.id, user?.username)}
        className="w-full py-2 text-red-600 bg-red-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
      >
        <Trash2 size={14} />
        حذف
      </button>
    )}
  </div>
);

// Role Badge Component
const RoleBadge = ({ role, isAdmin }) => {
  if (isAdmin || role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
        <ShieldCheck size={14} />
        مشرف نظام
      </span>
    );
  }
  if (role === 'staff') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
        <Shield size={14} />
        موظف
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 text-xs font-bold">
      <UserIcon size={14} />
      مستخدم
    </span>
  );
};

// Add Staff Modal Component
const AddStaffModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role: 'staff',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء إضافة الموظف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-600" />
            إضافة موظف جديد
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم المستخدم *</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="مثال: ahmed_staff"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="مثال: أحمد محمد"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الدور *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="staff">موظف (Staff) - يمكنه الإضافة والتعديل فقط</option>
              <option value="admin">مشرف (Admin) - صلاحيات كاملة</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">
              الموظف يمكنه إدارة السيارات والطلبات لكن لا يمكنه الحذف
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {loading ? 'جاري الإضافة...' : 'إضافة الموظف'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UsersList;