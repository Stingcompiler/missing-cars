import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CarFront, RefreshCw } from 'lucide-react';
import CarCard from '../components/CarCard';
import ApiInstance from '../api/Api';
import SearchCarCard from '../components/CarCardSeacrh';

const SearchPage = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    brand: "all",
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchCar = async () => {
      setIsLoading(true);
      try {
        const response = await ApiInstance.get('api/cars/');
        setCars(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCar();
  }, []);

  // --- 2. Filter Logic (Memoized for performance) ---
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const query = searchQuery.toLowerCase().trim();

      // Search matches
      const matchesSearch = query === "" || (
        String(car.plate_number || "").toLowerCase().includes(query) ||
        String(car.chassis_number || "").toLowerCase().includes(query) ||
        String(car.brand || "").toLowerCase().includes(query) ||
        String(car.model || "").toLowerCase().includes(query) ||
        String(car.year || "").includes(query)
      );

      // Status matches
      const matchesStatus = filters.status === "all" ||
        String(car.status || "").toLowerCase() === filters.status.toLowerCase();

      // Brand matches
      const matchesBrand = filters.brand === "all" ||
        car.brand === filters.brand;

      return matchesSearch && matchesStatus && matchesBrand;
    });
  }, [cars, searchQuery, filters]);

  // --- 3. Dynamic Brand List ---
  const uniqueBrands = useMemo(() => {
    const brands = cars.map(car => car.brand).filter(Boolean);
    return [...new Set(brands)];
  }, [cars]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8" dir="rtl">
      <div className="container mx-auto px-4">

        {/* --- Header Section --- */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-3xl font-bold text-slate-900 mb-4"
          >
            البحث في الأرشيف
          </motion.h1>

          <div className="relative">
            <input
              type="text"
              placeholder="ابحث برقم الشاصي، اللوحة، الموديل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-lg"
            />
            <Search className="absolute right-4 top-4 text-slate-400" size={24} />
          </div>
        </div>

        {/* --- Filter Toolbar --- */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-slate-500 ml-2">
              <Filter size={18} />
              <span className="font-bold text-sm">فلترة:</span>
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg text-sm outline-none cursor-pointer"
            >
              <option value="all">كل الحالات</option>
              <option value="found">موجودة (Found)</option>
              <option value="claimed">مطالب بها (Claimed)</option>
              <option value="delivered">تم التسليم (Delivered)</option>
            </select>

            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-lg text-sm outline-none cursor-pointer"
            >
              <option value="all">كل الماركات</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="text-slate-500 text-sm font-medium">
            تم العثور على <span className="text-primary-600 font-bold">{filteredCars.length}</span> سيارة
          </div>
        </div>

        {/* --- Main Results Grid --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* mode="popLayout" prevents the jumping/invisible item glitch */}
            <AnimatePresence mode="popLayout">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SearchCarCard car={car} lang="ar" />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <Search size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد نتائج</h3>
                  <button
                    onClick={() => { setFilters({ status: 'all', brand: 'all' }); setSearchQuery(''); }}
                    className="text-primary-600 font-bold hover:underline"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;