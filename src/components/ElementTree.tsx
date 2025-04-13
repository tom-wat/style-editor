// src/components/ElementTree.tsx
import React from 'react';
import { ElementType, countVisibleElements } from '../utils/bemUtils';

interface ElementTreeProps {
  elements: ElementType[];
  selectedIndex: number;
  onSelectElement: (id: number) => void;
}

const ElementTree: React.FC<ElementTreeProps> = ({
  elements,
  selectedIndex,
  onSelectElement
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
      
      // 選択されたときのアウトライン色を設定する
      let outlineColor = '';
      if (isSelected && element.properties.backgroundColor) {
        // 背景色から色相を抽出して明るくする
        try {
          const bgColor = element.properties.backgroundColor;
          // HEX形式の場合
          if (bgColor.startsWith('#')) {
            // 明るいアウトライン色を設定
            outlineColor = '#add8e6';
          } else {
            // それ以外の場合はデフォルトの青色
            outlineColor = '#add8e6';
          }
        } catch {
          // エラーが発生した場合はデフォルトの青色
          outlineColor = '#add8e6';
        }
      }
      
      // 親要素から渡された情報を元に、要素のクラス名を設定
      let elementClassName = '';
      
      // 選択スタイルを適用
      if (isSelected) {
        // elementStyleに直接アウトラインを追加
        elementStyle.outline = `2px solid ${outlineColor}`;
        elementStyle.outlineOffset = '2px';
        elementClassName = 'ring-2 ring-white ring-opacity-50';
      }


      // レンダリング要素の作成
      // 実際のHTMLタグに基づいて要素を動的に作成
      const tagName = element.htmlTagName && !element.hideHtmlTag ? element.htmlTagName : 'div';
      
      // 動的にタグをレンダリングするために、React.Elementを作成する
      const ElementTag = tagName as React.ElementType;
      
      return (
        <div 
          key={element.id}
          style={elementStyle}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onSelectElement(element.id);
          }}
          className={elementClassName}
        >
          {element.text && element.text.length > 0 ? element.text : null}
          
          {element.children && element.children.length > 0 && 
            renderElements(element.children, level + 1
            )
          }
        </div>
      );
    });
  };

  return <>{renderElements(elements)}</>;
};

export default ElementTree;