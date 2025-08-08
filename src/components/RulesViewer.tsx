import React from 'react';
import TabbedPDFViewer from './TabbedPDFViewer';

interface RulesViewerProps {
  onBack?: () => void;
}

const RulesViewer: React.FC<RulesViewerProps> = ({ onBack }) => {
  return <TabbedPDFViewer onBack={onBack} />;
};

export default RulesViewer;
