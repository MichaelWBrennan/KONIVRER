import { useEffect, useRef } from "react";
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import * as s from "./pdfViewer.css.ts";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export function PdfViewer({ url = "/sample.pdf" }: { url?: string }): any {
  const canvasRef: any : any : any : any = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let pdfDoc: PDFDocumentProxy | null = null;

    (async () => {
      const loadingTask: any : any : any : any = getDocument(url);
      pdfDoc = await loadingTask.promise;
      if (isCancelled) return;

      // Render first page for simple viewer parity
      const page: any : any : any : any = await pdfDoc.getPage(1);
      const viewport: any : any : any : any = page.getViewport({ scale: 1.5 });
      const canvas: any : any : any : any = canvasRef.current;
      if (!canvas) return;
      const context: any : any : any : any = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext: any : any : any : any = {
        canvasContext: context,
        canvas: canvas,
        viewport: viewport,
      };

      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvasRef.current,
      }).promise;
    })();

    return () => {
      isCancelled = true;
      // pdf.js cleans up internally when loadingTask is abandoned
    };
  }, [url]);

  return (
    <div className={s.viewerWrap}>
      <div className={s.toolbar}>
        <h3 className={s.title}>PDF Viewer</h3>
      </div>
      <div className={s.canvasWrap}>
        <canvas ref={canvasRef} className={s.canvas} />
      </div>
    </div>
  );
}
