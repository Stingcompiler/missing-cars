import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Clock, Truck, ShieldCheck } from 'lucide-react';

const StatusBadge = ({ status, type = 'car' }) => {
  
  // 1. إعدادات الحالات للسيارات (Car Model)
  const carStatusConfig = {
    found: {
      label: 'موجودة',
      styles: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2
    },
    claimed: {
      label: 'مطالب بها',
      styles: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertCircle
    },
    delivered: {
      label: 'تم التسليم',
      styles: 'bg-green-50 text-green-700 border-green-200',
      icon: ShieldCheck
    },
    removed: {
      label: 'محذوفة',
      styles: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle
    }
  };

  // 2. إعدادات الحالات لطلبات الاستلام (ClaimRequest Model)
  const claimStatusConfig = {
    pending: {
      label: 'قيد المراجعة',
      styles: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Clock
    },
    approved: {
      label: 'تمت الموافقة',
      styles: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle2
    },
    rejected: {
      label: 'مرفوض',
      styles: 'bg-red-50 text-red-700 border-red-200',
      icon: XCircle
    }
  };

  // اختيار الإعداد المناسب بناءً على النوع (car أو claim)
  const config = type === 'claim' ? claimStatusConfig : carStatusConfig;
  
  // البحث عن الحالة (مع تحويل النص لـ lowercase لضمان التطابق)
  const currentStatus = config[status?.toLowerCase()] || {
    label: status,
    styles: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: CheckCircle2
  };

  const Icon = currentStatus.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentStatus.styles}`}>
      <Icon size={14} />
      <span>{currentStatus.label}</span>
    </span>
  );
};

export default StatusBadge;