/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import MobilePDFViewer from '../components/MobilePDFViewer';
import ErrorBoundary from '../components/ErrorBoundary';

const MobileRules = () => {
  return (
    <ErrorBoundary>
      <MobilePDFViewer />
    </ErrorBoundary>
  );
};

export default MobileRules;
