// src/utils/elementOperations.ts
import { ElementType, countVisibleElements } from './bemUtils';

// 選択された要素を取得する関数
export const getSelectedElement = (elements: ElementType[], selectedIndex: number): ElementType => {
  // フラットな配列での選択インデックスから実際の要素を取得する関数
  const findElementByIndex = (elements: ElementType[], targetIndex: number, currentIndex = 0): ElementType | null => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (currentIndex === targetIndex) {
        return element;
      }
      
      currentIndex++;
      
      if (element.children && element.children.length > 0 && element.expanded) {
        const foundIndex = currentIndex;
        const childCount = countVisibleElements(element.children);
        
        if (targetIndex >= foundIndex && targetIndex < foundIndex + childCount) {
          const childResult = findElementByIndex(element.children, targetIndex, foundIndex);
          if (childResult) {
            return childResult;
          }
        }
        
        currentIndex += childCount;
      }
    }
    
    return null;
  };
  
  // 選択インデックスが有効な範囲内であることを確認
  const totalElements = countVisibleElements(elements);
  const validIndex = Math.min(Math.max(0, selectedIndex), totalElements - 1);
  
  return findElementByIndex(elements, validIndex) || elements[0];
};

// 階層構造の要素をフラットな配列に変換する関数
export const flattenElements = (elements: ElementType[]): ElementType[] => {
  const result: ElementType[] = [];
  
  const flatten = (items: ElementType[]) => {
    for (const item of items) {
      result.push(item);
      
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    }
  };
  
  flatten(elements);
  return result;
};

// 要素の展開/折りたたみ状態を切り替える関数
export const toggleElementExpanded = (elements: ElementType[], id: number): ElementType[] => {
  return elements.map(element => {
    if (element.id === id) {
      return { ...element, expanded: !element.expanded };
    } else if (element.children && element.children.length > 0) {
      return { ...element, children: toggleElementExpanded(element.children, id) };
    }
    return element;
  });
};

// 要素を検索して選択するためのインデックスを計算する関数
export const findElementIndex = (elements: ElementType[], targetId: number): number => {
  // 適切な選択インデックスをフラットな配列で探す
  let currentIndex = 0;
  let foundIndex = -1;
  
  const findIndexInTree = (elements: ElementType[], targetId: number): boolean => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (element.id === targetId) {
        foundIndex = currentIndex;
        return true;
      }
      
      currentIndex++;
      
      if (element.children && element.children.length > 0 && element.expanded) {
        if (findIndexInTree(element.children, targetId)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findIndexInTree(elements, targetId);
  return foundIndex;
};

// 要素のテキストを更新する関数
export const updateElementText = (elements: ElementType[], targetId: number, text: string): ElementType[] => {
  return elements.map(element => {
    if (element.id === targetId) {
      return {
        ...element,
        text
      };
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementText(element.children, targetId, text)
      };
    }
    return element;
  });
};

// 要素名を更新する関数
export const updateElementName = (elements: ElementType[], targetId: number, elementName: string): ElementType[] => {
  return elements.map(element => {
    if (element.id === targetId) {
      return {
        ...element,
        elementName
      };
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementName(element.children, targetId, elementName)
      };
    }
    return element;
  });
};

// モディファイアを更新する関数
export const updateElementModifiers = (elements: ElementType[], targetId: number, modifierStr: string): ElementType[] => {
  const modifiers = modifierStr.split(',').map(m => m.trim()).filter(m => m);
  
  return elements.map(element => {
    if (element.id === targetId) {
      return {
        ...element,
        modifiers
      };
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementModifiers(element.children, targetId, modifierStr)
      };
    }
    return element;
  });
};

