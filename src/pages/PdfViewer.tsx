import { useEffect, useRef } from "react";
import * as s from "./pdfViewer.css.ts";

// Worker source will be configured after dynamic import

export function PdfViewer({ url = "/sample.pdf" }: { url?: string }): any {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let pdfDoc: any = null;

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      const loadingTask = pdfjs.getDocument(url);
      pdfDoc = await loadingTask.promise;
      if (isCancelled) return;

      // Render first page for simple viewer parity
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

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
