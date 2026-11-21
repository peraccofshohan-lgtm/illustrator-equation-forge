# User guide (0.1.0 pre-release)

## Authoring

Enter an expression in the Equation tab. Valid input updates a canonical-syntax preview and reports parse errors with approximate source positions. Invalid intermediate text remains in the editor. Examples:

```text
frac(a+b,c)
sqrt(x^2)
x_{n+1}
sum(i=1,n,i^2)
int(a,b,f(x),dx)
lim(x->0,sin(x)/x)
2H2 + O2 -> 2H2O
\\alpha + \\beta <= \\infty
```

`/` is interpreted as a built-up fraction. Multiplication can be explicit (`*`, `×`, `·`) or implicit when adjacent operands are unambiguous. Function argument lists use commas. A restricted command set is documented in `REQUIREMENTS.md`; full LaTeX is not supported.

## Symbols and starter expressions

The Symbols tab searches the small offline command table. Double-click a result to append its command to the editor. The Templates tab contains editable example source strings; selecting one replaces the current input. The Equation tab's starter controls append valid example structures. These are not persistent custom template/favorite systems.

## Preview and insertion

The preview is canonical syntax, **not a rendered typesetting preview**. Set font and size, then insert into an open Illustrator document. The current renderer creates a named group on the active layer, using native text for textual content and paths for fraction/radical strokes. Its dimensions and baselines are approximate. Inspect and manually adjust output.

## Save and open

Save writes `.eqforge` text containing a version marker and canonical expression. Open reparses and validates the expression; the format does not preserve styling or layout. No Illustrator SVG/PDF/EPS export is provided.

## Editing controls

The dialog includes bounded text undo/redo history for current editor changes. This history is not an AST selection history and does not manage Illustrator's own undo stack. Close exits the dialog. Always keep a document backup during evaluation.
