"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Package, 
  Layers, 
  Ruler, 
  Palette, 
  ChevronDown, 
  ChevronUp,
  Info,
  Zap,
  Shield,
  Star
} from "lucide-react";

interface ProductAttributesProps {
  attributes: any;
  className?: string;
}

export default function ProductAttributes({ attributes, className }: ProductAttributesProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  if (!attributes || typeof attributes !== 'object') {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Settings className="h-8 w-8" />
          <p className="text-sm">Aucune caractéristique technique disponible</p>
        </div>
      </div>
    );
  }

  const attributeEntries = Object.entries(attributes);
  const maxInitialDisplay = 6;
  const displayEntries = showAll ? attributeEntries : attributeEntries.slice(0, maxInitialDisplay);

  const toggleSection = (key: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const renderAttributeValue = (key: string, value: any, level: number = 0): React.ReactNode => {
    // Handle array values
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {String(item)}
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    // Handle object values (nested attributes)
    if (typeof value === 'object' && value !== null) {
      const isExpanded = expandedSections.has(key);
      const hasNestedContent = Object.keys(value).length > 0;
      
      return (
        <div className={`space-y-3 ${level > 0 ? 'pl-4 border-l-2 border-muted/50' : ''}`}>
          {hasNestedContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(key)}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 mr-1" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1" />
              )}
              {isExpanded ? 'Masquer' : 'Afficher'} les détails
            </Button>
          )}
          
          {isExpanded && (
            <div className="space-y-3 pl-2">
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                      {formatAttributeLabel(subKey)}
                    </Badge>
                  </div>
                  <div className="pl-2">
                    {renderAttributeValue(subKey, subValue, level + 1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Handle primitive values (string, number, etc.)
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {String(value)}
        </span>
      </div>
    );
  };

  const getAttributeIcon = (key: string) => {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('dimension') || keyLower.includes('taille') || keyLower.includes('hauteur') || keyLower.includes('largeur') || keyLower.includes('profondeur') || keyLower.includes('cm') || keyLower.includes('mm')) {
      return <Ruler className="h-4 w-4 text-blue-500" />;
    }
    if (keyLower.includes('finition') || keyLower.includes('couleur') || keyLower.includes('color')) {
      return <Palette className="h-4 w-4 text-purple-500" />;
    }
    if (keyLower.includes('niveau') || keyLower.includes('layer') || keyLower.includes('etage')) {
      return <Layers className="h-4 w-4 text-green-500" />;
    }
    if (keyLower.includes('code') || keyLower.includes('reference') || keyLower.includes('ref')) {
      return <Package className="h-4 w-4 text-orange-500" />;
    }
    if (keyLower.includes('performance') || keyLower.includes('puissance') || keyLower.includes('vitesse')) {
      return <Zap className="h-4 w-4 text-yellow-500" />;
    }
    if (keyLower.includes('securite') || keyLower.includes('protection') || keyLower.includes('certification')) {
      return <Shield className="h-4 w-4 text-red-500" />;
    }
    if (keyLower.includes('qualite') || keyLower.includes('grade') || keyLower.includes('rating')) {
      return <Star className="h-4 w-4 text-amber-500" />;
    }
    
    return <Settings className="h-4 w-4 text-muted-foreground" />;
  };

  const formatAttributeLabel = (key: string) => {
    // Convert camelCase or snake_case to readable format
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const getAttributePriority = (key: string) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('dimension') || keyLower.includes('taille')) return 1;
    if (keyLower.includes('couleur') || keyLower.includes('finition')) return 2;
    if (keyLower.includes('code') || keyLower.includes('reference')) return 3;
    return 4;
  };

  // Sort attributes by priority
  const sortedEntries = displayEntries.sort(([a], [b]) => {
    return getAttributePriority(a) - getAttributePriority(b);
  });

  return (
    <div className={`space-y-4 overflow-y-auto ${className}`}>
      {sortedEntries.map(([key, value], index) => (
        <Card key={key} className="overflow-hidden hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {getAttributeIcon(key)}
                <h4 className="font-semibold text-base text-foreground flex-1">
                  {formatAttributeLabel(key)}
                </h4>
                {typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(key)}
                    className="h-8 w-8 p-0"
                  >
                    {expandedSections.has(key) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              <div className="ml-7">
                {renderAttributeValue(key, value)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {attributeEntries.length > maxInitialDisplay && (
        <div className="text-center pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Afficher moins
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Afficher toutes les caractéristiques ({attributeEntries.length})
              </>
            )}
          </Button>
        </div>
      )}

      {attributeEntries.length === 0 && (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Info className="h-8 w-8" />
            <p className="text-sm">Aucune caractéristique technique disponible</p>
          </div>
        </div>
      )}
    </div>
  );
}
