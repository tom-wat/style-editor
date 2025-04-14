// src/components/PropertyEditor/BemPanel.tsx
import React from 'react';
import { ElementType, generateBEMClassName } from '../../utils/bemUtils';
import { AccordionPanel } from './common/AccordionPanel';

interface BemPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  blockName: string;
  selectedElement: ElementType;
  onUpdateBlockName: (name: string) => void;
  onUpdateElementName: (name: string) => void;
  onUpdateModifiers: (modifierStr: string) => void;
  onToggleElementName?: (show: boolean) => void;
  onToggleModifiers?: (show: boolean) => void;
  onUpdateElementBlockName?: (blockName: string) => void;
  onToggleUseParentBlock?: (useParent: boolean) => void;
}

const BemPanel: React.FC<BemPanelProps> = ({
  isOpen,
  setIsOpen,
  blockName,
  selectedElement,
  onUpdateBlockName,
  onUpdateElementName,
  onUpdateModifiers,
  onToggleElementName,
  onToggleModifiers,
  onUpdateElementBlockName,
  onToggleUseParentBlock
}) => {
  return (
    <div className="mb-2">
      <AccordionPanel 
        title="クラス名設定"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      >
        {/* グローバルブロック名設定 */}
        <div className="mb-3 pb-2 border-b border-gray-200">
          <h4 className="text-sm font-semibold mb-2">グローバルブロック名</h4>
          <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
            <label className="text-sm font-medium">ブロック名：</label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => onUpdateBlockName(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>
        
        {/* 要素固有のブロック名設定 */}
        <div className="mb-3 pb-2 border-b border-gray-200">
          <h4 className="text-sm font-semibold mb-2">この要素のブロック名</h4>
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="use-parent-block"
              checked={!!selectedElement.useParentBlock}
              onChange={(e) => onToggleUseParentBlock && onToggleUseParentBlock(e.target.checked)}
              className="mr-1"
              disabled={!selectedElement.parentId} // 親要素がない場合は無効化
            />
            <label htmlFor="use-parent-block" className="text-sm">
              親要素のブロック名を使用する
            </label>
          </div>
          
          <div className="grid grid-cols-[auto,1fr] gap-2 items-center mb-2">
            <label className="text-sm font-medium">要素固有ブロック名：</label>
            <input
              type="text"
              value={selectedElement.blockName || ''}
              onChange={(e) => onUpdateElementBlockName && onUpdateElementBlockName(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              disabled={selectedElement.useParentBlock}
              placeholder={selectedElement.useParentBlock ? '親のブロック名を使用します' : 'ブロック名を入力'}
            />
          </div>
          
          <div className="text-xs text-gray-500 italic mb-2">
            {selectedElement.useParentBlock ? 
              '親要素のブロック名が連動して使われます' : 
              selectedElement.blockName ? 
                'この要素に固有のブロック名が設定されています' : 
                'グローバルブロック名が使用されます'}
          </div>
        </div>
        
        {/* 要素名設定 */}
        <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hide-element-name"
              checked={!selectedElement.hideElementName}
              onChange={(e) => onToggleElementName && onToggleElementName(e.target.checked)}
            />
            <label htmlFor="hide-element-name" className="text-sm font-medium">要素名</label>
          </div>
          <input
            type="text"
            value={selectedElement.elementName || ''}
            onChange={(e) => onUpdateElementName(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        
        {/* モディファイア設定 */}
        <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hide-modifiers"
              checked={!selectedElement.hideModifiers}
              onChange={(e) => onToggleModifiers && onToggleModifiers(e.target.checked)}
            />
            <label htmlFor="hide-modifiers" className="text-sm font-medium">モディファイア</label>
          </div>
          <input
            type="text"
            value={(selectedElement.modifiers || []).join(', ')}
            onChange={(e) => onUpdateModifiers(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        
        {/* 生成されるクラス名表示 */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">生成されるクラス名：</label>
          <div className="text-sm bg-gray-100 p-2 rounded break-words">
            {generateBEMClassName(selectedElement, blockName)}
          </div>
        </div>
      </AccordionPanel>
    </div>
  );
};

export default BemPanel;
