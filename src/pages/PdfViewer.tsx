import React, { type JSX, useEffect, useMemo, useRef, useState } from "react";
import * as s from "./pdfViewer.css.ts";
import * as pdfjsLib from "pdfjs-dist";
// Use Vite's ?url to get worker file URL and set workerSrc for cross-browser support
// This avoids relying on browser PDF plugins and ensures consistent rendering
// across Chrome, Firefox, Safari, and Edge.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite will resolve this at build time
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker as unknown as string;

type PdfViewerProps = {
  url?: string;
};

export function PdfViewer({ url = "/sample.pdf" }: PdfViewerProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadErrored, setLoadErrored] = useState<boolean>(false);
  const [useEmbedFallback, setUseEmbedFallback] = useState<boolean>(false);

  // Observe container size to keep pages responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) setContainerWidth(width);
      }
    });
    observer.observe(element);
    // Initialize with current width
    setContainerWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  // Load PDF when URL changes
  useEffect(() => {
    let cancelled = false;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    async function load() {
      try {
        setIsLoading(true);
        setLoadErrored(false);
        setUseEmbedFallback(false);
        if (!url) return;
        // Destroy any existing instance
        if (pdfRef.current) {
          try {
            await pdfRef.current.destroy();
          } catch {}
          pdfRef.current = null;
        }
        // Start loading task
        loadingTask = pdfjsLib.getDocument({ url, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) {
          try {
            await pdf.destroy();
          } catch {}
          return;
        }
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load PDF:", error);
        setNumPages(0);
        setIsLoading(false);
        setLoadErrored(true);
        setUseEmbedFallback(true);
      }
    }
    load();

    return () => {
      cancelled = true;
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch {}
      }
    };
  }, [url]);

  // Render pages whenever size or document changes
  useEffect(() => {
    const pdf = pdfRef.current;
    if (!pdf || !containerWidth || numPages === 0) return;

    let cancelled = false;

    async function renderAllPages() {
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        if (cancelled) return;
        try {
          const page = await pdf.getPage(pageNumber);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = Math.max(0.1, Math.min(5, containerWidth / unscaledViewport.width));
          const viewport = page.getViewport({ scale });

          const canvas = canvasRefs.current.get(pageNumber);
          if (!canvas) continue;
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          // Clear before rendering to avoid artifacts on resize
          context.clearRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: context, viewport }).promise;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to render page ${pageNumber}:`, error);
        }
      }
    }

    renderAllPages();
    return () => {
      cancelled = true;
    };
  }, [containerWidth, numPages]);

  const pageNumbers = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);

  return (
    <div className={s.viewerWrap}>
      <div className={s.toolbar}></div>
      <div ref={containerRef} className={s.canvasWrap}>
        {useEmbedFallback && url ? (
          <>
            <iframe className={s.frame} src={url} title="PDF document" />
            <p>
              If the PDF does not load, <a href={url} target="_blank" rel="noreferrer noopener">open it in a new tab</a>.
            </p>
          </>
        ) : numPages === 0 ? (
          <p>{isLoading ? "Loading PDF…" : loadErrored ? "Unable to display PDF." : ""}</p>
        ) : null}
        {pageNumbers.map((pageNumber) => (
          <canvas
            key={pageNumber}
            ref={(el) => {
              if (el) {
                canvasRefs.current.set(pageNumber, el);
              } else {
                canvasRefs.current.delete(pageNumber);
              }
            }}
            className={s.canvas}
            aria-label={`PDF page ${pageNumber}`}
          />
        ))}
      </div>
    </div>
  );
}
