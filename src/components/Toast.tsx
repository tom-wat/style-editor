// src/components/Toast.tsx
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ 
message, 
isVisible, 
onClose, 
duration = 3000,
 type = 'success'
 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 ${type === 'error' ? 'bg-red-600' : 'bg-blue-600'} text-white px-4 py-2 rounded shadow-lg animate-fade-in-up z-50`}>
      {message}
    </div>
  );
};

export default Toast;
