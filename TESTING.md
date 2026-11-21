# Testing and verification report

## Automated tests performed

Command: `node tests/core.test.js`

The current suite exercises 16 accepted expressions (including scripts, grouped fractions, roots, sums/products/integrals, a limit, chemistry-like text, Unicode/commands and fences), rejects malformed/unsupported examples, checks serialization round trips, symbol search, tokenization, and nesting safety. Latest observed result: **passed**. This tests only the pure core under Node's VM; Node is not an ExtendScript engine.

Build command: `python3 scripts/build/build.py` — latest observed result: successful deterministic concatenation to `dist/EquationForge.jsx`. The artifact is approximately 24 KB at current source state. ES3 compatibility was inspected by source review; no actual ExtendScript compiler/runtime was available.

## Not tested

- Adobe Illustrator CC 2015, any later Illustrator, or any real document.
- ScriptUI sizing, controls, event behavior, fonts, keyboard focus, artboard coordinates, rendering, grouping, Illustrator undo, locked/hidden layers, or partial failures.
- Save/open dialogs and filesystem behavior in ExtendScript.
- SVG/EPS/PDF export (not implemented).
- Actual font glyph coverage or mathematical typography accuracy.
- Large matrices and broad stress/load behavior beyond parser nesting/token limits.

## Manual test checklist for an Illustrator-equipped maintainer

1. Run with no document, confirm actionable message and no changes.
2. Run with a disposable document, create each supported expression, insert, move, save/reopen and inspect generated group.
3. Check normal and minimum dialog dimensions, search result interaction, font availability, and Unicode rendering.
4. Test on a locked active layer and on a document with multiple artboards; verify no unrelated artwork changes.
5. Force a failed insertion where safe and check partial group cleanup.
6. Save and reopen `.eqforge` data with Unicode, nested expressions, malformed content and unsupported version markers.
7. Compare visible fraction/root/script layout across common fonts and Illustrator releases.

No Illustrator test result is claimed. Release remains blocked until the applicable manual suite is completed and limitations are accepted.
