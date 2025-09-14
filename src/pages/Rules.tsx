import React from "react";
import { PdfViewer } from "./PdfViewer";

export const Rules: React.FC = () => {
  // Render PDF viewer with canonical rules PDF path
  return <PdfViewer url="/assets/konivrer-rules.pdf" />;
};
