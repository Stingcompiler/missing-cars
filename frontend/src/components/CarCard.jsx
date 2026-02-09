import React from 'react';
import { MapPin, Calendar, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion'

const CarCard = ({ car, lang = 'en' }) => {
  // Mock fallback image if none provided
  const thumbnail = car.images?.[0]?.image || 'https://via.placeholder.com/400x250?text=No+Image';
  const isArabic = lang === 'ar';

  return (
    <motion.div 
  whileHover={{ y: -5 }}
  className="bg-white rounded-2xl shadow-sm ..."
>
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden group">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={thumbnail} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
           <ShieldCheck size={12} />
           <span>EXIF Removed</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-xs font-mono opacity-80">
            ID: #{car.id} • Posted {new Date(car.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              {car.brand} {car.model}
            </h3>
            <p className="text-slate-500 text-sm">{car.year} • {car.color}</p>
          </div>
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
            ${car.status === 'found' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {car.status}
          </span>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 text-sm text-slate-600">
           <div className="flex items-center gap-2 bg-slate-50 p-2 rounded">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
             <span className="font-mono">{car.plate_number || 'No Plate'}</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-50 p-2 rounded">
             <MapPin size={14} className="text-primary-500" />
             <span className="truncate">{car.location_public}</span>
           </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/cars/${car.id}`}
          className="block w-full text-center bg-white border-2 border-slate-200 text-slate-700 font-semibold py-2 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          {isArabic ? 'عرض التفاصيل وطلب الموقع' : 'View Details & Request Location'}
        </Link>
      </div>
    </div>

    </motion.div>
  );
};

export default CarCard;