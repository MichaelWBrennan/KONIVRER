import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { safeStringify, formatTimestamp } from '../utils';
import { DEFAULT_QR_SIZE, QR_CODE_TYPES, ERROR_MESSAGES } from '../utils/constants';

/**
 * Standard QR Code Generator Component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.matchId] - ID of the match to generate QR code for
 * @param {string} [props.tournamentId] - ID of the tournament to generate QR code for
 * @param {number} [props.size=200] - Size of the QR code in pixels
 * @param {boolean} [props.includeData=false] - Whether to include raw data display
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} QR code component
 */
const QRCodeGenerator = ({ 
  matchId, 
  tournamentId, 
  size = DEFAULT_QR_SIZE, 
  includeData = false, 
  className = '' 
}) => {
  const { generateMatchQRData, generateTournamentQRData } = usePhysicalMatchmaking();
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [timestamp, setTimestamp] = useState('');

  // Generate QR data when props change
  useEffect(() => {
    try {
      let data = null;
      
      if (matchId) {
        data = generateMatchQRData(matchId);
        setTitle('Match QR Code');
      } else if (tournamentId) {
        data = generateTournamentQRData(tournamentId);
        setTitle('Tournament QR Code');
      } else {
        throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELD);
      }
      
      if (!data) {
        throw new Error(
          matchId 
            ? ERROR_MESSAGES.MATCH_NOT_FOUND 
            : ERROR_MESSAGES.TOURNAMENT_NOT_FOUND
        );
      }
      
      setQrData(data);
      setTimestamp(formatTimestamp(data.timestamp));
      setError(null);
    } catch (err) {
      console.error('QR Code generation error:', err);
      setError(err.message);
      setQrData(null);
      setTimestamp('');
    }
  }, [matchId, tournamentId, generateMatchQRData, generateTournamentQRData]);

  // Memoize the QR value to prevent unnecessary re-renders
  const qrValue = useMemo(() => {
    return qrData ? safeStringify(qrData) : '';
  }, [qrData]);

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Loading state
  if (!qrData) {
    return <div className="loading-container">Loading QR code...</div>;
  }

  return (
    <div className={`qr-code-container ${className}`}>
      <h3 className="qr-title">{title}</h3>
      <div className="qr-code">
        <QRCodeSVG 
          value={qrValue} 
          size={size}
          level="H" // High error correction
          includeMargin={true}
          renderAs="svg" // Ensure SVG rendering for better quality
          className="standard-qr-code"
        />
      </div>
      
      {includeData && (
        <div className="qr-data">
          <h4>QR Code Data:</h4>
          <pre>{safeStringify(qrData)}</pre>
        </div>
      )}
      
      <p className="qr-instructions">
        Scan this code to access {qrData.type} information
      </p>
      
      <div className="qr-timestamp">
        Generated: {timestamp}
      </div>
    </div>
  );
};

export default React.memo(QRCodeGenerator);