// プロパティを更新する関数
export const updateElementProperty = (elements: ElementType[], targetId: number, property: string, value: string): ElementType[] => {
  return elements.map(element => {
    if (element.id === targetId) {
      // 選択した要素のプロパティを更新
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          [property]: value
        }
      };
      
      // 子要素と孫要素も同時に再帰的に更新します
      // これにより、親要素のプロパティを変更した際に子要素や孫要素にUIが反映されます
      if (updatedElement.children && updatedElement.children.length > 0) {
        // すべての子要素とその子孫のプロパティも同様に更新
        const updateChildrenRecursively = (children: ElementType[]): ElementType[] => {
          return children.map(child => {
            const updatedChild = {
              ...child,
              properties: {
                ...child.properties,
                [property]: value
              }
            };
            
            // 孫要素も同様に更新していく
            if (updatedChild.children && updatedChild.children.length > 0) {
              updatedChild.children = updateChildrenRecursively(updatedChild.children);
            }
            
            return updatedChild;
          });
        };
        
        // すべての子要素を再帰的に更新
        updatedElement.children = updateChildrenRecursively(updatedElement.children);
      }
      
      return updatedElement;
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementProperty(element.children, targetId, property, value)
      };
    }
    return element;
  });
};

// プロパティの有効/無効を切り替える関数
export const togglePropertyEnabled = (elements: ElementType[], targetId: number, property: string, enabled: boolean): ElementType[] => {
  return elements.map(element => {
    if (element.id === targetId) {
      // 既存の無効プロパティ配列、または空の配列を取得
      const disabledProperties = element.disabledProperties || [];
      
      // 有効にする場合は配列からプロパティを削除
      // 無効にする場合は配列にプロパティを追加（重複がなければ）
      let updatedDisabledProperties: string[];
      const updatedProperties = { ...element.properties };

      if (enabled) {
        // プロパティを有効にする
        updatedDisabledProperties = disabledProperties.filter(p => p !== property);
      } else {
        // プロパティを無効にする
        updatedDisabledProperties = disabledProperties.includes(property) 
          ? disabledProperties 
          : [...disabledProperties, property];
        
        // displayプロパティが無効化されても、値自体は残しておく
        // 値の削除は行わず、disabledPropertiesで無効化するだけ
      }
      
      // 対象要素を更新
      const updatedElement = {
        ...element,
        properties: updatedProperties,
        disabledProperties: updatedDisabledProperties
      };
      
      // 子要素と孫要素も同様に更新
      if (updatedElement.children && updatedElement.children.length > 0) {
        // すべての子要素とその子孫のプロパティも同様に更新
        const updateChildrenRecursively = (children: ElementType[]): ElementType[] => {
          return children.map(child => {
            const childDisabledProperties = child.disabledProperties || [];
            let updatedChildDisabledProperties: string[];
            
            if (enabled) {
              // プロパティを有効にする
              updatedChildDisabledProperties = childDisabledProperties.filter(p => p !== property);
            } else {
              // プロパティを無効にする
              updatedChildDisabledProperties = childDisabledProperties.includes(property) 
                ? childDisabledProperties 
                : [...childDisabledProperties, property];
            }
            
            const updatedChild = {
              ...child,
              disabledProperties: updatedChildDisabledProperties
            };
            
            // 孫要素も同様に更新していく
            if (updatedChild.children && updatedChild.children.length > 0) {
              updatedChild.children = updateChildrenRecursively(updatedChild.children);
            }
            
            return updatedChild;
          });
        };
        
        // すべての子要素を再帰的に更新
        updatedElement.children = updateChildrenRecursively(updatedElement.children);
      }
      
      return updatedElement;
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: togglePropertyEnabled(element.children, targetId, property, enabled)
      };
    }
    return element;
  });
};

