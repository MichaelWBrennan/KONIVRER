import React, { type JSX, useEffect, useMemo, useRef, useState } from "react";
import * as s from "./pdfViewer.css.ts";
import { getBasePath } from "../utils/basePath";

type PdfViewerProps = {
  url?: string;
};


const ADOBE_SDK_URL = "https://acrobatservices.adobe.com/view-sdk/viewer.js";

function loadAdobeSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).AdobeDC) return Promise.resolve();
  if ((window as any).__ADOBE_EMBED_SDK_PROMISE__) return (window as any).__ADOBE_EMBED_SDK_PROMISE__;

  (window as any).__ADOBE_EMBED_SDK_PROMISE__ = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("adobe-dc-view-sdk");
    if (existing) {
      if ((window as any).AdobeDC) resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Adobe SDK")));
      return;
    }
    const script = document.createElement("script");
    script.id = "adobe-dc-view-sdk";
    script.src = ADOBE_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Adobe SDK"));
    document.head.appendChild(script);
  });

  return (window as any).__ADOBE_EMBED_SDK_PROMISE__;
}

function deriveFileNameFromUrl(url: string): string {
  try {
    const withoutQuery = url.split("?")[0];
    const last = withoutQuery.split("/").pop();
    return last && last.trim().length > 0 ? last : "document.pdf";
  } catch {
    return "document.pdf";
  }
}

export function PdfViewer({ url = "/sample.pdf" }: PdfViewerProps): JSX.Element {
  const containerIdRef = useRef<string>(`adobe-dc-view-${Math.random().toString(36).slice(2)}`);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fallback, setFallback] = useState<boolean>(false);
  const clientId = useMemo<string | undefined>(() => {
    // Prefer Vite env; allow overriding via global for runtime configs if needed
    const fromEnv = (import.meta as any)?.env?.VITE_ADOBE_DC_CLIENT_ID as string | undefined;
    const fromGlobal = (window as any)?.__ADOBE_CLIENT_ID as string | undefined;
    return fromEnv ?? fromGlobal;
  }, []);

  const resolveUrl = (input: string): string => {
    try {
      if (!input) return input;
      const absolutePattern = /^https?:\/\//i;
      if (absolutePattern.test(input)) return input;
      // Root-relative path: respect as-is (already includes base)
      if (input.startsWith("/")) {
        return new URL(input, window.location.origin).href;
      }
      const base = getBasePath();
      const normalizedBase = base.endsWith("/") ? base : base + "/";
      const trimmed = input.replace(/^\/+/, "");
      return new URL(normalizedBase + trimmed, window.location.origin).href;
    } catch {
      return input;
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function init() {
      setIsLoading(true);
      setFallback(false);

      if (!url) {
        setIsLoading(false);
        setFallback(true);
        return;
      }

      if (!clientId) {
        setIsLoading(false);
        setFallback(true);
        return;
      }

      try {
        await loadAdobeSdk();
        if (isCancelled) return;

        if (!(window as any).AdobeDC) {
          setFallback(true);
          setIsLoading(false);
          return;
        }

        const container = document.getElementById(containerIdRef.current);
        if (container) container.innerHTML = "";

        const adobeDCView = new (window as any).AdobeDC.View({
          clientId,
          divId: containerIdRef.current,
        });

        const effectiveUrl = resolveUrl(url);
        const fileName = deriveFileNameFromUrl(effectiveUrl);
        await adobeDCView.previewFile(
          {
            content: { location: { url: effectiveUrl } },
            metaData: { fileName },
          },
          {
            embedMode: "SIZED_CONTAINER",
            defaultViewMode: "FIT_WIDTH",
            showAnnotationTools: false,
            showLeftHandPanel: true,
            enableDownload: true,
          },
        );

        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Adobe viewer failed; falling back to iframe:", err);
        if (!isCancelled) {
          setFallback(true);
          setIsLoading(false);
        }
      }
    }
    init();

    return () => {
      isCancelled = true;
    };
  }, [url, clientId]);

  return (
    <div className={s.viewerWrap}>
      <div className={s.toolbar}></div>
      {fallback ? (
        <div>
          <iframe className={s.frame} src={resolveUrl(url)} title="PDF document" />
          <p>
            If the PDF does not load, <a href={resolveUrl(url)} target="_blank" rel="noreferrer noopener">open it in a new tab</a>.
          </p>
        </div>
      ) : (
        <div id={containerIdRef.current} className={s.embedContainer} aria-label="Adobe PDF viewer" />
      )}
      {isLoading && !fallback ? <p>Loading PDF…</p> : null}
    </div>
  );
}
