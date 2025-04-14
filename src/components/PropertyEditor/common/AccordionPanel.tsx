// src/components/PropertyEditor/common/AccordionPanel.tsx
import React, { ReactNode } from 'react';

interface AccordionPanelProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const AccordionPanel: React.FC<AccordionPanelProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div>
      <button
        className="flex w-full justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded mb-2"
        onClick={onToggle}
      >
        <span className="text-sm font-medium">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-2 p-2 border border-gray-200 rounded">
          {children}
        </div>
      )}
    </div>
  );
};
