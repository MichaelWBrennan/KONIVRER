# KONIVRER Azoth TCG

Minimal, fast, and focused. Everything you need to run and build the game and related tooling—nothing more.

## Quick Start

```bash
git clone https://github.com/MichaelWBrennan/KONIVRER-deck-database.git
cd KONIVRER-deck-database

# Open in Godot 4
# File → Import Project → select project.godot, then press F5
```

## Build (Web/HTML5)

```bash
# In Godot Editor
Project → Export → Add HTML5 preset → Export to build/
```

## Scripts (frontend tooling)

```bash
npm install
npm run dev       # local dev (Vite)
npm run build     # type-check + build
npm run start     # preview
```

## Docs

- See `docs/` for detailed guides and system design.
- Game rules: `docs/README_GODOT.md` and `docs/README_ENTERPRISE.md` (moved for clarity).

## License

MIT — see `LICENSE`.
