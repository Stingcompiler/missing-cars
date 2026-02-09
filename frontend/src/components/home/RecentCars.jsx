import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CarCard from '../CarCard'; 

const RecentCars = ({ cars,isLoading }) => {

    if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4" id='services'>
      <div className="flex justify-between items-end mb-8">
         <div>
           <h2 className="text-3xl font-bold text-slate-900 mb-2">أحدث السيارات المضافة</h2>
           <p className="text-slate-500">تم التوثيق والمراجعة بواسطة الإدارة</p>
         </div>
         <Link to="/search" className="hidden md:flex items-center gap-1 text-primary-600 font-bold hover:gap-2 transition-all">
           <span>عرض كل السيارات</span>
           <ArrowLeft size={18} />
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {cars.map(car => (
           <CarCard key={car.id} car={car} lang="ar" />
         ))}
      </div>
      
      <Link to="/search" className="md:hidden mt-6 block text-center w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl">
          عرض كل السيارات
      </Link>
    </section>
  );
};

export default RecentCars;