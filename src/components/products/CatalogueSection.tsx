import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Download, 
  FileText, 
  Eye,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Catalogue } from "@/generated/prisma";

interface CatalogueSectionProps {
  catalogue: Catalogue & { brand?: { name: string } };
  className?: string;
}

export default function CatalogueSection({ catalogue, className }: CatalogueSectionProps) {
  if (!catalogue) {
    return null;
  }

  const isPdfFile = catalogue.fileUrl?.toLowerCase().endsWith('.pdf');
  const fileName = catalogue.fileUrl?.split('/').pop() || 'catalogue';

  return (
    <section className={cn("mb-12", className)}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Catalogue</h3>
              {catalogue.brand && (
                <p className="text-sm text-muted-foreground">
                  Catalogue {catalogue.brand.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Titre du catalogue</p>
              <p className="font-medium text-lg text-foreground">{catalogue.title}</p>
            </div>
            
            {catalogue.fileUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Document</p>
                  <Badge variant="outline" className="text-xs">
                    {isPdfFile ? 'PDF' : 'Fichier'}
                  </Badge>
                </div>
                
                {/* PDF Preview for modern browsers */}
                {isPdfFile && (
                  <div className="border rounded-lg overflow-hidden bg-muted">
                    <div className="h-96 w-full">
                      <iframe
                        src={`${catalogue.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-full border-0"
                        title={`Catalogue ${catalogue.title}`}
                        onError={(e) => {
                          // Fallback if iframe doesn't work
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-full text-muted-foreground">
                                <div class="text-center space-y-2">
                                  <AlertCircle className="h-8 w-8 mx-auto" />
                                  <p class="text-sm">Aperçu non disponible</p>
                                  <p class="text-xs">Cliquez sur "Ouvrir" pour voir le document</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1 gap-2">
                    <a
                      href={catalogue.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 justify-center"
                    >
                      <Eye className="h-4 w-4" />
                      Ouvrir le catalogue
                    </a>
                  </Button>
                  
                  <Button variant="outline" asChild className="flex-1 gap-2">
                    <a
                      href={catalogue.fileUrl}
                      download={fileName}
                      className="inline-flex items-center gap-2 justify-center"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </a>
                  </Button>
                </div>

                {/* File Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Fichier: {fileName}</p>
                  <p>Format: {isPdfFile ? 'PDF' : 'Document'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

