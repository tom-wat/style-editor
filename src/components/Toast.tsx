// src/components/Toast.tsx
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error'; // 通知タイプ
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

  // タイプに基づいてスタイルを設定
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const iconName = type === 'success' ? '✓' : '✗';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg animate-fade-in-up z-50 flex items-center gap-2`}>
      <span className="font-bold">{iconName}</span>
      {message}
    </div>
  );
};

export default Toast;
