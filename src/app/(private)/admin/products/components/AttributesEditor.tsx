"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AttributesEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const AttributesEditor: React.FC<AttributesEditorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [formattedValue, setFormattedValue] = useState(value);

  React.useEffect(() => {
    setFormattedValue(value);
    validateJSON(value);
  }, [value]);

  const validateJSON = (jsonString: string) => {
    if (!jsonString || jsonString.trim() === '') {
      setIsValid(true);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      setIsValid(typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed));
    } catch {
      setIsValid(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setFormattedValue(newValue);
    onChange(newValue);
    validateJSON(newValue);
  };

  const formatJSON = () => {
    if (!formattedValue || formattedValue.trim() === '') return;
    
    try {
      const parsed = JSON.parse(formattedValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedValue(formatted);
      onChange(formatted);
      setIsValid(true);
    } catch (err) {
      // If JSON is invalid, don't format
      setIsValid(false);
    }
  };

  const clearAttributes = () => {
    setFormattedValue("");
    onChange("");
    setIsValid(true);
  };

  const addExampleAttribute = () => {
    const example = {
      color: "red",
      size: "large",
      material: "cotton",
      weight: "1.2kg"
    };
    const exampleString = JSON.stringify(example, null, 2);
    setFormattedValue(exampleString);
    onChange(exampleString);
    setIsValid(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="attributes" className="text-sm font-medium text-gray-700">
          Attributes (JSON)
        </Label>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExampleAttribute}
            disabled={disabled}
            className="text-xs"
          >
            Add Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJSON}
            disabled={disabled || !formattedValue || !isValid}
            className="text-xs"
          >
            Format JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAttributes}
            disabled={disabled}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <textarea
        id="attributes"
        rows={8}
        placeholder='{"color": "red", "size": "large", "material": "cotton"}'
        value={formattedValue}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
          error || !isValid ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-xs ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? 'Valid JSON' : 'Invalid JSON format'}
          </span>
        </div>
        
        {formattedValue && (
          <span className="text-xs text-gray-500">
            {Object.keys(formattedValue.trim() === '' ? {} : (() => {
              try {
                return JSON.parse(formattedValue);
              } catch {
                return {};
              }
            })()).length} attribute(s)
          </span>
        )}
      </div>
      
      {(error || !isValid) && (
        <p className="text-sm text-red-600">
          {error || "Please enter valid JSON format"}
        </p>
      )}
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>Enter product attributes as valid JSON object. Examples:</p>
        <div className="bg-gray-50 p-2 rounded font-mono text-xs">
          <div>• {"{"}"color": "red", "size": "large"{"}"}</div>
          <div>• {"{"}"dimensions": {"{"}"width": 10, "height": 20{"}"}, "weight": "1.2kg"{"}"}</div>
        </div>
        <p>Leave empty if no specific attributes are needed.</p>
      </div>
    </div>
  );
};

export default AttributesEditor;
