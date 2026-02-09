import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, trend, trendDirection = 'neutral', delay = 0 }) => {
  
  // تحديد لون واتجاه سهم التريند
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUp size={14} className="mr-1" />;
      case 'down': return <TrendingDown size={14} className="mr-1" />;
      default: return <Minus size={14} className="mr-1" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        {/* Icon Container */}
        <div className={`p-3.5 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>
        
        {/* Trend Badge */}
        {trend && (
          <div className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span dir="ltr">{trend}</span>
          </div>
        )}
      </div>

      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
    </motion.div>
  );
};

export default StatsCard;