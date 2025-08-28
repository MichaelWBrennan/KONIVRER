import React from 'react';
import { PdfViewer } from './PdfViewer';

export const Rules: React.FC = () => {
  // Render PDF viewer with default rules PDF path
  return <PdfViewer url="/rules.pdf" />;
};