import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import PromptHelper from '../components/home/PromptHelper';
import RecentCars from '../components/home/RecentCars';
import SuccessStories from '../components/home/SuccessStories'; // سنفترض أنك أنشأته
import FAQ from '../components/home/FAQ'; // سنفترض أنك أنشأته
import { motion } from 'framer-motion';
import ApiInstance from '../api/Api';
import ContactPage from './ContactPage';
// ... باقي الاستيرادات

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};
const HomePage = () => {
  const [carsList, setCarsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveredCars, setDeliveredCars] = useState()

  const [error, setError] = useState(null);
  const fetchCarList = async () => {
    setIsLoading(true);
    try {
      const response = await ApiInstance.get('api/cars/');
      setCarsList(response.data);
      const resData = response.data
      const getDeliveredCars = resData.filter((car) => car?.status.toLocaleLowerCase().includes('delivered'))
      setDeliveredCars(getDeliveredCars)
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      setError("فشل تحميل قائمة السيارات.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarList();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-20 overflow-x-hidden">
      <motion.div {...fadeInUp}

      ><Hero carsdelevered={deliveredCars} cars={carsList} /></motion.div>
      <motion.div {...fadeInUp}><HowItWorks /></motion.div>
      <motion.div {...fadeInUp}><PromptHelper /></motion.div>
      <motion.div {...fadeInUp}><RecentCars
        cars={carsList}
      /></motion.div>
      <motion.div {...fadeInUp}><SuccessStories cars={deliveredCars} /></motion.div>
      <motion.div {...fadeInUp}><FAQ /></motion.div>
      <motion.div {...fadeInUp}><ContactPage /></motion.div>
    </div>
  );
};

export default HomePage;