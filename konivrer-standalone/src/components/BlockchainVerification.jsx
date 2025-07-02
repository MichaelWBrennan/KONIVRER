import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { generateId, formatTimestamp } from '../utils';

/**
 * Blockchain verification component for secure tournament results and card ownership
 * This component simulates blockchain integration for verifying match results and card ownership
 * In a production environment, this would connect to an actual blockchain network
 */
const BlockchainVerification = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedVerificationType, setSelectedVerificationType] =
    useState('match');
  const { isAncientTheme } = useTheme();

  // Simulated blockchain data
  const blockchainData = useMemo(
    () => ({
      matches: [
        {
          id: 'match_01',
          timestamp: '2025-06-20T14:30:00Z',
          player1: { id: 'player_123', name: 'Alex Chen', rating: 1842 },
          player2: { id: 'player_456', name: 'Jordan Smith', rating: 1756 },
          result: { winner: 'player_123', score: '2-1' },
          transactionHash:
            '0x7f9e4e5d3b2a1c8f7e6d5c4b3a2e1d0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a',
        },
        {
          id: 'match_02',
          timestamp: '2025-06-21T10:15:00Z',
          player1: { id: 'player_789', name: 'Taylor Johnson', rating: 1920 },
          player2: { id: 'player_123', name: 'Alex Chen', rating: 1842 },
          result: { winner: 'player_789', score: '2-0' },
          transactionHash:
            '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        },
      ],
      cards: [
        {
          id: 'KON001',
          name: 'Ancient Guardian',
          owner: { id: 'player_123', name: 'Alex Chen' },
          mintDate: '2025-01-15T09:00:00Z',
          rarity: 'Mythic',
          transactionHash:
            '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        },
        {
          id: 'KON004',
          name: 'Ethereal Dragon',
          owner: { id: 'player_456', name: 'Jordan Smith' },
          mintDate: '2025-02-20T11:30:00Z',
          rarity: 'Mythic',
          transactionHash:
            '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
        },
      ],
      tournaments: [
        {
          id: 'tournament_01',
          name: 'Summer Championship 2025',
          date: '2025-06-15T09:00:00Z',
          participants: 32,
          winner: { id: 'player_789', name: 'Taylor Johnson' },
          transactionHash:
            '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        },
      ],
    }),
    [],
  );

  /**
   * Verify a transaction on the blockchain
   * @param {string} hash - The transaction hash to verify
   */
  const verifyTransaction = useCallback(
    hash => {
      if (!hash) return;

      setIsVerifying(true);

      // Simulate blockchain verification process
      setTimeout(() => {
        let found = false;
        let data = null;

        // Check matches
        if (selectedVerificationType === 'match') {
          data = blockchainData.matches.find(
            match => match.transactionHash === hash,
          );
        }
        // Check cards
        else if (selectedVerificationType === 'card') {
          data = blockchainData.cards.find(
            card => card.transactionHash === hash,
          );
        }
        // Check tournaments
        else if (selectedVerificationType === 'tournament') {
          data = blockchainData.tournaments.find(
            tournament => tournament.transactionHash === hash,
          );
        }

        found = !!data;

        setVerificationStatus({
          verified: found,
          timestamp: new Date().toISOString(),
          data: data,
        });

        setIsVerifying(false);
      }, 2000); // Simulate network delay
    },
    [blockchainData, selectedVerificationType],
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      verifyTransaction(transactionHash);
    },
    [transactionHash, verifyTransaction],
  );

  /**
   * Generate a new transaction for recording a match result
   */
  const recordNewTransaction = useCallback(() => {
    // Generate a simulated blockchain transaction hash
    const newHash =
      '0x' +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');

    // Create timestamp for the transaction
    const timestamp = new Date().toISOString();

    // Generate a unique ID for the new record
    const newId = generateId();

    // Create a new record based on the selected verification type
    let newRecord;

    if (selectedVerificationType === 'match') {
      newRecord = {
        id: `match_${newId}`,
        timestamp,
        player1: { id: 'player_123', name: 'Alex Chen', rating: 1842 },
        player2: { id: 'player_456', name: 'Jordan Smith', rating: 1756 },
        result: { winner: 'player_123', score: '2-0' },
        transactionHash: newHash,
      };
    } else if (selectedVerificationType === 'card') {
      newRecord = {
        id: `KON${Math.floor(Math.random() * 900) + 100}`,
        name: 'Newly Minted Card',
        owner: { id: 'player_123', name: 'Alex Chen' },
        mintDate: timestamp,
        rarity: 'Rare',
        transactionHash: newHash,
      };
    } else if (selectedVerificationType === 'tournament') {
      newRecord = {
        id: `tournament_${newId}`,
        name: 'New Local Tournament',
        date: timestamp,
        participants: 16,
        winner: { id: 'player_123', name: 'Alex Chen' },
        transactionHash: newHash,
      };
    }

    // Set the transaction hash for verification
    setTransactionHash(newHash);

    // Simulate adding to blockchain and verify
    setTimeout(() => {
      setVerificationStatus({
        verified: true,
        timestamp: new Date().toISOString(),
        data: newRecord,
      });
    }, 1500);

    alert(
      `New ${selectedVerificationType} recorded on blockchain with transaction hash: ${newHash}`,
    );
  }, [selectedVerificationType]);

  return (
    <div
      className={`blockchain-verification ${isAncientTheme ? 'ancient-theme' : ''}`}
    >
      <h2>Blockchain Verification</h2>

      <div className="verification-type-selector">
        <label>
          <input
            type="radio"
            value="match"
            checked={selectedVerificationType === 'match'}
            onChange={() => setSelectedVerificationType('match')}
          />
          Match Results
        </label>

        <label>
          <input
            type="radio"
            value="card"
            checked={selectedVerificationType === 'card'}
            onChange={() => setSelectedVerificationType('card')}
          />
          Card Ownership
        </label>

        <label>
          <input
            type="radio"
            value="tournament"
            checked={selectedVerificationType === 'tournament'}
            onChange={() => setSelectedVerificationType('tournament')}
          />
          Tournament Results
        </label>
      </div>

      <form onSubmit={handleSubmit} className="verification-form">
        <div className="input-group">
          <label htmlFor="transactionHash">Transaction Hash:</label>
          <input
            id="transactionHash"
            type="text"
            value={transactionHash}
            onChange={e => setTransactionHash(e.target.value)}
            placeholder="Enter blockchain transaction hash"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Transaction'}
          </button>

          <button
            type="button"
            onClick={recordNewTransaction}
            className="record-button"
          >
            Record New{' '}
            {selectedVerificationType.charAt(0).toUpperCase() +
              selectedVerificationType.slice(1)}
          </button>
        </div>
      </form>

      {verificationStatus && (
        <div
          className={`verification-result ${verificationStatus.verified ? 'verified' : 'failed'}`}
        >
          <h3>Verification Result</h3>
          <p>
            <strong>Status:</strong>{' '}
            {verificationStatus.verified ? 'Verified ✓' : 'Not Verified ✗'}
          </p>
          <p>
            <strong>Timestamp:</strong>{' '}
            {formatTimestamp(verificationStatus.timestamp)}
          </p>

          {verificationStatus.verified && verificationStatus.data && (
            <div className="verification-data">
              {selectedVerificationType === 'match' && (
                <>
                  <h4>Match Details</h4>
                  <p>
                    <strong>Match ID:</strong> {verificationStatus.data.id}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {formatTimestamp(verificationStatus.data.timestamp)}
                  </p>
                  <p>
                    <strong>Players:</strong>{' '}
                    {verificationStatus.data.player1.name} vs{' '}
                    {verificationStatus.data.player2.name}
                  </p>
                  <p>
                    <strong>Result:</strong>{' '}
                    {verificationStatus.data.result.score}
                  </p>
                  <p>
                    <strong>Winner:</strong>{' '}
                    {verificationStatus.data.player1.id ===
                    verificationStatus.data.result.winner
                      ? verificationStatus.data.player1.name
                      : verificationStatus.data.player2.name}
                  </p>
                </>
              )}

              {selectedVerificationType === 'card' && (
                <>
                  <h4>Card Details</h4>
                  <p>
                    <strong>Card ID:</strong> {verificationStatus.data.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {verificationStatus.data.name}
                  </p>
                  <p>
                    <strong>Rarity:</strong> {verificationStatus.data.rarity}
                  </p>
                  <p>
                    <strong>Owner:</strong> {verificationStatus.data.owner.name}
                  </p>
                  <p>
                    <strong>Mint Date:</strong>{' '}
                    {formatTimestamp(verificationStatus.data.mintDate)}
                  </p>
                </>
              )}

              {selectedVerificationType === 'tournament' && (
                <>
                  <h4>Tournament Details</h4>
                  <p>
                    <strong>Tournament ID:</strong> {verificationStatus.data.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {verificationStatus.data.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {formatTimestamp(verificationStatus.data.date)}
                  </p>
                  <p>
                    <strong>Participants:</strong>{' '}
                    {verificationStatus.data.participants}
                  </p>
                  <p>
                    <strong>Winner:</strong>{' '}
                    {verificationStatus.data.winner.name}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .blockchain-verification {
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }

        .verification-type-selector {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .verification-type-selector label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .verification-form {
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid ${isAncientTheme ? '#8a7e55' : '#cccccc'};
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#1a1914' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        button:hover:not(:disabled) {
          background-color: ${isAncientTheme ? '#a89a6a' : '#535bf2'};
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .record-button {
          background-color: ${isAncientTheme ? '#5d7a4e' : '#4caf50'};
        }

        .record-button:hover {
          background-color: ${isAncientTheme ? '#6e8c5f' : '#3e8e41'};
        }

        .verification-result {
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .verification-result.verified {
          background-color: ${isAncientTheme ? '#3a4a35' : '#e8f5e9'};
          border: 1px solid ${isAncientTheme ? '#5d7a4e' : '#a5d6a7'};
        }

        .verification-result.failed {
          background-color: ${isAncientTheme ? '#4a3535' : '#ffebee'};
          border: 1px solid ${isAncientTheme ? '#7a4e4e' : '#ef9a9a'};
        }

        .verification-data {
          margin-top: 15px;
          padding: 10px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          border-radius: 4px;
        }

        .ancient-theme h2,
        .ancient-theme h3,
        .ancient-theme h4 {
          font-family: 'Cinzel', serif;
          color: #d4b86a;
        }
      `}</style>
    </div>
  );
};

export default React.memo(BlockchainVerification);
