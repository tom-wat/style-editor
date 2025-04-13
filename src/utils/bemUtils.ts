// src/utils/bemUtils.ts
// BEM関連のユーティリティ関数

export interface ElementType {
  id: number;
  text: string;
  elementName: string;
  modifiers: string[];
  properties: Record<string, string>;
  disabledProperties?: string[]; // 無効になっているプロパティを管理する配列
  hideElementName?: boolean; // 要素名を非表示にするフラグ
  hideModifiers?: boolean; // モディファイアを非表示にするフラグ
  htmlTagName?: string; // HTMLタグ名
  htmlAttributes?: Record<string, string>; // HTML属性
  hideHtmlTag?: boolean; // HTMLタグ設定を非表示にするフラグ
  children: ElementType[];
  parentId: number | null;
  expanded: boolean;
  blockName?: string; // 各要素が独自のブロック名を持てるようにする
  useParentBlock?: boolean; // 親のブロック名を使用するかどうかのフラグ
}

// BEMクラス名を生成する関数
export const generateBEMClassName = (element: ElementType, defaultBlockName: string, allElements?: ElementType[]): string => {
  // ブロック名の適用ルール
  // 1. 要素がuseParentBlockがtrueの場合、親のブロック名を使用
  // 2. 要素に独自のブロック名がある場合、それを使用
  // 3. 上記の条件に当てはまらない場合はデフォルトブロック名を使用
  
  // 親要素のブロック名を取得する関数
  const getParentBlockName = (parentId: number | null): string | undefined => {
    if (!parentId || !allElements) return undefined;
    
    const parent = allElements.find(el => el.id === parentId);
    if (!parent) return undefined;
    
    return parent.blockName || getParentBlockName(parent.parentId) || defaultBlockName;
  };
  
  // 実際に使用するブロック名を決定
  let usedBlockName: string;
  
  if (element.useParentBlock && element.parentId !== null && allElements) {
    usedBlockName = getParentBlockName(element.parentId) || defaultBlockName;
  } else if (element.blockName) {
    usedBlockName = element.blockName;
  } else {
    usedBlockName = defaultBlockName;
  }
  
  let className = usedBlockName;
  
  // 要素名があり非表示設定でない場合は追加
  if (element.elementName && !element.hideElementName) {
    className += `__${element.elementName}`;
  }
  
  // モディファイアがあり非表示設定でない場合は追加
  if (element.modifiers && element.modifiers.length > 0 && !element.hideModifiers) {
    const modifierClasses = element.modifiers.map(modifier => `${className}--${modifier}`);
    className = `${className} ${modifierClasses.join(' ')}`;
  }
  
  return className;
};

// HTMLコードを生成する関数
export const generateHtmlCode = (elements: ElementType[], defaultBlockName: string): string => {
  // すべての要素のフラットな配列を生成
  const flattenElements = (elements: ElementType[]): ElementType[] => {
    let result: ElementType[] = [];
    elements.forEach(element => {
      result.push(element);
      if (element.children && element.children.length > 0) {
        result = result.concat(flattenElements(element.children));
      }
    });
    return result;
  };
  
  // すべての要素をフラット配列として取得
  const allElements = flattenElements(elements);
  
  const generateHtml = (elements: ElementType[], indent = '') => {
    return elements.map(element => {
      // ブロック名を生成するときに、すべての要素を渡して親子関係を反映させる
      const className = generateBEMClassName(element, defaultBlockName, allElements);
      const tagName = element.htmlTagName && !element.hideHtmlTag ? element.htmlTagName : 'div';
      
      // 属性の生成
      let attributesStr = `class="${className}"`;
      if (element.htmlAttributes && !element.hideHtmlTag) {
        Object.entries(element.htmlAttributes).forEach(([name, value]) => {
          if (name && value && name !== 'class') { // classは既に設定しているので除外
            attributesStr += ` ${name}="${value}"`;
          }
        });
      }
      
      let html = `${indent}<${tagName} ${attributesStr}>${element.text}`;
      
      if (element.children && element.children.length > 0) {
        html += '\n';
        html += generateHtml(element.children, indent + '  ');
        html += `\n${indent}</${tagName}>`;
      } else {
        html += `</${tagName}>`;
      }
      
      return html;
    }).join('\n');
  };
  
  return generateHtml(elements);
};

// CSSコードを生成する関数
export const generateCssCode = (elements: ElementType[], defaultBlockName: string): string => {
  // すべての要素のフラットな配列を生成
  const flattenElements = (elements: ElementType[]): ElementType[] => {
    let result: ElementType[] = [];
    elements.forEach(element => {
      result.push(element);
      if (element.children && element.children.length > 0) {
        result = result.concat(flattenElements(element.children));
      }
    });
    return result;
  };
  
  // すべての要素をフラット配列として取得
  const allElements = flattenElements(elements);
  
  const generateCss = (elements: ElementType[]) => {
    let css = '';
    
    elements.forEach(element => {
      // ブロック名を生成するときに、すべての要素を渡して親子関係を反映させる
      const className = generateBEMClassName(element, defaultBlockName, allElements).split(' ')[0]; // ベースクラス名のみ取得
      
      // 無効なプロパティをフィルタリング
      const disabledProps = element.disabledProperties || [];
      const cssRules = Object.entries(element.properties)
        .filter(([prop]) => !disabledProps.includes(prop)) // 無効なプロパティを除外
        .map(([prop, value]) => {
          // CSSプロパティ名をケバブケースに変換（必要な場合）
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `  ${cssProp}: ${value};`;
        })
        .join('\n');
      
      // ベースクラスのCSS
      css += `.${className} {\n${cssRules}\n}`;
      
      // モディファイアごとのCSS
      if (element.modifiers && element.modifiers.length > 0 && !element.hideModifiers) {
        element.modifiers.forEach(modifier => {
          const modifierClass = `${className}--${modifier}`;
          css += `\n\n.${modifierClass} {\n  /* モディファイア固有のスタイル */\n}`;
        });
      }
      
      css += '\n\n';
      
      // 子要素のCSSを追加
      if (element.children && element.children.length > 0) {
        css += generateCss(element.children);
      }
    });
    
    return css;
  };
  
  return generateCss(elements);
};

// 表示されている要素の数を数える関数
export const countVisibleElements = (elements: ElementType[]): number => {
  let count = elements.length;
  
  for (const element of elements) {
    if (element.children && element.children.length > 0 && element.expanded) {
      count += countVisibleElements(element.children);
    }
  }
  
  return count;
};

// コードをクリップボードにコピーする関数
export const copyToClipboard = (text: string, onSuccess?: () => void, onError?: (err: string) => void): void => {
  navigator.clipboard.writeText(text)
    .then(() => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(err => {
      console.error('コピーに失敗しました:', err);
      if (onError) {
        onError(err);
      }
    });
};