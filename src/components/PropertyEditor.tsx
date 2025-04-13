// src/components/PropertyEditor.tsx
import React from 'react';
import { ElementType, generateBEMClassName } from '../utils/bemUtils';

interface PropertyEditorProps {
  blockName: string;
  selectedElement: ElementType;
  onUpdateBlockName: (name: string) => void;
  onUpdateElementName: (name: string) => void;
  onUpdateModifiers: (modifierStr: string) => void;
  onUpdateText: (text: string) => void;
  onUpdateProperty: (property: string, value: string) => void;
  onTogglePropertyEnabled?: (property: string, enabled: boolean) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  blockName,
  selectedElement,
  onUpdateBlockName,
  onUpdateElementName,
  onUpdateModifiers,
  onUpdateText,
  onUpdateProperty,
  onTogglePropertyEnabled
}) => {
  // カラーピッカー用のプロパティ
  const colorProperties = ['backgroundColor', 'color'];
  
  // 数値+単位用のプロパティとその単位
  const unitProperties: Record<string, string> = {
    width: 'px',
    height: 'px',
    fontSize: 'px',
    padding: 'px',
    borderRadius: 'px',
    marginTop: 'px',
    marginBottom: 'px',
    marginLeft: 'px',
    marginRight: 'px'
  };
  
  // autoを指定できるプロパティ
  const autoProperties = ['width', 'height'];

  return (
    <div className="w-full md:w-80 min-w-80 border rounded-lg p-4 overflow-y-auto sticky top-4 max-h-[calc(100vh-2rem)]">
      <h2 className="text-lg font-semibold mb-2">プロパティ</h2>
      
      <div className="border-b pb-2 mb-3">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">ブロック名：</label>
          <input
            type="text"
            value={blockName}
            onChange={(e) => onUpdateBlockName(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">要素名：</label>
          <input
            type="text"
            value={selectedElement.elementName || ''}
            onChange={(e) => onUpdateElementName(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">モディファイア（カンマ区切り）：</label>
          <input
            type="text"
            value={(selectedElement.modifiers || []).join(', ')}
            onChange={(e) => onUpdateModifiers(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">生成されるクラス名：</label>
          <div className="text-sm bg-gray-100 p-2 rounded break-words">
            {generateBEMClassName(selectedElement, blockName)}
          </div>
        </div>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">テキスト：</label>
          <input
            type="text"
            value={selectedElement.text}
            onChange={(e) => onUpdateText(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">スタイルプロパティ</h3>
        {Object.keys(selectedElement.properties).map((property) => (
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
                />
                <input
                  type="text"
                  value={selectedElement.properties[property]}
                  onChange={(e) => onUpdateProperty(property, e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
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
                      disabled={selectedElement.properties[property] === 'auto'}
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={selectedElement.properties[property]}
                  onChange={(e) => onUpdateProperty(property, e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            ) : (
              <input
                type="text"
                value={selectedElement.properties[property]}
                onChange={(e) => onUpdateProperty(property, e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyEditor;
