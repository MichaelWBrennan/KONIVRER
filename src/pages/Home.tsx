import React from "react";
import * as h from "./home.css.ts";

export const Home: React.FC = () => {
  return (
    <div className={h.container}>
      <div className={h.homeRoot}>
        <header className={h.header}>
          <div className={h.hero}>
            <div>
              <h1 className={h.title}>KONIVRER Chronicles</h1>
              <p className={h.subtitle}>
                Latest card tech, meta analysis, and tournament updates
              </p>
            </div>
          </div>
          <div className={h.divider}></div>
        </header>

        <main className={h.content}>
          {/* Blog content has been cleared */}
        </main>
      </div>
    </div>
  );
};
