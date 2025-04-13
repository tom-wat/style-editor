// src/components/StyleEditor.tsx
import React, { useState, useEffect } from 'react';
import { fetchStylesFromMCPServer, saveStylesToMCPServer, fetchStyleTemplates } from '../utils/mcp/mcpService';
import { getEndpointUrl, MCP_CONFIG } from '../utils/mcp/mcpConfig';

import { ElementType} from '../utils/bemUtils';
import Preview from './Preview';
import PropertyEditor from './PropertyEditor';
import {
  getSelectedElement,
  findElementIndex,
  updateElementText,
  updateElementName,
  updateElementModifiers,
  updateElementProperty,
  addNewElement,
  removeElement,
  togglePropertyEnabled,
  addParentElement
} from '../utils/elementOperations';

const StyleEditor: React.FC = () => {
  // ブロック名（BEMのベース）
  const [blockName, setBlockName] = useState<string>('component');
  
  // 要素リストの状態管理
  const [elements, setElements] = useState<ElementType[]>([
    {
      id: 1,
      text: 'メイン要素',
      elementName: 'main', // BEMのelement名
      modifiers: ['primary'], // BEMのmodifier名
      properties: {
        width: 'auto',
        height: 'auto',
        backgroundColor: '#3498db',
        color: '#ffffff',
        fontSize: '16px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'block',
        flexDirection: 'row', // 初期値をrowに設定
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease'
      },
      children: [], // 子要素の配列
      parentId: null, // 親要素のID
      expanded: true, // UIでの展開状態
      hideElementName: true, // 要素名を非表示
      hideModifiers: true, // モディファイアを非表示
    }
  ]);

  
  // 現在選択されている要素のインデックス
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // 選択された要素を取得
  const selectedElement = getSelectedElement(elements, selectedIndex) || elements[0];

  // 要素を追加する関数
  const handleAddElement = (position: 'before' | 'after' | 'child', parentId: number | null = null) => {
    const result = addNewElement(elements, position, selectedElement?.id, parentId);
    setElements(result.elements);
    
    // 新しく追加された要素を選択
    setTimeout(() => {
      handleSelectElement(result.newElementId);
    }, 0);
  };

  // 親要素を追加する関数
  const handleAddParentElement = () => {
    const result = addParentElement(elements, selectedElement.id);
    setElements(result.elements);
    
    // 新しく追加された親要素を選択
    setTimeout(() => {
      handleSelectElement(result.newParentId);
    }, 0);
  };

  // 要素を削除する関数
  const handleRemoveElement = () => {
    const newElements = removeElement(elements, selectedElement.id);
    setElements(newElements);
    setSelectedIndex(0); // 最初の要素を選択
  };

  // 要素を選択する関数
  const handleSelectElement = (id: number) => {
    const index = findElementIndex(elements, id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  // テキストを更新する関数
  const handleUpdateText = (text: string) => {
    setElements(updateElementText(elements, selectedElement.id, text));
  };

  // 要素名を更新する関数
  const handleUpdateElementName = (elementName: string) => {
    setElements(updateElementName(elements, selectedElement.id, elementName));
  };

  // モディファイアを更新する関数
  const handleUpdateModifiers = (modifierStr: string) => {
    setElements(updateElementModifiers(elements, selectedElement.id, modifierStr));
  };

  // プロパティを更新する関数
  const handleUpdateProperty = (property: string, value: string) => {
    setElements(updateElementProperty(elements, selectedElement.id, property, value));
  };
  
  // プロパティの有効/無効を切り替える関数
  const handleTogglePropertyEnabled = (property: string, enabled: boolean) => {
    setElements(togglePropertyEnabled(elements, selectedElement.id, property, enabled));
  };

  // 要素名の表示/非表示を切り替える関数
  const handleToggleElementName = (show: boolean) => {
    // 再帰的に子要素も含めて更新する関数
    const updateElementsRecursively = (elements: ElementType[], targetId: number, show: boolean): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, hideElementName: !show };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, show) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, show));
  };

  // モディファイアの表示/非表示を切り替える関数
  const handleToggleModifiers = (show: boolean) => {
    // 再帰的に子要素も含めて更新する関数
    const updateElementsRecursively = (elements: ElementType[], targetId: number, show: boolean): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, hideModifiers: !show };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, show) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, show));
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 py-2">スタイルエディタ</h1>
      
      <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]">
        <Preview 
          elements={elements}
          selectedElement={selectedElement}
          selectedIndex={selectedIndex}
          blockName={blockName}
          onAddElement={handleAddElement}
          onAddParentElement={handleAddParentElement}
          onRemoveElement={handleRemoveElement}
          onSelectElement={handleSelectElement}
        />
        
        <PropertyEditor 
          blockName={blockName}
          selectedElement={selectedElement}
          onUpdateBlockName={setBlockName}
          onUpdateElementName={handleUpdateElementName}
          onUpdateModifiers={handleUpdateModifiers}
          onUpdateText={handleUpdateText}
          onUpdateProperty={handleUpdateProperty}
          onTogglePropertyEnabled={handleTogglePropertyEnabled}
          onToggleElementName={handleToggleElementName}
          onToggleModifiers={handleToggleModifiers}
        />
      </div>
    </div>
  );
};

export default StyleEditor;