// 親要素を追加する関数
export const addParentElement = (
  elements: ElementType[],
  targetId: number
): { elements: ElementType[], newParentId: number } => {
  const newParentId = Date.now(); // ユニークなID

  // メイン要素のプロパティを参考にする
  const mainElement = elements.length > 0 ? elements[0] : null;
  const mainElementProperties = mainElement ? { ...mainElement.properties } : {};
  
  // 親要素用にプロパティを上書きする
  const parentProperties = {
    ...mainElementProperties,
    backgroundColor: '#e2f0fb',
    padding: '10px',
    borderRadius: '8px',
    display: 'block',
    marginTop: '10px',
    marginBottom: '10px',
  };

  // トップレベルの要素に親を追加する場合
  const topLevelIndex = elements.findIndex(el => el.id === targetId);
  if (topLevelIndex !== -1) {
    const targetElement = elements[topLevelIndex];
    
    // 新しい親要素を作成
    const newParent: ElementType = {
      id: newParentId,
      text: '親要素',
      elementName: `parent-${countVisibleElements(elements) + 1}`,
      modifiers: ['container'],
      properties: parentProperties,
      children: [{ ...targetElement, parentId: newParentId }],
      parentId: null,
      expanded: true,
      hideElementName: false,
      hideModifiers: true,
      htmlTagName: 'section', // 親要素にはsectionタグをデフォルトで使用
      htmlAttributes: {}, // HTMLの属性
      hideHtmlTag: false, // HTMLタグ設定を初期状態で表示
      // メイン要素の無効プロパティを引き継ぐ
      disabledProperties: mainElement?.disabledProperties ? [...mainElement.disabledProperties] : []
    };
    
    // 元の要素を新しい親要素に置き換える
    const newElements = [...elements];
    newElements.splice(topLevelIndex, 1, newParent);
    
    return { elements: newElements, newParentId };
  }
  
  // 子要素を親で囲む関数（再帰的）
  const wrapChildWithParent = (elements: ElementType[], targetId: number): ElementType[] | null => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // 直接の子要素で対象を探す
      const childIndex = element.children.findIndex(child => child.id === targetId);
      if (childIndex !== -1) {
        // 対象の子要素
        const targetChild = element.children[childIndex];
        
        // 新しい親要素
        const newParent: ElementType = {
          id: newParentId,
          text: '親要素',
          elementName: `parent-${countVisibleElements(elements) + 1}`,
          modifiers: ['container'],
          properties: parentProperties,
          children: [{ ...targetChild, parentId: newParentId }],
          parentId: element.id,
          expanded: true,
          hideElementName: false,
          hideModifiers: true,
          htmlTagName: 'section', // 親要素にはsectionタグをデフォルトで使用
          htmlAttributes: {}, // HTMLの属性
          hideHtmlTag: false, // HTMLタグ設定を表示
          // メイン要素の無効プロパティを引き継ぐ
          disabledProperties: mainElement?.disabledProperties ? [...mainElement.disabledProperties] : []
        };
        
        // 子要素を親で置き換える
        const newChildren = [...element.children];
        newChildren.splice(childIndex, 1, newParent);
        
        return elements.map(el => {
          if (el.id === element.id) {
            return { ...el, children: newChildren };
          }
          return el;
        });
      }
      
      // 子要素の中をさらに探す
      if (element.children && element.children.length > 0) {
        const nestedResult = wrapChildWithParent([element], targetId);
        if (nestedResult) {
          return elements.map(el => {
            if (el.id === element.id) {
              return nestedResult[0];
            }
            return el;
          });
        }
      }
    }
    
    return null;
  };
  
  // 再帰的に子要素を探して親で囲む
  const result = wrapChildWithParent(elements, targetId);
  return { elements: result || elements, newParentId };
};

