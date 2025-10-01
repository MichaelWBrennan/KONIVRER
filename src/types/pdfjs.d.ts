declare module "pdfjs-dist" {
  export const GlobalWorkerOptions: { workerSrc: string };
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void> | void;
  }
  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
    destroy(): void;
  }
  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PDFPageViewport;
    render(params: { canvasContext: CanvasRenderingContext2D; viewport: PDFPageViewport }): { promise: Promise<void> };
  }
  export interface PDFPageViewport {
    width: number;
    height: number;
  }
  export function getDocument(params: { url: string; withCredentials?: boolean }): PDFDocumentLoadingTask;
}

declare module "pdfjs-dist/build/pdf.worker.mjs?url" {
  const src: string;
  export default src;
}
