// src/components/PropertyEditor/HtmlPanel.tsx
import React, { useState, useEffect } from 'react';
import { ElementType } from '../../utils/bemUtils';
import { AccordionPanel } from './common/AccordionPanel';

interface HtmlPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedElement: ElementType;
  onUpdateHtmlTagName?: (tagName: string) => void;
  onUpdateHtmlAttribute?: (name: string, value: string) => void;
  onUpdateHtmlAttributeName?: (oldName: string, newName: string) => void;
  onDeleteHtmlAttribute?: (name: string) => void;
  onToggleHtmlTag?: (show: boolean) => void;
}

const HtmlPanel: React.FC<HtmlPanelProps> = ({
  isOpen,
  setIsOpen,
  selectedElement,
  onUpdateHtmlTagName,
  onUpdateHtmlAttribute,
  onUpdateHtmlAttributeName,
  onDeleteHtmlAttribute,
  onToggleHtmlTag
}) => {
  const [tempHtmlTagName, setTempHtmlTagName] = useState<string>(selectedElement.htmlTagName || 'div');
  const [newAttributeName, setNewAttributeName] = useState<string>('');
  const [newAttributeValue, setNewAttributeValue] = useState<string>('');
  const [editingAttributeName, setEditingAttributeName] = useState<{
    originalName: string;
    newName: string;
  } | null>(null);

  // selectedElementが変更されたときにtempHtmlTagNameを更新
  useEffect(() => {
    setTempHtmlTagName(selectedElement.htmlTagName || 'div');
  }, [selectedElement]);

  // タグ名の変更を処理
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempHtmlTagName(e.target.value);
  };

  // フォーカスが外れたときに空の値はデフォルトに戻し、値を更新する
  const handleTagNameBlur = () => {
    if (!tempHtmlTagName.trim()) {
      setTempHtmlTagName('div');
      if (onUpdateHtmlTagName) {
        onUpdateHtmlTagName('div');
      }
    } else {
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
    <div className="mb-2">
      <AccordionPanel 
        title="HTMLタグ設定"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      >
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
      </AccordionPanel>
    </div>
  );
};

export default HtmlPanel;
