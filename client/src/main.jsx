import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  <AuthProvider>
    <NotificationProvider>     {/* <-- ADD THIS WRAPPER */}
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#151522",
              color: "#F4F4F8",
              border: "1px solid #2A2A3D",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#14B8A6", secondary: "#151522" } },
            error: { iconTheme: { primary: "#F43F5E", secondary: "#151522" } },
          }}
        />
      </BrowserRouter>
    </NotificationProvider>
  </AuthProvider>
</React.StrictMode>

);
