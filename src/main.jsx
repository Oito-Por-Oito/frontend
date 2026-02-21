import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '@/contexts/AuthContext';
import { PieceThemeProvider } from '@/contexts/PieceThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <PieceThemeProvider>
          <AppRoutes />
        </PieceThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
