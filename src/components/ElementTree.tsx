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
  const renderElements = (elements: ElementType[], level = 0) => {
    return elements.map((element) => {
      const isSelected = isElementSelected(element);
      
      // 子要素を持つ場合は、子要素を配置するためのコンテナになる追加スタイル
      const elementStyle = {
        ...element.properties,
        position: 'relative',
      };
      
      if (element.children && element.children.length > 0) {
        elementStyle.flexDirection = 'column';
        elementStyle.alignItems = 'stretch';
      }
      
      return (
        <div key={element.id} className="w-full">
          <div 
            style={elementStyle}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(element.id);
            }}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''} cursor-pointer mb-2`}
          >
            <div className="relative w-full">
              {element.text}
            </div>
            
            {element.children && element.children.length > 0 && (
              <div>
                <button
                  className="absolute bottom-1 right-1 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpanded(element.id);
                  }}
                >
                  {element.expanded ? '-' : '+'}
                </button>
                
                {element.expanded && (
                  <div className="w-full">
                    {renderElements(element.children, level + 1)}
                  </div>
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
