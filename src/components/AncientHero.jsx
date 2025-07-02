/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Scroll, Book, Compass } from 'lucide-react';

const AncientHero = () => {
  return (
    <div className="ancient-section py-16 content-area">
      <div className="container mx-auto px-4">
        <div className="scroll-header">
          <h1 className="text-4xl font-bold mb-2">
            <span className="ancient-rune rune-fehu hidden md:inline"></span>
            The Ancient Archives of KONIVRER
            <span className="ancient-rune rune-ansuz hidden md:inline"></span>
          </h1>
          <p className="text-xl text-secondary mb-8">
            Discover the mystical knowledge of forgotten realms
          </p>
        </div>

        <div className="ancient-divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="card mystical esoteric-frame">
            <h2 className="text-2xl font-bold mb-4">
              <Sparkles
                className="inline-block mr-2 text-accent-primary"
                size={24}
              />
              Arcane Wisdom
            </h2>
            <p className="mb-4">
              Delve into the ancient scrolls of knowledge, where the secrets of
              the KONIVRER deck await those who seek to master its esoteric
              powers.
            </p>
            <Link to="/decks" className="btn ancient">
              <Scroll size={18} />
              <span>Explore the Archives</span>
            </Link>
          </div>

          <div className="card mystical esoteric-frame">
            <h2 className="text-2xl font-bold mb-4">
              <Book
                className="inline-block mr-2 text-accent-primary"
                size={24}
              />
              Mystical Codex
            </h2>
            <p className="mb-4">
              The ancient tomes contain the wisdom of countless generations.
              Study their teachings to unlock the true potential of your
              mystical abilities.
            </p>
            <Link to="/cards" className="btn ancient">
              <Compass size={18} />
              <span>Consult the Codex</span>
            </Link>
          </div>
        </div>

        <div className="esoteric-quote">
          "In the ancient patterns of cards and symbols, we find reflections of
          the universe itself. The wise see not just the game, but the cosmic
          dance that it represents."
          <div className="mt-4 text-right text-sm">
            — The Esoteric Manuscripts
          </div>
        </div>

        <div className="scroll-title mt-12">
          <h2 className="text-3xl font-bold">Begin Your Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card esoteric-hover">
            <div className="ancient-symbol">✧</div>
            <h3 className="text-xl font-bold mb-2">The Archives</h3>
            <p>
              Explore the vast collection of ancient decks, each with its own
              story and power.
            </p>
          </div>

          <div className="card esoteric-hover">
            <div className="ancient-symbol">⚜</div>
            <h3 className="text-xl font-bold mb-2">The Sanctuary</h3>
            <p>
              Practice your arcane arts in a sacred space designed for mystical
              duels.
            </p>
          </div>

          <div className="card esoteric-hover">
            <div className="ancient-symbol">⚝</div>
            <h3 className="text-xl font-bold mb-2">The Observatory</h3>
            <p>
              Witness the celestial patterns that guide the evolution of the
              meta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AncientHero;
