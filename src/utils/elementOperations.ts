// src/utils/elementOperations.ts
import { ElementType, countVisibleElements } from './bemUtils';

// 選択された要素を取得する関数
export const getSelectedElement = (elements: ElementType[], selectedIndex: number): ElementType => {
  // フラットな配列での選択インデックスから実際の要素を取得する関数
  const findElementByIndex = (elements: ElementType[], targetIndex: number, currentIndex = 0) => {
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
  let result: ElementType[] = [];
  
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
      return {
        ...element,
        properties: {
          ...element.properties,
          [property]: value
        }
      };
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
      if (enabled) {
        updatedDisabledProperties = disabledProperties.filter(p => p !== property);
      } else {
        updatedDisabledProperties = disabledProperties.includes(property) 
          ? disabledProperties 
          : [...disabledProperties, property];
      }
      
      return {
        ...element,
        disabledProperties: updatedDisabledProperties
      };
    } else if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: togglePropertyEnabled(element.children, targetId, property, enabled)
      };
    }
    return element;
  });
};

// 新しい要素を追加する関数
export const addNewElement = (
  elements: ElementType[], 
  position: 'before' | 'after' | 'child', 
  selectedId: number | null = null,
  parentId: number | null = null
): { elements: ElementType[], newElementId: number } => {
  const newElementId = Date.now(); // ユニークなID
  const newElement: ElementType = {
    id: newElementId,
    text: '新しい要素',
    elementName: `element-${countVisibleElements(elements) + 1}`,
    modifiers: ['secondary'],
    properties: {
      width: 'auto',
      height: 'auto',
      backgroundColor: '#e74c3c',
      color: '#ffffff',
      fontSize: '16px',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      position: parentId ? 'relative' : 'relative', // 子要素には相対位置
    },
    children: [],
    parentId: parentId || null,
    expanded: true,
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
  const addElementAtLevel = (elements: ElementType[], targetId: number, newElement: ElementType, position: 'before' | 'after'): ElementType[] | null => {
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
