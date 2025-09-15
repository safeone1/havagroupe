"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  Package, 
  X,
  ZoomIn,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ProductWithRelations } from "@/lib/actions/products";

interface ProductImageGalleryProps {
  product: ProductWithRelations;
  className?: string;
}

export default function ProductImageGallery({ product, className }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = product.imageUrls || [];
  const currentImage = images[selectedImageIndex];

  const nextImage = () => {
    if (images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
    setIsZoomed(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const resetZoom = () => {
    setIsZoomed(false);
  };

  if (images.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card className="aspect-square bg-muted rounded-lg overflow-hidden">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <Package className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Aucune image disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <Card className="aspect-square bg-muted rounded-lg overflow-hidden group relative">
          <CardContent className="p-0 h-full">
            {currentImage ? (
              <>
                <Image
                  src={currentImage.url}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-contain transition-transform duration-300",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                    onClick={openImageModal}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                    onClick={toggleZoom}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {images.map((image, index) => (
              <Button
                key={image.id}
                variant="ghost"
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 p-0",
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground"
                )}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 16vw, 8vw"
                />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && currentImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/20 hover:bg-background/30 backdrop-blur-sm z-10"
              onClick={closeImageModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/20 hover:bg-background/30 backdrop-blur-sm"
                onClick={toggleZoom}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/20 hover:bg-background/30 backdrop-blur-sm"
                onClick={resetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/30 backdrop-blur-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/30 backdrop-blur-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.url}
                alt={product.name}
                width={1200}
                height={800}
                className={cn(
                  "object-contain max-h-full max-w-full transition-transform duration-300",
                  isZoomed ? "scale-150" : "scale-100"
                )}
                priority
              />
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Badge variant="secondary" className="bg-background/20 backdrop-blur-sm">
                  {selectedImageIndex + 1} / {images.length}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

