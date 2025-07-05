/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Scroll, Book, Compass } from 'lucide-react';

const AncientHero = (): any => {
  return (
    <div className="ancient-section py-16 content-area"></div>
      <div className="container mx-auto px-4"></div>
        <div className="scroll-header"></div>
          <h1 className="text-4xl font-bold mb-2"></h1>
            <span className="ancient-rune rune-fehu hidden md:inline"></span>
            The Ancient Archives of KONIVRER
            <span className="ancient-rune rune-ansuz hidden md:inline"></span>
          </h1>
          <p className="text-xl text-secondary mb-8"></p>
            Discover the mystical knowledge of forgotten realms
          </p>
        </div>

        <div className="ancient-divider"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8"></div>
          <div className="card mystical esoteric-frame"></div>
            <h2 className="text-2xl font-bold mb-4"></h2>
              <Sparkles
                className="inline-block mr-2 text-accent-primary"
                size={24}
              /></Sparkles>
              Arcane Wisdom
            </h2>
            <p className="mb-4"></p>
              Delve into the ancient scrolls of knowledge, where the secrets of
              the KONIVRER deck await those who seek to master its esoteric
              powers.
            </p>
            <Link to="/decks" className="btn ancient"></Link>
              <Scroll size={18} /></Scroll>
              <span>Explore the Archives</span>
            </Link>
          </div>

          <div className="card mystical esoteric-frame"></div>
            <h2 className="text-2xl font-bold mb-4"></h2>
              <Book
                className="inline-block mr-2 text-accent-primary"
                size={24}
              /></Book>
              Mystical Codex
            </h2>
            <p className="mb-4"></p>
              The ancient tomes contain the wisdom of countless generations.
              Study their teachings to unlock the true potential of your
              mystical abilities.
            </p>
            <Link to="/cards" className="btn ancient"></Link>
              <Compass size={18} /></Compass>
              <span>Consult the Codex</span>
            </Link>
          </div>
        </div>

        <div className="esoteric-quote"></div>
          "In the ancient patterns of cards and symbols, we find reflections of
          the universe itself. The wise see not just the game, but the cosmic
          dance that it represents."
          <div className="mt-4 text-right text-sm"></div>
            — The Esoteric Manuscripts
          </div>
        </div>

        <div className="scroll-title mt-12"></div>
          <h2 className="text-3xl font-bold">Begin Your Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"></div>
          <div className="card esoteric-hover"></div>
            <div className="ancient-symbol">✧</div>
            <h3 className="text-xl font-bold mb-2">The Archives</h3>
            <p></p>
              Explore the vast collection of ancient decks, each with its own
              story and power.
            </p>
          </div>

          <div className="card esoteric-hover"></div>
            <div className="ancient-symbol">⚜</div>
            <h3 className="text-xl font-bold mb-2">The Sanctuary</h3>
            <p></p>
              Practice your arcane arts in a sacred space designed for mystical
              duels.
            </p>
          </div>

          <div className="card esoteric-hover"></div>
            <div className="ancient-symbol">⚝</div>
            <h3 className="text-xl font-bold mb-2">The Observatory</h3>
            <p></p>
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