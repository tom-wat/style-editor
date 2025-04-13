// src/components/StyleEditor.tsx
import React, { useState } from 'react';
import { ElementType, countVisibleElements } from '../utils/bemUtils';
import Preview from './Preview';
import PropertyEditor from './PropertyEditor';
import {
  getSelectedElement,
  toggleElementExpanded,
  findElementIndex,
  updateElementText,
  updateElementName,
  updateElementModifiers,
  updateElementProperty,
  addNewElement,
  removeElement,
  togglePropertyEnabled
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
        width: '200px',
        height: '200px',
        backgroundColor: '#3498db',
        color: '#ffffff',
        fontSize: '16px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease'
      },
      children: [], // 子要素の配列
      parentId: null, // 親要素のID
      expanded: true, // UIでの展開状態
    }
  ]);
  
  // 現在選択されている要素のインデックス
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // 選択された要素を取得
  const selectedElement = getSelectedElement(elements, selectedIndex) || elements[0];

  // 要素を追加する関数
  const handleAddElement = (position: 'before' | 'after' | 'child', parentId: number | null = null) => {
    const newElements = addNewElement(elements, position, selectedElement?.id, parentId);
    setElements(newElements);
    
    // 新しい要素を選択 (parent以外の場合)
    if (position !== 'child') {
      setTimeout(() => {
        const newElement = newElements.flat().find(el => el.id > selectedElement.id);
        if (newElement) {
          handleSelectElement(newElement.id);
        }
      }, 0);
    } else if (parentId) {
      // 子要素の場合は親の最後の子要素を選択
      const parentElement = getSelectedElement(newElements, selectedIndex);
      if (parentElement && parentElement.children && parentElement.children.length > 0) {
        const lastChild = parentElement.children[parentElement.children.length - 1];
        handleSelectElement(lastChild.id);
      }
    }
  };

  // 要素を削除する関数
  const handleRemoveElement = () => {
    const newElements = removeElement(elements, selectedElement.id);
    setElements(newElements);
    setSelectedIndex(0); // 最初の要素を選択
  };

  // 要素の展開/折りたたみを切り替える関数
  const handleToggleExpanded = (id: number) => {
    setElements(toggleElementExpanded(elements, id));
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

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-xl font-bold mb-4">スタイルエディタ (BEM)</h1>
      
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <Preview 
          elements={elements}
          selectedElement={selectedElement}
          selectedIndex={selectedIndex}
          blockName={blockName}
          onAddElement={handleAddElement}
          onRemoveElement={handleRemoveElement}
          onSelectElement={handleSelectElement}
          onToggleExpanded={handleToggleExpanded}
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
        />
      </div>
    </div>
  );
};

export default StyleEditor;
