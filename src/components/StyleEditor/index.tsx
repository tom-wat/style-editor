// src/components/StyleEditor/index.tsx
import React from 'react';
import Preview from '../Preview';
import Toast from '../Toast';
import PropertyEditor from '../PropertyEditor';
import { useStyleEditor } from './hooks/useStyleEditor';

const StyleEditor: React.FC = () => {
  const {
    blockName,
    elements,
    selectedElement,
    selectedIndex,
    toast,
    setBlockName,
    handleAddElement,
    handleAddParentElement,
    handleRemoveElement,
    handleSelectElement,
    handleUpdateText,
    handleUpdateElementName,
    handleUpdateModifiers,
    handleUpdateProperty,
    handleTogglePropertyEnabled,
    handleToggleElementName,
    handleToggleModifiers,
    handleUpdateHtmlTagName,
    handleUpdateHtmlAttribute,
    handleDeleteHtmlAttribute,
    handleToggleHtmlTag,
    handleUpdateHtmlAttributeName,
    handleUpdateElementBlockName,
    handleToggleUseParentBlock,
    closeToast
  } = useStyleEditor();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* <div className="bg-white z-10 py-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">スタイルエディタ</h1>
        </div>
      </div> */}
      
      <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]">
        <Preview 
          elements={elements}
          selectedElement={selectedElement}
          selectedIndex={selectedIndex}
          blockName={blockName}
          onAddElement={handleAddElement}
          onAddParentElement={handleAddParentElement}
          onRemoveElement={handleRemoveElement}
          onSelectElement={handleSelectElement}
        />
        
        <PropertyEditor 
          blockName={blockName}
          selectedElement={selectedElement}
          allElements={elements}
          onUpdateBlockName={setBlockName}
          onUpdateElementName={handleUpdateElementName}
          onUpdateModifiers={handleUpdateModifiers}
          onUpdateText={handleUpdateText}
          onUpdateProperty={handleUpdateProperty}
          onTogglePropertyEnabled={handleTogglePropertyEnabled}
          onToggleElementName={handleToggleElementName}
          onToggleModifiers={handleToggleModifiers}
          onUpdateHtmlTagName={handleUpdateHtmlTagName}
          onUpdateHtmlAttribute={handleUpdateHtmlAttribute}
          onUpdateHtmlAttributeName={handleUpdateHtmlAttributeName}
          onDeleteHtmlAttribute={handleDeleteHtmlAttribute}
          onToggleHtmlTag={handleToggleHtmlTag}
          onUpdateElementBlockName={handleUpdateElementBlockName}
          onToggleUseParentBlock={handleToggleUseParentBlock}
        />
      </div>
      
      {/* トースト通知 */}
      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={closeToast}
        duration={3000}
        type={toast.type}
      />
    </div>
  );
};

export default StyleEditor;
