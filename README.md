# EquationForge

**EquationForge — Ultimate Equation & Scientific Typesetting System** is an offline-capable Adobe Illustrator ExtendScript tool for entering mathematical/scientific expressions and placing grouped native text and simple vector geometry in an Illustrator document.

> **Development status: 0.1.0 pre-release.** This repository contains a working parser, ScriptUI authoring dialog, syntax-file save/open, symbol search, starter templates, and Illustrator artwork insertion code. It is not a complete mathematical typesetting suite or a production release. The tool has not been run inside Illustrator in this environment; Illustrator integration, layout precision, CC 2015 behavior, and cross-version compatibility remain unverified. Do not rely on it for publication-critical output without manual review.

## Current capabilities

- ES3-style, dependency-free ExtendScript core and deterministic standalone build.
- Recursive expression parser: arithmetic, grouping, implicit multiplication, scripts, fractions, roots, selected functions, limits, summation/product/integral forms, and a defined Greek/symbol command subset.
- Syntax validation with source positions and recursion/token safety limits; preserves user input after invalid edits.
- ScriptUI typing workflow, symbol-name search, starter expressions and editable template examples.
- `.eqforge` save/open using a versioned, non-executable syntax serialization.
- Illustrator insertion code that creates a named group, native text frames and path strokes for fraction bars/radical geometry; partial insertions are removed on error.
- Node-based parser regression tests that do not require Illustrator.

Matrices and cases currently render through editable text fallback, not a structured matrix layout. There is no full visual AST editor, selection-aware editing, node styling, robust mathematical typography/measurement, favorites/recent persistence, custom template management, SVG/EPS/PDF export, or complete chemistry/physics notation engine. See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) and [REQUIREMENTS.md](REQUIREMENTS.md).

## Build and test

Requirements: Python 3 for packaging and Node.js for the parser test harness. Neither is needed by the built script at runtime.

```sh
python3 scripts/build/build.py
node tests/core.test.js
```

Output: `dist/EquationForge.jsx`. The build concatenates the in-repository core and UI sources in a fixed order. No network or package installation is used.

## Install / run

1. Build or download `dist/EquationForge.jsx`.
2. In Illustrator choose **File → Scripts → Other Script…**.
3. Select `EquationForge.jsx`.
4. Enter an expression, inspect the syntax preview, then choose **Insert into Illustrator**.

See [INSTALLATION.md](INSTALLATION.md) and [USER_GUIDE.md](USER_GUIDE.md). Save a copy of your document before testing early builds.

## Compatibility

Written with ES3-compatible syntax and traditional ExtendScript/ScriptUI APIs in mind. This is a static compatibility intention, not proof of Illustrator CC 2015 support. Current evidence is listed in [COMPATIBILITY.md](COMPATIBILITY.md).

## Ownership / license

Project owner and credit: Shohan Khan. No license is included: the repository request did not establish distribution terms, and a license should not be inferred from the public repository.
