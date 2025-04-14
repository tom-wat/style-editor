// src/components/PropertyEditor/index.tsx
import React, { useState } from 'react';
import { ElementType } from '../../utils/bemUtils';
import HtmlPanel from './HtmlPanel';
import BemPanel from './BemPanel';
import PropertiesPanel from './PropertiesPanel';

export interface PropertyEditorProps {
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

const PropertyEditor: React.FC<PropertyEditorProps> = (props) => {
  const {
    blockName,
    selectedElement,
    onUpdateText
  } = props;

  // アコーディオンの開閉状態を管理
  const [isHtmlPanelOpen, setIsHtmlPanelOpen] = useState<boolean>(false);
  const [isBEMPanelOpen, setIsBEMPanelOpen] = useState<boolean>(false);

  return (
    <div className="w-full md:w-80 min-w-80 border rounded-lg p-4 overflow-y-auto sticky top-4 max-h-[calc(100vh-2rem)]">
      <h2 className="text-lg font-semibold mb-2">要素</h2>
      
      <div className="border-b pb-2 mb-3">
        {/* HTMLタグアコーディオンパネル */}
        <HtmlPanel 
          isOpen={isHtmlPanelOpen}
          setIsOpen={setIsHtmlPanelOpen}
          selectedElement={selectedElement}
          onUpdateHtmlTagName={props.onUpdateHtmlTagName}
          onUpdateHtmlAttribute={props.onUpdateHtmlAttribute}
          onUpdateHtmlAttributeName={props.onUpdateHtmlAttributeName}
          onDeleteHtmlAttribute={props.onDeleteHtmlAttribute}
          onToggleHtmlTag={props.onToggleHtmlTag}
        />

        {/* BEMアコーディオンパネル */}
        <BemPanel 
          isOpen={isBEMPanelOpen}
          setIsOpen={setIsBEMPanelOpen}
          blockName={blockName}
          selectedElement={selectedElement}
          onUpdateBlockName={props.onUpdateBlockName}
          onUpdateElementName={props.onUpdateElementName}
          onUpdateModifiers={props.onUpdateModifiers}
          onToggleElementName={props.onToggleElementName}
          onToggleModifiers={props.onToggleModifiers}
          onUpdateElementBlockName={props.onUpdateElementBlockName}
          onToggleUseParentBlock={props.onToggleUseParentBlock}
        />
        
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
      
      {/* プロパティパネル */}
      <PropertiesPanel 
        selectedElement={selectedElement}
        onUpdateProperty={props.onUpdateProperty}
        onTogglePropertyEnabled={props.onTogglePropertyEnabled}
      />
    </div>
  );
};

export default PropertyEditor;
