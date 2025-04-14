// src/components/PropertyEditor/PropertiesPanel.tsx
import React, { useState } from 'react';
import { ElementType } from '../../utils/bemUtils';
import { AccordionPanel } from './common/AccordionPanel';
import PropertyInput from './PropertyInput';
import { propertyCategories, PropertyCategory } from './propertyCategories';

interface PropertiesPanelProps {
  selectedElement: ElementType;
  onUpdateProperty: (property: string, value: string) => void;
  onTogglePropertyEnabled?: (property: string, enabled: boolean) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateProperty,
  onTogglePropertyEnabled
}) => {
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

  // カテゴリの開閉を切り替える関数
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 全てのカテゴライズされたプロパティのリスト
  const allCategorizedProperties = Object.values(propertyCategories).flatMap(category => category.properties);
  
  // カテゴリに属さないプロパティのリスト
  const uncategorizedProperties = Object.keys(selectedElement.properties).filter(
    property => !allCategorizedProperties.includes(property)
  );

  return (
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
          <CategorySection 
            key={categoryKey}
            categoryKey={categoryKey}
            category={category}
            availableProperties={availableProperties}
            isOpen={openCategories[categoryKey]}
            toggleCategory={toggleCategory}
            selectedElement={selectedElement}
            onUpdateProperty={onUpdateProperty}
            onTogglePropertyEnabled={onTogglePropertyEnabled}
          />
        );
      })}
      
      {/* 未分類プロパティ */}
      {uncategorizedProperties.length > 0 && (
        <CategorySection 
          categoryKey="uncategorized"
          category={{ title: '未分類プロパティ', properties: [] }}
          availableProperties={uncategorizedProperties}
          isOpen={openCategories['uncategorized']}
          toggleCategory={toggleCategory}
          selectedElement={selectedElement}
          onUpdateProperty={onUpdateProperty}
          onTogglePropertyEnabled={onTogglePropertyEnabled}
        />
      )}
    </div>
  );
};

interface CategorySectionProps {
  categoryKey: string;
  category: PropertyCategory;
  availableProperties: string[];
  isOpen: boolean;
  toggleCategory: (category: string) => void;
  selectedElement: ElementType;
  onUpdateProperty: (property: string, value: string) => void;
  onTogglePropertyEnabled?: (property: string, enabled: boolean) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryKey,
  category,
  availableProperties,
  isOpen,
  toggleCategory,
  selectedElement,
  onUpdateProperty,
  onTogglePropertyEnabled
}) => {
  return (
    <div className="mb-4">
      <AccordionPanel 
        title={category.title}
        isOpen={isOpen}
        onToggle={() => toggleCategory(categoryKey)}
      >
        <div className="pl-2 space-y-3 border-l-2 border-gray-200">
          {availableProperties.map(property => (
            <PropertyInput 
              key={property}
              property={property}
              value={selectedElement.properties[property]}
              isDisabled={(selectedElement.disabledProperties || []).includes(property)}
              onUpdateProperty={onUpdateProperty}
              onTogglePropertyEnabled={onTogglePropertyEnabled}
            />
          ))}
        </div>
      </AccordionPanel>
    </div>
  );
};

export default PropertiesPanel;
