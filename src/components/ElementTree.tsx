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
  const renderElements = (elements: ElementType[], level = 0): React.ReactNode[] => {
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
      
      // HTMLタグの種類に基づいてデフォルトのdisplayを設定
      const inlineElements = ['span', 'a', 'em', 'strong', 'i', 'b', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'u', 'code'];
      const inlineBlockElements = ['button', 'input', 'select', 'textarea', 'label', 'img'];

      // displayプロパティが無効化されているかどうかチェック
      const isDisplayDisabled = (disabledProps || []).includes('display');

      // HTMLタグが有効であり、displayプロパティが無効化されている場合
      if (element.htmlTagName && !element.hideHtmlTag && isDisplayDisabled) {
        if (inlineElements.includes(element.htmlTagName)) {
          elementStyle.display = 'inline';
        } else if (inlineBlockElements.includes(element.htmlTagName)) {
          elementStyle.display = 'inline-block';
        } else {
          elementStyle.display = 'block';
        }
      } 
      // displayプロパティが指定されておらず、HTMLタグが有効な場合
      else if (element.htmlTagName && !element.hideHtmlTag && !elementStyle.display) {
        if (inlineElements.includes(element.htmlTagName)) {
          elementStyle.display = 'inline';
        } else if (inlineBlockElements.includes(element.htmlTagName)) {
          elementStyle.display = 'inline-block';
        } else {
          elementStyle.display = 'block';
        }
      }
      // それ以外はデフォルトのdisplayを設定
      else if (!elementStyle.display) {
        elementStyle.display = 'block';
      }
      
      // 子要素の表示モードを調整
      if (element.children && element.children.length > 0) {
        // インライン要素では子要素を含めない場合が多いが、子要素がある場合は子もレンダリングする
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
      
      // HTML属性を追加
      const htmlAttributes = element.htmlAttributes && !element.hideHtmlTag ? element.htmlAttributes : {};
      
      // void要素（自己終了要素）かどうかチェック
      const voidElements = [
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 
        'meta', 'param', 'source', 'track', 'wbr'
      ];
      const isVoidElement = voidElements.includes(tagName);
      
      // void要素の場合は子要素を持てない
      // const children = isVoidElement ? null : [
      //   element.text && element.text.length > 0 ? element.text : null,
      //   element.children && element.children.length > 0 ? 
      //     renderElements(element.children, level + 1) : null
      // ].filter(Boolean); // nullやundefinedを除去

      // テキストがある場合、void要素でなければテキストを表示
      // void要素の場合は、alt属性にテキストを設定する（imgタグ用）
      if (isVoidElement && element.text && tagName === 'img' && !htmlAttributes.alt) {
        htmlAttributes.alt = element.text;
      }
      
      // 動的にタグ名を使用して要素をレンダリングする
      return React.createElement(
        tagName,
        {
          key: element.id,
          style: elementStyle,
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onSelectElement(element.id);
          },
          className: elementClassName,
          ...htmlAttributes // HTML属性を展開
        },
        // void要素の場合は子要素を持たない
        ...(isVoidElement ? [] : [element.text || '', ...(element.children && element.children.length > 0 ? 
          renderElements(element.children, level + 1) : [])])
      );
    });
  };

  return <>{renderElements(elements)}</>;
};

export default ElementTree;