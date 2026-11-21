# Known limitations

This file describes the actual 0.1.0 pre-release scope, not the complete requested product.

- No Illustrator runtime was available. ScriptUI startup, insertion, document safety, artboard placement, point-text styling and paths are **not verified**.
- Layout width is a character-count estimate. Kerning, shaping, font metrics, baselines, scaling, clipping and mathematical spacing can be wrong. The preview reports canonical syntax; it is not a rendered visual preview.
- The renderer is approximate. Fraction and radical strokes are simple paths; roots/scripts/operators are not a full TeX-quality layout. Matrix and cases content falls back to plain editable text, not structural rows/cells. Multiple visual nodes are not exposed for selection or editing after insertion.
- No full visual equation builder, syntax highlighting, autocomplete, context selection, cursor-aware structural editing, paste/replace controls, alignment environment, equation numbering or node-level styles.
- Parser support is a limited subset. No complete LaTeX parser, robust matrix grammar, piecewise grammar, arbitrary text escaping, chemistry-aware charge/isotope/hydrate model, reaction conditions, 2D chemical structure drawing, or physics units/constants database.
- Symbol database is a compact command table, not the exhaustive categorized library requested. Search is command/value matching only.
- Starter expressions are static in-code examples; user templates, favorites, recents and preferences are not persisted.
- `.eqforge` stores canonical syntax only, not the full AST, styles, layout metadata, application version, recovery state or template reference. It has version marker 1 and basic validation only.
- No SVG, EPS or PDF export. No output mode for outlined text. Native text stays editable, but vector structure output is incomplete.
- Only font name and size are exposed. Missing-font/glyph fallback is not reliably detected or clearly surfaced; installed glyph coverage varies.
- Current insertion uses active layer and approximate active-artboard placement. Placement modes, output-layer management, locked/hidden layer handling and selection-relative placement are absent.
- No license file is supplied pending owner distribution terms.
- No production-ready, commercial-grade, or CC 2015 compatibility claim is made.
