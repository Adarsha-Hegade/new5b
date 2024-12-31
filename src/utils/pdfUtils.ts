import { pdfjs } from 'react-pdf';

export const initializePDFJS = () => {
  // Set worker source
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).href;
};

export const validatePDFUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType?.includes('pdf');
  } catch (error) {
    console.error('Error validating PDF URL:', error);
    return false;
  }
};