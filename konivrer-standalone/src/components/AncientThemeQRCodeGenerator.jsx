import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePhysicalMatchmaking } from '../contexts/PhysicalMatchmakingContext';
import { safeStringify, formatTimestamp } from '../utils';
import {
  DEFAULT_QR_SIZE,
  QR_CODE_TYPES,
  ERROR_MESSAGES,
} from '../utils/constants';

/**
 * Ancient theme styling - moved outside component to prevent recreation on each render
 * Using CSS variables from index.css for consistent theming
 */
const ancientStyles = {
  container: {
    background: `linear-gradient(to bottom, var(--ancient-bg-primary), var(--ancient-bg-secondary))`,
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow:
      '0 4px 8px rgba(0, 0, 0, 0.5), inset 0 0 6px var(--ancient-accent)',
    border: `2px solid var(--ancient-border)`,
    maxWidth: '350px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    color: 'var(--ancient-text)',
    fontFamily: 'var(--font-family-ancient)',
    textAlign: 'center',
    marginBottom: 'var(--spacing-md)',
    textShadow: '1px 1px 2px #000',
    letterSpacing: '1px',
  },
  qrContainer: {
    background: '#f5e7d3',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--border-radius-sm)',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: '1',
    display: 'flex',
    justifyContent: 'center',
  },
  instructions: {
    color: 'var(--ancient-text)',
    fontFamily: 'var(--font-family-ancient)',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: 'var(--spacing-md)',
    fontStyle: 'italic',
  },
  dataContainer: {
    marginTop: 'var(--spacing-md)',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: 'var(--spacing-sm)',
    borderRadius: 'var(--border-radius-sm)',
    maxHeight: '150px',
    overflowY: 'auto',
    color: 'var(--ancient-text)',
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  corner: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderColor: 'var(--ancient-border)',
    borderStyle: 'solid',
  },
  topLeft: {
    top: '5px',
    left: '5px',
    borderWidth: '3px 0 0 3px',
  },
  topRight: {
    top: '5px',
    right: '5px',
    borderWidth: '3px 3px 0 0',
  },
  bottomLeft: {
    bottom: '5px',
    left: '5px',
    borderWidth: '0 0 3px 3px',
  },
  bottomRight: {
    bottom: '5px',
    right: '5px',
    borderWidth: '0 3px 3px 0',
  },
  errorMessage: {
    color: 'var(--ancient-text)',
    textAlign: 'center',
    padding: 'var(--spacing-md)',
    background: 'rgba(139, 0, 0, 0.2)',
    borderRadius: 'var(--border-radius-sm)',
    border: '1px solid var(--ancient-border)',
  },
  loadingMessage: {
    color: 'var(--ancient-text)',
    textAlign: 'center',
    padding: 'var(--spacing-md)',
    fontStyle: 'italic',
  },
  timestamp: {
    color: 'var(--ancient-text)',
    fontFamily: 'var(--font-family-ancient)',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: 'var(--spacing-sm)',
    opacity: 0.8,
  },
};

/**
 * Memoized corner elements to prevent unnecessary re-renders
 */
const CornerElements = React.memo(() => (
  <>
    <div style={{ ...ancientStyles.corner, ...ancientStyles.topLeft }}></div>
    <div style={{ ...ancientStyles.corner, ...ancientStyles.topRight }}></div>
    <div style={{ ...ancientStyles.corner, ...ancientStyles.bottomLeft }}></div>
    <div
      style={{ ...ancientStyles.corner, ...ancientStyles.bottomRight }}
    ></div>
  </>
));

/**
 * Ancient Theme QR Code Generator Component
 *
 * @param {Object} props - Component props
 * @param {string} [props.matchId] - ID of the match to generate QR code for
 * @param {string} [props.tournamentId] - ID of the tournament to generate QR code for
 * @param {number} [props.size=200] - Size of the QR code in pixels
 * @param {boolean} [props.includeData=false] - Whether to include raw data display
 * @param {string} [props.className=''] - Additional CSS class names
 * @returns {JSX.Element} Ancient themed QR code component
 */
const AncientThemeQRCodeGenerator = ({
  matchId,
  tournamentId,
  size = DEFAULT_QR_SIZE,
  includeData = false,
  className = '',
}) => {
  const { generateMatchQRData, generateTournamentQRData } =
    usePhysicalMatchmaking();
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [timestamp, setTimestamp] = useState('');

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
        throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELD);
      }

      if (!data) {
        throw new Error(
          matchId
            ? ERROR_MESSAGES.MATCH_NOT_FOUND
            : ERROR_MESSAGES.TOURNAMENT_NOT_FOUND,
        );
      }

      setQrData(data);
      setTimestamp(formatTimestamp(data.timestamp));
      setError(null);
    } catch (err) {
      console.error('Ancient QR Code generation error:', err);
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
      <div style={ancientStyles.container} className={className}>
        <CornerElements />
        <div style={ancientStyles.errorMessage}>{error}</div>
      </div>
    );
  }

  // Loading state
  if (!qrData) {
    return (
      <div style={ancientStyles.container} className={className}>
        <CornerElements />
        <div style={ancientStyles.loadingMessage}>
          Summoning arcane sigil...
        </div>
      </div>
    );
  }

  return (
    <div style={ancientStyles.container} className={className}>
      <CornerElements />

      <h3 style={ancientStyles.title}>{title}</h3>

      <div style={ancientStyles.qrContainer}>
        <QRCodeSVG
          value={qrValue}
          size={size}
          level="H" // High error correction
          includeMargin={true}
          renderAs="svg" // Ensure SVG rendering for better quality
          fgColor="var(--ancient-bg-primary)"
          bgColor="#f5e7d3"
        />
      </div>

      {includeData && (
        <div style={ancientStyles.dataContainer}>
          <pre>{safeStringify(qrData)}</pre>
        </div>
      )}

      <p style={ancientStyles.instructions}>
        Scan this arcane sigil to reveal {qrData.type} secrets
      </p>

      <div style={ancientStyles.timestamp}>Conjured on the {timestamp}</div>
    </div>
  );
};

export default React.memo(AncientThemeQRCodeGenerator);
