/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import PDFViewer from '../components/PDFViewer';
import ErrorBoundary from '../components/ErrorBoundary';

const Rules = () => {
  return (
    <ErrorBoundary>
      <PDFViewer />
    </ErrorBoundary>
  );
};

export default Rules;
