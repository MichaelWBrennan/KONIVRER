import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';

const QRCodeGenerator = ({ matchId, tournamentId, size = 200, includeData = false, className = '' }) => {
  const { generateMatchQRData, generateTournamentQRData } = usePhysicalMatchmaking();
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

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
        throw new Error('Either matchId or tournamentId must be provided');
      }
      
      if (!data) {
        throw new Error(`Could not find data for QR code generation`);
      }
      
      setQrData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setQrData(null);
    }
  }, [matchId, tournamentId, generateMatchQRData, generateTournamentQRData]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!qrData) {
    return <div className="loading">Loading QR code...</div>;
  }

  // Convert data to JSON string for QR code
  const qrValue = JSON.stringify(qrData);

  return (
    <div className={`qr-code-container ${className}`}>
      <h3 className="qr-title">{title}</h3>
      <div className="qr-code">
        <QRCodeSVG 
          value={qrValue} 
          size={size}
          level="H" // High error correction
          includeMargin={true}
          className="ancient-qr-code"
        />
      </div>
      
      {includeData && (
        <div className="qr-data">
          <h4>QR Code Data:</h4>
          <pre>{JSON.stringify(qrData, null, 2)}</pre>
        </div>
      )}
      
      <p className="qr-instructions">
        Scan this code to access {qrData.type} information
      </p>
    </div>
  );
};

export default QRCodeGenerator;