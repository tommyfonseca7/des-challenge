import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LogIn from "./Login.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />
  },
  {
    path: "/game",
    element: <App />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
