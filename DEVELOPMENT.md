# Development

## Repository layout

- `src/core/engine.js` — dependency-free ES3-oriented parser, AST helpers, symbols and serialization.
- `src/ui/app.js` — ScriptUI authoring dialog and Illustrator DOM adapter.
- `scripts/build/build.py` — deterministic standalone packaging.
- `dist/EquationForge.jsx` — generated runnable artifact.
- `tests/core.test.js` — Node VM harness for core logic, not an Illustrator simulator.

## Workflow

Edit source files only, run `python3 scripts/build/build.py`, then `node tests/core.test.js`. Inspect the built output and the diff. Runtime code must remain ExtendScript-compatible (ES3-era JavaScript); do not introduce browser or Node APIs into runtime modules. No package manager dependencies are required.

## Safety and review

Use a disposable Illustrator document for manual integration checks. Test no-document handling, artboard placement, text font handling, locked layers, insertion failure cleanup, undo, and reopening saved files. Do not claim those checks passed unless actually performed in Illustrator. Any new syntax requires valid, malformed, round-trip, and stress tests. Any advertised UI action must have a working behavior or be removed/documented.

## Current state

This is an early functional pre-release, not the comprehensive product described by the full requirements. Release is blocked pending feature work and a real Illustrator test environment. See `REQUIREMENTS.md` and `TESTING.md`.
