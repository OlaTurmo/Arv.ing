import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FileMetadata } from 'utils/fileStore';

// Set worker URL for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface Props {
  file: FileMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreview({ file, open, onOpenChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    if (!open) {
      setPdfDoc(null);
      return;
    }

    if (file.category === 'document') {
      const loadPdf = async () => {
        try {
          const doc = await pdfjsLib.getDocument(file.downloadUrl).promise;
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
        } catch (err) {
          console.error('Failed to load PDF:', err);
          setError('Kunne ikke laste PDF. Prøv igjen senere.');
        }
      };

      loadPdf();
    }

    return () => {
      if (pdfDoc) {
        pdfDoc.destroy();
        setPdfDoc(null);
      }
    };
  }, [open, file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Failed to render page:', err);
        setError('Kunne ikke vise siden. Prøv igjen senere.');
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const handleDownload = () => {
    window.open(file.downloadUrl, '_blank');
  };

  const renderContent = () => {
    if (file.category === 'document') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center space-x-4 mb-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(1.0)}
              >
                100%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
              >
                +
              </Button>
            </div>
            {numPages > 1 && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Forrige
                </Button>
                <span className="text-sm">
                  Side {currentPage} av {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                  disabled={currentPage === numPages}
                >
                  Neste
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-auto max-h-[60vh]">
            <canvas ref={canvasRef} className="mx-auto" />
            {error && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}
          </div>
        </div>
      );
    }

    if (file.category === 'image') {
      return (
        <div className="overflow-auto max-h-[70vh]">
          <img
            src={file.downloadUrl}
            alt={file.filename}
            className="max-w-full h-auto"
            onError={() => setError('Kunne ikke laste bildet. Prøv igjen senere.')}
          />
        </div>
      );
    }

    return (
      <div className="text-center py-4">
        Forhåndsvisning er ikke tilgjengelig for denne filtypen.
        <br />
        <Button
          variant="outline"
          className="mt-2"
          onClick={handleDownload}
        >
          Last ned fil
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="truncate">{file.filename}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              Last ned
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {renderContent()}
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        {file.description && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Beskrivelse</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {file.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
