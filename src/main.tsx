import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./Login.tsx";
import LoadingScreen from "./LoadingScreen.tsx";
import Game from "./Game.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoadingScreen />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/game",
    element: <Game />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
