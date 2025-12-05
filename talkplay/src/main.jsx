import React, { Suspense, lazy } from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import GlobalErrorProvider from './context/GlobalErrorContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RouteError from './components/RouteError.jsx';
import Loading from './components/Loading.jsx';

// Lazy-loaded pages to reduce initial bundle and critical path
const Welcome = lazy(() => import('./pages/Welcome.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const FlashcardPage = lazy(() => import('./pages/FlashcardPage.jsx'));
const UnsupportedBrowser = lazy(() => import('./components/UnsupportedBrowser.jsx'));

const RouterWrapper = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Suspense fallback={<Loading />}><Welcome /></Suspense>, errorElement: <RouteError /> },
    { path: '/categories', element: <Suspense fallback={<Loading />}><Home /></Suspense>, errorElement: <RouteError /> },
    { path: '/category/:categoryId', element: <Suspense fallback={<Loading />}><FlashcardPage /></Suspense>, errorElement: <RouteError /> },
    { path: '/test-browser', element: <Suspense fallback={<Loading />}><UnsupportedBrowser /></Suspense>, errorElement: <RouteError /> },
  ]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorProvider>
      <ErrorBoundary>
        <RouterWrapper />
      </ErrorBoundary>
    </GlobalErrorProvider>
  </React.StrictMode>
);