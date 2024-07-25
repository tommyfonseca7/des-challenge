import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; // Ensure this imports your CSS with animations

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        navigate("/login");
      }, 500); // Match this with the fadeOut duration
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`flex items-center justify-center w-full h-screen bg-space-cadet top-0 left-0 absolute ${
        fade ? "fade-out" : "fade-in"
      }`}
    >
      <div className="flex items-center justify-center flex-col">
        <img
          src=".\src\assets\logo-dark-bg.png"
          alt=""
          className="w-1/2 h-1/2"
        />
        <div className="mt-4 mx-auto w-16 h-16 border-4 border-t-4 border-t-sky-blue border-space-cadet rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default LoadingScreen;
