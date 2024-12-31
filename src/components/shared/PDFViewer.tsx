import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize PDF.js with the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).href;

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPageNumber(1);
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please check if the URL is correct and accessible.');
    setLoading(false);
  };

  const LoadingSpinner = () => (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
            disabled={pageNumber >= (numPages || 1)}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut }) => (
              <>
                <button
                  onClick={() => zoomOut()}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={() => zoomIn()}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ZoomIn size={20} />
                </button>
              </>
            )}
          </TransformWrapper>
          <button
            onClick={() => setRotation(prev => (prev + 90) % 360)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <RotateCw size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="h-full flex items-center justify-center bg-red-50 text-red-600 p-4 rounded">
            {error}
          </div>
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<LoadingSpinner />}
            error={
              <div className="h-full flex items-center justify-center bg-red-50 text-red-600 p-4 rounded">
                Failed to load PDF
              </div>
            }
          >
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit={true}
            >
              <TransformComponent>
                <Page
                  key={`page_${pageNumber}_${rotation}`}
                  pageNumber={pageNumber}
                  rotate={rotation}
                  className="shadow-lg"
                  loading={<LoadingSpinner />}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1}
                />
              </TransformComponent>
            </TransformWrapper>
          </Document>
        )}
      </div>
    </div>
  );
}