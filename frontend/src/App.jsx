// src/App.jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; 
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import { Toaster } from 'react-hot-toast'; // Import Toaster

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster */}
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;