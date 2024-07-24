import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartNoAxesCombined } from 'lucide-react';
import './index.css'


const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-space-cadet top-0 left-0 absolute">
      <div className="text-center">
        <ChartNoAxesCombined className="mx-auto text-sky-blue" size={48} />
        <h1 className="mt-4 text-2xl font-bold text-misty-rose">Stock Market Simulator</h1>
        <div className="mt-4 mx-auto w-16 h-16 border-4 border-t-4 border-t-sky-blue border-space-cadet rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
