import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import Home from './pages/Home.jsx';
import FlashcardPage from "./pages/FlashcardPage.jsx";

// Creation of routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/category/:categoryId',
    element: <FlashcardPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

