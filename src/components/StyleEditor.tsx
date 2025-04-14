// src/components/StyleEditor.tsx
import React, { useState } from 'react';
import { ElementType } from '../utils/bemUtils';
import Preview from './Preview';
import Toast from './Toast';
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
        'max-width': '100%',
        'max-height': '100%',
        backgroundColor: '#3498db',
        color: '#ffffff',
        fontSize: '16px',
        padding: '20px',
        'padding-inline-start': '20px',
        'padding-inline-end': '20px',
        'padding-block-start': '20px',
        'padding-block-end': '20px',
        borderRadius: '8px',
        border: '1px solid #2980b9',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        opacity: '1',
        transform: 'scale(1)',
        flexDirection: 'row', // 初期値をrowに設定
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease',
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        marginRight: '10px'
      },
      children: [], // 子要素の配列
      parentId: null, // 親要素のID
      expanded: true, // UIでの展開状態
      hideElementName: true, // 要素名を非表示
      hideModifiers: true, // モディファイアを非表示
      htmlTagName: 'div', // デフォルトのHTMLタグ名
      htmlAttributes: {}, // HTML属性
      hideHtmlTag: false, // HTMLタグ設定を表示
      disabledProperties: [
        'width', 'height', 'max-width', 'max-height',
        'backgroundColor', 'color', 'borderColor',
        'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'textAlign', 'textDecoration',
        'padding', 'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end',
        'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'border', 'borderRadius', 'borderWidth', 'borderStyle',
        'boxShadow', 'display', 'position', 'overflow', 'opacity', 'transform',
        'flexDirection', 'justifyContent', 'alignItems', 'transition'
      ],
    }
  ]);

  
  // 現在選択されている要素のインデックス
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  
  // トースト通知の状態
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

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
  
  // HTMLタグ名を更新する関数
  const handleUpdateHtmlTagName = (tagName: string) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, tagName: string): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, htmlTagName: tagName };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, tagName) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, tagName));
  };
  
  // HTML属性を更新する関数
  const handleUpdateHtmlAttribute = (name: string, value: string) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, name: string, value: string): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          const currentAttributes = element.htmlAttributes || {};
          return { 
            ...element, 
            htmlAttributes: {
              ...currentAttributes,
              [name]: value
            }
          };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, name, value) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, name, value));
  };
  
  // HTML属性を削除する関数
  const handleDeleteHtmlAttribute = (name: string) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, name: string): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId && element.htmlAttributes) {
          // 新しい属性オブジェクトを作成
          const newAttributes = { ...element.htmlAttributes };
          // 指定された属性を削除
          delete newAttributes[name];
          
          return { 
            ...element, 
            htmlAttributes: newAttributes
          };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, name) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, name));
  };
  
  // HTMLタグ設定の表示/非表示を切り替える関数
  const handleToggleHtmlTag = (show: boolean) => {
    // 再帰的に子要素も含めて更新する関数
    const updateElementsRecursively = (elements: ElementType[], targetId: number, show: boolean): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, hideHtmlTag: !show };
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
  
  // HTML属性の名前を更新する関数
  const handleUpdateHtmlAttributeName = (oldName: string, newName: string) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, oldName: string, newName: string): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId && element.htmlAttributes) {
          const { [oldName]: value, ...restAttributes } = element.htmlAttributes;
          // 新しい名前が空でない場合のみ更新
          if (newName.trim()) {
            return { 
              ...element, 
              htmlAttributes: {
                ...restAttributes,
                [newName]: value
              }
            };
          } else {
            // 新しい名前が空の場合は属性を削除
            return { 
              ...element, 
              htmlAttributes: restAttributes
            };
          }
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, oldName, newName) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, oldName, newName));
  };

  // 要素固有のブロック名を更新する関数
  const handleUpdateElementBlockName = (blockName: string) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, blockName: string): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, blockName: blockName.trim() || undefined };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, blockName) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, blockName));
  };
  
  // 親のブロック名を使用するかどうかを切り替える関数
  const handleToggleUseParentBlock = (useParent: boolean) => {
    // 再帰的に要素を探して更新する
    const updateElementsRecursively = (elements: ElementType[], targetId: number, useParent: boolean): ElementType[] => {
      return elements.map(element => {
        if (element.id === targetId) {
          return { ...element, useParentBlock: useParent };
        } 
        if (element.children && element.children.length > 0) {
          return { 
            ...element, 
            children: updateElementsRecursively(element.children, targetId, useParent) 
          };
        }
        return element;
      });
    };
    
    setElements(updateElementsRecursively(elements, selectedElement.id, useParent));
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="bg-white z-10 py-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">スタイルエディタ</h1>
        </div>
      </div>
      
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
          allElements={elements}
          onUpdateBlockName={setBlockName}
          onUpdateElementName={handleUpdateElementName}
          onUpdateModifiers={handleUpdateModifiers}
          onUpdateText={handleUpdateText}
          onUpdateProperty={handleUpdateProperty}
          onTogglePropertyEnabled={handleTogglePropertyEnabled}
          onToggleElementName={handleToggleElementName}
          onToggleModifiers={handleToggleModifiers}
          onUpdateHtmlTagName={handleUpdateHtmlTagName}
          onUpdateHtmlAttribute={handleUpdateHtmlAttribute}
          onUpdateHtmlAttributeName={handleUpdateHtmlAttributeName}
          onDeleteHtmlAttribute={handleDeleteHtmlAttribute}
          onToggleHtmlTag={handleToggleHtmlTag}
          onUpdateElementBlockName={handleUpdateElementBlockName}
          onToggleUseParentBlock={handleToggleUseParentBlock}
        />
      </div>
      
      {/* トースト通知 */}
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
        type={toast.type}
      />
    </div>
  );
};

export default StyleEditor;
