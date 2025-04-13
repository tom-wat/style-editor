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
      const elementStyle = {};
      
      // 無効なプロパティを除外してスタイルを適用
      const disabledProps = element.disabledProperties || [];
      Object.entries(element.properties).forEach(([key, value]) => {
        if (!disabledProps.includes(key)) {
          elementStyle[key] = value;
        }
      });
      
      // 必要なスタイルの上書きを防止
      if (!elementStyle.position) {
        elementStyle.position = 'relative';
      }
      
      // 横並びの子要素の場合、幅を調整
      if (isChildOfFlexRow) {
        if (!elementStyle.flex && !element.properties.flex) {
          elementStyle.flex = '1';
        }
      }
      
      // 要素の表示モードを判定
      let displayMode = 'block';
      if (elementStyle.display || element.properties.display) {
        displayMode = elementStyle.display || element.properties.display;
      }
      
      // 子要素がある場合の特別処理
      let flexDirection = null;
      if (element.children && element.children.length > 0) {
        // 表示モードが指定されていない場合は追加
        if (!displayMode || displayMode === 'block') {
          elementStyle.display = 'flex';
          displayMode = 'flex';
        }
        
        // Gridレイアウトの場合のサポート
        if (displayMode === 'grid') {
          // gridレイアウトの場合、デフォルトのプロパティを追加
          if (!elementStyle.gridTemplateColumns && !element.properties.gridTemplateColumns) {
            elementStyle.gridTemplateColumns = 'repeat(2, 1fr)';
          }
          
          if (!elementStyle.gap && !element.properties.gap) {
            elementStyle.gap = '10px';
          }
        }
        
        // Flexレイアウトの場合のサポート
        if (displayMode === 'flex') {
          // ユーザーがフレックスディレクションを指定していない場合のみデフォルト値を設定
          flexDirection = elementStyle.flexDirection || element.properties.flexDirection;
          if (!flexDirection) {
            elementStyle.flexDirection = 'row';
            flexDirection = 'row';
          }
          
          // alignItemsが指定されていない場合のみ設定
          if (!elementStyle.alignItems && !element.properties.alignItems) {
            elementStyle.alignItems = 'center';
          }
          
          // 横並びの場合に子要素間の間隔を確保
          if ((flexDirection === 'row') && 
              !elementStyle.gap && !element.properties.gap) {
            elementStyle.gap = '10px';
          }
        }
      }
      
      // 親要素から渡された情報を元に、要素のクラス名を設定
      let elementClassName = `${isSelected ? 'ring-2 ring-blue-500' : ''} cursor-pointer mb-2 p-2 min-h-12`;
      
      // 子要素の場合、一定の幅制限を設定
      if (isChildOfFlexRow) {
        // Flexの横並びの場合
        elementClassName += ' max-w-xs';
      }
      
      // 親要素がGridの場合、子要素は全幅を使用
      const isChildOfGrid = level > 0 && !isChildOfFlexRow;
      
      return (
        <div key={element.id} className={`w-full ${isChildOfFlexRow ? 'flex-1' : ''}`}>
          <div 
            style={elementStyle}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(element.id);
            }}
            className={elementClassName}
          >
            <div className="relative min-h-6">
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
                  <div 
                    className="w-full mt-2" 
                    style={{
                      display: displayMode === 'grid' ? 'grid' : 'flex',
                      gridTemplateColumns: elementStyle.gridTemplateColumns || element.properties.gridTemplateColumns || 'repeat(2, 1fr)',
                      gridTemplateRows: elementStyle.gridTemplateRows || element.properties.gridTemplateRows,
                      gridGap: elementStyle.gridGap || element.properties.gridGap,
                      flexDirection: flexDirection === 'row' ? 'row' : 'column',
                      flexWrap: 'wrap',
                      gap: elementStyle.gap || element.properties.gap || '8px',
                      padding: '8px'
                    }}
                  >
                    {renderElements(element.children, level + 1, displayMode === 'flex' && flexDirection === 'row')}
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
