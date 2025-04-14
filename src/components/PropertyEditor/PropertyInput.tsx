// src/components/PropertyEditor/PropertyInput.tsx
import React from 'react';
import { colorProperties, unitProperties, autoProperties } from './propertyCategories';

interface PropertyInputProps {
  property: string;
  value: string;
  isDisabled: boolean;
  onUpdateProperty: (property: string, value: string) => void;
  onTogglePropertyEnabled?: (property: string, enabled: boolean) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  property,
  value,
  isDisabled,
  onUpdateProperty,
  onTogglePropertyEnabled
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`property-enabled-${property}`}
          checked={!isDisabled}
          onChange={(e) => onTogglePropertyEnabled && onTogglePropertyEnabled(property, e.target.checked)}
          className="mr-1"
        />
        <label className="block text-sm font-medium" htmlFor={`property-enabled-${property}`}>
          {property}:
        </label>
      </div>
      
      {colorProperties.includes(property) ? (
        <ColorPropertyInput 
          property={property}
          value={value}
          isDisabled={isDisabled}
          onUpdateProperty={onUpdateProperty}
        />
      ) : property in unitProperties ? (
        <UnitPropertyInput 
          property={property}
          value={value}
          isDisabled={isDisabled}
          onUpdateProperty={onUpdateProperty}
        />
      ) : (
        <TextPropertyInput 
          property={property}
          value={value}
          isDisabled={isDisabled}
          onUpdateProperty={onUpdateProperty}
        />
      )}
    </div>
  );
};

interface PropertyInputCommonProps {
  property: string;
  value: string;
  isDisabled: boolean;
  onUpdateProperty: (property: string, value: string) => void;
}

const ColorPropertyInput: React.FC<PropertyInputCommonProps> = ({
  property,
  value,
  isDisabled,
  onUpdateProperty
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onUpdateProperty(property, e.target.value)}
        className="w-8 h-8 p-0 border"
        disabled={isDisabled}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onUpdateProperty(property, e.target.value)}
        className={`flex-1 px-2 py-1 border rounded text-sm ${isDisabled ? 'bg-gray-100 text-gray-500' : ''}`}
        disabled={isDisabled}
      />
    </div>
  );
};

const UnitPropertyInput: React.FC<PropertyInputCommonProps> = ({
  property,
  value,
  isDisabled,
  onUpdateProperty
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {autoProperties.includes(property) && (
          <div className="flex items-center mr-2">
            <input
              type="checkbox"
              id={`auto-${property}`}
              checked={value === 'auto'}
              onChange={(e) => {
                if (e.target.checked) {
                  onUpdateProperty(property, 'auto');
                } else {
                  onUpdateProperty(property, `100${unitProperties[property as keyof typeof unitProperties]}`);
                }
              }}
              className="mr-1"
              disabled={isDisabled}
            />
            <label htmlFor={`auto-${property}`} className="text-xs">auto</label>
          </div>
        )}
        {value !== 'auto' && (
          <input
            type="range"
            min="0"
            max="300"
            value={parseInt(value) || 0}
            onChange={(e) => onUpdateProperty(property, `${e.target.value}${unitProperties[property as keyof typeof unitProperties]}`)}
            className="flex-1"
            disabled={value === 'auto' || isDisabled}
          />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onUpdateProperty(property, e.target.value)}
        className={`w-full px-2 py-1 border rounded text-sm ${isDisabled ? 'bg-gray-100 text-gray-500' : ''}`}
        disabled={isDisabled}
      />
    </div>
  );
};

const TextPropertyInput: React.FC<PropertyInputCommonProps> = ({
  property,
  value,
  isDisabled,
  onUpdateProperty
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onUpdateProperty(property, e.target.value)}
      className={`w-full px-2 py-1 border rounded text-sm ${isDisabled ? 'bg-gray-100 text-gray-500' : ''}`}
      disabled={isDisabled}
    />
  );
};

export default PropertyInput;
