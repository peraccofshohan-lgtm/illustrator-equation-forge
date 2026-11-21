# Architecture

## Runtime and build

The code is authored as two ES3-oriented files and concatenated deterministically into `dist/EquationForge.jsx`: `src/core/engine.js` defines the pure `EquationForgeCore` module; `src/ui/app.js` owns ScriptUI and accesses Illustrator globals only when the UI invokes artwork insertion. The JSX artifact has no external runtime dependencies. The build script uses Python 3 only at development time.

## Data flow

Typed source → tokenizer → bounded recursive parser → plain-object recursive AST → validation → canonical syntax representation or Illustrator insertion. The editor's text remains authoritative during the current session. Invalid text remains in the field and does not replace a valid output AST; insertion is disabled by validation behavior (the button reports the parse error instead of inserting).

AST nodes currently include text, symbol, unary, binary, grouping, fraction, root, script, function, limit, big operator, fence, accent, matrix and cases. This is not the complete AST catalogue in the project brief. Parser depth is capped at 64 and token count at 4096; AST validation also bounds node count.

## Parser

The tokenizer tracks source offsets and recognizes selected commands, Unicode characters, numbers, identifiers, delimiters and operators. A precedence-climbing parser implements relation, additive, multiplicative and implicit multiplication precedence, plus postfix scripts. Function-call forms are parsed with fixed argument counts for supported structures. Unsupported commands and malformed calls produce errors with positions. Serialization stores only a tagged format/version plus canonical source, then reparses on load; it never evaluates file contents.

## Rendering / Illustrator adapter

The adapter creates a group on the active layer and recursively emits point-text frames. Fraction bars and radical overbars are path strokes. Its rough widths are estimated from character count and point size, not from Illustrator's shaped glyph metrics. Matrix/cases have an editable-text fallback; some accents and large operators are approximate. On caught insertion exceptions it attempts to remove the generated group. There is no complete transaction boundary around all Illustrator APIs, and document placement/grouping has not been verified in Illustrator.

## UI

A modal ScriptUI dialog provides equation text, canonical syntax feedback, symbol lookup, static editable starter expressions, save/open, and insertion. It is deliberately not described as a responsive or dockable UI. The current UI is much narrower than the planned product workspace.

## Storage

`.eqforge` files are UTF-8 text with `{ "format":"eqforge", "version":1, "source":"..." }`. The only persisted content is canonical expression syntax. Preferences, history, styles and user libraries are not persisted. Loading validates the format marker and reparses; no `eval` is used.