// 新しい要素を追加する関数
export const addNewElement = (
  elements: ElementType[], 
  position: 'before' | 'after' | 'child', 
  selectedId: number | null = null,
  parentId: number | null = null
): { elements: ElementType[], newElementId: number } => {
  const newElementId = Date.now(); // ユニークなID
  
  // 要素の背景色を設定（位置によって変更）
  const backgroundColor = position === 'child' ? '#1f4e84' : '#3498db';
  
  // メイン要素のプロパティを参考にする
  // 最初の要素のプロパティと同じものをコピーする
  const mainElement = elements.length > 0 ? elements[0] : null;
  const mainElementProperties = mainElement ? { ...mainElement.properties } : {};
  
  // 背景色を位置に合わせて上書き
  const properties = {
    ...mainElementProperties,
    backgroundColor,
    color: '#ffffff',
    fontSize: '16px',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
    display: 'block',
    position: parentId ? 'relative' : 'relative', // 子要素には相対位置
  };
  
  const newElement: ElementType = {
    id: newElementId,
    text: '新しい要素',
    elementName: `element-${countVisibleElements(elements) + 1}`,
    modifiers: ['secondary'],
    properties,
    children: [],
    parentId: parentId || null,
    expanded: true,
    hideElementName: false, // 要素名を初期状態では表示する
    hideModifiers: true, // モディファイアを初期状態では非表示に設定
    htmlTagName: 'div', // デフォルトのHTMLタグ名
    htmlAttributes: {}, // HTMLの属性
    hideHtmlTag: false, // HTMLタグ設定を初期状態で表示に設定
    // メイン要素の無効プロパティを引き継ぐ
    disabledProperties: mainElement?.disabledProperties ? [...mainElement.disabledProperties] : []
  };
  
  // 親要素内に追加する場合
  if (parentId) {
    const addChildToParent = (elements: ElementType[], parentId: number, newChild: ElementType): ElementType[] => {
      return elements.map(element => {
        if (element.id === parentId) {
          return {
            ...element,
            children: [...element.children, newChild],
            expanded: true, // 親要素を展開状態にする
          };
        } else if (element.children && element.children.length > 0) {
          return {
            ...element,
            children: addChildToParent(element.children, parentId, newChild)
          };
        }
        return element;
      });
    };
    
    return { 
      elements: addChildToParent(elements, parentId, newElement),
      newElementId: newElementId
    };
  }
  
  // 選択要素を基準に追加する場合
  if (!selectedId) {
    // 最上位に追加
    if (position === 'before') {
      return { 
        elements: [newElement, ...elements],
        newElementId: newElementId
      };
    } else {
      return { 
        elements: [...elements, newElement],
        newElementId: newElementId
      };
    }
  }
  
  // 平面構造で探して追加する関数
  const addElementAtLevel = (elements: ElementType[], targetId: number, newElement: ElementType, position: 'before' | 'after' | 'child'): ElementType[] | null => {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].id === targetId) {
        const newElements = [...elements];
        if (position === 'before') {
          newElements.splice(i, 0, newElement);
        } else if (position === 'after') {
          newElements.splice(i + 1, 0, newElement);
        }
        return newElements;
      }
      
      // 子要素内も検索
      if (elements[i].children && elements[i].children.length > 0) {
        const result = addElementAtLevel(elements[i].children, targetId, newElement, position);
        if (result) {
          return elements.map((element, index) => {
            if (index === i) {
              return {
                ...element,
                children: result
              };
            }
            return element;
          });
        }
      }
    }
    return null;
  };
  
  const result = addElementAtLevel(elements, selectedId, newElement, position);
  return { 
    elements: result || elements,
    newElementId: newElementId
  };
};

// 要素を削除する関数
export const removeElement = (elements: ElementType[], targetId: number): ElementType[] => {
  // 最上位の要素が1つしかない場合は削除しない
  if (elements.length === 1 && elements[0].id === targetId && !elements[0].parentId) {
    return elements;
  }
  
  // 要素を削除する再帰関数
  const removeElementById = (elements: ElementType[], targetId: number): ElementType[] | null => {
    // 現在のレベルでターゲットを検索
    const index = elements.findIndex(el => el.id === targetId);
    if (index !== -1) {
      const newElements = [...elements];
      newElements.splice(index, 1);
      return newElements;
    }
    
    // 子要素内を検索
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].children && elements[i].children.length > 0) {
        const updatedChildren = removeElementById(elements[i].children, targetId);
        if (updatedChildren !== null) {
          return elements.map((el, idx) => {
            if (idx === i) {
              return { ...el, children: updatedChildren };
            }
            return el;
          });
        }
      }
    }
    
    return null;
  };
  
  const result = removeElementById(elements, targetId);
  return result || elements;
};
