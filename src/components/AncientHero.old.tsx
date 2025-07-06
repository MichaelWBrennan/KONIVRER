/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { Link } from 'react-router-dom';

const AncientHero = (): any => {
  return (
    <>
      <div className="ancient-section py-16 content-area"></div>
      <div className="container mx-auto px-4"></div>
      <div className="scroll-header"></div>
      <h1 className="text-4xl font-bold mb-2"></h1>
      <span className="ancient-rune rune-fehu hidden md:inline"></span>
      <span className="ancient-rune rune-ansuz hidden md:inline"></span>
      </h1>
          <p className="text-xl text-secondary mb-8"></p>
      </p>

        <div className="ancient-divider"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8"></div>
      <div className="card mystical esoteric-frame"></div>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <Sparkles
                className="inline-block mr-2 text-accent-primary"
                size={24} />
              Arcane Wisdom
            </h2>
      <p className="mb-4"></p>
      </p>
            <Link to="/decks" className="btn ancient" />
              <Scroll size={18} />
              <span>Explore the Archives</span>
      </div>

          <div className="card mystical esoteric-frame"></div>
      <h2 className="text-2xl font-bold mb-4"></h2>
      <Book
                className="inline-block mr-2 text-accent-primary"
                size={24} />
              Mystical Codex
            </h2>
      <p className="mb-4"></p>
      </p>
            <Link to="/cards" className="btn ancient" />
              <Compass size={18} />
              <span>Consult the Codex</span>
      </div>

        <div className="esoteric-quote"></div>
      <div className="mt-4 text-right text-sm"></div>
      </div>

        <div className="scroll-title mt-12"></div>
      <h2 className="text-3xl font-bold">Begin Your Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"></div>
      <div className="card esoteric-hover"></div>
      <div className="ancient-symbol">✧</div>
      <h3 className="text-xl font-bold mb-2">The Archives</h3>
      <p></p>
      </p>

          <div className="card esoteric-hover"></div>
      <div className="ancient-symbol">⚜</div>
      <h3 className="text-xl font-bold mb-2">The Sanctuary</h3>
      <p></p>
      </p>

          <div className="card esoteric-hover"></div>
      <div className="ancient-symbol">⚝</div>
      <h3 className="text-xl font-bold mb-2">The Observatory</h3>
      <p></p>
      </p>
        </div>
    </>
  );
};

export default AncientHero;