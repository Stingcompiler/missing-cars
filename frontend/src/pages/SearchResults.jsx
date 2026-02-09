import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import CarCard from '../components/CarCard';
import ApiInstance from '../api/Api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || "";
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await ApiInstance.get('api/cars/');
        // Filter logic specifically for the URL query
// Inside SearchResults.jsx useEffect:
      const filtered = response.data.filter(car => {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) return true;

        // Split the query into individual words (e.g., "red", "toyota", "2022")
        const searchWords = searchTerm.split(/\s+/);

        // A car matches if EVERY word in the search is found in at least ONE of the car fields
        return searchWords.every(word => {
          return (
            String(car.brand || "").toLowerCase().includes(word) ||
            String(car.model || "").toLowerCase().includes(word) ||
            String(car.chassis_number || "").toLowerCase().includes(word) ||
            String(car.plate_number || "").toLowerCase().includes(word) ||
            String(car.year || "").toLowerCase().includes(word) ||
            String(car.color || "").toLowerCase().includes(word)
          );
        });
      });
        setCars(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
      <div className="container mx-auto px-4">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">نتائج البحث عن: "{query}"</h1>
            <p className="text-slate-500">تم العثور على {cars.length} نتيجة</p>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
            <span>انتقل للأرشيف الكامل</span>
            <ArrowRight size={18} className="rotate-180" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.length > 0 ? (
              cars.map(car => (
                <motion.div key={car.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CarCard car={car} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">عذراً، لم نجد نتائج</h2>
                <p className="text-slate-500 mb-6">تأكد من كتابة الرقم بشكل صحيح أو جرب البحث بكلمات أخرى</p>
                <Link to="/search" className="bg-blue-600 text-white px-6 py-2 rounded-xl">تصفح كل السيارات</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;