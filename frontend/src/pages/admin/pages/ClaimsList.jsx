import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, Download, Loader2, AlertCircle, Trash2, ExternalLink, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import ApiInstance from '../../../api/Api';

// Status options for the dropdown
const STATUS_OPTIONS = [
  { value: 'pending', label: 'معلق', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'approved', label: 'مقبول', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'rejected', label: 'مرفوض', color: 'bg-red-100 text-red-700 border-red-200' },
];

const ClaimsList = () => {
  const [filter, setFilter] = useState('all');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for Previewing
  const [previewFile, setPreviewFile] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await ApiInstance.get('api/claims/');
      setClaims(response.data);
      setError(null);
    } catch (err) {
      setError("فشل تحميل طلبات الاستلام.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  // تحديث حالة الطلب
  const handleStatusChange = async (id, newStatus) => {
    const statusLabels = { pending: 'معلق', approved: 'مقبول', rejected: 'مرفوض' };
    const confirmChange = window.confirm(`هل تريد تغيير حالة الطلب إلى "${statusLabels[newStatus]}"؟`);
    if (!confirmChange) return;

    try {
      await ApiInstance.patch(`api/claims/${id}/`, { status: newStatus });
      // تحديث الحالة محلياً لتسريع الواجهة
      setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Error updating status:', err);
      alert("حدث خطأ أثناء تحديث الحالة.");
    }
  };

  // مكون قائمة الحالة المنسدلة
  const StatusDropdown = ({ claim }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentStatus = STATUS_OPTIONS.find(s => s.value === claim.status);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${currentStatus?.color || 'bg-slate-100 text-slate-600'}`}
        >
          {currentStatus?.label || claim.status}
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 min-w-[120px]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value !== claim.status) {
                        handleStatusChange(claim.id, option.value);
                      }
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-right text-xs font-bold transition-colors hover:bg-slate-50 flex items-center gap-2 ${option.value === claim.status ? 'bg-slate-50' : ''
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
                    {option.label}
                    {option.value === claim.status && <CheckCircle size={12} className="mr-auto text-green-500" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.")) return;
    try {
      await ApiInstance.delete(`api/claims/${id}/`);
      setClaims(claims.filter(c => c.id !== id)); // Optimized UI update
    } catch (err) {
      alert("فشل الحذف. قد لا تملك الصلاحيات الكافية.");
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesFilter = filter === 'all' || claim.status === filter;
    const matchesSearch = claim.claimant_name.toLowerCase().includes(searchTerm.toLowerCase()) || claim.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Helper to check file type
  const isImage = (url) => {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p>جاري تحميل البيانات...</p>
    </div>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Filters (Keep as is) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">طلبات الاستلام</h1>
          <p className="text-slate-500 font-medium">مراجعة والتحقق من مستندات الملكية.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              {s === 'all' ? 'الكل' : s === 'pending' ? 'معلق' : s === 'approved' ? 'مقبول' : 'مرفوض'}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredClaims.map((claim) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key={claim.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
            >
              {/* Header with name and status */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{claim.claimant_name}</span>
                  <span className="block text-xs text-slate-400 mt-0.5 font-mono" dir="ltr">{claim.claimant_contact}</span>
                </div>
                <StatusDropdown claim={claim} />
              </div>

              {/* Car info */}
              <div className="bg-slate-50 rounded-xl p-3">
                <span className="text-xs text-slate-500 block mb-1">السيارة</span>
                <span className="text-sm font-bold text-slate-700">{claim.car_details?.brand} {claim.car_details?.model}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">ID: #{claim.car}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {claim.proof_files ? (
                  <button
                    onClick={() => setPreviewFile(claim.proof_files)}
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all text-xs font-bold border border-blue-100"
                  >
                    <Eye size={14} />
                    معاينة المستند
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs italic">لا توجد مرفقات</span>
                )}
                <button onClick={() => handleDelete(claim.id)} className="p-2 text-red-500 bg-red-50 rounded-xl" title="حذف الطلب">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500">
                <th className="p-6 uppercase">مقدم الطلب</th>
                <th className="p-6 uppercase">السيارة</th>
                <th className="p-6 uppercase">المستند</th>
                <th className="p-6 uppercase">الحالة</th>
                <th className="p-6 uppercase text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredClaims.map((claim) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={claim.id} className="hover:bg-slate-50/50 group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{claim.claimant_name}</span>
                        <span className="text-xs text-slate-400 mt-1 font-mono" dir="ltr">{claim.claimant_contact}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{claim.car_details?.brand} {claim.car_details?.model}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ID: #{claim.car}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      {claim.proof_files ? (
                        <button
                          onClick={() => setPreviewFile(claim.proof_files)}
                          className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all text-xs font-bold border border-blue-100"
                        >
                          <Eye size={14} />
                          معاينة سريعة
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">لا توجد مرفقات</span>
                      )}
                    </td>
                    <td className="p-6"><StatusDropdown claim={claim} /></td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(claim.id)} className="p-2 text-red-500 bg-red-50 rounded-lg" title="حذف الطلب"><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-4xl max-h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" /> مستند الإثبات المرفق
                </h3>
                <div className="flex items-center gap-2">
                  <a href={previewFile} download target="_blank" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><Download size={20} /></a>
                  <button onClick={() => setPreviewFile(null)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
              </div>

            // داخل قسم iframe في المودال
              <div className="flex-1 overflow-auto bg-slate-100 p-6 flex justify-center">
                {isImage(previewFile) ? (
                  <img src={previewFile} alt="Proof" className="max-w-full h-auto rounded-lg shadow-md object-contain" />
                ) : (
                  <div className="w-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-10 bg-white rounded-3xl shadow-sm border border-slate-200">
                      <FileText size={64} className="text-blue-500 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-800">معاينة المستند غير متاحة مباشرة</h4>
                      <p className="text-slate-500 mb-6">المستند من نوع (Text/PDF)، يرجى فتحه في نافذة جديدة للمعاينة.</p>
                      <a
                        href={previewFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-blue-700 transition-all"
                      >
                        <ExternalLink size={20} />
                        فتح المستند الآن
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClaimsList;