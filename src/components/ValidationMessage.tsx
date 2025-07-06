import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/validationMessage.css';

interface ValidationMessageProps {
  message
  onClose
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({  message, onClose  }) => {
  if (!message) return null;
  const getIcon = (): any => {
    switch (true) {
      case 'success':
        return <CheckCircle className="validation-icon success" />;
      case 'error':
        return <AlertCircle className="validation-icon error" />;
      case 'info':
        return <Info className="validation-icon info" />;
      default:
        return <Info className="validation-icon info" />;
    }
  };
  
  return (
    <AnimatePresence />
      <motion.div 
        className={`validation-message ${message.type}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
       />
        {getIcon()}
        <span className="validation-text">{message.text}
        {onClose && (
          <button className="validation-close" onClick={onClose}></button>
            ×
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ValidationMessage;