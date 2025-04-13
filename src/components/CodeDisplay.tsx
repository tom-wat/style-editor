// src/components/CodeDisplay.tsx
import React, { useState } from 'react';
import { ElementType, generateHtmlCode, generateCssCode, copyToClipboard } from '../utils/bemUtils';
import Toast from './Toast';

interface CodeDisplayProps {
  elements: ElementType[];
  blockName: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ elements, blockName }) => {
  const htmlCode = generateHtmlCode(elements, blockName);
  const cssCode = generateCssCode(elements, blockName);
  
  // トースト表示の状態管理
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // コピー処理実行関数
  const handleCopy = (code: string, type: string) => {
    copyToClipboard(
      code, 
      () => {
        setToastMessage(`${type}コードがコピーされました`);
        setShowToast(true);
      }
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-2 overflow-x-auto">
      <div className="border rounded p-2 bg-gray-50">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium">HTMLコード</h3>
          <button 
            onClick={() => handleCopy(htmlCode, 'HTML')}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            コピー
          </button>
        </div>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32">
          {htmlCode}
        </pre>
      </div>
      
      <div className="border rounded p-2 bg-gray-50">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium">CSSコード</h3>
          <button 
            onClick={() => handleCopy(cssCode, 'CSS')}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            コピー
          </button>
        </div>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-64">
          {cssCode}
        </pre>
      </div>
      
      {/* トースト通知コンポーネント */}
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </div>
  );
};

export default CodeDisplay;
