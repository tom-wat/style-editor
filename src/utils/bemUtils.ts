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
  children: ElementType[];
  parentId: number | null;
  expanded: boolean;
}

// BEMクラス名を生成する関数
export const generateBEMClassName = (element: ElementType, blockName: string): string => {
  let className = blockName;
  
  // チェックボックスがチェックされている場合に要素名を追加しない
  if (element.elementName && !element.hideElementName) {
    className += `__${element.elementName}`;
  }
  
  // チェックボックスがチェックされている場合にモディファイアを追加しない
  if (element.modifiers && element.modifiers.length > 0 && !element.hideModifiers) {
    const modifierClasses = element.modifiers.map(modifier => `${className}--${modifier}`);
    className = `${className} ${modifierClasses.join(' ')}`;
  }
  
  return className;
};

// HTMLコードを生成する関数
export const generateHtmlCode = (elements: ElementType[], blockName: string): string => {
  const generateHtml = (elements: ElementType[], indent = '') => {
    return elements.map(element => {
      const className = generateBEMClassName(element, blockName);
      let html = `${indent}<div class="${className}">${element.text}`;
      
      if (element.children && element.children.length > 0) {
        html += '\n';
        html += generateHtml(element.children, indent + '  ');
        html += `\n${indent}</div>`;
      } else {
        html += '</div>';
      }
      
      return html;
    }).join('\n');
  };
  
  return generateHtml(elements);
};

// CSSコードを生成する関数
export const generateCssCode = (elements: ElementType[], blockName: string): string => {
  const generateCss = (elements: ElementType[]) => {
    let css = '';
    
    elements.forEach(element => {
      const className = generateBEMClassName(element, blockName).split(' ')[0]; // ベースクラス名のみ取得
      
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
export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('コードがクリップボードにコピーされました');
    })
    .catch(err => {
      console.error('コピーに失敗しました:', err);
    });
};