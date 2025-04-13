// src/components/ElementTree.tsx
import React from 'react';
import { ElementType, countVisibleElements } from '../utils/bemUtils';

interface ElementTreeProps {
  elements: ElementType[];
  selectedIndex: number;
  onSelectElement: (id: number) => void;
  onToggleExpanded: (id: number) => void;
}

const ElementTree: React.FC<ElementTreeProps> = ({
  elements,
  selectedIndex,
  onSelectElement,
  onToggleExpanded
}) => {
  // 要素がレンダリング階層内で選択されているか判定する
  const isElementSelected = (element: ElementType): boolean => {
    let currentIndex = 0;
    
    const checkIsSelected = (elements: ElementType[], targetId: number): boolean => {
      for (const el of elements) {
        if (currentIndex === selectedIndex) {
          return el.id === targetId;
        }
        
        currentIndex++;
        
        if (el.children && el.children.length > 0 && el.expanded) {
          const found = checkIsSelected(el.children, targetId);
          if (found) return true;
          
          currentIndex += countVisibleElements(el.children);
        }
      }
      
      return false;
    };
    
    return checkIsSelected(elements, element.id);
  };

  // 要素をレンダリングする関数
  const renderElements = (elements: ElementType[], level = 0, isChildOfFlexRow = false) => {
    return elements.map((element) => {
      const isSelected = isElementSelected(element);
      
      // スタイルの処理
      const elementStyle = {...element.properties};
      
      // 無効なプロパティを除外してスタイルを適用
      const disabledProps = element.disabledProperties || [];
      Object.keys(elementStyle).forEach(key => {
        if (disabledProps.includes(key)) {
          delete elementStyle[key];
        }
      });
      
      // デフォルトのdisplayを設定（指定されていない場合）
      if (!elementStyle.display) {
        elementStyle.display = 'block';
      }
      
      // 子要素の表示モードを調整
      if (element.children && element.children.length > 0) {
        if (elementStyle.display === 'block') {
          elementStyle.display = 'flex';
          elementStyle.flexDirection = 'column';
        }
      }
      
      // 親要素から渡された情報を元に、要素のクラス名を設定
      let elementClassName = isSelected ? 'ring-2 ring-blue-500' : '';

      return (
        <div key={element.id}>
          <div 
            style={elementStyle}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(element.id);
            }}
            className={elementClassName}
          >
            {element.text && element.text.length > 0 ? element.text : null}
            
            {element.children && element.children.length > 0 && (
              <div>
                {renderElements(element.children, level + 1, 
                  elementStyle.display === 'flex' && elementStyle.flexDirection === 'row'
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return <>{renderElements(elements)}</>;
};

export default ElementTree;