"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AttributesDisplayProps {
  attributes: Record<string, unknown>;
  compact?: boolean;
}

const AttributesDisplay: React.FC<AttributesDisplayProps> = ({
  attributes,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (
    !attributes ||
    typeof attributes !== "object" ||
    Object.keys(attributes).length === 0
  ) {
    return <span className="text-gray-400 text-sm italic">No attributes</span>;
  }

  const attributeEntries = Object.entries(attributes);
  const displayCount = compact ? 2 : attributeEntries.length;
  const hasMore = attributeEntries.length > displayCount;

  if (compact && !isExpanded) {
    return (
      <div className="flex flex-wrap gap-1">
        {attributeEntries.slice(0, displayCount).map(([key, value]) => (
          <Badge key={key} variant="secondary" className="text-xs">
            {key}: {String(value)}
          </Badge>
        ))}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
          >
            <ChevronRight size={12} className="mr-1" />+
            {attributeEntries.length - displayCount} more
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {compact && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
          >
            <ChevronDown size={12} className="mr-1" />
            Show less
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-1">
        {attributeEntries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{key}:</span>
            <Badge variant="outline" className="text-xs">
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributesDisplay;
