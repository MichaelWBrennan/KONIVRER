import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';

// Ancient theme styling
const ancientStyles = {
  container: {
    background: 'linear-gradient(to bottom, #2c1e0e, #3c2915)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5), inset 0 0 6px rgba(255, 215, 0, 0.3)',
    border: '2px solid #8b7355',
    maxWidth: '350px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden'
  },
  title: {
    color: '#e6cc9c',
    fontFamily: '"Cinzel", serif',
    textAlign: 'center',
    marginBottom: '15px',
    textShadow: '1px 1px 2px #000',
    letterSpacing: '1px'
  },
  qrContainer: {
    background: '#f5e7d3',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: '1',
    display: 'flex',
    justifyContent: 'center'
  },
  qrCode: {
    border: '4px solid #8b7355',
    padding: '8px',
    background: '#fff',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
  },
  instructions: {
    color: '#e6cc9c',
    fontFamily: '"Cinzel", serif',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '15px',
    fontStyle: 'italic'
  },
  dataContainer: {
    marginTop: '15px',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '10px',
    borderRadius: '5px',
    maxHeight: '150px',
    overflowY: 'auto',
    color: '#e6cc9c',
    fontFamily: 'monospace',
    fontSize: '12px'
  },
  corner: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderColor: '#8b7355',
    borderStyle: 'solid'
  },
  topLeft: {
    top: '5px',
    left: '5px',
    borderWidth: '3px 0 0 3px'
  },
  topRight: {
    top: '5px',
    right: '5px',
    borderWidth: '3px 3px 0 0'
  },
  bottomLeft: {
    bottom: '5px',
    left: '5px',
    borderWidth: '0 0 3px 3px'
  },
  bottomRight: {
    bottom: '5px',
    right: '5px',
    borderWidth: '0 3px 3px 0'
  }
};

const AncientThemeQRCodeGenerator = ({ matchId, tournamentId, size = 200, includeData = false, className = '' }) => {
  const { generateMatchQRData, generateTournamentQRData } = usePhysicalMatchmaking();
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    try {
      let data = null;
      
      if (matchId) {
        data = generateMatchQRData(matchId);
        setTitle('Ancient Match Seal');
      } else if (tournamentId) {
        data = generateTournamentQRData(tournamentId);
        setTitle('Tournament Arcane Sigil');
      } else {
        throw new Error('Either matchId or tournamentId must be provided');
      }
      
      if (!data) {
        throw new Error(`Could not find data for arcane sigil generation`);
      }
      
      setQrData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setQrData(null);
    }
  }, [matchId, tournamentId, generateMatchQRData, generateTournamentQRData]);

  if (error) {
    return <div style={{ color: '#e6cc9c', textAlign: 'center' }}>{error}</div>;
  }

  if (!qrData) {
    return <div style={{ color: '#e6cc9c', textAlign: 'center' }}>Summoning arcane sigil...</div>;
  }

  // Convert data to JSON string for QR code
  const qrValue = JSON.stringify(qrData);

  return (
    <div style={ancientStyles.container} className={className}>
      <div style={{...ancientStyles.corner, ...ancientStyles.topLeft}}></div>
      <div style={{...ancientStyles.corner, ...ancientStyles.topRight}}></div>
      <div style={{...ancientStyles.corner, ...ancientStyles.bottomLeft}}></div>
      <div style={{...ancientStyles.corner, ...ancientStyles.bottomRight}}></div>
      
      <h3 style={ancientStyles.title}>{title}</h3>
      
      <div style={ancientStyles.qrContainer}>
        <QRCodeSVG 
          value={qrValue} 
          size={size}
          level="H" // High error correction
          includeMargin={true}
          style={ancientStyles.qrCode}
          fgColor="#2c1e0e"
          bgColor="#f5e7d3"
        />
      </div>
      
      {includeData && (
        <div style={ancientStyles.dataContainer}>
          <pre>{JSON.stringify(qrData, null, 2)}</pre>
        </div>
      )}
      
      <p style={ancientStyles.instructions}>
        Scan this arcane sigil to reveal {qrData.type} secrets
      </p>
    </div>
  );
};

export default AncientThemeQRCodeGenerator;