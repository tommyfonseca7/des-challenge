import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChartNoAxesCombined } from "lucide-react";
import "./index.css";

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-space-cadet top-0 left-0 absolute">
      <div className="flex items-center justify-center flex-col">
        <img src=".\src\assets\image.png" alt="" className="w-1/2 h-1/2" />
        <div className="mt-4 mx-auto w-16 h-16 border-4 border-t-4 border-t-sky-blue border-space-cadet rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
