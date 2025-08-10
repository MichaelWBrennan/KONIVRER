import React from 'react';

export const Rules: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>KONIVRER Game Rules</h1>
        <p>Master the art of strategic card play in the KONIVRER universe</p>
      </div>
      
      <main>
        <section style={{ marginBottom: '3rem' }}>
          <h2>Getting Started</h2>
          <p>
            Welcome to KONIVRER, a strategic trading card game where players command powerful 
            cards representing legendary creatures, spells, and artifacts. Build your deck, 
            master the elements, and emerge victorious in epic battles.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Basic Rules</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Deck Construction</h3>
              <ul>
                <li>Minimum 60 cards per deck</li>
                <li>Maximum 4 copies of any single card</li>
                <li>Must include at least one element type</li>
              </ul>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Game Setup</h3>
              <ul>
                <li>Each player starts with 20 life points</li>
                <li>Draw 7 cards to start</li>
                <li>Shuffle your deck and place it face down</li>
              </ul>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Turn Structure</h3>
              <ol>
                <li><strong>Draw Phase:</strong> Draw one card from your deck</li>
                <li><strong>Main Phase:</strong> Play cards, activate abilities</li>
                <li><strong>Combat Phase:</strong> Attack with creatures</li>
                <li><strong>End Phase:</strong> End your turn</li>
              </ol>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Card Types</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Creatures</h3>
              <p>Summon powerful beings to fight for you. They have Power (attack) and Toughness (defense) values.</p>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Instants</h3>
              <p>Quick spells that can be played at any time, even during your opponent's turn.</p>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Sorceries</h3>
              <p>Powerful spells that can only be played during your main phase.</p>
            </div>
            
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h3>Artifacts</h3>
              <p>Ancient tools and weapons that provide ongoing benefits.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Elements</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>🔥 Fire</h4>
              <p>Aggressive, fast damage</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>💧 Water</h4>
              <p>Control, card draw</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>🌿 Earth</h4>
              <p>Large creatures, ramp</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>💨 Air</h4>
              <p>Flying creatures, tempo</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>⚫ Dark</h4>
              <p>Destruction, sacrifice</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <h4>⚪ Light</h4>
              <p>Healing, protection</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Winning the Game</h2>
          <p>
            Reduce your opponent's life to 0 or below to claim victory! Use strategic combinations 
            of cards, master the timing of your spells, and control the battlefield to emerge triumphant.
          </p>
        </section>

        <section>
          <div style={{ 
            padding: '2rem', 
            background: 'var(--accent-color)', 
            color: 'white', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3>Ready to Play?</h3>
            <p>Start by building your first deck or try out the simulator to practice your strategies!</p>
          </div>
        </section>
      </main>
    </div>
  );
};