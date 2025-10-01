import React, { type JSX } from "react";
import * as s from "./pdfViewer.css.ts";

export function PdfViewer({
  url = "/sample.pdf",
}: {
  url?: string;
}): JSX.Element {
  return (
    <div className={s.viewerWrap}>
      <div className={s.toolbar}></div>
      <div className={s.canvasWrap}>
        <object
          data={url}
          type="application/pdf"
          className={s.frame}
          aria-label="PDF document"
        >
          <embed src={url} type="application/pdf" className={s.frame} />
          <p>
            Unable to display PDF.
          </p>
        </object>
      </div>
    </div>
  );
}
