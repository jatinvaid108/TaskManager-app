import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
