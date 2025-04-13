// src/components/Preview.tsx
import React from 'react';
import { ElementType, countVisibleElements, generateBEMClassName } from '../utils/bemUtils';
import ElementTree from './ElementTree';
import CodeDisplay from './CodeDisplay';

interface PreviewProps {
  elements: ElementType[];
  selectedElement: ElementType;
  selectedIndex: number;
  blockName: string;
  onAddElement: (position: 'before' | 'after' | 'child', parentId?: number | null) => void;
  onAddParentElement: () => void;
  onRemoveElement: () => void;
  onSelectElement: (id: number) => void;
  onToggleExpanded: (id: number) => void;
}

const Preview: React.FC<PreviewProps> = ({
  elements,
  selectedElement,
  selectedIndex,
  blockName,
  onAddElement,
  onAddParentElement,
  onRemoveElement,
  onSelectElement,
  onToggleExpanded
}) => {
  return (
    <div className="flex-1 w-full border rounded-lg p-4 flex flex-col min-h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">プレビュー</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onAddElement('before')} 
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              前に追加
            </button>
            <button 
              onClick={() => onAddElement('after')} 
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              後に追加
            </button>
            <button 
              onClick={() => onAddElement('child', selectedElement.id)} 
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              子要素を追加
            </button>
            <button 
              onClick={onAddParentElement} 
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              親要素を追加
            </button>
            <button 
              onClick={onRemoveElement} 
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              disabled={elements.length <= 1 && !selectedElement.parentId}
            >
              削除
            </button>
          </div>
          <div className="text-sm flex items-center overflow-hidden">
            <div className="mr-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
              選択中: {selectedElement ? generateBEMClassName(selectedElement, blockName, elements) : 'なし'}
            </div>
            <span className="whitespace-nowrap">要素 {selectedIndex + 1}/{countVisibleElements(elements)}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 border border-gray-200 bg-white rounded-lg overflow-auto relative">
        <div className="p-4 overflow-x-auto">
          <ElementTree 
            elements={elements}
            selectedIndex={selectedIndex}
            onSelectElement={onSelectElement}
            onToggleExpanded={onToggleExpanded}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <CodeDisplay elements={elements} blockName={blockName} />
      </div>
    </div>
  );
};

export default Preview;