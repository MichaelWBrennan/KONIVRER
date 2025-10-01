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
        <iframe
          src={url}
          title="Embedded PDF"
          className={s.frame}
          loading="lazy"
        />
      </div>
    </div>
  );
}
