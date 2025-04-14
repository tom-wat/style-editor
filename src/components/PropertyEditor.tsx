// src/components/PropertyEditor.tsx
import React, { useState, useEffect } from 'react';
import { ElementType, generateBEMClassName } from '../utils/bemUtils';

interface PropertyEditorProps {
  blockName: string;
  selectedElement: ElementType;
  allElements: ElementType[];
  onUpdateBlockName: (name: string) => void;
  onUpdateElementName: (name: string) => void;
  onUpdateModifiers: (modifierStr: string) => void;
  onUpdateText: (text: string) => void;
  onUpdateProperty: (property: string, value: string) => void;
  onTogglePropertyEnabled?: (property: string, enabled: boolean) => void;
  onToggleElementName?: (show: boolean) => void;
  onToggleModifiers?: (show: boolean) => void;
  onUpdateHtmlTagName?: (tagName: string) => void;
  onUpdateHtmlAttribute?: (name: string, value: string) => void;
  onUpdateHtmlAttributeName?: (oldName: string, newName: string) => void;
  onDeleteHtmlAttribute?: (name: string) => void;
  onToggleHtmlTag?: (show: boolean) => void;
  onUpdateElementBlockName?: (blockName: string) => void;
  onToggleUseParentBlock?: (useParent: boolean) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  blockName,
  selectedElement,
  onUpdateBlockName,
  onUpdateElementName,
  onUpdateModifiers,
  onUpdateText,
  onUpdateProperty,
  onTogglePropertyEnabled,
  onToggleElementName,
  onToggleModifiers,
  onUpdateHtmlTagName,
  onUpdateHtmlAttribute,
  onUpdateHtmlAttributeName,
  onDeleteHtmlAttribute,
  onToggleHtmlTag,
  onUpdateElementBlockName,
  onToggleUseParentBlock
}) => {
  // アコーディオンの開閉状態を管理
  const [isHtmlPanelOpen, setIsHtmlPanelOpen] = useState<boolean>(false);
  const [isBEMPanelOpen, setIsBEMPanelOpen] = useState<boolean>(false);
  const [newAttributeName, setNewAttributeName] = useState<string>('');
  const [newAttributeValue, setNewAttributeValue] = useState<string>('');
  
  // 編集中の属性名を管理するための状態
  const [editingAttributeName, setEditingAttributeName] = useState<{
    originalName: string;
    newName: string;
  } | null>(null);
  
  // HTMLタグ名の一時的な入力状態
  const [tempHtmlTagName, setTempHtmlTagName] = useState<string>(selectedElement.htmlTagName || 'div');
  
  // プロパティをカテゴリに分類
  const propertyCategories = {
    font: {
      title: 'フォント',
      properties: ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign', 'textDecoration']
    },
    color: {
      title: 'カラー',
      properties: ['color', 'backgroundColor', 'borderColor']
    },
    dimension: {
      title: '幅と高さ',
      properties: ['width', 'height', 'max-width', 'max-height']
    },
    padding: {
      title: 'パディング',
      properties: ['padding', 'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'padding-block-end']
    },
    margin: {
      title: 'マージン',
      properties: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight']
    },
    display: {
      title: 'ディスプレイ',
      properties: ['display']
    },
    border: {
      title: 'ボーダー',
      properties: ['border', 'borderRadius', 'borderWidth', 'borderStyle']
    },
    other: {
      title: 'その他',
      properties: ['position', 'overflow', 'opacity', 'boxShadow', 'transform']
    }
  };
  
  // カテゴリの開閉状態を管理
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    font: false,
    color: false,
    dimension: false,
    padding: false,
    margin: false,
    display: false,
    border: false,
    other: false,
    uncategorized: false
  });

  // カラーピッカー用のプロパティ
  const colorProperties = ['backgroundColor', 'color', 'borderColor'];
  
  // 数値+単位用のプロパティとその単位
  const unitProperties: Record<string, string> = {
    width: 'px',
    height: 'px',
    'max-width': 'px',
    'max-height': 'px',
    fontSize: 'px',
    padding: 'px',
    'padding-inline-start': 'px',
    'padding-inline-end': 'px',
    'padding-block-start': 'px',
    'padding-block-end': 'px',
    borderRadius: 'px',
    marginTop: 'px',
    marginBottom: 'px',
    marginLeft: 'px',
    marginRight: 'px',
    borderWidth: 'px'
  };
  
  // autoを指定できるプロパティ
  const autoProperties = ['width', 'height', 'max-width', 'max-height'];

  // カテゴリの開閉を切り替える関数
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // selectedElementが変更されたときにtempHtmlTagNameを更新
  useEffect(() => {
    setTempHtmlTagName(selectedElement.htmlTagName || 'div');
  }, [selectedElement]);

  // タグ名の変更を処理
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempHtmlTagName(value);
    // フォーカスが外れたときにのみ更新するため、ここではonUpdateHtmlTagNameを呼ばない
  };

  // フォーカスが外れたときに空の値はデフォルトに戻し、値を更新する
  const handleTagNameBlur = () => {
    if (!tempHtmlTagName.trim()) {
      setTempHtmlTagName('div');
      if (onUpdateHtmlTagName) {
        onUpdateHtmlTagName('div');
      }
    } else {
      // ここで初めて更新する
      if (onUpdateHtmlTagName) {
        onUpdateHtmlTagName(tempHtmlTagName);
      }
    }
  };

  // 属性名の編集開始
  const handleAttributeNameChange = (originalName: string, newName: string) => {
    setEditingAttributeName({ originalName, newName });
  };

  // 属性名編集のフォーカス外れ時の処理
  const handleAttributeNameBlur = () => {
    if (editingAttributeName) {
      const { originalName, newName } = editingAttributeName;
      if (newName.trim() && newName !== originalName && onUpdateHtmlAttributeName) {
        onUpdateHtmlAttributeName(originalName, newName);
      }
      setEditingAttributeName(null);
    }
  };

  return (
    <div className="w-full md:w-80 min-w-80 border rounded-lg p-4 overflow-y-auto sticky top-4 max-h-[calc(100vh-2rem)]">
      <h2 className="text-lg font-semibold mb-2">要素</h2>
      
      <div className="border-b pb-2 mb-3">
        {/* HTMLタグアコーディオンパネル */}
        <div className="mb-2">
          <button
            className="flex w-full justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => setIsHtmlPanelOpen(!isHtmlPanelOpen)}
          >
            <span className="text-sm font-medium">HTMLタグ設定</span>
            <svg
              className={`w-5 h-5 transition-transform ${isHtmlPanelOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* HTMLタグ設定パネルの中身 */}
          {isHtmlPanelOpen && (
            <div className="mt-2 p-2 border border-gray-200 rounded">
              <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="use-html-tag"
                    checked={!selectedElement.hideHtmlTag}
                    onChange={(e) => onToggleHtmlTag && onToggleHtmlTag(e.target.checked)}
                  />
                  <label htmlFor="use-html-tag" className="text-sm font-medium">タグ名</label>
                </div>
                <input
                  type="text"
                  value={tempHtmlTagName}
                  onChange={handleTagNameChange}
                  onBlur={handleTagNameBlur}
                  disabled={selectedElement.hideHtmlTag}
                  className="w-full px-2 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              {/* 属性一覧 */}
              {!selectedElement.hideHtmlTag && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">属性</label>
                  <div className="space-y-2 mb-2">
                    {selectedElement.htmlAttributes && Object.entries(selectedElement.htmlAttributes).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingAttributeName?.originalName === name 
                            ? editingAttributeName.newName 
                            : name}
                          onChange={(e) => handleAttributeNameChange(name, e.target.value)}
                          onBlur={handleAttributeNameBlur}
                          className="w-2/5 px-2 py-1 border rounded"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => onUpdateHtmlAttribute && onUpdateHtmlAttribute(name, e.target.value)}
                          className="w-2/5 flex-1 px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => onDeleteHtmlAttribute && onDeleteHtmlAttribute(name)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* 新規属性追加 */}
                  <div className="flex items-end gap-2 mt-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">属性名</label>
                      <input
                        type="text"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                        placeholder="id"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">値</label>
                      <input
                        type="text"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                        placeholder="element-id"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newAttributeName && newAttributeValue && onUpdateHtmlAttribute) {
                          onUpdateHtmlAttribute(newAttributeName, newAttributeValue);
                          setNewAttributeName('');
                          setNewAttributeValue('');
                        }
                      }}
                      disabled={!newAttributeName || !newAttributeValue}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-gray-300"
                    >
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* BEMアコーディオンパネル */}
        <div className="mb-2">
          <button
            className="flex w-full justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => setIsBEMPanelOpen(!isBEMPanelOpen)}
          >
            <span className="text-sm font-medium">クラス名設定</span>
            <svg
              className={`w-5 h-5 transition-transform ${isBEMPanelOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* アコーディオンの中身 */}
          {isBEMPanelOpen && (
            <div className="mt-2 p-2 border border-gray-200 rounded">
              {/* グローバルブロック名設定 */}
              <div className="mb-3 pb-2 border-b border-gray-200">
                <h4 className="text-sm font-semibold mb-2">グローバルブロック名</h4>
                <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
                  <label className="text-sm font-medium">ブロック名：</label>
                  <input
                    type="text"
                    value={blockName}
                    onChange={(e) => onUpdateBlockName(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
              
              {/* 要素固有のブロック名設定 */}
              <div className="mb-3 pb-2 border-b border-gray-200">
                <h4 className="text-sm font-semibold mb-2">この要素のブロック名</h4>
                
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="use-parent-block"
                    checked={!!selectedElement.useParentBlock}
                    onChange={(e) => onToggleUseParentBlock && onToggleUseParentBlock(e.target.checked)}
                    className="mr-1"
                    disabled={!selectedElement.parentId} // 親要素がない場合は無効化
                  />
                  <label htmlFor="use-parent-block" className="text-sm">
                    親要素のブロック名を使用する
                  </label>
                </div>
                
                <div className="grid grid-cols-[auto,1fr] gap-2 items-center mb-2">
                  <label className="text-sm font-medium">要素固有ブロック名：</label>
                  <input
                    type="text"
                    value={selectedElement.blockName || ''}
                    onChange={(e) => onUpdateElementBlockName && onUpdateElementBlockName(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                    disabled={selectedElement.useParentBlock}
                    placeholder={selectedElement.useParentBlock ? '親のブロック名を使用します' : 'ブロック名を入力'}
                  />
                </div>
                
                <div className="text-xs text-gray-500 italic mb-2">
                  {selectedElement.useParentBlock ? 
                    '親要素のブロック名が連動して使われます' : 
                    selectedElement.blockName ? 
                      'この要素に固有のブロック名が設定されています' : 
                      'グローバルブロック名が使用されます'}
                </div>
              </div>
              
              {/* 要素名設定 */}
              <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hide-element-name"
                    checked={!selectedElement.hideElementName}
                    onChange={(e) => onToggleElementName && onToggleElementName(e.target.checked)}
                  />
                  <label htmlFor="hide-element-name" className="text-sm font-medium">要素名</label>
                </div>
                <input
                  type="text"
                  value={selectedElement.elementName || ''}
                  onChange={(e) => onUpdateElementName(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              
              {/* モディファイア設定 */}
              <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hide-modifiers"
                    checked={!selectedElement.hideModifiers}
                    onChange={(e) => onToggleModifiers && onToggleModifiers(e.target.checked)}
                  />
                  <label htmlFor="hide-modifiers" className="text-sm font-medium">モディファイア</label>
                </div>
                <input
                  type="text"
                  value={(selectedElement.modifiers || []).join(', ')}
                  onChange={(e) => onUpdateModifiers(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              
              {/* 生成されるクラス名表示 */}
              <div className="mb-2">
              <label className="block text-sm font-medium mb-1">生成されるクラス名：</label>
              <div className="text-sm bg-gray-100 p-2 rounded break-words">
              {generateBEMClassName(selectedElement, blockName)}
              </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-2 grid grid-cols-[auto,1fr] gap-2 items-center">
          <label className="text-sm font-medium">テキスト：</label>
          <input
            type="text"
            value={selectedElement.text}
            onChange={(e) => onUpdateText(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">プロパティ</h3>
        
        {/* カテゴリ別のプロパティ表示 */}
        {Object.entries(propertyCategories).map(([categoryKey, category]) => {
          // カテゴリに含まれるプロパティのうち、selectedElementに存在するもののみをフィルタリング
          const availableProperties = category.properties.filter(prop => 
            prop in selectedElement.properties
          );
          
          // 利用可能なプロパティがない場合はそのカテゴリを表示しない
          if (availableProperties.length === 0) return null;
          
          return (
            <div key={categoryKey} className="mb-4">
              {/* カテゴリのアコーディオンヘッダー */}
              <button
                className="flex w-full justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded mb-2"
                onClick={() => toggleCategory(categoryKey)}
              >
                <span className="text-sm font-medium">{category.title}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${openCategories[categoryKey] ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* カテゴリの内容 */}
              {openCategories[categoryKey] && (
                <div className="pl-2 space-y-3 border-l-2 border-gray-200">
                  {availableProperties.map(property => (
                    <div key={property} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`property-enabled-${property}`}
                          checked={!(selectedElement.disabledProperties || []).includes(property)}
                          onChange={(e) => onTogglePropertyEnabled && onTogglePropertyEnabled(property, e.target.checked)}
                          className="mr-1"
                        />
                        <label className="block text-sm font-medium" htmlFor={`property-enabled-${property}`}>
                          {property}:
                        </label>
                      </div>
                      
                      {colorProperties.includes(property) ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className="w-8 h-8 p-0 border"
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                          <input
                            type="text"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className={`flex-1 px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                        </div>
                      ) : property in unitProperties ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {autoProperties.includes(property) && (
                              <div className="flex items-center mr-2">
                                <input
                                  type="checkbox"
                                  id={`auto-${property}`}
                                  checked={selectedElement.properties[property] === 'auto'}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onUpdateProperty(property, 'auto');
                                    } else {
                                      onUpdateProperty(property, `100${unitProperties[property]}`);
                                    }
                                  }}
                                  className="mr-1"
                                  disabled={(selectedElement.disabledProperties || []).includes(property)}
                                />
                                <label htmlFor={`auto-${property}`} className="text-xs">auto</label>
                              </div>
                            )}
                            {selectedElement.properties[property] !== 'auto' && (
                              <input
                                type="range"
                                min="0"
                                max="300"
                                value={parseInt(selectedElement.properties[property]) || 0}
                                onChange={(e) => onUpdateProperty(property, `${e.target.value}${unitProperties[property]}`)}
                                className="flex-1"
                                disabled={selectedElement.properties[property] === 'auto' || (selectedElement.disabledProperties || []).includes(property)}
                              />
                            )}
                          </div>
                          <input
                            type="text"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className={`w-full px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={selectedElement.properties[property]}
                          onChange={(e) => onUpdateProperty(property, e.target.value)}
                          className={`w-full px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                          disabled={(selectedElement.disabledProperties || []).includes(property)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* カテゴリに属さないプロパティを「その他」として表示 */}
        {(() => {
          const allCategorizedProperties = Object.values(propertyCategories).flatMap(category => category.properties);
          const uncategorizedProperties = Object.keys(selectedElement.properties).filter(
            property => !allCategorizedProperties.includes(property)
          );
          
          if (uncategorizedProperties.length === 0) return null;
          
          return (
            <div className="mb-4">
              <button
                className="flex w-full justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded mb-2"
                onClick={() => toggleCategory('uncategorized')}
              >
                <span className="text-sm font-medium">未分類プロパティ</span>
                <svg
                  className={`w-5 h-5 transition-transform ${openCategories['uncategorized'] ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openCategories['uncategorized'] && (
                <div className="pl-2 space-y-3 border-l-2 border-gray-200">
                  {uncategorizedProperties.map(property => (
                    <div key={property} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`property-enabled-${property}`}
                          checked={!(selectedElement.disabledProperties || []).includes(property)}
                          onChange={(e) => onTogglePropertyEnabled && onTogglePropertyEnabled(property, e.target.checked)}
                          className="mr-1"
                        />
                        <label className="block text-sm font-medium" htmlFor={`property-enabled-${property}`}>
                          {property}:
                        </label>
                      </div>
                      
                      {colorProperties.includes(property) ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className="w-8 h-8 p-0 border"
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                          <input
                            type="text"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className={`flex-1 px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                        </div>
                      ) : property in unitProperties ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {autoProperties.includes(property) && (
                              <div className="flex items-center mr-2">
                                <input
                                  type="checkbox"
                                  id={`auto-${property}`}
                                  checked={selectedElement.properties[property] === 'auto'}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      onUpdateProperty(property, 'auto');
                                    } else {
                                      onUpdateProperty(property, `100${unitProperties[property]}`);
                                    }
                                  }}
                                  className="mr-1"
                                  disabled={(selectedElement.disabledProperties || []).includes(property)}
                                />
                                <label htmlFor={`auto-${property}`} className="text-xs">auto</label>
                              </div>
                            )}
                            {selectedElement.properties[property] !== 'auto' && (
                              <input
                                type="range"
                                min="0"
                                max="300"
                                value={parseInt(selectedElement.properties[property]) || 0}
                                onChange={(e) => onUpdateProperty(property, `${e.target.value}${unitProperties[property]}`)}
                                className="flex-1"
                                disabled={selectedElement.properties[property] === 'auto' || (selectedElement.disabledProperties || []).includes(property)}
                              />
                            )}
                          </div>
                          <input
                            type="text"
                            value={selectedElement.properties[property]}
                            onChange={(e) => onUpdateProperty(property, e.target.value)}
                            className={`w-full px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                            disabled={(selectedElement.disabledProperties || []).includes(property)}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={selectedElement.properties[property]}
                          onChange={(e) => onUpdateProperty(property, e.target.value)}
                          className={`w-full px-2 py-1 border rounded text-sm ${(selectedElement.disabledProperties || []).includes(property) ? 'bg-gray-100 text-gray-500' : ''}`}
                          disabled={(selectedElement.disabledProperties || []).includes(property)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default PropertyEditor;
