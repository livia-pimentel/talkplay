import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css';
import Welcome from './pages/Welcome.jsx';
import Home from './pages/Home.jsx';
import FlashcardPage from "./pages/FlashcardPage.jsx";
import UnsupportedBrowser from './components/UnsupportedBrowser.jsx'

// Creation of routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />  // Welcome page is the landing page
  },
  {
    path: '/categories',
    element: <Home />  // Category selection is in categories
  },
  {
    path: '/category/:categoryId',
    element: <FlashcardPage />,
  },
  {
    path: '/test-browser', // TEMPORARY TEST ROUTE - Remove after testing!
    element: <UnsupportedBrowser />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)